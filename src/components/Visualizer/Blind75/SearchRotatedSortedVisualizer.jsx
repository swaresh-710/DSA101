import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SearchRotatedSortedVisualizer = () => {
    const [nums, setNums] = useState([4, 5, 6, 7, 0, 1, 2]);
    const [target, setTarget] = useState(0);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(6);
    const [mid, setMid] = useState(-1);
    const [foundIndex, setFoundIndex] = useState(-1);
    const [message, setMessage] = useState('Click Start to run Binary Search.');
    const [isFinished, setIsFinished] = useState(false);
    const [stepState, setStepState] = useState('INIT');

    const reset = () => {
        setLeft(0);
        setRight(nums.length - 1);
        setMid(-1);
        setFoundIndex(-1);
        setMessage('Ready.');
        setIsFinished(false);
        setStepState('INIT');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (stepState === 'INIT') {
            setStepState('CALC_MID');
            setMessage(`Searching for ${target} in range [${left}, ${right}].`);
            return;
        }

        if (stepState === 'CALC_MID') {
            const newMid = Math.floor((left + right) / 2);
            setMid(newMid);
            setStepState('CHECK_MID');
            setMessage(`Mid index is ${newMid} (Value: ${nums[newMid]}).`);
            return;
        }

        if (stepState === 'CHECK_MID') {
            if (nums[mid] === target) {
                setFoundIndex(mid);
                setMessage(`Found target ${target} at index ${mid}!`);
                setIsFinished(true);
            } else {
                setStepState('CHECK_SORTED');
                setMessage(`Mid (${nums[mid]}) != Target (${target}). Checking which half is sorted...`);
            }
            return;
        }

        if (stepState === 'CHECK_SORTED') {
            // Check if left half is sorted
            if (nums[left] <= nums[mid]) {
                setMessage(`Left half [${left}..${mid}] is sorted (${nums[left]} <= ${nums[mid]}). Checking if target is in this range.`);
                setStepState('DECIDE_LEFT_SORTED');
            } else {
                setMessage(`Right half [${mid}..${right}] is sorted. Checking if target is in this range.`);
                setStepState('DECIDE_RIGHT_SORTED');
            }
            return;
        }

        if (stepState === 'DECIDE_LEFT_SORTED') {
            if (nums[left] <= target && target < nums[mid]) {
                const newRight = mid - 1;
                setRight(newRight);
                setMessage(`Target ${target} is in the left sorted half. Moving Right to ${newRight}.`);
            } else {
                const newLeft = mid + 1;
                setLeft(newLeft);
                setMessage(`Target ${target} is NOT in the left sorted half. Moving Left to ${newLeft}.`);
            }

            checkFinish(left, right, mid); // Need to check bounds immediately or next cycle
            // Actually, we state updates are async, so next click will handle bounds check or we do it carefully.
            // Let's go to CALC_MID next, but check for exhausted search there.
            setStepState('CHECK_BOUNDS');
            return;
        }

        if (stepState === 'DECIDE_RIGHT_SORTED') {
            if (nums[mid] < target && target <= nums[right]) {
                const newLeft = mid + 1;
                setLeft(newLeft);
                setMessage(`Target ${target} is in the right sorted half. Moving Left to ${newLeft}.`);
            } else {
                const newRight = mid - 1;
                setRight(newRight);
                setMessage(`Target ${target} is NOT in the right sorted half. Moving Right to ${newRight}.`);
            }
            setStepState('CHECK_BOUNDS');
            return;
        }

        if (stepState === 'CHECK_BOUNDS') {
            // In actual code this check happens at loop condition.
            // Here we simulate it.
            // Note: react state updates for left/right from previous step haven't reflected in `left` variable yet due to closure.
            // But we can rely on re-rendering. 
            // Wait. The `handleStep` sees the *current* state. `setLeft` schedules update.
            // So we must wait for next click to see new values? Yes.
            // But 'CHECK_BOUNDS' logic is flawed if we check old values. 
            // Better: Move to CALC_MID, and Inside CALC_MID, check if left > right.
            setStepState('CALC_MID_OR_EXIT'); // Special intermediate to handle "state update pending"
            setMessage('Updating range...');
            // Actually, we might need a useEffect or just let the user click "Next" which re-runs handleStep with NEW state.
            // So here we just return.
            return;
        }

        if (stepState === 'CALC_MID_OR_EXIT') {
            if (left > right) {
                setMessage(`Range exhausted [${left}, ${right}]. Target ${target} not found.`);
                setIsFinished(true);
            } else {
                setStepState('CALC_MID');
                handleStep(); // Chain it? No, avoid recursion depth if possible, but 1 level is ok.
                // Actually relying on user click is safer for visualizer.
                // Let's just go to CALC_MID logic manually here.
                const newMid = Math.floor((left + right) / 2);
                setMid(newMid);
                setStepState('CHECK_MID');
                setMessage(`Range: [${left}, ${right}]. New Mid index is ${newMid}.`);
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
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Target:</label>
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => { setTarget(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <button
                    onClick={() => { setNums([4, 5, 6, 7, 0, 1, 2]); setTarget(0); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    [4,5,6,7,0,1,2] (T=0)
                </button>
                <button
                    onClick={() => { setNums([4, 5, 6, 7, 0, 1, 2]); setTarget(3); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    (T=3)
                </button>
            </div>

            <div style={{ marginBottom: '2rem', height: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {nums.map((val, idx) => {
                    const isMid = idx === mid;
                    const inRange = idx >= left && idx <= right;
                    const isMin = foundIndex === idx;

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

export default SearchRotatedSortedVisualizer;
