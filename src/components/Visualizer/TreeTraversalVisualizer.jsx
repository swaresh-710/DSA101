import React, { useState, useEffect } from 'react';

// Tree: 
//       1
//     /   \
//    2     3
//   / \   / \
//  4   5 6   7

const TreeTraversalVisualizer = () => {
    const [activeNode, setActiveNode] = useState(null);
    const [visited, setVisited] = useState([]);
    const [queueOrStack, setQueueOrStack] = useState([]);
    const [mode, setMode] = useState('BFS'); // BFS or DFS
    const [isRunning, setIsRunning] = useState(false);

    const tree = {
        1: [2, 3],
        2: [4, 5],
        3: [6, 7],
        4: [], 5: [], 6: [], 7: []
    };

    const startTraversal = async () => {
        setIsRunning(true);
        setVisited([]);
        setActiveNode(null);

        const q = [1]; // Using array as Queue/Stack
        setQueueOrStack([...q]);
        await delay(500);

        while (q.length > 0) {
            let curr;
            if (mode === 'BFS') {
                curr = q.shift(); // Dequeue
            } else {
                curr = q.pop(); // Pop (DFS)
            }

            setActiveNode(curr);
            setVisited(prev => [...prev, curr]);

            // For animation stability
            const currentQ = [...q];
            // Neighbors
            const children = tree[curr] || [];

            if (mode === 'BFS') {
                q.push(...children);
            } else {
                // For DFS right order processing (push right then left so left pops first)
                // However visuals usually show left-to-right. 
                // To visit 4 before 5, we push 5 then 4.
                for (let i = children.length - 1; i >= 0; i--) {
                    q.push(children[i]);
                }
            }

            setQueueOrStack([...q]);
            await delay(1000);
        }
        setIsRunning(false);
        setActiveNode(null);
    };

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const reset = () => {
        setVisited([]);
        setActiveNode(null);
        setQueueOrStack([]);
        setIsRunning(false);
    };

    // Simple Render coords
    const coords = {
        1: { x: 300, y: 50 },
        2: { x: 150, y: 150 },
        3: { x: 450, y: 150 },
        4: { x: 75, y: 250 },
        5: { x: 225, y: 250 },
        6: { x: 375, y: 250 },
        7: { x: 525, y: 250 },
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <button onClick={() => { setMode('BFS'); reset(); }} style={{ padding: '0.4rem 1rem', background: mode === 'BFS' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '4px 0 0 4px' }}>BFS</button>
                    <button onClick={() => { setMode('DFS'); reset(); }} style={{ padding: '0.4rem 1rem', background: mode === 'DFS' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '0 4px 4px 0' }}>DFS</button>
                </div>
                <button onClick={startTraversal} disabled={isRunning} style={{ padding: '0.5rem 2rem', background: 'var(--bg-secondary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
                    Start
                </button>
                <div style={{ marginTop: '1rem', color: '#aaa' }}>
                    Visited: {visited.join(' -> ')}
                </div>
            </div>

            <div style={{ height: '300px', position: 'relative' }}>
                <svg width="600" height="300" style={{ margin: '0 auto', display: 'block' }}>
                    {Object.keys(tree).map(p =>
                        tree[p].map(c => (
                            <line
                                key={`${p}-${c}`}
                                x1={coords[p].x} y1={coords[p].y}
                                x2={coords[c].x} y2={coords[c].y}
                                stroke="var(--glass-border)" strokeWidth="2"
                            />
                        ))
                    )}
                    {Object.keys(coords).map(k => {
                        const id = parseInt(k);
                        const isVisited = visited.includes(id);
                        const isActive = activeNode === id;
                        return (
                            <g key={k}>
                                <circle
                                    cx={coords[k].x} cy={coords[k].y} r="20"
                                    fill={isActive ? '#fff' : (isVisited ? 'var(--accent-primary)' : 'var(--bg-secondary)')}
                                    stroke="var(--glass-border)" strokeWidth="2"
                                />
                                <text x={coords[k].x} y={coords[k].y} dy=".3em" textAnchor="middle" fill={isActive ? '#000' : '#fff'} fontWeight="bold">{k}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default TreeTraversalVisualizer;
