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

const SameTreeVisualizer = () => {
    // Tree P:
    //      1
    //     / \
    //    2   3
    const createTreeP = () => new TreeNode(1, new TreeNode(2), new TreeNode(3));

    // Tree Q (Initially same as P):
    const createTreeQ = (isSame = true) => {
        if (isSame) return new TreeNode(1, new TreeNode(2), new TreeNode(3));
        return new TreeNode(1, new TreeNode(2), null); // Different structure
    };

    const [treeP, setTreeP] = useState(createTreeP());
    const [treeQ, setTreeQ] = useState(createTreeQ(true));
    const [message, setMessage] = useState('Select mode and click Start.');
    const [activeNodes, setActiveNodes] = useState([]); // [p_node_id, q_node_id]
    const [resultStatus, setResultStatus] = useState(null); // true (match), false (mismatch)
    const [isRunning, setIsRunning] = useState(false);

    const reset = (same = true) => {
        setTreeP(createTreeP());
        setTreeQ(createTreeQ(same));
        setActiveNodes([]);
        setResultStatus(null);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runCompare = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting Comparison...');
        setActiveNodes([]);
        setResultStatus(null);

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 800;

        const isSameTree = async (p, q) => {
            // Visualize visiting nulls or nodes
            const pId = p ? p.id : 'null';
            const qId = q ? q.id : 'null';
            // We can't really track ID of null, so we just use logic.
            // But we want to highlight existing nodes.

            if (p && q) setActiveNodes([p.id, q.id]);
            else if (p) setActiveNodes([p.id, 'null']);
            else if (q) setActiveNodes(['null', q.id]);
            else setActiveNodes(['null', 'null']); // Both null

            setMessage(`Comparing P:${p ? p.val : 'NULL'} and Q:${q ? q.val : 'NULL'}`);
            await sleep(delay);

            if (!p && !q) return true;
            if (!p || !q || p.val !== q.val) {
                setMessage('Mismatch found!');
                setResultStatus(false);
                return false;
            }

            const leftSame = await isSameTree(p.left, q.left);
            if (!leftSame) return false;

            const rightSame = await isSameTree(p.right, q.right);
            if (!rightSame) return false;

            return true;
        };

        const result = await isSameTree(treeP, treeQ);

        setActiveNodes([]);
        setIsRunning(false);
        setResultStatus(result);
        setMessage(result ? 'Trees are the Same!' : 'Trees are Different.');
    };

    const renderTree = (node, x, y, level, parentX, parentY, offsetX = 0) => {
        if (!node) return null;

        const gap = (100 / Math.pow(1.8, level - 1));
        const nextY = y + 50;
        const leftX = x - gap;
        const rightX = x + gap;

        const isActive = activeNodes.includes(node.id);
        const isError = resultStatus === false && isActive;

        return (
            <React.Fragment key={node.id}>
                {parentX !== null && (
                    <line
                        x1={parentX} y1={parentY + 15}
                        x2={x} y2={y - 15}
                        stroke="var(--glass-border)"
                        strokeWidth="2"
                    />
                )}

                <g>
                    <motion.circle
                        cx={x} cy={y} r="15"
                        fill={isError ? '#e74c3c' : (isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)')}
                        stroke="var(--accent-primary)" strokeWidth="2"
                        animate={{ scale: isActive ? 1.2 : 1 }}
                    />
                    <text x={x} y={y} dy=".3em" textAnchor="middle" fill={isActive ? 'black' : 'white'} fontSize="12px" fontWeight="bold">{node.val}</text>
                </g>

                {renderTree(node.left, leftX, nextY, level + 1, x, y, offsetX)}
                {renderTree(node.right, rightX, nextY, level + 1, x, y, offsetX)}
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button onClick={runCompare} disabled={isRunning} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isRunning ? 0.5 : 1, color: 'black', fontWeight: 'bold' }}>
                    Compare Trees
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => reset(true)} style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                        Load Same
                    </button>
                    <button onClick={() => reset(false)} style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                        Load Different
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1rem', height: '1.5rem', color: isError => resultStatus === false ? '#e74c3c' : 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ height: '300px', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                <svg width="100%" height="100%" viewBox="0 0 600 300">
                    <line x1="300" y1="20" x2="300" y2="280" stroke="#333" strokeDasharray="4" />

                    <g transform="translate(150, 40)">
                        <text x="0" y="-20" textAnchor="middle" fill="#aaa">Tree P</text>
                        {treeP && renderTree(treeP, 0, 0, 1, null, null)}
                    </g>

                    <g transform="translate(450, 40)">
                        <text x="0" y="-20" textAnchor="middle" fill="#aaa">Tree Q</text>
                        {treeQ && renderTree(treeQ, 0, 0, 1, null, null)}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default SameTreeVisualizer;
