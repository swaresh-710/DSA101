import React, { useState } from 'react';

const BinarySearchVisualizer = () => {
    // Sorted array
    const [arr] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
    const [target, setTarget] = useState(23);
    const [left, setLeft] = useState(-1);
    const [right, setRight] = useState(-1);
    const [mid, setMid] = useState(-1);
    const [message, setMessage] = useState('Set target and click Start.');
    const [found, setFound] = useState(false);
    const [processing, setProcessing] = useState(false);

    const startSearch = async () => {
        setProcessing(true);
        setFound(false);
        setMessage('Starting Binary Search...');

        let l = 0;
        let r = arr.length - 1;
        setLeft(l); setRight(r); setMid(-1);

        // Artificial async loop
        const loop = async (l, r) => {
            if (l > r) {
                setMessage('Target not found.');
                setProcessing(false);
                return;
            }

            const m = Math.floor(l + (r - l) / 2);
            setLeft(l); setRight(r); setMid(m);
            setMessage(`Checking Middle [${m}] value: ${arr[m]}`);
            await new Promise(res => setTimeout(res, 1200));

            if (arr[m] === target) {
                setFound(true);
                setMessage(`Found target ${target} at index ${m}!`);
                setProcessing(false);
            } else if (arr[m] < target) {
                setMessage(`${arr[m]} > ${target} is FALSE. Target is in RIGHT half.`);
                await new Promise(res => setTimeout(res, 800));
                loop(m + 1, r);
            } else {
                setMessage(`${arr[m]} > ${target} is TRUE. Target is in LEFT half.`);
                await new Promise(res => setTimeout(res, 800));
                loop(l, m - 1);
            }
        };

        loop(l, r);
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <input
                    type="number"
                    value={target}
                    onChange={e => setTarget(parseInt(e.target.value))}
                    style={{ padding: '0.5rem', width: '80px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white', marginRight: '1rem' }}
                />
                <button onClick={startSearch} disabled={processing} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                    Search
                </button>
                <p style={{ marginTop: '1rem', color: 'var(--accent-secondary)' }}>{message}</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                {arr.map((val, idx) => {
                    // Logic to dim out range that is discarded
                    const inRange = (left === -1) || (idx >= left && idx <= right);
                    const isMid = idx === mid;
                    const isFound = found && idx === mid;

                    return (
                        <div key={idx} style={{
                            width: '50px', height: '50px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isFound ? 'var(--accent-primary)' : (isMid ? 'var(--accent-secondary)' : 'var(--bg-secondary)'),
                            border: '1px solid var(--glass-border)',
                            borderRadius: '6px',
                            opacity: inRange ? 1 : 0.2,
                            fontWeight: 'bold',
                            transform: isMid ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.5s ease',
                            color: 'white'
                        }}>
                            {val}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BinarySearchVisualizer;
