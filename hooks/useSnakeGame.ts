import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Coordinate, 
  Direction, 
  GameStatus, 
  GameState 
} from '../types';
import { 
  GRID_COUNT, 
  INITIAL_SPEED, 
  SPEED_DECREMENT, 
  MIN_SPEED, 
  KEY_HIGH_SCORE 
} from '../constants';
import { audioManager } from '../utils/audio';

// Helper to get random coordinate
const getRandomPos = (snake: Coordinate[]): Coordinate => {
  let newPos: Coordinate;
  while (true) {
    newPos = {
      x: Math.floor(Math.random() * GRID_COUNT),
      y: Math.floor(Math.random() * GRID_COUNT),
    };
    const collision = snake.some(s => s.x === newPos.x && s.y === newPos.y);
    if (!collision) break;
  }
  return newPos;
};

export const useSnakeGame = () => {
  // --- Refs for Mutable Game State (Performance) ---
  const snakeRef = useRef<Coordinate[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const foodRef = useRef<Coordinate>({ x: 5, y: 5 });
  const directionRef = useRef<Direction>(Direction.UP);
  const nextDirectionRef = useRef<Direction>(Direction.UP);
  const gameLoopRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef<number>(0);
  
  // --- React State for UI ---
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem(KEY_HIGH_SCORE) || '0', 10),
    status: GameStatus.IDLE,
    speed: INITIAL_SPEED,
  });

  // --- Helpers ---
  const stopLoop = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  const saveHighScore = (score: number) => {
    if (score > gameState.highScore) {
      localStorage.setItem(KEY_HIGH_SCORE, score.toString());
      setGameState(prev => ({ ...prev, highScore: score }));
    }
  };

  const resetGame = useCallback(() => {
    stopLoop();
    snakeRef.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    directionRef.current = Direction.UP;
    nextDirectionRef.current = Direction.UP;
    foodRef.current = getRandomPos(snakeRef.current);
    
    setGameState(prev => ({
      ...prev,
      score: 0,
      status: GameStatus.IDLE,
      speed: INITIAL_SPEED,
    }));
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    
    // Prevent 180 degree turns
    const isOpposite = 
      (newDir === Direction.UP && currentDir === Direction.DOWN) ||
      (newDir === Direction.DOWN && currentDir === Direction.UP) ||
      (newDir === Direction.LEFT && currentDir === Direction.RIGHT) ||
      (newDir === Direction.RIGHT && currentDir === Direction.LEFT);

    if (!isOpposite) {
      nextDirectionRef.current = newDir;
    }
  }, []);

  const moveSnake = () => {
    const head = { ...snakeRef.current[0] };
    directionRef.current = nextDirectionRef.current; // Apply buffered direction

    switch (directionRef.current) {
      case Direction.UP: head.y -= 1; break;
      case Direction.DOWN: head.y += 1; break;
      case Direction.LEFT: head.x -= 1; break;
      case Direction.RIGHT: head.x += 1; break;
    }

    // Wall Collision
    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
      handleGameOver();
      return;
    }

    // Self Collision
    if (snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
      handleGameOver();
      return;
    }

    snakeRef.current.unshift(head);

    // Food Collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      audioManager.playEat();
      // Increase Score & Speed
      setGameState(prev => {
        const newScore = prev.score + 10;
        const newSpeed = Math.max(MIN_SPEED, prev.speed - SPEED_DECREMENT);
        return { ...prev, score: newScore, speed: newSpeed };
      });
      // New Food
      foodRef.current = getRandomPos(snakeRef.current);
    } else {
      // Just moving, remove tail
      snakeRef.current.pop();
    }
  };

  const handleGameOver = () => {
    audioManager.playGameOver();
    setGameState(prev => {
      saveHighScore(prev.score);
      return { ...prev, status: GameStatus.GAME_OVER };
    });
    stopLoop();
  };

  const gameTick = (time: number) => {
    if (gameState.status !== GameStatus.PLAYING) return;

    const secondsSinceLastRender = (time - lastRenderTimeRef.current) / 1000;
    // Speed is in ms, so convert to seconds for comparison
    if (secondsSinceLastRender < gameState.speed / 1000) {
      gameLoopRef.current = requestAnimationFrame(gameTick);
      return;
    }

    lastRenderTimeRef.current = time;
    moveSnake();
    
    // Continue loop if not game over
    if (gameState.status === GameStatus.PLAYING) { // Check status again after move check
       gameLoopRef.current = requestAnimationFrame(gameTick);
    }
  };

  const startGame = useCallback(() => {
    if (gameState.status === GameStatus.GAME_OVER) {
      resetGame();
      // Small timeout to allow state reset before starting
      setTimeout(() => {
        setGameState(prev => ({ ...prev, status: GameStatus.PLAYING }));
        lastRenderTimeRef.current = performance.now();
        gameLoopRef.current = requestAnimationFrame(gameTick);
      }, 50);
    } else {
      setGameState(prev => ({ ...prev, status: GameStatus.PLAYING }));
      lastRenderTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameTick);
    }
  }, [gameState.status, resetGame]); // Add dependencies

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: GameStatus.PAUSED }));
    stopLoop();
  }, []);

  // Sync the loop ref with latest state values if needed, 
  // though we are using refs for critical game data so it's less fragile.
  // We strictly restart the loop when 'status' changes to PLAYING.
  useEffect(() => {
    if (gameState.status === GameStatus.PLAYING && !gameLoopRef.current) {
        lastRenderTimeRef.current = performance.now();
        gameLoopRef.current = requestAnimationFrame(gameTick);
    }
    return () => stopLoop();
  }, [gameState.status, gameState.speed]);

  return {
    snake: snakeRef.current,
    food: foodRef.current,
    gameState,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  };
};