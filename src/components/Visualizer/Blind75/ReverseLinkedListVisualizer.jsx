import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReverseLinkedListVisualizer = () => {
    // Initial List: 1 -> 2 -> 3 -> 4 -> NULL
    // Representation: objects with id, val, nextId
    const initialNodes = [
        { id: '1', val: 1, next: '2' },
        { id: '2', val: 2, next: '3' },
        { id: '3', val: 3, next: '4' },
        { id: '4', val: 4, next: null }
    ];

    const [nodes, setNodes] = useState(initialNodes);
    // Pointers (store node IDs or 'null')
    const [prev, setPrev] = useState('null');
    const [curr, setCurr] = useState('1');
    const [nextTemp, setNextTemp] = useState(null);

    const [message, setMessage] = useState('Click Start to reverse the linked list.');
    const [isFinished, setIsFinished] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    // For visual arrows: mapping {sourceId: targetId}
    // We derive this from nodes state, but strictly for the "current state of links"

    // Helper to get next ID from current node state
    const getNextId = (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        return node ? node.next : null;
    };

    const reset = () => {
        setNodes([
            { id: '1', val: 1, next: '2' },
            { id: '2', val: 2, next: '3' },
            { id: '3', val: 3, next: '4' },
            { id: '4', val: 4, next: null }
        ]);
        setPrev('null');
        setCurr('1');
        setNextTemp(null);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runReverse = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting Reversal Process...');

        let currentId = '1';
        let prevId = null; // 'null' string for visual, null value for logic

        // Local state tracking to sync with visual sleep
        // We fundamentally change the `nodes` structure step by step
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        while (currentId !== null) {
            // Step 0: Highlight Current State
            setCurr(currentId);
            setPrev(prevId === null ? 'null' : prevId);
            setNextTemp(null);
            setMessage(`Step: Visiting Node ${nodes.find(n => n.id === currentId).val} (Curr).`);
            await sleep(delay);

            // Step 1: Save Next
            const nextNodeId = getNextId(currentId);
            setNextTemp(nextNodeId === null ? 'null' : nextNodeId);
            setMessage(`Save Next: Next of ${nodes.find(n => n.id === currentId).val} is ${nextNodeId ? nodes.find(n => n.id === nextNodeId).val : 'NULL'}.`);
            await sleep(delay);

            // Step 2: Reverse Link
            // Update the 'next' of current node to point to prev
            setNodes(prevNodes => prevNodes.map(n => {
                if (n.id === currentId) {
                    return { ...n, next: prevId };
                }
                return n;
            }));
            setMessage(`Reverse: Set Node ${nodes.find(n => n.id === currentId).val}.next to ${prevId ? (prevId === 'null' ? 'NULL' : nodes.find(n => n.id === prevId).val) : 'NULL'}.`);
            await sleep(delay);

            // Step 3: Move Pointers
            prevId = currentId;
            currentId = nextNodeId;

            setPrev(prevId);
            setCurr(currentId === null ? 'null' : currentId);
            setMessage('Move Pointers: Prev becomes Curr, Curr becomes Next.');
            await sleep(delay);
        }

        setIsFinished(true);
        setIsRunning(false);
        setMessage('List Reversed! New Head is ' + prevId);
    };

    // Calculate position for rendering to keep them in a line but flipped in logic
    // Actually, physically they stay in 1-2-3-4 order on screen usually simpler, just arrows change.

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={runReverse}
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
                    Reverse List
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '3rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '80px', paddingTop: '40px' }}>

                {/* Virtual NULL at start for initial prev */}
                <div style={{ position: 'absolute', left: '10px', top: '50px', opacity: 0.5 }}>NULL</div>

                {/* Nodes Display */}
                {initialNodes.map((node, idx) => { // Use initialNodes to keep DOM order stable
                    const currentNode = nodes.find(n => n.id === node.id);
                    // Check pointers
                    const isCurr = curr === node.id;
                    const isPrev = prev === node.id;
                    const isNext = nextTemp === node.id;

                    return (
                        <div key={node.id} style={{ position: 'relative' }}>
                            {/* Pointers Labels */}
                            <div style={{ position: 'absolute', top: '-40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                {isCurr && <motion.span layoutId="curr" style={{ color: '#f1c40f', fontWeight: 'bold' }}>CURR &darr;</motion.span>}
                                {isPrev && <motion.span layoutId="prev" style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '0.8rem' }}>PREV &darr;</motion.span>}
                                {isNext && <motion.span layoutId="next" style={{ color: '#3498db', fontWeight: 'bold', fontSize: '0.8rem' }}>NEXT &darr;</motion.span>}
                            </div>

                            {/* Node Circle */}
                            <div style={{
                                width: '60px', height: '60px',
                                borderRadius: '50%',
                                background: '#34495e',
                                border: '2px solid #ecf0f1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '1.2rem',
                                zIndex: 2, position: 'relative'
                            }}>
                                {node.val}
                            </div>

                            {/* Dynamic Arrow */}
                            {/* logic: if this node's next is another node in our known set, draw arrow to it. if null, draw to null */}
                            {/* Visualizing arrows is tricky in flexbox. Simplified approach: 
                                - Arrows point Right by default.
                                - If Reversed, pointer should point Left. 
                            */}
                            {currentNode.next && currentNode.next !== 'null' && (
                                // Find if the target is to right or left
                                // ID '1' next '2' -> Right
                                // ID '2' next '1' -> Left
                                <Arrow
                                    direction={parseInt(currentNode.next) > parseInt(node.id) ? 'right' : 'left'}
                                />
                            )}
                            {currentNode.next === null && (
                                <div style={{ position: 'absolute', right: '-60px', top: '20px', color: '#999' }}>&rarr; NULL</div>
                            )}
                            {currentNode.next === 'null' && ( // Explicit null (new head end)
                                <div style={{ position: 'absolute', right: '70px', top: '20px', color: '#999' }}>NULL &larr;</div>
                            )}

                        </div>
                    );
                })}

                {/* Final NULL pointer visualization */}
                <div style={{ position: 'absolute', right: '10px', top: '50px', opacity: 0.5 }}>NULL</div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center', color: '#666' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    <span style={{ color: '#2ecc71' }}>Prev: Green</span>
                    <span style={{ color: '#f1c40f' }}>Curr: Yellow</span>
                    <span style={{ color: '#3498db' }}>Next: Blue</span>
                </div>
            </div>
        </div>
    );
};

// Simple SVG Arrow Component
const Arrow = ({ direction }) => {
    return (
        <div style={{
            position: 'absolute',
            left: direction === 'right' ? '65px' : '-85px',
            top: '20px',
            width: '80px',
            height: '20px',
            pointerEvents: 'none'
        }}>
            <svg width="80" height="20" viewBox="0 0 80 20">
                {direction === 'right' ? (
                    <path d="M0,10 L70,10 M60,5 L70,10 L60,15" stroke="white" strokeWidth="2" fill="none" />
                ) : (
                    <path d="M80,10 L10,10 M20,5 L10,10 L20,15" stroke="#e74c3c" strokeWidth="2" fill="none" />
                )}
            </svg>
        </div>
    );
};

export default ReverseLinkedListVisualizer;
