import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThreeSumVisualizer = () => {
    // Sorted array for 3Sum
    const [nums, setNums] = useState([-4, -1, -1, 0, 1, 2]);
    // Pointers
    const [i, setI] = useState(0);
    const [left, setLeft] = useState(1);
    const [right, setRight] = useState(4); // initial right = nums.length - 1

    const [foundTriplets, setFoundTriplets] = useState([]);
    const [message, setMessage] = useState('Click Start to run 3Sum.');
    const [isFinished, setIsFinished] = useState(false);
    const [stepState, setStepState] = useState('INIT');

    // Helper to format triplets for display
    const formatTriplet = (IDX_I, IDX_L, IDX_R) => {
        return `[${nums[IDX_I]}, ${nums[IDX_L]}, ${nums[IDX_R]}]`;
    };

    const reset = () => {
        setI(0);
        setLeft(1);
        setRight(nums.length - 1);
        setFoundTriplets([]);
        setMessage('Ready. Array must be sorted first (Done).');
        setIsFinished(false);
        setStepState('INIT');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (stepState === 'INIT') {
            setStepState('CHECK_I');
            setMessage(`Starting with i = 0 (Value: ${nums[0]}).`);
            return;
        }

        if (stepState === 'CHECK_I') {
            if (i >= nums.length - 2) {
                setMessage('Finished! All triplets found.');
                setIsFinished(true);
                return;
            }
            // Skip duplicates for i
            if (i > 0 && nums[i] === nums[i - 1]) {
                setI(i + 1);
                setMessage(`Skipping duplicate i at index ${i}.`);
                return;
                // In a real loop we'd continue, here we just set state and return to let user click Next
            }

            setLeft(i + 1);
            setRight(nums.length - 1);
            setStepState('TWO_POINTER_LOOP');
            setMessage(`Solving Two Sum for target ${-nums[i]} with Pointers Left=${i + 1}, Right=${nums.length - 1}.`);
            return;
        }

        if (stepState === 'TWO_POINTER_LOOP') {
            if (left >= right) {
                // Done with this i, move to next i
                setI(i + 1);
                setStepState('CHECK_I');
                setMessage(`Finished range for i=${i}. Moving to next i.`);
                return;
            }

            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                const triplet = formatTriplet(i, left, right);
                setFoundTriplets(prev => [...prev, triplet]);
                setMessage(`Found Triplet! ${triplet}. Moving both pointers inward.`);

                // Move pointers and skip duplicates
                let nextLeft = left + 1;
                while (nextLeft < right && nums[nextLeft] === nums[left]) nextLeft++;

                let nextRight = right - 1;
                while (nextLeft < nextRight && nums[nextRight] === nums[right]) nextRight--;

                setLeft(nextLeft);
                setRight(nextRight);
            } else if (sum < 0) {
                setMessage(`Sum (${sum}) < 0. Need bigger number. Move Left ->`);
                setLeft(left + 1);
            } else {
                setMessage(`Sum (${sum}) > 0. Need smaller number. Move <- Right`);
                setRight(right - 1);
            }
            return;
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {stepState === 'INIT' ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            {/* Array Visualization */}
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '2rem' }}>
                {nums.map((val, idx) => {
                    const isI = idx === i;
                    const isL = idx === left;
                    const isR = idx === right;

                    return (
                        <motion.div
                            key={idx}
                            animate={{
                                scale: isI || isL || isR ? 1.2 : 1,
                                backgroundColor: isI ? '#FF6B6B' : isL ? '#4ECDC4' : isR ? '#4ECDC4' : '#222',
                                borderColor: isI ? '#FF6B6B' : 'transparent',
                                color: isI || isL || isR ? '#222' : 'white'
                            }}
                            style={{
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid transparent',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                position: 'relative'
                            }}
                        >
                            {val}
                            <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', color: '#888', fontWeight: 'bold' }}>
                                {isI && <span style={{ color: '#FF6B6B' }}>i</span>}
                                {isL && <span style={{ color: '#4ECDC4' }}>L</span>}
                                {isR && <span style={{ color: '#4ECDC4' }}>R</span>}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Found Triplets */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', minHeight: '100px' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#888' }}>Found Triplets</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {foundTriplets.map((t, idx) => (
                        <div key={idx} style={{ padding: '0.5rem 1rem', background: '#333', borderRadius: '4px', color: '#2ecc71', border: '1px solid #2ecc71' }}>
                            {t}
                        </div>
                    ))}
                    {foundTriplets.length === 0 && <span style={{ color: '#555', fontStyle: 'italic' }}>None yet...</span>}
                </div>
            </div>
        </div>
    );
};

export default ThreeSumVisualizer;
