import React, { useState, useEffect } from 'react';

const SlidingWindowVisualizer = () => {
    const [array, setArray] = useState([4, 2, 1, 7, 8, 1, 2, 8, 1, 0]);
    const [k, setK] = useState(3);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0); // Exclusive or inclusive? Let's say window is [left, right) or [left, left+k-1]

    // Algorithm State
    const [currentSum, setCurrentSum] = useState(0);
    const [maxSum, setMaxSum] = useState(0);
    const [step, setStep] = useState(0); // 0: Init, 1: Build First Window, 2: Slide
    const [isPlaying, setIsPlaying] = useState(false);
    const [message, setMessage] = useState("Click 'Start' to begin visualization.");

    // For automatic playing
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                handleNextStep();
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, left, right, step]);

    const handleStart = () => {
        setLeft(0);
        setRight(0);
        setCurrentSum(0);
        setMaxSum(0);
        setStep(1);
        setIsPlaying(true);
        setMessage("Building the first window of size k=" + k);
    };

    const handleNextStep = () => {
        // Phase 1: Build first window
        if (step === 1) {
            if (right < k) {
                // Expand window
                const newVal = array[right];
                setCurrentSum(prev => prev + newVal);
                setRight(prev => prev + 1);
                setMessage(`Adding element at index ${right} (${newVal}) to current sum.`);
            } else {
                // Window built
                setMaxSum(currentSum);
                setStep(2);
                setMessage(`First window created. Sum: ${currentSum}. Max Sum initialized.`);
            }
        }
        // Phase 2: Show slide
        else if (step === 2) {
            if (right < array.length) {
                // Slide
                const outgoing = array[left];
                const incoming = array[right];
                const newSum = currentSum - outgoing + incoming;

                setCurrentSum(newSum);
                setMaxSum(prev => Math.max(prev, newSum));
                setLeft(prev => prev + 1);
                setRight(prev => prev + 1);
                setMessage(`Slide window: Subtract ${outgoing}, Add ${incoming}. New Sum: ${newSum}.`);
            } else {
                setIsPlaying(false);
                setStep(3);
                setMessage(`Finished! Maximum Sum found: ${maxSum}`);
            }
        }
    };

    const handleReset = () => {
        setLeft(0);
        setRight(0);
        setCurrentSum(0);
        setMaxSum(0);
        setStep(0);
        setIsPlaying(false);
        setMessage("Ready to start.");
    };

    return (
        <div className="visualizer-container" style={{ textAlign: 'center' }}>

            {/* Controls */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={handleStart} disabled={step > 0} style={{ padding: '0.8rem 1.5rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '8px' }}>
                    Start
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)} disabled={step === 0 || step === 3} style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '8px' }}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={handleNextStep} disabled={isPlaying || step === 0 || step === 3} style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '8px' }}>
                    Next Step
                </button>
                <button onClick={handleReset} style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '8px' }}>
                    Reset
                </button>
            </div>

            {/* Info Panel */}
            <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                    <div>Current Sum: <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{currentSum}</span></div>
                    <div>Max Sum: <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{maxSum}</span></div>
                </div>
            </div>

            {/* Array Display */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                padding: '2rem 0',
                overflowX: 'auto'
            }}>
                {array.map((val, idx) => {
                    // Determine if element is in current window
                    // Window is from [left, right - 1] because right is inclusive in my logic above? 
                    // Wait, in build phase, right increments AFTER adding. So window is [left, right-1].
                    const isInWindow = idx >= left && idx < right;

                    return (
                        <div key={idx} style={{
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isInWindow ? 'rgba(80, 40, 150, 0.4)' : 'var(--bg-tertiary)',
                            border: isInWindow ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            transform: isInWindow ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: isInWindow ? '0 0 15px var(--accent-primary)' : 'none',
                            position: 'relative'
                        }}>
                            {val}

                            <div style={{ position: 'absolute', bottom: '-25px', fontSize: '0.8rem', color: '#666' }}>{idx}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SlidingWindowVisualizer;
