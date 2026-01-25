import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MergeKListsVisualizer = () => {
    // Lists:
    // L1: [1, 4, 5]
    // L2: [1, 3, 4]
    // L3: [2, 6]

    // Heap (Size K=3): [{val:1, list:0}, {val:1, list:1}, {val:2, list:2}]
    // Min is 1 (from list 0). Pop. Add to Result. Push next from List 0 (4).

    const initialLists = [
        [1, 4, 5],
        [1, 3, 4],
        [2, 6]
    ];

    const [lists, setLists] = useState(JSON.parse(JSON.stringify(initialLists)));
    const [result, setResult] = useState([]);
    const [heap, setHeap] = useState([]); // Visual min-heap
    const [message, setMessage] = useState('Click Start to merge lists.');
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const reset = () => {
        setLists(JSON.parse(JSON.stringify(initialLists)));
        setResult([]);
        setHeap([]);
        setIsRunning(false);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const runMerge = async () => {
        if (isRunning) return;
        setIsRunning(true);
        reset();
        await new Promise(r => setTimeout(r, 100)); // reset Wait

        let currentLists = JSON.parse(JSON.stringify(initialLists));
        setLists(currentLists);

        // 1. Init Heap
        setMessage("Initializing Min-Heap with heads of all lists...");
        let pq = [];

        currentLists.forEach((list, idx) => {
            if (list.length > 0) {
                pq.push({ val: list[0], listIdx: idx });
                // We cheat visually and keep item in list until popped from heap? 
                // Or remove from list immediately?
                // Let's remove from list immediately for visual movement to heap?
                // Actually, standard is: Heap has copy/pointer. 
                // Let's visualize: Item highlights in list.
                // When popped from Heap -> moves to Result. Next from list moves to Heap.

                // Simplified:
                // Heap stores {val, listIdx}.
                // We physically remove from the visual list when we push to heap?
                // Let's just track head index for each list.
            }
        });

        let heads = [0, 0, 0]; // Index of head for each list

        // Initial PQ Sort
        pq.sort((a, b) => a.val - b.val);
        setHeap([...pq]);
        await sleep(1000);

        while (pq.length > 0) {
            // Pop Min
            const minNode = pq.shift(); // Remove first (sorted)
            const val = minNode.val;
            const listIdx = minNode.listIdx;

            setMessage(`Min value is ${val} (List ${listIdx + 1}). Adding to result.`);

            // "Remove" from visual list (update head index)
            heads[listIdx]++;
            // We can also splice the array for visual effect of shrinking
            currentLists[listIdx].shift();
            setLists([...currentLists]);

            setResult(prev => [...prev, val]);
            await sleep(800);

            // Push Next from same list
            if (currentLists[listIdx].length > 0) { // Or check logic against original if using headers
                const nextVal = currentLists[listIdx][0];
                setMessage(`Pushing next value ${nextVal} from List ${listIdx + 1} to Heap.`);
                pq.push({ val: nextVal, listIdx: listIdx });
                pq.sort((a, b) => a.val - b.val);
                setHeap([...pq]);
                await sleep(800);
            } else {
                setMessage(`List ${listIdx + 1} empty. Continuing...`);
                setHeap([...pq]);
                await sleep(500);
            }
        }

        setMessage("Merge Complete!");
        setIsFinished(true);
        setIsRunning(false);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={runMerge}
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
                    Merge Lists
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

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Lists Area */}
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#888', marginTop: 0 }}>Input Lists</h4>
                    {lists.map((list, listIdx) => (
                        <div key={listIdx} style={{ display: 'flex', gap: '10px', marginBottom: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '60px', color: '#aaa' }}>List {listIdx + 1}:</div>
                            <AnimatePresence>
                                {list.map((val, idx) => (
                                    <motion.div
                                        key={`${listIdx}-${val}-${idx}`} // Unstable key if duplicates? 
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
                                        style={{
                                            padding: '8px 12px',
                                            background: '#3498db',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                                {list.length === 0 && <span style={{ color: '#555', fontStyle: 'italic' }}>Empty</span>}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Heap Area */}
                <div style={{ width: '200px', border: '1px solid #e67e22', borderRadius: '8px', padding: '10px', background: 'rgba(230, 126, 34, 0.1)' }}>
                    <h4 style={{ color: '#e67e22', marginTop: 0, textAlign: 'center' }}>Min Heap</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <AnimatePresence>
                            {heap.map((item, idx) => (
                                <motion.div
                                    key={`${item.listIdx}-${item.val}`}
                                    layout
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    style={{
                                        padding: '5px 10px',
                                        background: idx === 0 ? '#e67e22' : '#333',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        border: idx === 0 ? '1px solid white' : 'none'
                                    }}
                                >
                                    <span>{item.val}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>L{item.listIdx + 1}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {heap.length === 0 && <div style={{ textAlign: 'center', color: '#666' }}>Empty</div>}
                    </div>
                </div>
            </div>

            {/* Result Area */}
            <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #444' }}>
                <h4 style={{ color: '#2ecc71', marginTop: 0 }}>Merged Result</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {result.map((val, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                padding: '8px 12px',
                                background: '#2ecc71',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                color: 'black'
                            }}
                        >
                            {val}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MergeKListsVisualizer;
