import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CourseScheduleVisualizer = () => {
    // 0 -> [1], 1 -> [2], 2 -> [0] (Cycle)
    // 3 -> [4] (No cycle)
    const [numCourses, setNumCourses] = useState(5);
    const [prerequisites, setPrerequisites] = useState([[1, 0], [2, 1], [0, 2], [4, 3]]);
    // Edge: [1, 0] means take 0 before 1? Leetcode says: [a, b] => take b first. So b -> a.
    // [1,0]: 0 -> 1.

    const [visiting, setVisiting] = useState(new Set()); // Nodes currently in recursion stack (gray)
    const [visited, setVisited] = useState(new Set());   // Nodes fully processed (black/green)
    const [cycleNode, setCycleNode] = useState(null);    // Node where cycle was detected
    const [message, setMessage] = useState('Click Start to check for cycles.');
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState(null); // true (possible), false (impossible)
    const [currentNode, setCurrentNode] = useState(null);

    // Build Adjacency List
    // [1, 0] => must take 0 before 1. So 0 -> 1.
    const getAdj = () => {
        const adj = {};
        for (let i = 0; i < numCourses; i++) adj[i] = [];
        prerequisites.forEach(([to, from]) => {
            if (adj[from]) adj[from].push(to);
        });
        return adj;
    };

    const reset = () => {
        setVisiting(new Set());
        setVisited(new Set());
        setCycleNode(null);
        setCurrentNode(null);
        setIsFinished(false);
        setResult(null);
        setMessage('Ready.');
    };

    // We can't do step-by-step easily with recursive DFS.
    // We'll use an iterative simulation or state machine approach for visualization.
    // Or just run it and animate the state changes?
    // Let's optimize for interaction: "Check Cycle" runs the algo step-by-step via async/await delay loop? 
    // Since React state updates are async, a pure async loop with sleeps is easiest for "Auto Play".
    // "Step" button is harder with recursion. Let's do Auto Play.

    const runCheck = async () => {
        if (isFinished) reset();
        setIsFinished(false);
        setResult(null);
        const adj = getAdj();
        const visitedSet = new Set();
        const visitingSet = new Set(); // Recursion stack

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        const hasCycle = async (node) => {
            visitingSet.add(node);
            setVisiting(new Set(visitingSet));
            setCurrentNode(node);
            setMessage(`Visiting Node ${node}. Added to recursion stack.`);
            await sleep(800);

            if (adj[node]) {
                for (let neighbor of adj[node]) {
                    if (visitingSet.has(neighbor)) {
                        setCycleNode(neighbor);
                        setMessage(`Cycle detected! Cycle back to Node ${neighbor}. Impossible to finish.`);
                        return true;
                    }
                    if (!visitedSet.has(neighbor)) {
                        if (await hasCycle(neighbor)) return true;
                    }
                }
            }

            visitingSet.delete(node);
            setVisiting(new Set(visitingSet));
            visitedSet.add(node);
            setVisited(new Set(visitedSet));
            setMessage(`Node ${node} processed. Marked as safe.`);
            await sleep(800);
            return false;
        };

        for (let i = 0; i < numCourses; i++) {
            if (!visitedSet.has(i)) {
                if (await hasCycle(i)) {
                    setIsFinished(true);
                    setResult(false); // Impossible
                    return;
                }
            }
        }

        setIsFinished(true);
        setResult(true); // Possible
        setMessage('No cycles found. All courses can be finished!');
        setCurrentNode(null);
    };

    // Helper for manual graph editing
    const addEdge = (u, v) => setPrerequisites([...prerequisites, [v, u]]); // v needs u, so u->v

    // Layout nodes in a circle
    const getPosition = (i) => {
        const radius = 100;
        const angle = (i / numCourses) * 2 * Math.PI - Math.PI / 2;
        return {
            x: Math.cos(angle) * radius + 150,
            y: Math.sin(angle) * radius + 150
        };
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={runCheck}
                    disabled={!isFinished && currentNode !== null} // Disable while running
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: (!isFinished && currentNode !== null) ? 0.5 : 1 }}
                >
                    Run Check
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    Edges: {prerequisites.map(p => `[${p[0]},${p[1]}]`).join(' ')} (e.g. [1,0] means 0-&gt;1)
                </div>
            </div>

            <div style={{ marginBottom: '2rem', height: '2rem', color: isFinished ? (result ? 'green' : 'red') : 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
                <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <defs>
                        <marker id="head" orient="auto" markerWidth="6" markerHeight="6" refX="21" refY="3">
                            <path d="M0,0 V6 L6,3 Z" fill="#666" />
                        </marker>
                        <marker id="head-active" orient="auto" markerWidth="6" markerHeight="6" refX="21" refY="3">
                            <path d="M0,0 V6 L6,3 Z" fill="var(--accent-primary)" />
                        </marker>
                    </defs>
                    {/* Edges */}
                    {prerequisites.map((p, idx) => {
                        const from = p[1];
                        const to = p[0];
                        const p1 = getPosition(from);
                        const p2 = getPosition(to);

                        // Highlight edge if it's potentially part of current path?
                        // Hard to track specific edge in recursion easily without more state.
                        // Just draw static for now.
                        return (
                            <line
                                key={idx}
                                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                stroke={visiting.has(from) && visiting.has(to) ? 'red' : '#666'}
                                strokeWidth="2"
                                markerEnd={visiting.has(from) && visiting.has(to) ? "url(#head-active)" : "url(#head)"}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {Array(numCourses).fill(0).map((_, i) => {
                    const pos = getPosition(i);
                    let bg = '#333';
                    let border = '#555';

                    if (i === cycleNode) {
                        bg = 'red';
                        border = 'red';
                    } else if (visiting.has(i)) {
                        bg = '#f39c12'; // Orange for recursion stack
                        border = '#f39c12';
                    } else if (visited.has(i)) {
                        bg = 'green';
                        border = 'green';
                    }

                    if (i === currentNode) {
                        border = 'white';
                    }

                    return (
                        <motion.div
                            key={i}
                            animate={{ scale: i === currentNode ? 1.2 : 1 }}
                            style={{
                                position: 'absolute', left: pos.x, top: pos.y,
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: bg, border: `2px solid ${border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transform: 'translate(-50%, -50%)', fontWeight: 'bold'
                            }}
                        >
                            {i}
                        </motion.div>
                    );
                })}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', background: '#333', border: '1px solid #555' }}></div> Unvisited
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', background: '#f39c12' }}></div> Visiting (Stack)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', background: 'green' }}></div> Visited (Safe)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', background: 'red' }}></div> Cycle Detected
                </div>
            </div>
        </div>
    );
};

export default CourseScheduleVisualizer;
