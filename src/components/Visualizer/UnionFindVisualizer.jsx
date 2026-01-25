import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UnionFindVisualizer = () => {
    const [numNodes, setNumNodes] = useState(10);
    const [parents, setParents] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('Ready to perform Union-Find operations.');
    const [nodeA, setNodeA] = useState('');
    const [nodeB, setNodeB] = useState('');
    const [highlightNodes, setHighlightNodes] = useState([]);
    const [activeOperation, setActiveOperation] = useState(null);

    // Initialize Disjoint Set
    useEffect(() => {
        resetDSU();
    }, [numNodes]);

    const resetDSU = () => {
        const initialParents = Array.from({ length: numNodes }, (_, i) => i);
        const initialRanks = Array(numNodes).fill(0);
        setParents(initialParents);
        setRanks(initialRanks);
        setHistory([]);
        setMessage(`Initialized ${numNodes} disjoint sets.`);
        setHighlightNodes([]);
        setActiveOperation(null);
    };

    const find = (i, localParents) => {
        if (localParents[i] === i) {
            return i;
        }
        return find(localParents[i], localParents); // Simple find for visualization path
    };

    const findWithPathCompression = (i, localParents) => {
        if (localParents[i] !== i) {
            localParents[i] = findWithPathCompression(localParents[i], localParents);
        }
        return localParents[i];
    };

    const handleFind = async () => {
        if (nodeA === '' || isNaN(nodeA) || nodeA < 0 || nodeA >= numNodes) {
            setMessage('Please enter a valid node index.');
            return;
        }

        const idx = parseInt(nodeA);
        setActiveOperation('FIND');
        setMessage(`Finding representative for node ${idx}...`);

        // Visualize path finding (simplified)
        let curr = idx;
        const path = [];
        const currentParents = [...parents];

        while (currentParents[curr] !== curr) {
            path.push(curr);
            curr = currentParents[curr];
        }
        path.push(curr);

        setHighlightNodes(path);

        // Apply path compression logic in state explanation
        const root = curr;
        setMessage(`Representative of ${idx} is ${root}. Path: ${path.join(' -> ')}`);

        // Actually update state for path compression if we want to show that
        // For now, let's just show the structure first
        setTimeout(() => {
            setHighlightNodes([]);
            setActiveOperation(null);
        }, 2000);
    };

    const handleUnion = () => {
        if (nodeA === '' || nodeB === '' || isNaN(nodeA) || isNaN(nodeB)) {
            setMessage('Please enter two valid node indices.');
            return;
        }

        const idxA = parseInt(nodeA);
        const idxB = parseInt(nodeB);

        if (idxA < 0 || idxA >= numNodes || idxB < 0 || idxB >= numNodes) {
            setMessage('Node indices out of bounds.');
            return;
        }

        setActiveOperation('UNION');
        setMessage(`Union(${idxA}, ${idxB})... Finding roots.`);

        const currentParents = [...parents];
        const currentRanks = [...ranks];

        // Find roots
        let rootA = find(idxA, currentParents);
        let rootB = find(idxB, currentParents);

        setHighlightNodes([idxA, idxB]);

        setTimeout(() => {
            if (rootA === rootB) {
                setMessage(`Nodes ${idxA} and ${idxB} are already in the same set (Root: ${rootA}).`);
                setActiveOperation(null);
                setHighlightNodes([]);
                return;
            }

            setMessage(`Roots are ${rootA} and ${rootB}. Merging sets...`);

            // Union by Rank
            if (currentRanks[rootA] < currentRanks[rootB]) {
                currentParents[rootA] = rootB;
                setMessage(`Rank of ${rootA} < Rank of ${rootB}. Attached ${rootA} to ${rootB}.`);
            } else if (currentRanks[rootA] > currentRanks[rootB]) {
                currentParents[rootB] = rootA;
                setMessage(`Rank of ${rootA} > Rank of ${rootB}. Attached ${rootB} to ${rootA}.`);
            } else {
                currentParents[rootB] = rootA;
                currentRanks[rootA]++;
                setMessage(`Ranks are equal. Attached ${rootB} to ${rootA} and incremented rank of ${rootA}.`);
            }

            setParents(currentParents);
            setRanks(currentRanks);

            setTimeout(() => {
                setHighlightNodes([]);
                setActiveOperation(null);
            }, 1500);

        }, 1000);
    };

    const getNodeColor = (i) => {
        // Find the absolute root to determine color group
        let curr = i;
        let p = parents;
        // Caution: simplistic traversal, purely for coloring based on current state
        let steps = 0;
        while (p[curr] !== curr && steps < numNodes) {
            curr = p[curr];
            steps++;
        }
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
            '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
        ];
        return colors[curr % colors.length];
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                    type="number"
                    placeholder="Node A"
                    value={nodeA}
                    onChange={(e) => setNodeA(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white', width: '80px' }}
                />
                <input
                    type="number"
                    placeholder="Node B"
                    value={nodeB}
                    onChange={(e) => setNodeB(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white', width: '80px' }}
                />
                <button
                    onClick={handleUnion}
                    disabled={activeOperation !== null}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: activeOperation ? 0.5 : 1 }}
                >
                    Union(A, B)
                </button>
                <button
                    onClick={handleFind}
                    disabled={activeOperation !== null}
                    style={{ padding: '0.5rem 1rem', background: '#444', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: activeOperation ? 0.5 : 1, color: 'white' }}
                >
                    Find(A)
                </button>
                <button
                    onClick={resetDSU}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #666', borderRadius: '4px', cursor: 'pointer', color: '#aaa', marginLeft: 'auto' }}
                >
                    Reset
                </button>
            </div>

            {/* Status Message */}
            <div style={{ marginBottom: '2rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            {/* Visualization Area */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'flex-start',
                minHeight: '300px'
            }}>
                {parents.map((parent, i) => {
                    const isRoot = parent === i;
                    const isHighlight = highlightNodes.includes(i);
                    const color = getNodeColor(i);

                    return (
                        <motion.div
                            key={i}
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: isHighlight ? 1.2 : 1,
                                opacity: 1,
                                borderColor: isHighlight ? 'white' : 'transparent',
                                borderWidth: isHighlight ? '2px' : '0px'
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: color,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                color: '#222',
                                border: '3px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                zIndex: 2
                            }}>
                                {i}
                            </div>

                            {/* Rank Badge */}
                            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '5px' }}>
                                Rank: {ranks[i]}
                            </div>

                            {/* Pointer Arrow */}
                            {!isRoot && (
                                <motion.div
                                    animate={{ height: '30px' }}
                                    style={{
                                        marginTop: '-5px',
                                        marginBottom: '-5px',
                                        width: '2px',
                                        background: '#666',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Simple down arrow for now, visualizing hierarchy could be complex efficiently, 
                                         so we just show "Parent: X" text below if not clear? 
                                         Actually, let's just write "-> Parent" below 
                                      */}
                                </motion.div>
                            )}

                            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '2px' }}>
                                {isRoot ? 'Root' : `Parent: ${parent}`}
                            </div>

                        </motion.div>
                    );
                })}
            </div>

            {/* Theoretical Tree View (Conceptual) */}
            <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #333' }}>
                <h4 style={{ color: '#888', marginBottom: '1rem' }}>Internal Array State</h4>
                <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {parents.map((p, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '30px' }}>
                            <div style={{ padding: '5px', background: '#333', width: '100%', textAlign: 'center', borderBottom: '1px solid #555' }}>{i}</div>
                            <div style={{ padding: '5px', background: '#222', width: '100%', textAlign: 'center', color: highlightNodes.includes(i) ? 'var(--accent-primary)' : '#fff' }}>{p}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UnionFindVisualizer;
