import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FindMedianVisualizer = () => {
    // Data Stream: [2, 10, 5, 1, 8]
    // Two Heaps:
    // Left (Max Heap): Small Elements
    // Right (Min Heap): Large Elements
    // Balance Condition: Size(Left) == Size(Right) OR Size(Left) == Size(Right) + 1

    // Trace:
    // Add 2: Left=[2], Right=[] -> Median 2
    // Add 10: Left=[2], Right=[10] (10 > 2 ok) -> Median (2+10)/2 = 6
    // Add 5: 5 fits in Right ([10, 5] -> [5, 10]). Size L=1, R=2. Rebalance -> Move 5 to Left.
    //        Left=[5, 2], Right=[10]. Median 5.

    const [stream, setStream] = useState([2, 10, 5, 1, 8]);
    const [leftHeap, setLeftHeap] = useState([]); // Max Heap
    const [rightHeap, setRightHeap] = useState([]); // Min Heap
    const [median, setMedian] = useState(0);
    const [message, setMessage] = useState('Click Add Number to simulate stream.');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setLeftHeap([]);
        setRightHeap([]);
        setMedian(0);
        setCurrentIndex(0);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const addNumber = async () => {
        if (currentIndex >= stream.length) return;

        const num = stream[currentIndex];
        setMessage(`Adding number ${num}...`);

        let lHeap = [...leftHeap];
        let rHeap = [...rightHeap];

        // 1. Add to appropriate heap (simple Logic for visualization)
        // Usually add to Left, then move max of Left to Right.
        // Then if Right > Left, move min of Right to Left.

        // Push to Left (Max Heap)
        lHeap.push(num);
        lHeap.sort((a, b) => b - a); // Maintain Max Heap property visually

        // Move Max of Left to Right
        const maxLeft = lHeap.shift();
        rHeap.push(maxLeft);
        rHeap.sort((a, b) => a - b); // Maintain Min Heap property

        // Balance Sizes: Left must be >= Right
        if (lHeap.length < rHeap.length) {
            const minRight = rHeap.shift();
            lHeap.push(minRight);
            lHeap.sort((a, b) => b - a);
        }

        // Update State
        setLeftHeap([...lHeap]);
        setRightHeap([...rHeap]);

        // Calc Median
        let m = 0;
        if (lHeap.length > rHeap.length) {
            m = lHeap[0];
        } else {
            m = (lHeap[0] + rHeap[0]) / 2.0;
        }
        setMedian(m);
        setMessage(`Added ${num}. Rebalanced. Median is ${m}.`);

        setCurrentIndex(prev => {
            const next = prev + 1;
            if (next >= stream.length) setIsFinished(true);
            return next;
        });
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={addNumber}
                    disabled={isFinished}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: isFinished ? 0.5 : 1,
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                >
                    Add Next ({stream[currentIndex] || 'Done'})
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

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                {/* Left Heap */}
                <div style={{ flex: 1, padding: '1rem', border: '1px solid #e74c3c', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                    <h4 style={{ marginTop: 0, color: '#e74c3c' }}>Max Heap (Left)</h4>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>Stores smaller half</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        <AnimatePresence>
                            {leftHeap.map((val, idx) => (
                                <motion.div
                                    key={`${val}-${idx}`}
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    style={{ padding: '10px', background: '#e74c3c', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}
                                >
                                    {val}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Heap */}
                <div style={{ flex: 1, padding: '1rem', border: '1px solid #3498db', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                    <h4 style={{ marginTop: 0, color: '#3498db' }}>Min Heap (Right)</h4>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>Stores larger half</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        <AnimatePresence>
                            {rightHeap.map((val, idx) => (
                                <motion.div
                                    key={`${val}-${idx}`}
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    style={{ padding: '10px', background: '#3498db', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}
                                >
                                    {val}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid var(--accent-primary)', borderRadius: '8px' }}>
                <div style={{ color: '#888', marginBottom: '0.5rem' }}>Current Median</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                    {median}
                </div>
            </div>
        </div>
    );
};

export default FindMedianVisualizer;
