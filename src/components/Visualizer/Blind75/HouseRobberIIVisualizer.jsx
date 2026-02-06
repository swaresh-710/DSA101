import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Helper for linear house robber
const robLinear = (nums) => {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    let prev2 = 0;
    let prev1 = 0;
    for (let num of nums) {
        let temp = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = temp;
    }
    return prev1;
};

const HouseRobberIIVisualizer = () => {
    const [houses, setHouses] = useState([2, 3, 2]);
    const [scenario, setScenario] = useState('none'); // 'case1' (0 to n-2), 'case2' (1 to n-1), 'result'
    const [message, setMessage] = useState('Click Start to compare scenarios.');

    const handleStart = () => {
        setScenario('case1');
        setMessage('Case 1: Rob houses 0 to n-2 (cannot rob last if we might rob first). \nIgnoring last house.');
    };

    const handleNext = () => {
        if (scenario === 'case1') {
            setScenario('case2');
            setMessage('Case 2: Rob houses 1 to n-1 (cannot rob first if we might rob last). \nIgnoring first house.');
        } else if (scenario === 'case2') {
            const val1 = robLinear(houses.slice(0, houses.length - 1));
            const val2 = robLinear(houses.slice(1));
            const res = Math.max(val1, val2);
            setScenario('result');
            setMessage(`Result: Max(Case 1: ${val1}, Case 2: ${val2}) = ${res}.`);
        }
    };

    const reset = () => {
        setScenario('none');
        setMessage('Ready.');
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={scenario === 'none' ? handleStart : handleNext}
                    disabled={scenario === 'result'}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: scenario === 'result' ? 0.5 : 1 }}
                >
                    {scenario === 'none' ? 'Start' : 'Next Case'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Houses:</label>
                    <input
                        type="text"
                        value={houses.join(',')}
                        onChange={(e) => { setHouses(e.target.value.split(',').map(n => parseInt(n.trim()) || 0)); reset(); }}
                        style={{ width: '100px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ position: 'relative', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Circular Layout */}
                {houses.map((val, idx) => {
                    const angle = (idx / houses.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = 80;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    let isActive = true;
                    // Visualize active/inactive based on scenario
                    if (scenario === 'case1' && idx === houses.length - 1) isActive = false;
                    if (scenario === 'case2' && idx === 0) isActive = false;

                    return (
                        <motion.div
                            key={idx}
                            animate={{
                                opacity: isActive ? 1 : 0.3,
                                scale: isActive ? 1 : 0.8
                            }}
                            style={{
                                position: 'absolute',
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                width: '40px', height: '40px', background: '#333',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '50%', border: '2px solid white',
                                transform: 'translate(-50%, -50%)',
                                fontWeight: 'bold'
                            }}
                        >
                            {val}
                            <span style={{ position: 'absolute', fontSize: '0.7rem', color: '#aaa', top: '-15px' }}>{idx}</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default HouseRobberIIVisualizer;
