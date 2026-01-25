import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FindMinRotatedVisualizer = () => {
    const [nums, setNums] = useState([3, 4, 5, 1, 2]);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(4);
    const [mid, setMid] = useState(-1);
    const [minVal, setMinVal] = useState(null);
    const [message, setMessage] = useState('Click Start to run Binary Search.');
    const [isFinished, setIsFinished] = useState(false);
    const [stepState, setStepState] = useState('INIT'); // INIT, CALC_MID, COMPARE, UPDATE

    const reset = () => {
        setLeft(0);
        setRight(nums.length - 1);
        setMid(-1);
        setMinVal(null);
        setMessage('Ready.');
        setIsFinished(false);
        setStepState('INIT');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (stepState === 'INIT') {
            setStepState('CALC_MID');
            setMessage(`Range: [${left}, ${right}]. Calculating Mid...`);
            return;
        }

        if (stepState === 'CALC_MID') {
            const newMid = Math.floor((left + right) / 2);
            setMid(newMid);
            setStepState('COMPARE');
            setMessage(`Mid index is ${newMid} (Value: ${nums[newMid]}). Comparing with Right (${nums[right]}).`);
            return;
        }

        if (stepState === 'COMPARE') {
            // Binary Search Logic
            // If nums[mid] > nums[right], the minimum must be in the right half (excluding mid).
            // Else, the minimum is in the left half (including mid).

            if (left >= right) {
                // Should technically be caught earlier or same time
                setMinVal(nums[left]);
                setMessage(`Left == Right. Minimum found: ${nums[left]}.`);
                setIsFinished(true);
                return;
            }

            if (nums[mid] > nums[right]) {
                setMessage(`${nums[mid]} > ${nums[right]}. The minimum is to the RIGHT. Left becomes Mid + 1.`);
                setStepState('UPDATE_RIGHT_SIDE');
            } else {
                setMessage(`${nums[mid]} <= ${nums[right]}. The minimum is to the LEFT (or is Mid). Right becomes Mid.`);
                setStepState('UPDATE_LEFT_SIDE');
            }
            return;
        }

        if (stepState === 'UPDATE_RIGHT_SIDE') {
            const newLeft = mid + 1;
            setLeft(newLeft);
            if (newLeft === right) {
                setMinVal(nums[newLeft]);
                setMessage(`Range narrowed to single element. Minimum is ${nums[newLeft]}.`);
                setIsFinished(true);
            } else {
                setStepState('CALC_MID');
                setMessage(`Range updated: [${newLeft}, ${right}].`);
            }
            return;
        }

        if (stepState === 'UPDATE_LEFT_SIDE') {
            const newRight = mid;
            setRight(newRight);
            if (left === newRight) {
                setMinVal(nums[left]);
                setMessage(`Range narrowed to single element. Minimum is ${nums[left]}.`);
                setIsFinished(true);
            } else {
                setStepState('CALC_MID');
                setMessage(`Range updated: [${left}, ${newRight}].`);
            }
            return;
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
                    {stepState === 'INIT' ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <button
                    onClick={() => { setNums([3, 4, 5, 1, 2]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    [3, 4, 5, 1, 2]
                </button>
                <button
                    onClick={() => { setNums([4, 5, 6, 7, 0, 1, 2]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    [4, 5, 6, 7, 0, 1, 2]
                </button>
                <button
                    onClick={() => { setNums([11, 13, 15, 17]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    [11, 13, 15, 17]
                </button>
            </div>

            <div style={{ marginBottom: '2rem', height: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {nums.map((val, idx) => {
                    const isMid = idx === mid;
                    const inRange = idx >= left && idx <= right;
                    const isMin = minVal !== null && idx === left; // Or wherever minVal is found

                    return (
                        <motion.div
                            key={idx}
                            animate={{
                                scale: isMid ? 1.2 : isMin ? 1.3 : 1,
                                opacity: inRange || isFinished ? 1 : 0.3,
                                backgroundColor: isMin ? '#2ecc71' : isMid ? '#FF6B6B' : inRange ? '#333' : '#111',
                                borderColor: isMid ? 'var(--accent-primary)' : 'transparent',
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
                                position: 'relative',
                                color: 'white'
                            }}
                        >
                            {val}
                            {/* Labels */}
                            <div style={{ position: 'absolute', top: '-25px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7rem', color: '#888' }}>
                                {idx === left && <span style={{ color: '#4ECDC4' }}>L</span>}
                                {idx === right && <span style={{ color: '#4ECDC4' }}>R</span>}
                                {idx === mid && <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>M</span>}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default FindMinRotatedVisualizer;
