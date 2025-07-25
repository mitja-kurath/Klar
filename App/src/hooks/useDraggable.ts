import { useState, useRef, useEffect } from 'react';
interface Position {
  x: number;
  y: number;
}
export const useDraggable = (storageKey: string, defaultPosition: Position) => {
  const getInitialPosition = (): Position => {
    try {
      const saved = localStorage.getItem(`widget-position-${storageKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const x = Math.max(0, Math.min(window.innerWidth - 320, parsed.x));
        const y = Math.max(0, Math.min(window.innerHeight - 200, parsed.y));
        return { x, y };
      }
    } catch (error) {
      console.warn('Failed to load widget position:', error);
    }
    return defaultPosition;
  };
  const [position, setPosition] = useState<Position>(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<Position>({ x: 0, y: 0 });
  const elementStart = useRef<Position>({ x: 0, y: 0 });
  useEffect(() => {
    try {
      localStorage.setItem(`widget-position-${storageKey}`, JSON.stringify(position));
    } catch (error) {
      console.warn('Failed to save widget position:', error);
    }
  }, [position, storageKey]);
  useEffect(() => {
    const dragElement = dragRef.current;
    if (!dragElement) return;
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      elementStart.current = { ...position };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      const newX = elementStart.current.x + deltaX;
      const newY = elementStart.current.y + deltaY;
      const boundedX = Math.max(0, Math.min(window.innerWidth - 320, newX));
      const boundedY = Math.max(0, Math.min(window.innerHeight - 200, newY));
      setPosition({ x: boundedX, y: boundedY });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    dragElement.addEventListener('mousedown', handleMouseDown);
    return () => {
      dragElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position, isDragging]);
  return {
    position,
    dragRef,
    isDragging,
    setPosition
  };
};



