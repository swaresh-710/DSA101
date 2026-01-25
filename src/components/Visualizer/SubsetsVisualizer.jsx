import React, { useState, useEffect } from 'react';

const SubsetsVisualizer = () => {
    // 4-Queens Problem
    const SIZE = 4;
    const [board, setBoard] = useState(Array(SIZE).fill().map(() => Array(SIZE).fill(false))); // false = empty, true = Queen
    const [current, setCurrent] = useState({ row: -1, col: -1 });
    const [solutions, setSolutions] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState('Click Start to solve 4-Queens');

    // Simple delay helper
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const solveNQueens = async () => {
        setIsRunning(true);
        setSolutions(0);
        setStatus('Starting Backtracking...');

        const newBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
        setBoard([...newBoard]);

        await backtrack(0, newBoard);

        setIsRunning(false);
        setStatus(`Exploration Complete! Found possible solutions.`);
    };

    const backtrack = async (row, currentBoard) => {
        if (row === SIZE) {
            setSolutions(prev => prev + 1);
            setStatus('Found a solution!');
            await delay(1500);
            return;
        }

        for (let col = 0; col < SIZE; col++) {
            setStatus(`Checking (Row ${row}, Col ${col})...`);
            setCurrent({ row, col });
            await delay(400);

            if (isValid(currentBoard, row, col)) {
                // Place Queen
                currentBoard[row][col] = true;
                setBoard([...currentBoard.map(row => [...row])]); // Force Update
                setStatus(`Placed Queen at (${row}, ${col}). Moving to next row.`);
                await delay(600);

                await backtrack(row + 1, currentBoard);

                // Backtrack
                currentBoard[row][col] = false;
                setBoard([...currentBoard.map(row => [...row])]);
                setStatus(`Backtracking from (${row}, ${col}). Removing Queen.`);
                await delay(600);
            } else {
                setStatus(`Invalid move at (${row}, ${col}). Conflict detected.`);
            }
        }
    };

    const isValid = (board, row, col) => {
        // Check column
        for (let i = 0; i < row; i++) {
            if (board[i][col]) return false;
        }
        // Check diagonals
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j]) return false;
        }
        for (let i = row - 1, j = col + 1; i >= 0 && j < SIZE; i--, j++) {
            if (board[i][j]) return false;
        }
        return true;
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-primary)', minHeight: '1.5em' }}>{status}</p>
                <button onClick={solveNQueens} disabled={isRunning} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px' }}>
                    {isRunning ? 'Running...' : 'Start 4-Queens'}
                </button>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Solutions Found: {solutions}</div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${SIZE}, 60px)`,
                gap: '5px',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                {board.map((row, rIdx) => (
                    row.map((hasQueen, cIdx) => {
                        const isCurrent = current.row === rIdx && current.col === cIdx;
                        const isBlack = (rIdx + cIdx) % 2 === 1;
                        return (
                            <div key={`${rIdx}-${cIdx}`} style={{
                                width: '60px', height: '60px',
                                background: isBlack ? '#333' : '#555',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem',
                                border: isCurrent ? '2px solid var(--accent-primary)' : 'none',
                                position: 'relative'
                            }}>
                                {hasQueen && '♛'}
                                {isCurrent && !hasQueen && <div style={{ width: '10px', height: '10px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default SubsetsVisualizer;
