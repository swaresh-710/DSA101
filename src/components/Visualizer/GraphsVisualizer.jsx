import React, { useState, useEffect } from 'react';

// Simple undirected graph
// 0 -- 1 -- 2
// |    |    |
// 3 -- 4 -- 5

const adj = {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1, 5],
    3: [0, 4],
    4: [1, 3, 5],
    5: [2, 4]
};

const coords = {
    0: { x: 100, y: 100 },
    1: { x: 300, y: 100 },
    2: { x: 500, y: 100 },
    3: { x: 100, y: 300 },
    4: { x: 300, y: 300 },
    5: { x: 500, y: 300 }
};

const GraphsVisualizer = () => {
    const [activeNode, setActiveNode] = useState(null);
    const [visited, setVisited] = useState(new Set());
    const [queue, setQueue] = useState([]);
    const [isTraversing, setIsTraversing] = useState(false);

    const startBFS = () => {
        setVisited(new Set());
        setQueue([0]);
        setActiveNode(null);
        setIsTraversing(true);
    };

    useEffect(() => {
        if (isTraversing && queue.length > 0) {
            const timer = setTimeout(() => {
                const curr = queue[0];
                const newQueue = queue.slice(1);

                setActiveNode(curr);
                setVisited(prev => new Set(prev).add(curr));

                const neighbors = adj[curr].filter(n => !visited.has(n) && !queue.includes(n) && !newQueue.includes(n));
                setQueue([...newQueue, ...neighbors]);

            }, 1000);
            return () => clearTimeout(timer);
        } else if (isTraversing && queue.length === 0) {
            setIsTraversing(false);
            setActiveNode(null);
        }
    }, [isTraversing, queue, visited]);

    const reset = () => {
        setVisited(new Set());
        setQueue([]);
        setActiveNode(null);
        setIsTraversing(false);
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    BFS Traversal starting from Node 0
                </p>
                <button onClick={startBFS} disabled={isTraversing} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px', marginRight: '1rem', opacity: isTraversing ? 0.5 : 1 }}>
                    Start BFS
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                    Reset
                </button>
                <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                    Queue: [{queue.join(', ')}]
                </div>
            </div>

            <div style={{
                height: '400px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <svg width="100%" height="100%" viewBox="0 0 600 400">
                    {/* Edges */}
                    {Object.keys(adj).map(u =>
                        adj[u].map(v => {
                            if (u < v) { // Draw once
                                return (
                                    <line
                                        key={`edge-${u}-${v}`}
                                        x1={coords[u].x} y1={coords[u].y}
                                        x2={coords[v].x} y2={coords[v].y}
                                        stroke="var(--glass-border)"
                                        strokeWidth="2"
                                    />
                                );
                            }
                            return null;
                        })
                    )}

                    {/* Nodes */}
                    {Object.keys(coords).map(id => {
                        const nodeId = parseInt(id);
                        const isVisited = visited.has(nodeId);
                        const isActive = activeNode === nodeId;

                        return (
                            <g key={id}>
                                <circle
                                    cx={coords[id].x} cy={coords[id].y} r="25"
                                    fill={isActive ? 'var(--accent-primary)' : (isVisited ? 'var(--accent-secondary)' : 'var(--bg-secondary)')}
                                    stroke={isActive ? '#fff' : 'var(--glass-border)'}
                                    strokeWidth={isActive ? 3 : 2}
                                    style={{ transition: 'all 0.5s ease' }}
                                />
                                <text
                                    x={coords[id].x} y={coords[id].y} dy=".3em"
                                    textAnchor="middle"
                                    fill="white" fontWeight="bold" fontSize="14px"
                                >
                                    {id}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default GraphsVisualizer;
