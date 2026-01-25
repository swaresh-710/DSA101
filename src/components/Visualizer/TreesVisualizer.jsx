import React, { useState } from 'react';

// Simple Binary Tree Node Logic for Visualization
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.x = 0; // for canvas/svg positioning
        this.y = 0;
    }
}

const TreesVisualizer = () => {
    const [root, setRoot] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [key, setKey] = useState(0); // Force re-render

    const insert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        if (!root) {
            setRoot(new TreeNode(val));
        } else {
            insertNode(root, val);
        }
        setInputValue('');
        setKey(prev => prev + 1);
    };

    const insertNode = (node, val) => {
        if (val < node.val) {
            if (!node.left) node.left = new TreeNode(val);
            else insertNode(node.left, val);
        } else {
            if (!node.right) node.right = new TreeNode(val);
            else insertNode(node.right, val);
        }
    };

    const reset = () => {
        setRoot(null);
        setKey(prev => prev + 1);
    };

    // Recursive rendering helper
    const renderTree = (node, x, y, level, parentX, parentY) => {
        if (!node) return null;

        const gap = 120 / (level + 1);
        const nextY = y + 60;
        const leftX = x - gap;
        const rightX = x + gap;

        return (
            <React.Fragment key={`${node.val}-${x}-${y}`}>
                {/* Line to Parent */}
                {parentX !== null && (
                    <line
                        x1={parentX} y1={parentY + 20}
                        x2={x} y2={y - 20}
                        stroke="var(--glass-border)"
                        strokeWidth="2"
                    />
                )}

                {/* Node Circle */}
                <g>
                    <circle cx={x} cy={y} r="20" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />
                    <text x={x} y={y} dy=".3em" textAnchor="middle" fill="white" fontSize="12px" fontWeight="bold">{node.val}</text>
                </g>

                {/* Children */}
                {renderTree(node.left, leftX, nextY, level + 1, x, y)}
                {renderTree(node.right, rightX, nextY, level + 1, x, y)}
            </React.Fragment>
        );
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Value"
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white', marginRight: '1rem' }}
                />
                <button onClick={insert} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
                    Insert
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                    Reset
                </button>
            </div>

            <div style={{
                height: '400px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.1)'
            }}>
                <svg width="100%" height="100%" viewBox="0 0 600 400">
                    <g transform="translate(300, 40)">
                        {root ? renderTree(root, 0, 0, 1, null, null) : <text x="0" y="50" textAnchor="middle" fill="#666">Empty Tree</text>}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default TreesVisualizer;
