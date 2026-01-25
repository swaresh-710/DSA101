import React, { useState } from 'react';

class TrieNode {
    constructor(char) {
        this.char = char;
        this.children = {};
        this.isEndOfWord = false;
    }
}

const TriesVisualizer = () => {
    const [root, setRoot] = useState(new TrieNode('root'));
    const [word, setWord] = useState('');
    const [key, setKey] = useState(0); // Force re-render

    const insert = () => {
        if (!word) return;
        const newRoot = root; // Mutating deep object for simplicity in demo
        let node = newRoot;

        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode(char);
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;

        setRoot(newRoot);
        setWord('');
        setKey(prev => prev + 1);
    };

    const reset = () => {
        setRoot(new TrieNode('root'));
        setKey(prev => prev + 1);
    };

    const renderTrie = (node, x, y, level, parentX, parentY) => {
        const charKeys = Object.keys(node.children);
        if (charKeys.length === 0) return null;

        const width = 100 * Math.pow(0.8, level);
        const nextY = y + 60;
        let startX = x - (width * (charKeys.length - 1)) / 2;

        return charKeys.map((char, index) => {
            const child = node.children[char];
            const childX = startX + index * width;

            return (
                <React.Fragment key={`${char}-${x}-${y}-${index}`}>
                    {/* Line */}
                    <line x1={x} y1={y + 20} x2={childX} y2={nextY - 20} stroke="var(--glass-border)" strokeWidth="1" />

                    {/* Node */}
                    <g>
                        <circle
                            cx={childX} cy={nextY} r="18"
                            fill={child.isEndOfWord ? 'var(--accent-primary)' : 'var(--bg-secondary)'}
                            stroke="var(--accent-secondary)"
                            strokeWidth="2"
                        />
                        <text x={childX} y={nextY} dy=".3em" textAnchor="middle" fill="white" fontWeight="bold">{char}</text>
                    </g>

                    {/* Children */}
                    {renderTrie(child, childX, nextY, level + 1, x, y)}
                </React.Fragment>
            );
        });
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value.toLowerCase())}
                    placeholder="word"
                    maxLength={6}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white', marginRight: '1rem' }}
                />
                <button onClick={insert} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
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
                background: 'rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <svg width="100%" height="100%" viewBox="0 0 600 400">
                    <g transform="translate(300, 40)">
                        <circle cx="0" cy="0" r="20" fill="#333" stroke="#666" strokeWidth="2" />
                        <text x="0" y="0" dy=".3em" textAnchor="middle" fill="#aaa" fontSize="10px">ROOT</text>
                        {renderTrie(root, 0, 0, 1, 0, 0)}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default TriesVisualizer;
