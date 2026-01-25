import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TrieVisualizer = () => {
    // Trie Node: { id, char, isEnd, children: {}, x, y }
    // Visual layout is tricky. Let's do a simplified vertical layout or radial?
    // Vertical like a tree.

    const [idCounter, setIdCounter] = useState(1);
    const [root, setRoot] = useState({ id: 0, char: '*', isEnd: false, children: {} });
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('Enter a word to Insert or Search.');
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [foundNode, setFoundNode] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const insert = async () => {
        if (!inputValue || isAnimating) return;
        setIsAnimating(true);
        setHighlightedNodes([]);
        setFoundNode(null);

        let curr = { ...root }; // deep copy if needing immutability for React state? 
        // For visual, simpler to modify a copy and setRoot at end or step-by-step?
        // Step-by-step is better for "wow".

        // Actually, we must maintain state. 
        // Let's modify a copy of the structure, then update state.
        // It's recursive state update. Hard.

        // Alternative: Use a mutable reference for logic, forcing update for render? Use state.

        // Let's do: Traverse logic locally, Identify path, if new node needed, create it.
        // Re-construct tree state object.

        const newRoot = JSON.parse(JSON.stringify(root)); // Deep clone simple object
        let node = newRoot;
        const pathIds = [node.id];

        setMessage(`Inserting "${inputValue}"...`);

        for (let char of inputValue) {
            setMessage(`Processing '${char}'...`);
            setHighlightedNodes([...pathIds]);
            await sleep(500);

            if (!node.children[char]) {
                setMessage(`Character '${char}' not found. Creating new node.`);
                node.children[char] = {
                    id: Date.now() + Math.random(), // Simple unique ID
                    char: char,
                    isEnd: false,
                    children: {}
                };
            } else {
                setMessage(`Character '${char}' exists. Moving down.`);
            }
            node = node.children[char];
            pathIds.push(node.id);
            setRoot({ ...newRoot }); // Trigger render update
        }

        node.isEnd = true;
        setMessage(`Marked end of word "${inputValue}".`);
        setHighlightedNodes([...pathIds]);
        setRoot({ ...newRoot });
        setIsAnimating(false);
        setInputValue('');
    };

    const search = async () => {
        if (!inputValue || isAnimating) return;
        setIsAnimating(true);
        setHighlightedNodes([]);
        setFoundNode(null);

        let node = root;
        const pathIds = [node.id];
        let valid = true;

        setMessage(`Searching for "${inputValue}"...`);

        for (let char of inputValue) {
            setHighlightedNodes([...pathIds]);
            await sleep(500);

            if (node.children[char]) {
                node = node.children[char];
                pathIds.push(node.id);
                setMessage(`Found '${char}'.`);
            } else {
                setMessage(`Character '${char}' NOT found.`);
                valid = false;
                break;
            }
        }

        if (valid && node.isEnd) {
            setMessage(`Word "${inputValue}" FOUND!`);
            setFoundNode(node.id);
            setHighlightedNodes([...pathIds]);
        } else if (valid && !node.isEnd) {
            setMessage(`Prefix "${inputValue}" exists, but not complete word.`);
            setHighlightedNodes([...pathIds]);
        } else {
            setMessage(`Word "${inputValue}" NOT found.`);
        }
        setIsAnimating(false);
    };

    // Recursive render?
    // How to calculate positions.
    // Static heuristic: Levels.
    // Level 0: Root (250, 50)
    // Level 1: Divide width by num children?
    // Let's do a simple indented list or basic tree layout calculation.

    // Simple tree layout computer
    const getLayout = (node, x, y, level, availableWidth) => {
        const nodes = [];
        const lines = [];

        nodes.push({ ...node, x, y });

        const childKeys = Object.keys(node.children);
        if (childKeys.length > 0) {
            const step = availableWidth / childKeys.length;
            const startX = x - availableWidth / 2 + step / 2;

            childKeys.forEach((key, idx) => {
                const child = node.children[key];
                const childX = startX + idx * step;
                const childY = y + 60;

                lines.push({ x1: x, y1: y, x2: childX, y2: childY });

                const { nodes: subNodes, lines: subLines } = getLayout(child, childX, childY, level + 1, step);
                nodes.push(...subNodes);
                lines.push(...subLines);
            });
        }
        return { nodes, lines };
    };

    // Width can grow large. Limit depth or scroll? 
    // SVG viewBox?
    const { nodes: layoutNodes, lines: layoutLines } = getLayout(root, 300, 40, 0, 500);

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                    placeholder="word..."
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                />
                <button onClick={insert} disabled={isAnimating} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'black' }}>Insert</button>
                <button onClick={search} disabled={isAnimating} style={{ padding: '0.5rem 1rem', background: '#3498db', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>Search</button>
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
                overflow: 'hidden' // or scroll
            }}>
                <svg width="100%" height="100%" viewBox="0 0 600 400">
                    {layoutLines.map((line, idx) => (
                        <line key={idx} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#555" strokeWidth="2" />
                    ))}
                    {layoutNodes.map(node => (
                        <g key={node.id}>
                            <circle
                                cx={node.x} cy={node.y} r="15"
                                fill={
                                    foundNode === node.id ? '#2ecc71' :
                                        highlightedNodes.includes(node.id) ? '#f1c40f' :
                                            node.isEnd ? '#9b59b6' : '#333'
                                }
                                stroke={node.isEnd ? '#9b59b6' : '#555'} strokeWidth="2"
                            />
                            <text
                                x={node.x} y={node.y}
                                dy=".3em" textAnchor="middle"
                                fill="white" fontSize="12px" fontWeight="bold"
                            >
                                {node.char}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                Purple border = End of Word. Yellow = Path. Green = Found.
            </div>
        </div>
    );
};

export default TrieVisualizer;
