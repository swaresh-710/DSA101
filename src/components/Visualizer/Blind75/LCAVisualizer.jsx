import React, { useState } from 'react';

const LCAVisualizer = () => {
    // Tree:
    //        6
    //      /   \
    //     2     8
    //    / \   / \
    //   0   4 7   9
    //      / \
    //     3   5

    // Find LCA of 2 and 8 -> 6
    // Find LCA of 2 and 4 -> 2
    // Find LCA of 0 and 5 -> 2

    const initialTree = {
        id: 1, val: 6, x: 250, y: 50,
        left: {
            id: 2, val: 2, x: 150, y: 150,
            left: { id: 4, val: 0, x: 100, y: 250, left: null, right: null },
            right: {
                id: 5, val: 4, x: 200, y: 250,
                left: { id: 8, val: 3, x: 175, y: 320, left: null, right: null },
                right: { id: 9, val: 5, x: 225, y: 320, left: null, right: null }
            }
        },
        right: {
            id: 3, val: 8, x: 350, y: 150,
            left: { id: 6, val: 7, x: 300, y: 250, left: null, right: null },
            right: { id: 7, val: 9, x: 400, y: 250, left: null, right: null }
        }
    };

    const [p, setP] = useState(2);
    const [q, setQ] = useState(4);

    const [currentNode, setCurrentNode] = useState(null);
    const [lcaNode, setLcaNode] = useState(null);
    const [path, setPath] = useState([]); // Nodes visited
    const [message, setMessage] = useState('Select nodes and click Find LCA.');
    const [isFinished, setIsFinished] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const reset = () => {
        setCurrentNode(null);
        setLcaNode(null);
        setPath([]);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const findLCA = async () => {
        if (isRunning) return;
        setIsRunning(true);
        reset();
        await new Promise(r => setTimeout(r, 100));

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        let curr = initialTree;
        const pVal = p;
        const qVal = q;

        while (curr) {
            setCurrentNode(curr.id);
            setPath(prev => [...prev, curr.id]);
            setMessage(`Visiting Node ${curr.val}...`);
            await sleep(delay);

            if (pVal < curr.val && qVal < curr.val) {
                setMessage(`Both ${pVal} and ${qVal} < ${curr.val}. Go Left.`);
                curr = curr.left;
            } else if (pVal > curr.val && qVal > curr.val) {
                setMessage(`Both ${pVal} and ${qVal} > ${curr.val}. Go Right.`);
                curr = curr.right;
            } else {
                setMessage(`Split point found! ${curr.val} is the LCA.`);
                setLcaNode(curr.id);
                setIsFinished(true);
                setIsRunning(false);
                return;
            }
            await sleep(delay);
        }
    };

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

                <g>
                    <circle
                        cx={node.x} cy={node.y} r="18"
                        fill={
                            lcaNode === node.id ? '#2ecc71' : // Green for LCA
                                currentNode === node.id ? '#f39c12' : // Orange for Current
                                    path.includes(node.id) ? '#3498db' : // Blue for Visited
                                        (node.val === p || node.val === q) ? '#9b59b6' : '#555' // Purple for Targets, Grey inactive
                        }
                        stroke={(node.val === p || node.val === q) ? 'white' : 'none'}
                        strokeWidth={(node.val === p || node.val === q) ? '3' : '0'}
                    />
                    <text
                        x={node.x} y={node.y}
                        dy=".3em" textAnchor="middle"
                        fill="white" fontWeight="bold" fontSize="12px"
                    >
                        {node.val}
                    </text>
                    {(node.val === p) && <text x={node.x} y={node.y - 25} textAnchor="middle" fill="#9b59b6" fontSize="10px">P</text>}
                    {(node.val === q) && <text x={node.x} y={node.y - 25} textAnchor="middle" fill="#9b59b6" fontSize="10px">Q</text>}
                </g>
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label>P:</label>
                    <select value={p} onChange={(e) => setP(parseInt(e.target.value))} style={{ padding: '4px', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }}>
                        {[0, 2, 3, 4, 5, 6, 7, 8, 9].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label>Q:</label>
                    <select value={q} onChange={(e) => setQ(parseInt(e.target.value))} style={{ padding: '4px', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }}>
                        {[0, 2, 3, 4, 5, 6, 7, 8, 9].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>

                <button
                    onClick={findLCA}
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
                    Find LCA
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
                height: '400px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <svg width="100%" height="100%">
                    {renderTree(initialTree)}
                </svg>
            </div>
        </div>
    );
};

export default LCAVisualizer;
