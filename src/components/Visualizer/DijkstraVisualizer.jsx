import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DijkstraVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [startNode, setStartNode] = useState(0);
    const [distances, setDistances] = useState({});
    const [visited, setVisited] = useState(new Set());
    const [activeEdge, setActiveEdge] = useState(null); // {from, to}
    const [pq, setPq] = useState([]); // Priority Queue equivalent
    const [message, setMessage] = useState('Ready to run Dijkstra.');
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Initial Graph Setup
    useEffect(() => {
        resetGraph();
    }, []);

    const resetGraph = () => {
        // Create a simple weighted graph
        // 0 -> 1 (4), 0 -> 2 (1)
        // 2 -> 1 (2), 2 -> 3 (5)
        // 1 -> 3 (1), 1 -> 4 (4)
        // 3 -> 4 (3)
        const newNodes = [
            { id: 0, x: 50, y: 150, label: '0' },
            { id: 1, x: 200, y: 50, label: '1' },
            { id: 2, x: 200, y: 250, label: '2' },
            { id: 3, x: 350, y: 250, label: '3' },
            { id: 4, x: 450, y: 150, label: '4' },
        ];

        const newEdges = [
            { from: 0, to: 1, weight: 4 },
            { from: 0, to: 2, weight: 1 },
            { from: 2, to: 1, weight: 2 },
            { from: 2, to: 3, weight: 5 },
            { from: 1, to: 3, weight: 1 },
            { from: 1, to: 4, weight: 4 },
            { from: 3, to: 4, weight: 3 },
        ];

        setNodes(newNodes);
        setEdges(newEdges);

        // Reset Algorithm State
        const initialDistances = {};
        newNodes.forEach(n => initialDistances[n.id] = Infinity);
        initialDistances[startNode] = 0;

        setDistances(initialDistances);
        setVisited(new Set());
        setPq([{ id: startNode, dist: 0 }]);
        setMessage(`Initialized graph. Start node: ${startNode}`);
        setIsRunning(false);
        setIsFinished(false);
        setActiveEdge(null);
    };

    const runStep = () => {
        if (pq.length === 0) {
            setMessage('Priority Queue is empty. Algorithm finished.');
            setIsFinished(true);
            setIsRunning(false);
            return;
        }

        // Sort PQ to simulate Min-Heap
        const currentPq = [...pq].sort((a, b) => a.dist - b.dist);
        const { id: u, dist: d } = currentPq.shift();

        const newPq = currentPq;

        // Visual update for visiting u
        setMessage(`Popped Node ${u} with distance ${d}.`);

        if (d > distances[u]) {
            setMessage(`Node ${u} already processed with shorter distance.`);
            setPq(newPq);
            return;
        }

        const newVisited = new Set(visited);
        newVisited.add(u);
        setVisited(newVisited);

        // Find neighbors
        const neighbors = edges.filter(e => e.from === u);

        // We will process all neighbors in one step for simplicity of visualization loop
        // OR we can break it down. Let's do batch update for neighbors
        let updates = [];
        const newDistances = { ...distances };

        neighbors.forEach(edge => {
            const v = edge.to;
            const weight = edge.weight;
            if (distances[u] + weight < distances[v]) {
                newDistances[v] = distances[u] + weight;
                newPq.push({ id: v, dist: newDistances[v] });
                updates.push(`Updated ${v} to ${newDistances[v]}`);
            }
        });

        setDistances(newDistances);
        setPq(newPq);

        if (updates.length > 0) {
            setMessage(`Visiting neighbors of ${u}: ${updates.join(', ')}`);
        } else {
            setMessage(`Visited neighbors of ${u}. No updates.`);
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={runStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    Next Step
                </button>
                <button
                    onClick={resetGraph}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            {/* Graph Visualization */}
            <div style={{ position: 'relative', height: '350px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                    {edges.map((edge, i) => {
                        const start = nodes.find(n => n.id === edge.from);
                        const end = nodes.find(n => n.id === edge.to);
                        return (
                            <g key={i}>
                                <line
                                    x1={start.x} y1={start.y}
                                    x2={end.x} y2={end.y}
                                    stroke="#555"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                                {/* Weight Label */}
                                <g transform={`translate(${(start.x + end.x) / 2}, ${(start.y + end.y) / 2})`}>
                                    <rect x="-10" y="-10" width="20" height="20" fill="#222" rx="4" />
                                    <text x="0" y="5" textAnchor="middle" fill="#aaa" fontSize="12">{edge.weight}</text>
                                </g>
                            </g>
                        );
                    })}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="19" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
                        </marker>
                    </defs>
                </svg>

                {nodes.map(node => {
                    const isVisited = visited.has(node.id);
                    const dist = distances[node.id];
                    const isInfinity = dist === Infinity;

                    return (
                        <motion.div
                            key={node.id}
                            animate={{
                                backgroundColor: isVisited ? '#4ECDC4' : '#333',
                                scale: isVisited ? 1.1 : 1
                            }}
                            style={{
                                position: 'absolute',
                                left: node.x - 20,
                                top: node.y - 20,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid #555',
                                zIndex: 10,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                color: isVisited ? '#222' : '#fff',
                                fontWeight: 'bold'
                            }}
                        >
                            {node.id}
                            <div style={{
                                position: 'absolute',
                                top: '-25px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#222',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                color: isVisited ? '#4ECDC4' : '#FF6B6B',
                                border: '1px solid #444'
                            }}>
                                {isInfinity ? '∞' : dist}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default DijkstraVisualizer;
