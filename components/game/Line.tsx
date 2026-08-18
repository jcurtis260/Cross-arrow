'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Line as LineType, Direction } from '@/types/game';
import { getLineDirection } from '@/lib/collision-detector';

interface LineProps {
  line: LineType;
  cellSize: number;
  gridSize: number;
  validDirections: Direction[];
  onClick: () => void;
}

export function Line({ line, cellSize, gridSize, validDirections, onClick }: LineProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [travelDistance, setTravelDistance] = useState(0);
  const onExitRef = useRef(onClick);
  const direction = getLineDirection(line);
  const canLeave = validDirections.length > 0;
  const boardSize = gridSize * cellSize;
  const boardDistance = boardSize + cellSize * 2;
  const pathPoints = line.path?.length
    ? line.path
    : line.orientation === 'horizontal'
      ? direction === 'left'
        ? [
            { x: line.startX + line.length - 1, y: line.startY },
            { x: line.startX, y: line.startY },
          ]
        : [
            { x: line.startX, y: line.startY },
            { x: line.startX + line.length - 1, y: line.startY },
          ]
      : direction === 'up'
        ? [
            { x: line.startX, y: line.startY + line.length - 1 },
            { x: line.startX, y: line.startY },
          ]
        : [
            { x: line.startX, y: line.startY },
            { x: line.startX, y: line.startY + line.length - 1 },
          ];

  const svgPoints = pathPoints.map((point) => ({
    x: point.x * cellSize + cellSize / 2,
    y: point.y * cellSize + cellSize / 2,
  }));
  const bodyLength = getPolylineLength(svgPoints);
  const exitPoint = movePoint(svgPoints.at(-1)!, direction, boardDistance);
  const snakeTrack = [...svgPoints, exitPoint];
  const visiblePoints = isLeaving
    ? slicePolyline(snakeTrack, travelDistance, Math.min(travelDistance + bodyLength, bodyLength + boardDistance))
    : svgPoints;
  const pathData = visiblePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const arrowTip = visiblePoints.at(-1)!;
  const arrow = getArrowHead(arrowTip.x, arrowTip.y, direction);

  useEffect(() => {
    onExitRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!isLeaving) return;

    const duration = 1100;
    const totalDistance = bodyLength + boardDistance;
    let frameId = 0;
    let didFinish = false;
    const startedAt = performance.now();

    const finish = () => {
      if (didFinish) return;
      didFinish = true;
      onExitRef.current();
    };

    const animate = (now: number) => {
      const linearProgress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
      setTravelDistance(totalDistance * easedProgress);

      if (linearProgress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        finish();
      }
    };

    frameId = requestAnimationFrame(animate);
    // Browser animation frames can be throttled or suspended on mobile.
    // The fallback keeps the visual animation and the game state in sync.
    const completionTimeout = window.setTimeout(finish, duration + 150);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(completionTimeout);
    };
  }, [bodyLength, boardDistance, isLeaving]);

  const bounceOffset = movePoint({ x: 0, y: 0 }, direction, cellSize * 0.16);

  const handleArrowTap = () => {
    if (isLeaving || isBouncing) return;

    if (canLeave) {
      setIsLeaving(true);
      return;
    }

    setIsBouncing(true);
    window.setTimeout(() => setIsBouncing(false), 180);
  };

  return (
    <motion.svg
      aria-label={`Arrow pointing ${direction}`}
      role="button"
      animate={isBouncing ? bounceOffset : { x: 0, y: 0 }}
      transition={isBouncing
        ? { type: 'spring', stiffness: 850, damping: 18, mass: 0.35 }
        : { type: 'spring', stiffness: 620, damping: 14, mass: 0.35 }}
      className="absolute inset-0 z-10 overflow-visible"
      style={{ width: boardSize, height: boardSize, pointerEvents: 'none' }}
    >
      <path
        d={pathData}
        fill="none"
        stroke="black"
        strokeLinecap="square"
        strokeWidth="4"
        pointerEvents={!isLeaving ? 'stroke' : 'none'}
        onClick={handleArrowTap}
        style={{ cursor: isLeaving ? 'default' : 'pointer' }}
      />
      <polygon points={arrow} fill="black" pointerEvents="none" />
    </motion.svg>
  );
}

function getPolylineLength(points: Array<{ x: number; y: number }>): number {
  return points.slice(1).reduce((length, point, index) => {
    const previous = points[index];
    return length + Math.hypot(point.x - previous.x, point.y - previous.y);
  }, 0);
}

function movePoint(point: { x: number; y: number }, direction: Direction, distance: number) {
  if (direction === 'left') return { x: point.x - distance, y: point.y };
  if (direction === 'right') return { x: point.x + distance, y: point.y };
  if (direction === 'up') return { x: point.x, y: point.y - distance };
  return { x: point.x, y: point.y + distance };
}

function slicePolyline(
  points: Array<{ x: number; y: number }>,
  start: number,
  end: number,
): Array<{ x: number; y: number }> {
  const result = [pointAtDistance(points, start)];
  let traversed = 0;

  for (let index = 1; index < points.length; index++) {
    const point = points[index];
    const previous = points[index - 1];
    const segmentLength = Math.hypot(point.x - previous.x, point.y - previous.y);
    const segmentEnd = traversed + segmentLength;

    if (segmentEnd > start && segmentEnd < end) result.push(point);
    traversed = segmentEnd;
  }

  result.push(pointAtDistance(points, end));
  return result;
}

function pointAtDistance(points: Array<{ x: number; y: number }>, distance: number) {
  let remaining = distance;

  for (let index = 1; index < points.length; index++) {
    const start = points[index - 1];
    const end = points[index];
    const segmentLength = Math.hypot(end.x - start.x, end.y - start.y);

    if (remaining <= segmentLength) {
      const ratio = segmentLength === 0 ? 0 : remaining / segmentLength;
      return { x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio };
    }
    remaining -= segmentLength;
  }

  return points.at(-1)!;
}

function getArrowHead(x: number, y: number, direction: Direction): string {
  if (direction === 'right') return `${x + 9},${y} ${x - 4},${y - 7} ${x - 4},${y + 7}`;
  if (direction === 'left') return `${x - 9},${y} ${x + 4},${y - 7} ${x + 4},${y + 7}`;
  if (direction === 'down') return `${x},${y + 9} ${x - 7},${y - 4} ${x + 7},${y - 4}`;
  return `${x},${y - 9} ${x - 7},${y + 4} ${x + 7},${y + 4}`;
}
