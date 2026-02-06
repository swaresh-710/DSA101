import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MissingNumberVisualizer = () => {
    const [nums, setNums] = useState([3, 0, 1]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [xorSum, setXorSum] = useState(0);
    const [message, setMessage] = useState('Click Start to find missing number using XOR.');
    const [isFinished, setIsFinished] = useState(false);
    const [stepPhase, setStepPhase] = useState('INIT'); // INIT, XOR_INDEX, XOR_VAL, FINAL

    const reset = () => {
        setCurrentIndex(-1);
        setXorSum(0);
        setMessage('Ready.');
        setIsFinished(false);
        setStepPhase('INIT');
    };

    const handleStep = () => {
        if (isFinished) return;

        const n = nums.length;

        if (stepPhase === 'INIT') {
            setXorSum(n);
            setMessage(`Initialize Result = n (${n}). We will XOR this with every index and every value.`);
            setStepPhase('LOOP_START');
            setCurrentIndex(0);
            return;
        }

        if (stepPhase === 'LOOP_START') {
            if (currentIndex >= n) {
                setMessage(`Loop finished. Final Missing Number is ${xorSum}.`);
                setIsFinished(true);
                return;
            }
            // First XOR with Index
            const newXor = xorSum ^ currentIndex;
            setXorSum(newXor);
            setMessage(`Step ${currentIndex}: XOR with Index ${currentIndex}. Result: ${xorSum} ^ ${currentIndex} = ${newXor}.`);
            setStepPhase('XOR_VAL');
            return;
        }

        if (stepPhase === 'XOR_VAL') {
            const val = nums[currentIndex];
            const newXor = xorSum ^ val;
            setXorSum(newXor);
            setMessage(`Step ${currentIndex}: XOR with Value ${val}. Result: ${xorSum} ^ ${val} = ${newXor}.`);

            setCurrentIndex(currentIndex + 1);
            setStepPhase('LOOP_START');
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
                    {stepPhase === 'INIT' ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <button
                    onClick={() => { setNums([3, 0, 1]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    [3,0,1]
                </button>
                <button
                    onClick={() => { setNums([0, 1]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    [0,1] (Missing 2)
                </button>
                <button
                    onClick={() => { setNums([9, 6, 4, 2, 3, 5, 7, 0, 1]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    [9,6...1] (Missing 8)
                </button>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ background: '#222', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', color: '#888', marginBottom: '1rem' }}>Current XOR Sum</div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                        {xorSum}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {nums.map((val, idx) => (
                        <div key={idx} style={{
                            display: 'flex', gap: '1rem', padding: '0.5rem 1rem', background: '#333', borderRadius: '4px',
                            opacity: idx < currentIndex ? 0.3 : idx === currentIndex ? 1 : 0.6,
                            outline: idx === currentIndex ? '1px solid var(--accent-primary)' : 'none'
                        }}>
                            <span style={{ color: '#888', width: '60px' }}>Index: {idx}</span>
                            <span style={{ color: 'white', fontWeight: 'bold' }}>Val: {val}</span>
                        </div>
                    ))}
                    <div style={{ padding: '0.5rem 1rem', color: '#555', fontStyle: 'italic' }}>
                        Len: {nums.length} (Initial seed)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissingNumberVisualizer;
