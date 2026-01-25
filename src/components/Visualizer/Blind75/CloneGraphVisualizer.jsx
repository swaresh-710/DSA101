import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Graph representation
// Node 1: [2, 4]
// Node 2: [1, 3]
// Node 3: [2, 4]
// Node 4: [1, 3]
const initialGraph = {
    1: { id: 1, neighbors: [2, 4], x: 50, y: 50 },
    2: { id: 2, neighbors: [1, 3], x: 150, y: 50 },
    3: { id: 3, neighbors: [2, 4], x: 150, y: 150 },
    4: { id: 4, neighbors: [1, 3], x: 50, y: 150 }
};

const CloneGraphVisualizer = () => {
    const [originalNodes, setOriginalNodes] = useState(initialGraph);
    const [clonedNodes, setClonedNodes] = useState({}); // id -> { id, neighbors: [] }
    const [visited, setVisited] = useState({}); // originalId -> clonedId
    const [queue, setQueue] = useState([]); // BFS queue
    const [currentNode, setCurrentNode] = useState(null);
    const [message, setMessage] = useState('Click Start to clone the graph.');
    const [isFinished, setIsFinished] = useState(false);
    const [step, setStep] = useState(0);

    const reset = () => {
        setClonedNodes({});
        setVisited({});
        setQueue([]);
        setCurrentNode(null);
        setIsFinished(false);
        setMessage('Ready.');
        setStep(0);
    };

    const handleStep = () => {
        if (isFinished) return;

        // Init
        if (step === 0) {
            const startNode = 1;
            setQueue([startNode]);
            setVisited({ [startNode]: startNode }); // Mapping original 1 -> cloned 1
            setClonedNodes({ [startNode]: { id: startNode, neighbors: [], x: 50, y: 50 } });
            setMessage(`Start BFS from Node 1. Created Clone 1.`);
            setStep(1);
            return;
        }

        if (queue.length > 0) {
            const curr = queue[0]; // Peek
            setCurrentNode(curr);

            // We need to process neighbors one by one or all at once?
            // For visualization, let's process all neighbors of current node then dequeue.

            const neighbors = originalNodes[curr].neighbors;
            const clone = clonedNodes[curr];

            // Check if we have processed all neighbors for this node?
            // This simple logic might re-process. Let's make it granular.
            // Actually, let's just do standard BFS: pop, process all neighbors, add unvisited to queue.

            const newQueue = queue.slice(1);
            const newVisited = { ...visited };
            const newClonedNodes = { ...clonedNodes };
            let msg = `Processing neighbors of Node ${curr}: [${neighbors.join(', ')}]. `;

            neighbors.forEach(neighborId => {
                if (!newVisited[neighborId]) {
                    newVisited[neighborId] = neighborId;
                    // Create new clone node (with offset position for visualization separation? No, let's mirror structure just shifted)
                    newClonedNodes[neighborId] = {
                        id: neighborId,
                        neighbors: [],
                        x: originalNodes[neighborId].x,
                        y: originalNodes[neighborId].y
                    };
                    newQueue.push(neighborId);
                    msg += `Cloned Node ${neighborId}. `;
                }

                // Add edge to clone
                // Check if edge already exists to avoid dupes in this simple graph assumption (undirected)
                if (!newClonedNodes[curr].neighbors.includes(neighborId)) {
                    newClonedNodes[curr].neighbors.push(neighborId);
                    msg += `Added edge ${curr}->${neighborId} to clone. `;
                }
            });

            setQueue(newQueue);
            setVisited(newVisited);
            setClonedNodes(newClonedNodes);
            setMessage(msg);

            if (newQueue.length === 0) {
                setTimeout(() => {
                    setIsFinished(true);
                    setMessage("Graph cloned successfully!");
                    setCurrentNode(null);
                }, 500);
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {step === 0 ? 'Start BFS' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '2rem', height: '3rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center' }}>
                {/* Original Graph */}
                <div style={{ position: 'relative', width: '200px', height: '200px', border: '1px solid #444', borderRadius: '8px' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#888', fontSize: '0.8rem' }}>Original</div>
                    <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        {Object.values(originalNodes).map(node => (
                            node.neighbors.map(neighborId => {
                                if (node.id < neighborId) { // Draw edge once
                                    const n2 = originalNodes[neighborId];
                                    return (
                                        <line key={`${node.id}-${neighborId}`} x1={node.x} y1={node.y} x2={n2.x} y2={n2.y} stroke="#555" strokeWidth="2" />
                                    );
                                }
                                return null;
                            })
                        ))}
                    </svg>
                    {Object.values(originalNodes).map(node => (
                        <div
                            key={node.id}
                            style={{
                                position: 'absolute', left: node.x, top: node.y,
                                width: '30px', height: '30px', borderRadius: '50%', background: '#333',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transform: 'translate(-50%, -50%)',
                                border: currentNode === node.id ? '2px solid var(--accent-primary)' : '2px solid #555'
                            }}
                        >
                            {node.id}
                        </div>
                    ))}
                </div>

                {/* Cloned Graph */}
                <div style={{ position: 'relative', width: '200px', height: '200px', border: '1px dashed var(--accent-primary)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--accent-primary)', fontSize: '0.8rem' }}>Cloned</div>
                    <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        {Object.values(clonedNodes).map(node => (
                            node.neighbors.map(neighborId => {
                                // Draw edge if neighbor exists in clones (it might not have backward edge yet if using directed logic in visualization, but here neighbors are added)
                                // Since we add edges from current to all neighbors, and graph is effectively undirected, we might draw multiple.
                                // For visual cleanliness, let's just draw what exists.
                                const n2 = clonedNodes[neighborId];
                                if (n2) {
                                    return (
                                        <line key={`c-${node.id}-${neighborId}`} x1={node.x} y1={node.y} x2={n2.x} y2={n2.y} stroke="var(--accent-primary)" strokeWidth="2" opacity="0.6" />
                                    );
                                }
                                return null;
                            })
                        ))}
                    </svg>
                    <AnimatePresence>
                        {Object.values(clonedNodes).map(node => (
                            <motion.div
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{
                                    position: 'absolute', left: node.x, top: node.y,
                                    width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'black', fontWeight: 'bold'
                                }}
                            >
                                {node.id}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                We use a Hash Map (Original Node -&gt; Cloned Node) to keep track of visited nodes and ensure deep copy.
            </div>
        </div>
    );
};

export default CloneGraphVisualizer;
