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

const MaxDepthVisualizer = () => {
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
    const [message, setMessage] = useState('Click Start to calculate Max Depth.');
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [nodeDepths, setNodeDepths] = useState({}); // Stores calculated depth for each node ID
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setRoot(createInitialTree());
        setActiveNodeId(null);
        setNodeDepths({});
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runMaxDepth = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting DFS...');
        setNodeDepths({});

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 800;

        const maxDepth = async (node) => {
            if (!node) return 0;

            setActiveNodeId(node.id);
            setMessage(`Visiting Node ${node.val}. Going deeper...`);
            await sleep(delay);

            const leftDepth = await maxDepth(node.left);
            setActiveNodeId(node.id); // Refocus back to current after returning from left
            setMessage(`Node ${node.val}: Left Depth is ${leftDepth}. Checking Right...`);
            await sleep(delay);

            const rightDepth = await maxDepth(node.right);
            setActiveNodeId(node.id); // Refocus back to current after returning from right
            setMessage(`Node ${node.val}: Right Depth is ${rightDepth}.`);
            await sleep(delay);

            const currentDepth = 1 + Math.max(leftDepth, rightDepth);

            setNodeDepths(prev => ({ ...prev, [node.id]: currentDepth }));
            setMessage(`Node ${node.val}: Max Depth = 1 + max(${leftDepth}, ${rightDepth}) = ${currentDepth}`);
            await sleep(delay);

            return currentDepth;
        };

        const result = await maxDepth(root);

        setActiveNodeId(null);
        setIsRunning(false);
        setIsFinished(true);
        setMessage(`Finished! Max Depth of Tree is ${result}.`);
    };

    const renderTree = (node, x, y, level, parentX, parentY) => {
        if (!node) return null;

        const gap = 140 / Math.pow(1.8, level - 1);
        const nextY = y + 70;
        const leftX = x - gap;
        const rightX = x + gap;

        const isActive = activeNodeId === node.id;
        const depthVal = nodeDepths[node.id];

        return (
            <React.Fragment key={node.id}>
                {parentX !== null && (
                    <line
                        x1={parentX} y1={parentY + 20}
                        x2={x} y2={y - 20}
                        stroke="var(--glass-border)"
                        strokeWidth="2"
                    />
                )}

                <g>
                    <motion.circle
                        cx={x} cy={y} r="20"
                        fill={isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)'}
                        stroke={depthVal !== undefined ? '#2ecc71' : 'var(--accent-primary)'}
                        strokeWidth={depthVal !== undefined ? "3" : "2"}
                        layout
                        animate={{ scale: isActive ? 1.2 : 1 }}
                    />
                    <text x={x} y={y} dy=".3em" textAnchor="middle" fill={isActive ? 'black' : 'white'} fontSize="14px" fontWeight="bold">{node.val}</text>

                    {/* Display Depth Value next to node if calculated */}
                    {depthVal !== undefined && (
                        <motion.text
                            initial={{ opacity: 0, y: y - 10 }}
                            animate={{ opacity: 1, y: y - 25 }}
                            x={x}
                            textAnchor="middle"
                            fill="#2ecc71"
                            fontSize="12px"
                            fontWeight="bold"
                        >
                            d={depthVal}
                        </motion.text>
                    )}
                </g>

                {renderTree(node.left, leftX, nextY, level + 1, x, y)}
                {renderTree(node.right, rightX, nextY, level + 1, x, y)}
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button onClick={runMaxDepth} disabled={isRunning || isFinished} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: (isRunning || isFinished) ? 0.5 : 1, color: 'black', fontWeight: 'bold' }}>
                    Calculate Depth
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ height: '400px', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                <svg width="100%" height="100%" viewBox="0 0 600 400">
                    <g transform="translate(300, 40)">
                        {root && renderTree(root, 0, 0, 1, null, null)}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default MaxDepthVisualizer;
