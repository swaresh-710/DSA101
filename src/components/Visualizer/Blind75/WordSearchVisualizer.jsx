import React, { useState } from 'react';

const WordSearchVisualizer = () => {
    // Grid:
    // A B C E
    // S F C S
    // A D E E
    // Word: ABCCED (Standard LC example)

    const initialGrid = [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ];

    const [word, setWord] = useState('ABCCED');
    const [path, setPath] = useState([]); // Array of {r, c}
    const [visited, setVisited] = useState(new Set()); // string "r,c"
    const [found, setFound] = useState(false);
    const [message, setMessage] = useState('Click Start to search.');
    const [isRunning, setIsRunning] = useState(false);
    const [currentCell, setCurrentCell] = useState(null);

    const reset = () => {
        setPath([]);
        setVisited(new Set());
        setFound(false);
        setIsRunning(false);
        setCurrentCell(null);
        setMessage('Ready.');
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const solve = async () => {
        if (isRunning) return;
        setIsRunning(true);
        reset();
        await new Promise(r => setTimeout(r, 100));

        const rows = initialGrid.length;
        const cols = initialGrid[0].length;

        const backtrack = async (r, c, idx) => {
            if (idx === word.length) return true;

            if (r < 0 || r >= rows || c < 0 || c >= cols || visited.has(`${r},${c}`)) {
                return false;
            }

            // Visual step: inspect cell
            setCurrentCell({ r, c });
            setMessage(`Checking cell (${r},${c}) '${initialGrid[r][c]}' for '${word[idx]}'...`);
            await sleep(600);

            if (initialGrid[r][c] !== word[idx]) {
                setMessage(`Mismatch! '${initialGrid[r][c]}' != '${word[idx]}'. Backtrack.`);
                return false;
            }

            // Match
            setMessage(`Match '${word[idx]}'! Exploring neighbors...`);
            visited.add(`${r},${c}`);
            path.push({ r, c });
            setVisited(new Set(visited)); // Update React state
            setPath([...path]);

            await sleep(600);

            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            for (let [dr, dc] of dirs) {
                if (await backtrack(r + dr, c + dc, idx + 1)) return true;
            }

            // Backtrack
            setMessage(`Dead end at (${r},${c}). Unvisiting.`);
            visited.delete(`${r},${c}`);
            path.pop();
            setVisited(new Set(visited));
            setPath([...path]);
            await sleep(600);

            return false;
        };

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (await backtrack(r, c, 0)) {
                    setMessage("Word Found!");
                    setFound(true);
                    setIsRunning(false);
                    return;
                }
            }
        }

        setMessage("Word NOT Found.");
        setIsRunning(false);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value.toUpperCase())}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white', maxWidth: '100px' }}
                />
                <button onClick={solve} disabled={isRunning} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'black' }}>
                    Start Search
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '3rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${initialGrid[0].length}, 60px)`,
                gap: '10px',
                justifyContent: 'center',
                padding: '2rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)'
            }}>
                {initialGrid.map((row, r) => (
                    row.map((char, c) => {
                        const isPath = path.some(p => p.r === r && p.c === c);
                        const isCurrent = currentCell?.r === r && currentCell?.c === c;

                        return (
                            <div
                                key={`${r}-${c}`}
                                style={{
                                    width: '60px', height: '60px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', fontWeight: 'bold',
                                    borderRadius: '8px',
                                    background: isPath ? '#2ecc71' : '#333',
                                    border: isCurrent ? '3px solid #f1c40f' : '1px solid #555',
                                    color: isPath ? 'black' : 'white',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {char}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default WordSearchVisualizer;
