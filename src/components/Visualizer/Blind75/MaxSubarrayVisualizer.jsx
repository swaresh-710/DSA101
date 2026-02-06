import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MaxSubarrayVisualizer = () => {
    // Kadane's Algorithm Visualizer
    const [nums, setNums] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
    const [currentSum, setCurrentSum] = useState(0);
    const [maxSum, setMaxSum] = useState(-Infinity);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // For visualizing the sub-array window
    const [startIndex, setStartIndex] = useState(0);
    const [tempStart, setTempStart] = useState(0); // Where the current sum started
    const [bestStart, setBestStart] = useState(0);
    const [bestEnd, setBestEnd] = useState(0);

    const [message, setMessage] = useState("Click Start to run Kadane's Algorithm.");
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setCurrentSum(0);
        setMaxSum(-Infinity);
        setCurrentIndex(-1);
        setTempStart(0);
        setBestStart(0);
        setBestEnd(0);
        setMessage('Ready.');
        setIsFinished(false);
    };

    const handleStep = () => {
        if (isFinished) return;

        let nextIndex = currentIndex + 1;
        if (currentIndex === -1) {
            nextIndex = 0;
            setCurrentIndex(0);
            setCurrentSum(nums[0]);
            setMaxSum(nums[0]);
            setTempStart(0);
            setBestStart(0);
            setBestEnd(0);
            setMessage(`Started at index 0. Current Sum: ${nums[0]}`);
            return;
        }

        if (nextIndex >= nums.length) {
            setMessage(`Finished! Maximum Subarray Sum is ${maxSum}.`);
            setIsFinished(true);
            return;
        }

        setCurrentIndex(nextIndex);
        const val = nums[nextIndex];

        let newCurrentSum = currentSum + val;
        let newTempStart = tempStart;
        let msg = `Added ${val} to current sum. New sum: ${newCurrentSum}. `;

        // Kadane's Logic: If val is better than currentSum + val, restart subarray
        // Equivalently: if currentSum < 0 before adding val, we should have discarded it.
        // Actually: currentSum = Math.max(val, currentSum + val)

        if (val > newCurrentSum) {
            newCurrentSum = val;
            newTempStart = nextIndex;
            msg = `${val} is larger than previous sum + ${val}. Restarting subarray at index ${nextIndex}. Sum: ${val}. `;
        }

        setCurrentSum(newCurrentSum);
        setTempStart(newTempStart);

        if (newCurrentSum > maxSum) {
            setMaxSum(newCurrentSum);
            setBestStart(newTempStart);
            setBestEnd(nextIndex);
            msg += `New Max Found! ${newCurrentSum}.`;
        } else {
            msg += `Max remains ${maxSum}.`;
        }

        setMessage(msg);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
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
            </div>

            <div style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Current Subarray Sum</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ECDC4' }}>
                        {currentIndex === -1 ? '-' : currentSum}
                    </div>
                </div>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Max Sum So Far</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                        {maxSum === -Infinity ? '-' : maxSum}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {nums.map((val, idx) => {
                    const isProcessing = idx === currentIndex;
                    // In current window?
                    const inCurrentWindow = idx >= tempStart && idx <= currentIndex;
                    // In best window?
                    const inBestWindow = idx >= bestStart && idx <= bestEnd;

                    return (
                        <motion.div
                            key={idx}
                            animate={{
                                scale: isProcessing ? 1.1 : 1,
                                borderColor: inBestWindow ? '#FF6B6B' : inCurrentWindow ? '#4ECDC4' : 'transparent',
                                backgroundColor: inBestWindow ? 'rgba(255, 107, 107, 0.2)' : inCurrentWindow ? 'rgba(78, 205, 196, 0.1)' : '#222'
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
    );
};

export default MaxSubarrayVisualizer;
