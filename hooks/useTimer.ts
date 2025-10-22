
import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialElapsedTime = 0) => {
  const [elapsedTime, setElapsedTime] = useState(initialElapsedTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
  }, [isActive, elapsedTime]);

  const pause = useCallback(() => {
    if (isActive && intervalRef.current) {
      setIsActive(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isActive]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return {
    elapsedTime,
    isActive,
    start,
    pause,
    stop,
    formattedTime: formatTime(elapsedTime),
  };
};
