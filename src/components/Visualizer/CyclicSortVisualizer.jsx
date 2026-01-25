import React, { useState } from 'react';

const CyclicSortVisualizer = () => {
    // Array with numbers 1 to N (N=5), unsorted: [3, 5, 2, 1, 4]
    const [array, setArray] = useState([3, 5, 2, 1, 4]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState('Goal: Sort 1 to N in place. Start at index 0.');
    const [isSorted, setIsSorted] = useState(false);

    const step = () => {
        if (currentIndex >= array.length) {
            setIsSorted(true);
            setMessage('Array is fully sorted!');
            return;
        }

        const nums = [...array];
        const i = currentIndex;
        const correctPos = nums[i] - 1; // Value '3' should be at index 2 (3-1)

        if (nums[i] !== nums[correctPos]) {
            // Swap
            setMessage(`Value ${nums[i]} is at index ${i}, but belongs at index ${correctPos}. Swapping!`);
            [nums[i], nums[correctPos]] = [nums[correctPos], nums[i]];
            setArray(nums);
            // Don't increment i, we need to check the new value at i
        } else {
            // Correct position, move on
            setMessage(`Value ${nums[i]} is at correct index ${i}. Moving to next.`);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const reset = () => {
        setArray([3, 5, 2, 1, 4]);
        setCurrentIndex(0);
        setIsSorted(false);
        setMessage('Reset.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={step} disabled={isSorted} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px' }}>
                        Next Step
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {array.map((val, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isCorrect = val === idx + 1;

                    return (
                        <div key={idx} style={{
                            width: '60px', height: '60px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            border: isCurrent ? '2px solid white' : (isCorrect ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)'),
                            background: isCorrect ? 'rgba(46, 204, 113, 0.2)' : 'var(--bg-secondary)',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>{val}</span>
                            <span style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>idx: {idx}</span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default CyclicSortVisualizer;
