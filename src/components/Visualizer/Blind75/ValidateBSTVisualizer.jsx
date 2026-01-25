import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ValidateBSTVisualizer = () => {
    // Tree Structure:
    //      5
    //    /   \
    //   1     4  (Invalid: 4 < 5, but right child must be > parent? No. Wait.)
    // BST Property:
    // Left subtree nodes < Node
    // Right subtree nodes > Node

    // Example 1: Valid
    //      5
    //    /   \
    //   1     7
    //        / \
    //       6   8

    // Example 2: Invalid
    //      5
    //    /   \
    //   1     7
    //        / \
    //       3   8
    // (3 is in right subtree of 5, but 3 < 5. Invalid!)

    const [tree, setTree] = useState({
        id: 1, val: 5, x: 200, y: 50,
        left: {
            id: 2, val: 1, x: 100, y: 150,
            left: null, right: null
        },
        right: {
            id: 3, val: 7, x: 300, y: 150,
            left: {
                id: 4, val: 3, x: 250, y: 250, // Invalid node! Right of 5, so > 5. But 3 < 5.
                left: null, right: null
            },
            right: {
                id: 5, val: 8, x: 350, y: 250,
                left: null, right: null
            }
        }
    });

    const [message, setMessage] = useState('Click Start to validate BST.');
    const [currentNode, setCurrentNode] = useState(null);
    const [currentRange, setCurrentRange] = useState({ min: -Infinity, max: Infinity });
    const [errorNode, setErrorNode] = useState(null);
    const [visited, setVisited] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isValidBST, setIsValidBST] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const reset = () => {
        setCurrentNode(null);
        setCurrentRange({ min: -Infinity, max: Infinity });
        setErrorNode(null);
        setVisited([]);
        setIsFinished(false);
        setIsValidBST(null);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const validate = async () => {
        if (isRunning) return;
        setIsRunning(true);
        reset();
        await new Promise(r => setTimeout(r, 100)); // allow reset

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        const validateNode = async (node, min, max) => {
            if (!node) return true;

            setCurrentNode(node.id);
            setCurrentRange({ min, max });
            setVisited(prev => [...prev, node.id]);

            setMessage(`Visiting Node ${node.val}. Range: (${min === -Infinity ? '-Inf' : min}, ${max === Infinity ? 'Inf' : max})`);
            await sleep(delay);

            // Check conditions
            if ((min !== -Infinity && node.val <= min) || (max !== Infinity && node.val >= max)) {
                setErrorNode(node.id);
                setMessage(`Error! Node ${node.val} violates range (${min}, ${max}).`);
                return false;
            }

            setMessage(`Node ${node.val} within range. Checking children...`);
            await sleep(delay);

            // Left Child: Range (min, node.val)
            if (node.left) {
                const leftValid = await validateNode(node.left, min, node.val);
                if (!leftValid) return false;
            }

            // Backtrack to current node logic context (conceptually)
            setCurrentNode(node.id);
            setCurrentRange({ min, max });

            // Right Child: Range (node.val, max)
            if (node.right) {
                const rightValid = await validateNode(node.right, node.val, max);
                if (!rightValid) return false;
            }

            return true;
        };

        const result = await validateNode(tree, -Infinity, Infinity);

        setIsValidBST(result);
        setIsFinished(true);
        setIsRunning(false);
        setCurrentNode(null);

        if (result) {
            setMessage("Validation Complete: Tree is a VALID BST.");
        } else {
            setMessage("Validation Complete: Tree is INVALID.");
        }
    };

    // Helper to render tree
    const renderTree = (node) => {
        if (!node) return null;
        return (
            <React.Fragment key={node.id}>
                {node.left && (
                    <line
                        x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y}
                        stroke="#555" strokeWidth="2"
                    />
                )}
                {node.right && (
                    <line
                        x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y}
                        stroke="#555" strokeWidth="2"
                    />
                )}
                {renderTree(node.left)}
                {renderTree(node.right)}

                <g
                    onClick={() => { }}
                    style={{ cursor: 'default' }}
                >
                    <circle
                        cx={node.x} cy={node.y} r="20"
                        fill={
                            errorNode === node.id ? '#e74c3c' :
                                currentNode === node.id ? '#f1c40f' :
                                    visited.includes(node.id) ? '#2ecc71' : '#3498db'
                        }
                        stroke="white" strokeWidth="2"
                    />
                    <text
                        x={node.x} y={node.y}
                        dy=".3em" textAnchor="middle"
                        fill="white" fontWeight="bold"
                    >
                        {node.val}
                    </text>
                    {/* Show Range bubble if active */}
                    {currentNode === node.id && (
                        <foreignObject x={node.x + 25} y={node.y - 15} width="120" height="50">
                            <div style={{ background: 'rgba(255,255,255,0.9)', color: 'black', padding: '4px', borderRadius: '4px', fontSize: '0.7rem', border: '1px solid #333' }}>
                                Range: ({currentRange.min === -Infinity ? '-Inf' : currentRange.min}, {currentRange.max === Infinity ? 'Inf' : currentRange.max})
                            </div>
                        </foreignObject>
                    )}
                </g>
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={validate}
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
                    Check Valid BST
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '3rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{
                height: '350px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <svg width="100%" height="100%">
                    {renderTree(tree)}
                </svg>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                Node 3 is invalid (Range: 5 to 7, Val: 3).
            </div>
        </div>
    );
};

export default ValidateBSTVisualizer;
