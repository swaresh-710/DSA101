import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DecodeWaysVisualizer = () => {
    const [s, setS] = useState("226");
    const [dp, setDp] = useState([]); // dp[i] = ways to decode s[0...i-1]
    const [i, setI] = useState(0);
    const [message, setMessage] = useState('Click Start to count decode ways.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setDp([]);
        setI(0);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // s length n. dp size n+1. dp[0] = 1.
        if (i === 0) {
            const initDp = Array(s.length + 1).fill(0);
            initDp[0] = 1;
            setDp(initDp);
            setI(1);
            setMessage('Initialized dp array. dp[0] = 1 (empty string has 1 way).');
            return;
        }

        if (i <= s.length) {
            const currentIdx = i; // Checking s[currentIdx-1]
            const char1 = s[currentIdx - 1];
            const char2 = currentIdx >= 2 ? s.substring(currentIdx - 2, currentIdx) : null;

            const newDp = [...dp];
            let msg = `Checking length ${currentIdx} (ending at '${char1}'). `;

            // One digit check
            if (char1 !== '0') {
                newDp[currentIdx] += newDp[currentIdx - 1];
                msg += `One digit '${char1}' is valid (1-9). Add dp[${currentIdx - 1}] (${newDp[currentIdx - 1]}). `;
            } else {
                msg += `One digit '${char1}' is invalid (0). `;
            }

            // Two digit check
            if (char2) {
                const val = parseInt(char2);
                if (val >= 10 && val <= 26) {
                    newDp[currentIdx] += newDp[currentIdx - 2];
                    msg += `Two digits '${char2}' is valid (10-26). Add dp[${currentIdx - 2}] (${newDp[currentIdx - 2]}). `;
                } else {
                    msg += `Two digits '${char2}' is invalid or out of range. `;
                }
            }

            msg += `Total ways for length ${currentIdx}: ${newDp[currentIdx]}.`;
            setDp(newDp);
            setMessage(msg);
            setI(i + 1);
        } else {
            setMessage(`Finished! Total decode ways: ${dp[s.length]}.`);
            setIsFinished(true);
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
                    {i === 0 ? 'Start' : 'Next Digit'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>String (digits):</label>
                    <input
                        type="text"
                        value={s}
                        onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); setS(val); reset(); }}
                        style={{ width: '100px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                        maxLength={10}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* String */}
                <div style={{ display: 'flex', gap: '2px', marginLeft: '30px' }}>
                    {s.split('').map((c, idx) => (
                        <div key={idx} style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{c}</div>
                    ))}
                </div>

                {/* DP Array */}
                <div style={{ display: 'flex', gap: '2px' }}>
                    {dp.map((val, idx) => {
                        const isCurrent = idx === i - 1; // i is next step, so i-1 was just updated
                        return (
                            <motion.div
                                key={idx}
                                animate={{
                                    backgroundColor: isCurrent ? 'var(--accent-primary)' : '#333',
                                    scale: isCurrent ? 1.1 : 1
                                }}
                                style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', color: 'white',
                                    border: '1px solid #444'
                                }}
                            >
                                {val}
                            </motion.div>
                        );
                    })}
                    {/* Placeholders if not started */}
                    {dp.length === 0 && Array(s.length + 1).fill(0).map((_, idx) => (
                        <div key={idx} style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#222', border: '1px solid #333' }}></div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '2px', color: '#666', fontSize: '0.7rem' }}>
                    {Array(s.length + 1).fill(0).map((_, idx) => (
                        <div key={idx} style={{ width: '40px', textAlign: 'center' }}>{idx}</div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
                <p>Decoding Map: A=1, B=2, ..., Z=26</p>
            </div>
        </div>
    );
};

export default DecodeWaysVisualizer;
