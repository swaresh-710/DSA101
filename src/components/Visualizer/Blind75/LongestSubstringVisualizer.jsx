import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LongestSubstringVisualizer = () => {
    const [s, setS] = useState("abcabcbb");
    const [windowStart, setWindowStart] = useState(0);
    const [windowEnd, setWindowEnd] = useState(0);
    const [maxLen, setMaxLen] = useState(0);
    const [charSet, setCharSet] = useState(new Set());
    const [message, setMessage] = useState('Click Step to slide window.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setWindowStart(0);
        setWindowEnd(0);
        setMaxLen(0);
        setCharSet(new Set());
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // Base case: end reached
        if (windowEnd >= s.length) {
            setMessage(`Finished! Max Length: ${maxLen}`);
            setIsFinished(true);
            return;
        }

        const char = s[windowEnd];

        let msg = `Checking char '${char}' at index ${windowEnd}. `;

        if (!charSet.has(char)) {
            // New unique char, add to window
            const newSet = new Set(charSet);
            newSet.add(char);
            setCharSet(newSet);

            const currentLen = windowEnd - windowStart + 1;
            const newMax = Math.max(maxLen, currentLen);
            setMaxLen(newMax);

            msg += `Unique. Expand window. Current Range: [${windowStart}, ${windowEnd}]. Length: ${currentLen}. Max: ${newMax}.`;
            setMessage(msg);
            setWindowEnd(windowEnd + 1);
        } else {
            // Duplicate found, shrink window from left
            const removeChar = s[windowStart];
            const newSet = new Set(charSet);
            newSet.delete(removeChar);
            setCharSet(newSet);

            msg += `Duplicate found! Shrink window from left. Removed '${removeChar}' at index ${windowStart}.`;
            setMessage(msg);
            setWindowStart(windowStart + 1);
            // Don't move windowEnd yet, we need to re-check current char in next step (or logically in loop we would continue, here we step)
            // Wait, standard algo is while(set.has(char)) remove; then add char.
            // My visualization step is one action at a time.
            // If I shrink, I am NOT adding the current char yet. I stay at windowEnd.
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
                    Step
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
                        style={{ width: '150px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '5px', fontSize: '1.2rem', fontFamily: 'monospace', position: 'relative', height: '60px', alignItems: 'center' }}>
                    {/* Window Highlight */}
                    {!isFinished && (
                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                position: 'absolute',
                                left: `${windowStart * 35}px`,
                                width: `${Math.max(0, windowEnd - windowStart) * 35}px`,
                                height: '100%',
                                border: '2px solid var(--accent-primary)',
                                borderRadius: '4px',
                                background: 'rgba(52, 152, 219, 0.2)',
                                pointerEvents: 'none'
                            }}
                        />
                    )}

                    {s.split('').map((c, idx) => (
                        <div key={idx} style={{ width: '30px', textAlign: 'center', zIndex: 1 }}>
                            <div style={{ marginBottom: '5px' }}>{c}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{idx}</div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '1rem', background: '#333', borderRadius: '4px', width: 'fit-content' }}>
                    <div>Max Length: {maxLen}</div>
                    <div style={{ marginTop: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>
                        Set: {`{${Array.from(charSet).join(', ')}}`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LongestSubstringVisualizer;
