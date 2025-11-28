import React, { useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import Button from './components/Button';
import { GameStatus } from './types';
import { audioManager } from './utils/audio';
import { Volume2, VolumeX, Play, RotateCcw, Pause } from 'lucide-react';

const App: React.FC = () => {
  const { 
    snake, 
    food, 
    gameState, 
    changeDirection, 
    startGame, 
    pauseGame, 
    resetGame 
  } = useSnakeGame();

  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioManager.toggle(newState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] text-cyan-500 overflow-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        
        {/* Header */}
        <header className="w-full flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              SNAKE <span className="text-white text-opacity-80 font-light">NEOM</span>
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
              Cyberpunk Edition
            </p>
          </div>
          <div className="text-right">
             <div className="text-xs text-slate-500 uppercase tracking-wider">Score</div>
             <div className="text-2xl font-mono font-bold text-cyan-400 leading-none">
               {gameState.score.toString().padStart(4, '0')}
             </div>
          </div>
        </header>

        {/* Game Area */}
        <div className="relative group">
          <GameBoard 
            snake={snake} 
            food={food} 
            status={gameState.status} 
          />
          
          {/* Overlays */}
          {gameState.status === GameStatus.IDLE && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl border border-cyan-500/20">
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">READY?</h2>
              <Button onClick={startGame} className="animate-pulse">
                Initialize System
              </Button>
            </div>
          )}

          {gameState.status === GameStatus.GAME_OVER && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-md rounded-xl border-2 border-red-500/50">
              <h2 className="text-4xl font-bold text-red-500 mb-2 drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]">SYSTEM FAILURE</h2>
              <p className="text-red-300 mb-6 font-mono">Final Score: {gameState.score}</p>
              <div className="flex gap-4">
                <Button onClick={resetGame} variant="secondary">Menu</Button>
                <Button onClick={startGame} className="border-red-500 text-red-100 bg-red-900/50 hover:bg-red-500 hover:text-white">
                  Reboot
                </Button>
              </div>
            </div>
          )}
          
          {gameState.status === GameStatus.PAUSED && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-xl">
               <h2 className="text-3xl font-bold text-cyan-400 tracking-widest mb-4">PAUSED</h2>
               <Button onClick={startGame} variant="icon" active>
                  <Play className="w-8 h-8 fill-current" />
               </Button>
            </div>
          )}
        </div>

        {/* Dashboard / Stats */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
             <span className="text-[10px] uppercase text-slate-500 tracking-widest">High Score</span>
             <span className="text-xl text-yellow-400 font-mono shadow-yellow-500/20 drop-shadow-sm">
               {gameState.highScore.toString().padStart(4, '0')}
             </span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between px-4">
            <span className="text-[10px] uppercase text-slate-500 tracking-widest">Audio</span>
            <button 
              onClick={toggleSound}
              className={`p-2 rounded-full transition-colors ${soundEnabled ? 'text-cyan-400 bg-cyan-950' : 'text-slate-600 bg-slate-950'}`}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full flex justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
             <Button 
               variant="secondary" 
               className="p-3 rounded-xl"
               onClick={gameState.status === GameStatus.PLAYING ? pauseGame : startGame}
               disabled={gameState.status === GameStatus.GAME_OVER}
             >
               {gameState.status === GameStatus.PLAYING ? <Pause size={20} /> : <Play size={20} />}
             </Button>
             <Button 
               variant="secondary" 
               className="p-3 rounded-xl"
               onClick={resetGame}
             >
               <RotateCcw size={20} />
             </Button>
          </div>

          <div className="flex-1">
             <GameControls onDirectionChange={changeDirection} />
          </div>
          
          {/* Spacer to balance the left buttons for centering controls */}
          <div className="w-12"></div>
        </div>

      </div>
    </div>
  );
};

export default App;