import React, { useRef, useEffect } from 'react';
import { Coordinate, GameStatus } from '../types';
import { 
  CANVAS_SIZE, 
  GRID_SIZE, 
  GRID_COUNT,
  COLOR_NEON_BLUE, 
  COLOR_GRID 
} from '../constants';

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  status: GameStatus;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, status }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- RENDER FUNCTION ---
    const render = () => {
      // 1. Clear & Background
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      // 2. Draw Grid
      ctx.strokeStyle = COLOR_GRID;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      for (let i = 0; i <= GRID_COUNT; i++) {
        // Vertical
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        // Horizontal
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
      }
      ctx.stroke();

      // 3. Draw Snake
      ctx.shadowBlur = 15;
      ctx.shadowColor = COLOR_NEON_BLUE;
      ctx.fillStyle = COLOR_NEON_BLUE;

      snake.forEach((segment, index) => {
        // Head is solid, body slightly transparent
        ctx.globalAlpha = index === 0 ? 1 : 0.8; 
        
        // Slight inset for "segment" look
        const inset = 1;
        ctx.fillRect(
          segment.x * GRID_SIZE + inset,
          segment.y * GRID_SIZE + inset,
          GRID_SIZE - (inset * 2),
          GRID_SIZE - (inset * 2)
        );
      });
      ctx.globalAlpha = 1;

      // 4. Draw Food
      if (status !== GameStatus.IDLE) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#f472b6'; // Pinkish glow for food
        ctx.fillStyle = '#f472b6'; // Tailwind pink-400
        
        const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
        const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;
        const radius = GRID_SIZE / 2 - 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset Context
      ctx.shadowBlur = 0;
    };

    // Use requestAnimationFrame for smooth rendering decoupled from game logic tick
    let animationFrameId: number;
    const animate = () => {
      render();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [snake, food, status]);

  return (
    <div className="relative p-1 rounded-xl bg-gradient-to-b from-cyan-900/50 to-slate-900/50 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
       {/* Corner Accents */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block bg-slate-950/80 rounded-lg max-w-full h-auto cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-lg bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />
    </div>
  );
};

export default GameBoard;