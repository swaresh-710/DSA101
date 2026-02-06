import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContainerWithMostWaterVisualizer = () => {
    const [heights, setHeights] = useState([1, 8, 6, 2, 5, 4, 8, 3, 7]);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(8);
    const [maxArea, setMaxArea] = useState(0);
    const [currentArea, setCurrentArea] = useState(0);

    const [message, setMessage] = useState('Click Start to find max water container.');
    const [isFinished, setIsFinished] = useState(false);
    const [stepState, setStepState] = useState('INIT');

    const reset = () => {
        setLeft(0);
        setRight(heights.length - 1);
        setMaxArea(0);
        setCurrentArea(0);
        setMessage('Ready.');
        setIsFinished(false);
        setStepState('INIT');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (stepState === 'INIT') {
            setMessage(`Starting with Left=${left}, Right=${right}.`);
            setStepState('CALC_AREA');
            return;
        }

        if (stepState === 'CALC_AREA') {
            const h = Math.min(heights[left], heights[right]);
            const w = right - left;
            const area = h * w;
            setCurrentArea(area);

            let msg = `Height: min(${heights[left]}, ${heights[right]}) = ${h}. Width: ${w}. Area: ${area}. `;

            if (area > maxArea) {
                setMaxArea(area);
                msg += `New Max Area found!`;
            } else {
                msg += `Max Area is still ${maxArea}.`;
            }
            setMessage(msg);
            setStepState('MOVE_POINTER');
            return;
        }

        if (stepState === 'MOVE_POINTER') {
            // Move the shorter line
            if (heights[left] < heights[right]) {
                setMessage(`Height at Left (${heights[left]}) < Right (${heights[right]}). Moving Left pointer to find taller line.`);
                setLeft(left + 1);
            } else {
                setMessage(`Height at Right (${heights[right]}) <= Left (${heights[left]}). Moving Right pointer to find taller line.`);
                setRight(right - 1);
            }

            // Check finish condition for next step (pointers crossed or equal)
            // We do this check at start of next cycle actually, or pre-emptively here.
            // If we just updated pointers, let's check if they met.
            // Note: state update is async, so we can't check 'left' directly here if we just set it.
            // But logic: if left < right before update, and now we move 1 step, they might meet or cross.
            setStepState('CHECK_DONE');
            return;
        }

        if (stepState === 'CHECK_DONE') {
            if (left >= right) {
                setMessage(`Pointers met. Finished! Max Water Area is ${maxArea}.`);
                setIsFinished(true);
            } else {
                setStepState('CALC_AREA');
                handleStep(); // Auto-advance to calc area
            }
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

            <div style={{ position: 'relative', height: '300px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>

                {/* Water Area Visualization */}
                {left < right && !isFinished && (
                    <div style={{
                        position: 'absolute',
                        left: `${(left / (heights.length - 1)) * 100}%`,
                        width: `${((right - left) / (heights.length - 1)) * 100}%`,
                        height: `${Math.min(heights[left], heights[right]) * 30}px`,
                        bottom: '20px',
                        background: 'rgba(52, 152, 219, 0.3)',
                        border: '1px dashed #3498db',
                        transition: 'all 0.3s ease'
                    }} />
                )}

                {heights.map((h, idx) => {
                    const isLeft = idx === left;
                    const isRight = idx === right;

                    return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{h}</div>
                            <motion.div
                                animate={{
                                    height: `${h * 30}px`,
                                    backgroundColor: isLeft || isRight ? '#FF6B6B' : '#555',
                                    opacity: (idx < left || idx > right) ? 0.3 : 1
                                }}
                                style={{
                                    width: '20px',
                                    borderRadius: '4px 4px 0 0',
                                }}
                            />
                            <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#888' }}>{idx}</div>
                            {isLeft && <div style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: '0.8rem' }}>L</div>}
                            {isRight && <div style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: '0.8rem' }}>R</div>}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Current Area</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                        {currentArea}
                    </div>
                </div>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Max Area So Far</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71' }}>
                        {maxArea}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContainerWithMostWaterVisualizer;
