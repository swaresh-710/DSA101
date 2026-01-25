import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LinkedListCycleVisualizer = () => {
    // List: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> (Cycle to 3)
    const nodes = [
        { id: 1, x: 50, y: 100 },
        { id: 2, x: 150, y: 100 },
        { id: 3, x: 250, y: 100 },
        { id: 4, x: 350, y: 100 },
        { id: 5, x: 350, y: 200 },
        { id: 6, x: 250, y: 200 },
    ];
    // Cycle link from 6 to 3

    const [slow, setSlow] = useState(1);
    const [fast, setFast] = useState(1);
    const [message, setMessage] = useState('Click Start to detect cycle using Slow/Fast pointers.');
    const [isFinished, setIsFinished] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [stepCount, setStepCount] = useState(0);

    const getNext = (id) => {
        if (id === 1) return 2;
        if (id === 2) return 3;
        if (id === 3) return 4;
        if (id === 4) return 5;
        if (id === 5) return 6;
        if (id === 6) return 3; // The Cycle
        return null;
    };

    const reset = () => {
        setSlow(1);
        setFast(1);
        setStepCount(0);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runCycleDetection = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting Floyd\'s Cycle Detection...');

        let s = 1;
        let f = 1;
        let steps = 0;

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        await sleep(delay);

        // Algorithm loop
        while (true) {
            steps++;
            setStepCount(steps);

            // Move Slow 1 step
            s = getNext(s);
            setSlow(s);
            setMessage(`Step ${steps}: Slow moves to ${s}`);
            await sleep(delay / 2);

            // Move Fast 2 steps
            let f_next = getNext(f);
            if (f_next === null) {
                setMessage('Fast reached end. No cycle.');
                break; // Should not happen in this specific cyclic setup
            }
            // Animate intermediate step for fast? maybe too complex visually, just jump
            f = getNext(f_next);
            setFast(f);
            setMessage(`Step ${steps}: Fast moves to ${f} (jumped over ${f_next})`);
            await sleep(delay);

            if (s === f) {
                setMessage(`Cycle Detected! Slow and Fast met at Node ${s}.`);
                setIsFinished(true);
                break;
            }
        }
        setIsRunning(false);
    };

    return (
        <div style={{ padding: '1rem', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={runCycleDetection}
                    disabled={isRunning || isFinished}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: (isRunning || isFinished) ? 0.5 : 1,
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                >
                    Detect Cycle
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '2rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ position: 'relative', width: '500px', height: '300px', border: '1px dashed #333', borderRadius: '8px' }}>

                {/* Draw Links manually based on positions */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                        </marker>
                    </defs>
                    <line x1="50" y1="100" x2="150" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="150" y1="100" x2="250" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="250" y1="100" x2="350" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="350" y1="100" x2="350" y2="200" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="350" y1="200" x2="250" y2="200" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="250" y1="200" x2="250" y2="100" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>

                {nodes.map(node => (
                    <div
                        key={node.id}
                        style={{
                            position: 'absolute',
                            left: node.x - 25,
                            top: node.y - 25,
                            width: '50px', height: '50px',
                            borderRadius: '50%',
                            background: '#34495e',
                            border: '2px solid #ecf0f1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold',
                            zIndex: 1
                        }}
                    >
                        {node.id}
                    </div>
                ))}

                {/* Pointers */}
                {/* Slow Pointer - Turtle/Green */}
                <motion.div
                    animate={{
                        left: nodes.find(n => n.id === slow).x - 20,
                        top: nodes.find(n => n.id === slow).y - 45
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'absolute', color: '#2ecc71', fontWeight: 'bold', zIndex: 10 }}
                >
                    S
                </motion.div>

                {/* Fast Pointer - Hare/Red */}
                <motion.div
                    animate={{
                        left: nodes.find(n => n.id === fast).x + 10,
                        top: nodes.find(n => n.id === fast).y - 45
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'absolute', color: '#e74c3c', fontWeight: 'bold', zIndex: 10 }}
                >
                    F
                </motion.div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                <span style={{ color: '#2ecc71' }}>S = Slow (1 step)</span>
                <span style={{ color: '#e74c3c' }}>F = Fast (2 steps)</span>
            </div>
        </div>
    );
};

export default LinkedListCycleVisualizer;
