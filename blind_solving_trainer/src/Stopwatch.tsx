import { useEffect, useState, useRef } from 'react';
import './Stopwatch.css';

export interface StopwatchProps {
  isRunning: boolean;
  onReset?: () => void;
  onTimeUpdate?: (time: number) => void;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ 
  isRunning, 
  onReset,
  onTimeUpdate 
}) => {
  const [time, setTime] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Start or stop the stopwatch when isRunning changes
  useEffect(() => {
    if (isRunning) {
      // Get current timestamp when starting
      startTimeRef.current = Date.now() - time;
      
      // Start the timer
      intervalRef.current = window.setInterval(() => {
        const currentTime = Date.now() - (startTimeRef.current || 0);
        setTime(currentTime);
        
        // Call the onTimeUpdate callback if provided
        if (onTimeUpdate) {
          onTimeUpdate(currentTime);
        }
      }, 10); // Update every 10ms for smooth display
    } else if (intervalRef.current !== null) {
      // Stop the timer
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  // Function to reset the stopwatch
  const resetStopwatch = () => {
    setTime(0);
    if (onReset) {
      onReset();
    }
  };

  // Format the time for display (mm:ss.ms)
  const formatTime = (timeInMs: number): string => {
    const ms = Math.floor((timeInMs % 1000) / 10);
    const seconds = Math.floor((timeInMs / 1000) % 60);
    const minutes = Math.floor(timeInMs / 60000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stopwatch">
      <div className="time-display">{formatTime(time)}</div>
      <button 
        onClick={resetStopwatch} 
        className="reset-button"
        disabled={isRunning}
      >
        Reset
      </button>
    </div>
  );
};

export default Stopwatch;