import React, { useEffect } from 'react';
import { Direction } from '../types';
import Button from './Button';
import { audioManager } from '../utils/audio';

interface GameControlsProps {
  onDirectionChange: (dir: Direction) => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onDirectionChange }) => {
  
  const handlePress = (dir: Direction) => {
    onDirectionChange(dir);
    // Optional: quiet click on button press
    audioManager.playMove(); 
  };

  // Keyboard Listeners attached here to keep logic centralized, 
  // though they affect the global game state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onDirectionChange(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onDirectionChange(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onDirectionChange(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onDirectionChange(Direction.RIGHT);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDirectionChange]);

  // SVG Icons for directions
  const ArrowIcon = ({ rot }: { rot: number }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex justify-center">
        <Button 
          variant="icon" 
          className="w-16 h-16 rounded-2xl"
          onClick={() => handlePress(Direction.UP)}
        >
          <ArrowIcon rot={0} />
        </Button>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="icon" 
          className="w-16 h-16 rounded-2xl"
          onClick={() => handlePress(Direction.LEFT)}
        >
          <ArrowIcon rot={270} />
        </Button>
        <Button 
          variant="icon" 
          className="w-16 h-16 rounded-2xl"
          onClick={() => handlePress(Direction.DOWN)}
        >
          <ArrowIcon rot={180} />
        </Button>
        <Button 
          variant="icon" 
          className="w-16 h-16 rounded-2xl"
          onClick={() => handlePress(Direction.RIGHT)}
        >
          <ArrowIcon rot={90} />
        </Button>
      </div>
    </div>
  );
};

export default GameControls;