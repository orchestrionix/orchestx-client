import React from 'react';
import { FiFolder } from 'react-icons/fi';

interface PathPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const PathPicker: React.FC<PathPickerProps> = ({
  value,
  onChange,
  placeholder,
  error,
  className = ''
}) => {
  const handleClick = async () => {
    // For now this is just a styled input
    // In the future, we can add actual path picking functionality
    // when the backend supports it
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-3 py-1.5 
            bg-black/20 
            border border-white/10 
            rounded 
            text-sm text-white 
            placeholder-white/20 
            focus:outline-none focus:border-gold/50
            transition-colors
            ${error ? 'border-red-500/50' : 'hover:border-white/20'}
          `}
        />
        <div className="absolute right-0 h-full px-2 flex items-center">
          <button
            type="button"
            onClick={handleClick}
            className={`
              p-1 
              rounded
              text-white/40 
              hover:text-gold 
              hover:bg-white/5
              transition-colors
              group-hover:text-white/60
            `}
          >
            <FiFolder className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {error && (
        <div className="text-red-400/90 text-xs mt-1 pl-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default PathPicker; 