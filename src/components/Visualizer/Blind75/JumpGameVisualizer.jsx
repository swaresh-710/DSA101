import React, { useState } from 'react';
import { motion } from 'framer-motion';

const JumpGameVisualizer = () => {
    const [nums, setNums] = useState([2, 3, 1, 1, 4]);
    const [maxReach, setMaxReach] = useState(-1);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [message, setMessage] = useState('Click Start to check reachability.');
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState(null); // true/false

    const reset = () => {
        setMaxReach(-1);
        setCurrentIndex(-1);
        setIsFinished(false);
        setResult(null);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // Init
        if (currentIndex === -1) {
            setCurrentIndex(0);
            setMaxReach(0);
            setMessage(`Starting at index 0. Initial Max Reach = 0.`);
            return;
        }

        if (currentIndex <= maxReach && currentIndex < nums.length) {
            const jump = nums[currentIndex];
            const reach = currentIndex + jump;
            const newMaxReach = Math.max(maxReach, reach);

            let msg = `Index ${currentIndex}, Jump Length: ${jump}. Reachable: ${currentIndex} + ${jump} = ${reach}. `;
            if (reach > maxReach) {
                msg += `New Max Reach updated to ${newMaxReach}.`;
            } else {
                msg += `Max Reach stays ${maxReach}.`;
            }

            setMaxReach(newMaxReach);
            setMessage(msg);

            if (newMaxReach >= nums.length - 1) {
                setMessage(`Max Reach (${newMaxReach}) >= Last Index (${nums.length - 1}). Success! We can reach the end.`);
                setIsFinished(true);
                setResult(true);
                return;
            }

            // Move to next
            const nextIdx = currentIndex + 1;
            // Check if next index is reachable
            if (nextIdx > newMaxReach) {
                setMessage(`Cannot reach index ${nextIdx}. Current Max Reach is ${newMaxReach}. Failed.`);
                setIsFinished(true);
                setResult(false);
            } else {
                setCurrentIndex(nextIdx);
            }

        } else {
            // Should verify loop condition above covers failure, but explicit check:
            if (currentIndex >= nums.length) {
                // Reached end via loop (rare if we break early on success)
                setMessage(`Finished iteration. Success!`);
                setIsFinished(true);
                setResult(true);
            } else {
                setMessage(`Stuck! Cannot proceed beyond index ${currentIndex - 1}.`);
                setIsFinished(true);
                setResult(false);
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentIndex === -1 ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Jumps:</label>
                    <input
                        type="text"
                        value={nums.join(',')}
                        onChange={(e) => { setNums(e.target.value.split(',').map(n => parseInt(n.trim()) || 0)); reset(); }}
                        style={{ width: '120px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', position: 'relative' }}>
                {/* Max Reach Marker Line */}
                {maxReach >= 0 && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(maxReach + 1) * 70}px` }}
                        style={{ position: 'absolute', top: '70px', left: '0', height: '4px', background: result === false ? 'red' : 'green', opacity: 0.5, borderRadius: '2px', zIndex: 0 }}
                    />
                )}

                {nums.map((val, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isReachable = idx <= maxReach;

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px', zIndex: 1 }}>
                            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: idx === nums.length - 1 ? 'gold' : '#888' }}>
                                {idx === nums.length - 1 ? 'End' : idx}
                            </div>
                            <motion.div
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    borderColor: isCurrent ? 'var(--accent-primary)' : (isReachable ? '#666' : '#333'),
                                    backgroundColor: isCurrent ? '#444' : '#222'
                                }}
                                style={{
                                    width: '60px', height: '60px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '8px', border: `2px solid ${isReachable ? 'var(--glass-border)' : '#333'}`,
                                    position: 'relative'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', opacity: isReachable ? 1 : 0.4 }}>{val}</span>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#666' }}>
                Green line indicates max reachable range.
            </div>
        </div>
    );
};

export default JumpGameVisualizer;
