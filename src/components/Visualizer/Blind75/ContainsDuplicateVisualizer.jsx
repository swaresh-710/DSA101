import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContainsDuplicateVisualizer = () => {
    // Default array with a duplicate (1)
    const [array, setArray] = useState([1, 2, 3, 1]);
    const [hashSet, setHashSet] = useState(new Set());
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [duplicateFound, setDuplicateFound] = useState(null); // { val, index }
    const [message, setMessage] = useState('Click Start to check for duplicates.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setHashSet(new Set());
        setCurrentIndex(-1);
        setDuplicateFound(null);
        setMessage('Ready.');
        setIsFinished(false);
    };

    const handleStep = () => {
        if (isFinished) return;

        const nextIndex = currentIndex + 1;

        if (nextIndex >= array.length) {
            setMessage('Finished array traversal. No duplicates found.');
            setIsFinished(true);
            return;
        }

        setCurrentIndex(nextIndex);
        const val = array[nextIndex];

        if (hashSet.has(val)) {
            setMessage(`Found ${val} in HashSet! Duplicate detected at index ${nextIndex}.`);
            setDuplicateFound({ val, index: nextIndex });
            setIsFinished(true);
        } else {
            setMessage(`Element ${val} not in set. Adding it.`);
            setHashSet(prev => new Set(prev).add(val));
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            {/* Controls */}
            <div className="visualizer-controls">
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentIndex === -1 ? 'Start' : 'Next Element'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <button
                    onClick={() => {
                        setArray([1, 2, 3, 4, 5]);
                        reset();
                    }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    No Duplicates
                </button>
                <button
                    onClick={() => {
                        setArray([1, 2, 3, 1]);
                        reset();
                    }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    Has Duplicates
                </button>
            </div>

            <div style={{ marginBottom: '2rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
                {/* Array Visualization */}
                <div>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Array</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {array.map((val, idx) => {
                            const isCurrent = idx === currentIndex;
                            const isDuplicate = duplicateFound && duplicateFound.index === idx;

                            return (
                                <motion.div
                                    key={idx}
                                    animate={{
                                        scale: isDuplicate ? 1.2 : isCurrent ? 1.1 : 1,
                                        borderColor: isDuplicate ? '#FF6B6B' : isCurrent ? 'var(--accent-primary)' : 'transparent',
                                        backgroundColor: isDuplicate ? 'rgba(255, 107, 107, 0.2)' : '#222'
                                    }}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px solid transparent',
                                        borderRadius: '8px',
                                        background: '#222',
                                        fontWeight: 'bold',
                                        position: 'relative'
                                    }}
                                >
                                    {val}
                                    <div style={{ position: 'absolute', top: '-25px', fontSize: '0.7rem', color: '#555' }}>{idx}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* HashSet Visualization */}
                <div>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>HashSet</h4>
                    <div style={{
                        border: '1px solid #444',
                        borderRadius: '12px',
                        padding: '1rem',
                        minWidth: '150px',
                        minHeight: '100px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        alignContent: 'flex-start',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <AnimatePresence>
                            {Array.from(hashSet).map((val) => (
                                <motion.div
                                    key={val}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{
                                        padding: '5px 10px',
                                        background: 'var(--accent-primary)',
                                        color: '#222',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {val}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {hashSet.size === 0 && <span style={{ color: '#555', fontStyle: 'italic' }}>Empty</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContainsDuplicateVisualizer;
