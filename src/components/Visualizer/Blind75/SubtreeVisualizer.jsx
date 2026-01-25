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

const SubtreeVisualizer = () => {
    // Main Tree (S):
    //      3
    //     / \
    //    4   5
    //   / \
    //  1   2
    const createMainTree = () => {
        return new TreeNode(3,
            new TreeNode(4, new TreeNode(1), new TreeNode(2)),
            new TreeNode(5)
        );
    };

    // Subtree (T):
    //    4
    //   / \
    //  1   2
    const createSubTree = () => {
        return new TreeNode(4, new TreeNode(1), new TreeNode(2));
    };

    const [root, setRoot] = useState(createMainTree());
    const [subRoot, setSubRoot] = useState(createSubTree());
    const [activeNodeId, setActiveNodeId] = useState(null); // Node in Main tree being visited
    const [matchingNodes, setMatchingNodes] = useState([]); // Nodes currently part of a match check
    const [message, setMessage] = useState('Click Start to check if T is subtree of S.');
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState(null);

    const reset = () => {
        setRoot(createMainTree());
        setActiveNodeId(null);
        setMatchingNodes([]);
        setResult(null);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runCheck = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting Subtree Check...');
        setResult(null);

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 800;

        const isSame = async (p, q) => {
            if (!p && !q) return true;
            if (!p || !q || p.val !== q.val) return false;

            // Visual match check
            setMatchingNodes(prev => [...prev, p.id]); // Add to matching set highlight
            await sleep(delay / 2);

            const left = await isSame(p.left, q.left);
            const right = await isSame(p.right, q.right);

            return left && right;
        };

        const dfs = async (node) => {
            if (!node) return false;

            setActiveNodeId(node.id);
            setMessage(`Visiting Node ${node.val} in Main Tree.`);
            await sleep(delay);

            if (node.val === subRoot.val) {
                setMessage(`Node ${node.val} matches Subtree Root. Checking structure...`);
                setMatchingNodes([]); // Clear previous matches
                const match = await isSame(node, subRoot);
                if (match) {
                    setMessage(`Subtree Found starting at Node ${node.val}!`);
                    return true;
                } else {
                    setMessage(`Structure mismatch at Node ${node.val}. continuing...`);
                    setMatchingNodes([]);
                }
            }

            if (await dfs(node.left)) return true;
            if (await dfs(node.right)) return true;

            return false;
        };

        const found = await dfs(root);
        setResult(found);
        setActiveNodeId(null);
        setIsRunning(false);
        if (!found) setMessage('Traversal complete. Subtree NOT found.');
    };

    const renderTree = (node, x, y, level, parentX, parentY, isSubtree = false) => {
        if (!node) return null;
        const gap = (isSubtree ? 50 : 100) / Math.pow(1.8, level - 1);
        const nextY = y + 50;

        const isActive = !isSubtree && activeNodeId === node.id;
        const isMatching = !isSubtree && matchingNodes.includes(node.id);

        return (
            <React.Fragment key={node.id}>
                {parentX !== null && <line x1={parentX} y1={parentY + 15} x2={x} y2={y - 15} stroke="var(--glass-border)" strokeWidth="2" />}
                <motion.circle
                    cx={x} cy={y} r="15"
                    fill={isMatching ? '#2ecc71' : (isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)')}
                    stroke="var(--accent-primary)" strokeWidth="2"
                    animate={{ scale: isActive || isMatching ? 1.2 : 1 }}
                />
                <text x={x} y={y} dy=".3em" textAnchor="middle" fill={isActive || isMatching ? 'black' : 'white'} fontSize="12px" fontWeight="bold">{node.val}</text>
                {renderTree(node.left, x - gap, nextY, level + 1, x, y, isSubtree)}
                {renderTree(node.right, x + gap, nextY, level + 1, x, y, isSubtree)}
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button onClick={runCheck} disabled={isRunning} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isRunning ? 0.5 : 1, color: 'black', fontWeight: 'bold' }}>
                    Check Subtree
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '1.5rem', color: result === true ? '#2ecc71' : 'var(--accent-secondary)' }}>{message}</div>

            <div style={{ height: '350px', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                <svg width="100%" height="100%" viewBox="0 0 600 350">
                    <line x1="400" y1="20" x2="400" y2="330" stroke="#333" strokeDasharray="4" />

                    <g transform="translate(200, 40)">
                        <text x="0" y="-20" textAnchor="middle" fill="#aaa">Main Tree (S)</text>
                        {root && renderTree(root, 0, 0, 1, null, null)}
                    </g>

                    <g transform="translate(500, 40)">
                        <text x="0" y="-20" textAnchor="middle" fill="#aaa">Subtree (T)</text>
                        {subRoot && renderTree(subRoot, 0, 0, 1, null, null, true)}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default SubtreeVisualizer;
