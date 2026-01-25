import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Simple TreeNode class for logic
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
        this.id = Math.random().toString(36).substr(2, 9); // Unique ID for animation keys
    }
}

const InvertBinaryTreeVisualizer = () => {
    // Initial Tree:
    //      4
    //    /   \
    //   2     7
    //  / \   / \
    // 1   3 6   9

    const createInitialTree = () => {
        return new TreeNode(4,
            new TreeNode(2, new TreeNode(1), new TreeNode(3)),
            new TreeNode(7, new TreeNode(6), new TreeNode(9))
        );
    };

    const [root, setRoot] = useState(createInitialTree());
    const [message, setMessage] = useState('Click Start to invert the tree.');
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [swappingIds, setSwappingIds] = useState([]); // [leftId, rightId]
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setRoot(createInitialTree());
        setActiveNodeId(null);
        setSwappingIds([]);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runInversion = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting recursive inversion...');

        // We need to clone the tree structure to modify it in state
        // But for visualization, we want to animate the logical steps
        // A helper function that updates state step-by-step

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 800;

        const invert = async (node) => {
            if (!node) return;

            setActiveNodeId(node.id);
            setMessage(`Visiting Node ${node.val}...`);
            await sleep(delay);

            // Swap children logic
            if (node.left || node.right) {
                const leftVal = node.left ? node.left.val : 'NULL';
                const rightVal = node.right ? node.right.val : 'NULL';
                setMessage(`Swapping children of ${node.val} (${leftVal} <-> ${rightVal})`);

                setSwappingIds([node.left?.id, node.right?.id]);
                await sleep(delay);

                // Perform swap in logic
                const temp = node.left;
                node.left = node.right;
                node.right = temp;

                // Trigger re-render with new structure
                // Note: We are mutating the object graph which is linked to 'root' state. 
                // In React, we should ideally clone, but for this visualizer deep cloning is complex.
                // We will force update by setting root to itself (spread) or similar 
                // but since 'node' is a reference inside 'root', simple setRoot({...root}) works partially 
                // or better, we just use a refresh trigger. 
                // Here, since we are not changing 'root' reference, we might need to force update.
                // Actually, let's just create a new wrapper or use a refresh counter.
                // For simplicity, we'll just setRoot to a shallow copy or deep clone if feasible.
                // Let's rely on reference mutation + setRoot({...root}) for now.

                setRoot({ ...root });
                setSwappingIds([]);
                setMessage(`Swapped children of ${node.val}.`);
                await sleep(delay);
            }

            // Recurse
            if (node.left) await invert(node.left);
            if (node.right) await invert(node.right);
        };

        // Deep clone first to avoid mutating the initial non-state tree if we reused it (though we create distinct instances in reset)
        // Since we mutate 'root' in place essentially, this is fine for this scope.
        await invert(root);

        setActiveNodeId(null);
        setIsRunning(false);
        setIsFinished(true);
        setMessage('Tree Inverted!');
    };

    // Recursive rendering helper (Similar to TreesVisualizer but with Motion)
    const renderTree = (node, x, y, level, parentX, parentY) => {
        if (!node) return null;

        // Gap decreases as level increases to avoid overlap
        // Level 1: Gap 100, Level 2: Gap 50, Level 3: Gap 25
        const gap = 140 / Math.pow(1.8, level - 1);
        const nextY = y + 70;
        const leftX = x - gap;
        const rightX = x + gap;

        const isActive = activeNodeId === node.id;
        const isSwapping = swappingIds.includes(node.id);

        return (
            <React.Fragment key={node.id}>
                {/* Line to Parent */}
                {parentX !== null && (
                    <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        x1={parentX} y1={parentY + 20}
                        x2={x} y2={y - 20}
                        stroke="var(--glass-border)"
                        strokeWidth="2"
                    />
                )}

                {/* Node Circle */}
                <g onClick={() => console.log(node.val)}>
                    <motion.circle
                        cx={x} cy={y} r="20"
                        fill={isActive ? 'var(--accent-primary)' : (isSwapping ? '#e67e22' : 'var(--bg-secondary)')}
                        stroke={isActive ? 'white' : 'var(--accent-primary)'}
                        strokeWidth="2"
                        layout // Helps animate position changes if we used Reorder, but here we change X/Y props directly
                        animate={{ cx: x, cy: y, scale: isActive ? 1.2 : 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.text
                        x={x} y={y} dy=".3em" textAnchor="middle"
                        fill={isActive ? 'black' : 'white'}
                        fontSize="14px" fontWeight="bold"
                        animate={{ x: x, y: y }}
                        transition={{ duration: 0.5 }}
                    >
                        {node.val}
                    </motion.text>
                </g>

                {/* Children */}
                {renderTree(node.left, leftX, nextY, level + 1, x, y)}
                {renderTree(node.right, rightX, nextY, level + 1, x, y)}
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={runInversion}
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
                    Invert Tree
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{
                height: '400px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.2)',
                overflow: 'hidden'
            }}>
                <svg width="100%" height="100%" viewBox="0 0 600 400">
                    <g transform="translate(300, 40)">
                        {root && renderTree(root, 0, 0, 1, null, null)}
                    </g>
                </svg>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                Yellow = Active Node | Orange = Being Swapped
            </div>
        </div>
    );
};

export default InvertBinaryTreeVisualizer;
