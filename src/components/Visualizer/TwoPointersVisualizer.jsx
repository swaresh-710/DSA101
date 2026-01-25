import React, { useState, useEffect } from 'react';

const TwoPointersVisualizer = () => {
    // Sorted array for Two Sum
    const [array] = useState([1, 3, 4, 6, 8, 9, 11, 14, 18, 22]);
    const [target, setTarget] = useState(13);

    // State
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(array.length - 1);
    const [found, setFound] = useState(false);
    const [message, setMessage] = useState("Click 'Start' to begin visualization.");
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval;
        if (isPlaying && !found) {
            interval = setInterval(() => {
                handleNextStep();
            }, 1200);
        }
        return () => clearInterval(interval);
    }, [isPlaying, left, right, found]);

    const handleStart = () => {
        setLeft(0);
        setRight(array.length - 1);
        setFound(false);
        setIsPlaying(true);
        setMessage(`Looking for pair with sum ${target}...`);
    };

    const handleNextStep = () => {
        if (left >= right) {
            setMessage("Pointers crossed. No pair found.");
            setIsPlaying(false);
            return;
        }

        const sum = array[left] + array[right];

        if (sum === target) {
            setMessage(`Found it! ${array[left]} + ${array[right]} = ${target}`);
            setFound(true);
            setIsPlaying(false);
        } else if (sum < target) {
            setMessage(`Sum ${sum} is too small. Move Left pointer ->`);
            setLeft(prev => prev + 1);
        } else {
            setMessage(`Sum ${sum} is too big. <- Move Right pointer`);
            setRight(prev => prev - 1);
        }
    };

    const handleReset = () => {
        setLeft(0);
        setRight(array.length - 1);
        setFound(false);
        setIsPlaying(false);
        setMessage("Ready to start.");
    };

    return (
        <div className="visualizer-container" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={handleStart} style={{ padding: '0.8rem 1.5rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '8px' }}>
                    Start
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)} disabled={found} style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '8px' }}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={handleNextStep} disabled={isPlaying || found} style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '8px' }}>
                    Next Step
                </button>
                <button onClick={handleReset} style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '8px' }}>
                    Reset
                </button>
            </div>

            <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{message}</p>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Target: {target}</p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                padding: '2rem 0',
                overflowX: 'auto'
            }}>
                {array.map((val, idx) => {
                    const isLeft = idx === left;
                    const isRight = idx === right;
                    const isMatch = found && (isLeft || isRight);

                    return (
                        <div key={idx} style={{
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isMatch ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                            border: (isLeft || isRight) ? '2px solid var(--accent-secondary)' : '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            transform: (isLeft || isRight) ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
                            boxShadow: (isLeft || isRight) ? '0 0 15px var(--accent-secondary)' : 'none',
                            position: 'relative'
                        }}>
                            {val}
                            {isLeft && <div style={{ position: 'absolute', bottom: '-25px', color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>L</div>}
                            {isRight && <div style={{ position: 'absolute', bottom: '-25px', color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>R</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TwoPointersVisualizer;
