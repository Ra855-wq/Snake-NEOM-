import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  active?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  active = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "transition-all duration-200 font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: `
      bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 
      hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]
      active:scale-95 py-3 px-6 rounded-lg backdrop-blur-sm
    `,
    secondary: `
      bg-slate-800/50 text-slate-300 border border-slate-700 
      hover:border-cyan-500/50 hover:text-cyan-400
      active:scale-95 py-2 px-4 rounded-lg
    `,
    icon: `
      p-3 rounded-xl border
      ${active 
        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
        : 'bg-slate-900/80 text-cyan-500 border-cyan-900/50 hover:bg-slate-800 hover:border-cyan-500/30'
      }
      active:scale-90
    `
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;