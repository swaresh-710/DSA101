import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WordBreakVisualizer = () => {
    const [s, setS] = useState("leetcode");
    const [wordDict, setWordDict] = useState(["leet", "code"]);

    // dp[i] = true if s[0...i-1] can be segmented
    const [dp, setDp] = useState(() => Array(s.length + 1).fill(false));
    const [i, setI] = useState(0);
    const [j, setJ] = useState(-1);
    const [message, setMessage] = useState('Click Start to check word break.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setDp(Array(s.length + 1).fill(false));
        setI(0);
        setJ(-1);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // Initial setup
        if (i === 0 && j === -1) {
            const initDp = Array(s.length + 1).fill(false);
            initDp[0] = true;
            setDp(initDp);
            setI(1);
            setJ(0);
            setMessage('Initialized dp[0] = true (empty string). Starting check for substrings.');
            return;
        }

        if (i <= s.length) {
            if (j < i) {
                // Check if dp[j] is true AND s.substring(j, i) is in dict
                const sub = s.substring(j, i);
                let msg = `i=${i}, j=${j}. Substring "${sub}". `;

                if (dp[j]) {
                    if (wordDict.includes(sub)) {
                        msg += `dp[${j}] is true AND "${sub}" is in dict. Set dp[${i}] = true.`;
                        const newDp = [...dp];
                        newDp[i] = true;
                        setDp(newDp);
                        // We can break early for this i if found? 
                        // The standard algorithm check all j, but if we found one valid split, dp[i] becomes true.
                        // For visualization simplicity, let's stop checking j for this i if found.
                        setMessage(msg);
                        setJ(0); // Reset j for next i
                        setI(i + 1);
                        return;
                    } else {
                        msg += `dp[${j}] is true but "${sub}" not in dict.`;
                    }
                } else {
                    msg += `dp[${j}] is false. Cannot start word here.`;
                }

                setMessage(msg);
                setJ(j + 1);
            } else {
                // Done with all j for this i (and no match found)
                setMessage(`Finished checking for length ${i}. No valid segmentation found ending here.`);
                setI(i + 1);
                setJ(0);
            }
        } else {
            setMessage(`Finished! Result: ${dp[s.length] ? "True" : "False"}.`);
            setIsFinished(true);
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
                    {i === 0 && j === -1 ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>String:</label>
                    <input
                        type="text"
                        value={s}
                        onChange={(e) => { setS(e.target.value); reset(); }}
                        style={{ width: '100px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                    <label>Dict (comma sep):</label>
                    <input
                        type="text"
                        value={wordDict.join(',')}
                        onChange={(e) => { setWordDict(e.target.value.split(',').map(w => w.trim())); reset(); }}
                        style={{ width: '120px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* String Chars and DP */}
                <div style={{ display: 'flex', gap: '2px' }}>
                    {/* DP array has length s.length + 1. Align it such that dp[k] is between k-1 and k? Or just under index k? 
                        dp[i] means s[0...i-1] valid.
                        Let's align dp[i] under the gap after char i-1.
                    */}
                    {s.split('').map((char, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '30px', textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }}>{char}</div>
                            <div style={{ width: '30px', height: '2px', background: '#444' }}></div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '2px', marginLeft: '-15px' }}>
                    {dp.map((val, idx) => {
                        const isI = idx === i;
                        const isJ = idx === j && i <= s.length && !isFinished;
                        // Highlight logic
                        return (
                            <motion.div
                                key={idx}
                                animate={{
                                    scale: isI ? 1.2 : 1,
                                    backgroundColor: val ? 'var(--accent-primary)' : '#333',
                                    border: isI ? '2px solid white' : isJ ? '2px solid #f1c40f' : '1px solid transparent'
                                }}
                                style={{
                                    width: '30px', height: '30px', borderRadius: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '0.7rem',
                                    marginTop: '5px'
                                }}
                            >
                                {val ? 'T' : 'F'}
                            </motion.div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: '2px', marginLeft: '-15px', color: '#666', fontSize: '0.7rem' }}>
                    {dp.map((_, idx) => (
                        <div key={idx} style={{ width: '30px', textAlign: 'center' }}>{idx}</div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #444', borderRadius: '4px' }}>
                <h4 style={{ marginTop: 0, color: '#888' }}>Dictionary</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {wordDict.map((w, idx) => (
                        <span key={idx} style={{ background: '#333', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                            {w}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WordBreakVisualizer;
