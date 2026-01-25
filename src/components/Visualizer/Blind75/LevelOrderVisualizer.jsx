import React, { useState } from 'react';
import { motion } from 'framer-motion';

class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

const LevelOrderVisualizer = () => {
    // Tree:
    //      3
    //     / \
    //    9  20
    //      /  \
    //     15   7
    const createInitialTree = () => {
        return new TreeNode(3,
            new TreeNode(9),
            new TreeNode(20, new TreeNode(15), new TreeNode(7))
        );
    };

    const [root, setRoot] = useState(createInitialTree());
    const [queue, setQueue] = useState([]); // Array of values for visualization
    const [result, setResult] = useState([]); // Array of arrays
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [message, setMessage] = useState('Click Start to run BFS.');
    const [isRunning, setIsRunning] = useState(false);

    const reset = () => {
        setRoot(createInitialTree());
        setQueue([]);
        setResult([]);
        setActiveNodeId(null);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runBFS = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting BFS...');
        setResult([]);

        const q = [root]; // Logical queue
        setQueue([root.val]); // Visual queue

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        await sleep(delay);

        const finalResult = [];

        while (q.length > 0) {
            const levelSize = q.length;
            const currentLevel = [];
            setMessage(`Processing Level with ${levelSize} nodes.`);
            await sleep(delay);

            for (let i = 0; i < levelSize; i++) {
                const node = q.shift();
                setActiveNodeId(node.id);
                setQueue(q.map(n => n.val)); // Update visual queue removing current

                setMessage(`Dequeued ${node.val}. Adding to current level.`);
                currentLevel.push(node.val);
                await sleep(delay);

                if (node.left) {
                    q.push(node.left);
                    setQueue(prev => [...prev, node.left.val]);
                    setMessage(`Enqueued Left Child: ${node.left.val}`);
                    await sleep(delay);
                }
                if (node.right) {
                    q.push(node.right);
                    setQueue(prev => [...prev, node.right.val]);
                    setMessage(`Enqueued Right Child: ${node.right.val}`);
                    await sleep(delay);
                }
            }
            finalResult.push(currentLevel);
            setResult([...finalResult]);
        }

        setActiveNodeId(null);
        setIsRunning(false);
        setMessage('Level Order Traversal Completed!');
    };

    const renderTree = (node, x, y, level, parentX, parentY) => {
        if (!node) return null;
        const gap = 140 / Math.pow(1.8, level - 1);
        const nextY = y + 70;

        return (
            <React.Fragment key={node.id}>
                {parentX !== null && <line x1={parentX} y1={parentY + 20} x2={x} y2={y - 20} stroke="var(--glass-border)" strokeWidth="2" />}
                <motion.circle
                    cx={x} cy={y} r="20"
                    fill={activeNodeId === node.id ? 'var(--accent-primary)' : 'var(--bg-secondary)'}
                    stroke="var(--accent-primary)" strokeWidth="2"
                    animate={{ scale: activeNodeId === node.id ? 1.2 : 1 }}
                />
                <text x={x} y={y} dy=".3em" textAnchor="middle" fill={activeNodeId === node.id ? 'black' : 'white'} fontSize="14px" fontWeight="bold">{node.val}</text>
                {renderTree(node.left, x - gap, nextY, level + 1, x, y)}
                {renderTree(node.right, x + gap, nextY, level + 1, x, y)}
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button onClick={runBFS} disabled={isRunning} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isRunning ? 0.5 : 1, color: 'black', fontWeight: 'bold' }}>
                    Start BFS
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>{message}</div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2, height: '400px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                    <svg width="100%" height="100%" viewBox="0 0 600 400">
                        <g transform="translate(300, 40)">
                            {root && renderTree(root, 0, 0, 1, null, null)}
                        </g>
                    </svg>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', background: '#111' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Queue:</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {queue.map((val, idx) => (
                                <div key={idx} style={{ padding: '5px 10px', background: '#333', borderRadius: '4px', fontSize: '0.9rem' }}>{val}</div>
                            ))}
                            {queue.length === 0 && <span style={{ color: '#666' }}>Empty</span>}
                        </div>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', background: '#111', flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Levels:</h4>
                        {result.map((level, idx) => (
                            <div key={idx} style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: '#888', marginRight: '0.5rem' }}>L{idx}:</span>
                                {JSON.stringify(level)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelOrderVisualizer;
