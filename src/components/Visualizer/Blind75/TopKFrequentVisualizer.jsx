import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TopKFrequentVisualizer = () => {
    // Input: [1,1,1,2,2,3], k = 2
    // Freq Map: {1:3, 2:2, 3:1}
    // Heap (Min-Heap of size K=2):
    // Push 1 (freq 3): [1]
    // Push 2 (freq 2): [1, 2] (sorted by freq? Min heap root is smallest freq)
    //   Wait, min heap keeps LARGEST freq elements by ejecting SMALLEST?
    //   Yes. If we want Top K Largest Frequencies, we keep size K.
    //   If current freq > root.freq, pop root, push current.

    // Example trace:
    // K=2.
    // 1. Process 1:3. Heap: [{val:1, freq:3}]
    // 2. Process 2:2. Heap: [{val:2, freq:2}, {val:1, freq:3}] (Min is 2:2)
    // 3. Process 3:1. Heap has size 2. Min is 2:2. Is 1 > 2? No. Ignore 3?
    // Wait. Heap root is MINIMUM freq.
    // Heap: [{2,2}, {1,3}] (root is 2).
    // Incoming 3 has freq 1. 1 < 2. We don't want it.
    // Result: [1, 2]. Correct.

    const [input, setInput] = useState([1, 1, 1, 2, 2, 3]);
    const [k, setK] = useState(2);
    const [freqMap, setFreqMap] = useState({});
    const [heap, setHeap] = useState([]); // Visual Array representing Min-Heap
    const [result, setResult] = useState([]);

    const [message, setMessage] = useState('Click Start to find Top K Frequent Elements.');
    const [phase, setPhase] = useState('IDLE'); // COUNTING, HEAP_PROCESSING, FINISHED

    const reset = () => {
        setFreqMap({});
        setHeap([]);
        setResult([]);
        setPhase('IDLE');
        setMessage('Ready.');
    };

    const runTopK = async () => {
        if (phase !== 'IDLE') return;
        setPhase('COUNTING');
        setFreqMap({});
        setHeap([]);
        setResult([]);

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 800;

        // 1. Counting Phase
        setMessage('Counting frequencies...');
        const counts = {};
        for (let num of input) {
            counts[num] = (counts[num] || 0) + 1;
            setFreqMap({ ...counts });
            await sleep(200);
        }
        await sleep(delay);

        // 2. Heap Processing Phase
        setPhase('HEAP_PROCESSING');
        setMessage(`Maintaing Min-Heap of size K=${k}.`);

        const entries = Object.entries(counts).map(([val, freq]) => ({ val: parseInt(val), freq }));
        // entries: [{val:1, freq:3}, {val:2, freq:2}, {val:3, freq:1}]

        let currentHeap = [];
        setHeap(currentHeap);

        for (let item of entries) {
            setMessage(`Processing Element ${item.val} (Freq: ${item.freq})...`);
            await sleep(delay);

            if (currentHeap.length < k) {
                currentHeap.push(item);
                // Sort to simulate heap property (min freq at index 0)
                currentHeap.sort((a, b) => a.freq - b.freq);
                setHeap([...currentHeap]);
                setMessage(`Heap size < K. Added ${item.val}. Heap: [${currentHeap.map(x => x.val).join(', ')}]`);
            } else {
                // Check if current freq > min freq in heap
                if (item.freq > currentHeap[0].freq) {
                    setMessage(`Freq(${item.val})= ${item.freq} > MinHeapRoot(${currentHeap[0].val})= ${currentHeap[0].freq}. Replace Root.`);
                    currentHeap[0] = item;
                    currentHeap.sort((a, b) => a.freq - b.freq);
                    setHeap([...currentHeap]);
                } else {
                    setMessage(`Freq(${item.val})= ${item.freq} <= MinHeapRoot(${currentHeap[0].val})= ${currentHeap[0].freq}. Skip.`);
                }
            }
            await sleep(delay);
        }

        const res = currentHeap.map(x => x.val);
        setResult(res);
        setPhase('FINISHED');
        setMessage(`Finished! Top ${k} elements are [${res.join(', ')}].`);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={runTopK}
                    disabled={phase !== 'IDLE'}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: (phase !== 'IDLE') ? 0.5 : 1,
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                >
                    Find Top K
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

            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* Frequency Map */}
                <div style={{ flex: 1, padding: '1rem', border: '1px solid #444', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                    <h4 style={{ marginTop: 0, color: '#aaa' }}>Frequency Map</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <AnimatePresence>
                            {Object.entries(freqMap).map(([val, freq]) => (
                                <motion.div
                                    key={val}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{ padding: '0.5rem', background: '#333', borderRadius: '4px', minWidth: '40px', textAlign: 'center' }}
                                >
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Val {val}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{freq}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Heap Visualization */}
                <div style={{ flex: 1, padding: '1rem', border: '1px solid var(--accent-primary)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                    <h4 style={{ marginTop: 0, color: 'var(--accent-primary)' }}>Min-Heap (Size {k})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {heap.map((item, idx) => (
                            <motion.div
                                key={`${item.val}-${item.freq}`} // Key change triggers animation
                                layout
                                style={{
                                    padding: '0.5rem',
                                    background: idx === 0 ? '#e67e22' : '#2ecc71', // Root is Orange
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span style={{ fontWeight: 'bold', color: 'black' }}>Val: {item.val}</span>
                                <span style={{ color: 'black' }}>Freq: {item.freq}</span>
                            </motion.div>
                        ))}
                        {heap.length === 0 && <span style={{ color: '#666' }}>Empty</span>}
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
                        *Root (Top element) is minimum frequency.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopKFrequentVisualizer;
