'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Maze generation algorithm (Recursive Backtracker)
const generateMaze = (size: number) => {
  const grid = Array(size).fill(null).map(() => Array(size).fill({ top: true, right: true, bottom: true, left: true, visited: false }));
  const stack = [[0, 0]];
  grid[0][0].visited = true;

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors = [];
    // Top
    if (cy > 0 && !grid[cx][cy - 1].visited) neighbors.push([cx, cy - 1, 'top', 'bottom']);
    // Right
    if (cx < size - 1 && !grid[cx + 1][cy].visited) neighbors.push([cx + 1, cy, 'right', 'left']);
    // Bottom
    if (cy < size - 1 && !grid[cx][cy + 1].visited) neighbors.push([cx, cy + 1, 'bottom', 'top']);
    // Left
    if (cx > 0 && !grid[cx - 1][cy].visited) neighbors.push([cx - 1, cy, 'left', 'right']);

    if (neighbors.length > 0) {
      const [nx, ny, dir1, dir2] = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[cx][cy] = { ...grid[cx][cy], [dir1]: false };
      grid[nx][ny] = { ...grid[nx][ny], [dir2]: false, visited: true };
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }
  return grid;
};

const MazeGrid = ({ maze, playerPos, endPos }: { maze: any[][], playerPos: {x: number, y: number}, endPos: {x: number, y: number} }) => {
    const size = maze.length;
    return (
        <div className="grid bg-secondary border-2 border-primary/50 rounded-lg p-1" style={{gridTemplateColumns: `repeat(${size}, 1fr)`}}>
            {maze.map((row, y) => (
                row.map((cell, x) => (
                    <div key={`${x}-${y}`} className="relative aspect-square">
                        <div className={cn("absolute bg-primary/50", cell.top && "top-0 left-0 right-0 h-[3px]")} />
                        <div className={cn("absolute bg-primary/50", cell.right && "top-0 bottom-0 right-0 w-[3px]")} />
                        <div className={cn("absolute bg-primary/50", cell.bottom && "bottom-0 left-0 right-0 h-[3px]")} />
                        <div className={cn("absolute bg-primary/50", cell.left && "top-0 bottom-0 left-0 w-[3px]")} />
                        
                        {playerPos.x === x && playerPos.y === y && <div className="absolute inset-[15%] bg-accent rounded-full transition-all duration-200" />}
                        {endPos.x === x && endPos.y === y && <div className="absolute inset-[20%] bg-green-500 rounded-sm" />}
                    </div>
                ))
            ))}
        </div>
    )
}

export default function MindfulMazePage() {
    const MAZE_SIZE = 10;
    const [maze, setMaze] = useState(generateMaze(MAZE_SIZE));
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
    const endPos = { x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 };
    const [isComplete, setIsComplete] = useState(false);

    const resetGame = () => {
        setMaze(generateMaze(MAZE_SIZE));
        setPlayerPos({ x: 0, y: 0 });
        setIsComplete(false);
    }
    
    useEffect(() => {
        if (playerPos.x === endPos.x && playerPos.y === endPos.y) {
            setIsComplete(true);
        }
    }, [playerPos, endPos]);

    const movePlayer = (dx: number, dy: number) => {
        const { x, y } = playerPos;
        const newX = x + dx;
        const newY = y + dy;

        if (isComplete) return;

        if (newX < 0 || newX >= MAZE_SIZE || newY < 0 || newY >= MAZE_SIZE) return;

        const currentCell = maze[x][y];
        if (dx === 1 && !currentCell.right) setPlayerPos({ x: newX, y: newY });
        if (dx === -1 && !currentCell.left) setPlayerPos({ x: newX, y: newY });
        if (dy === 1 && !currentCell.bottom) setPlayerPos({ x: newX, y: newY });
        if (dy === -1 && !currentCell.top) setPlayerPos({ x: newX, y: newY });
    };
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === 'ArrowUp') movePlayer(0, -1);
            if(e.key === 'ArrowDown') movePlayer(0, 1);
            if(e.key === 'ArrowLeft') movePlayer(-1, 0);
            if(e.key === 'ArrowRight') movePlayer(1, 0);
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPos, isComplete]);

    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Mindful Maze</CardTitle>
                        <CardDescription>Guide the dot to the green square. Use arrow keys or the buttons below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col items-center">
                        <MazeGrid maze={maze} playerPos={playerPos} endPos={endPos} />
                        <div className="grid grid-cols-3 gap-2 w-48">
                            <div></div>
                            <Button size="icon" onClick={() => movePlayer(0, -1)}><ArrowUp /></Button>
                            <div></div>
                            <Button size="icon" onClick={() => movePlayer(-1, 0)}><ArrowLeft /></Button>
                            <Button size="icon" onClick={() => movePlayer(0, 1)}><ArrowDown /></Button>
                            <Button size="icon" onClick={() => movePlayer(1, 0)}><ArrowRight /></Button>
                        </div>
                        <Button onClick={resetGame} variant="outline">
                            <RefreshCw className="mr-2" />
                            New Maze
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <AlertDialog open={isComplete} onOpenChange={setIsComplete}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Congratulations!</AlertDialogTitle>
                  <AlertDialogDescription>
                    You've found your way through the maze. A moment of focus can bring great clarity.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
