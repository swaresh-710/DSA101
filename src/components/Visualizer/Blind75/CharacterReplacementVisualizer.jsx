import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CharacterReplacementVisualizer = () => {
    const [s, setS] = useState("AABABBA");
    const [k, setK] = useState(1);
    const [windowStart, setWindowStart] = useState(0);
    const [windowEnd, setWindowEnd] = useState(0);
    const [maxLen, setMaxLen] = useState(0);
    const [counts, setCounts] = useState({}); // char -> count
    const [maxFreq, setMaxFreq] = useState(0);
    const [message, setMessage] = useState('Click Step to expand window.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setWindowStart(0);
        setWindowEnd(0);
        setMaxLen(0);
        setCounts({});
        setMaxFreq(0);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (windowEnd >= s.length) {
            setMessage(`Finished! Max Length: ${maxLen}.`);
            setIsFinished(true);
            return;
        }

        const char = s[windowEnd];
        const newCounts = { ...counts };
        newCounts[char] = (newCounts[char] || 0) + 1;

        const currentCount = newCounts[char];
        const newMaxFreq = Math.max(maxFreq, currentCount);

        const windowLen = windowEnd - windowStart + 1;
        const replacementsNeeded = windowLen - newMaxFreq;

        let msg = `Added '${char}'. Window: [${windowStart}, ${windowEnd}] (${s.substring(windowStart, windowEnd + 1)}). Freqs: ${JSON.stringify(newCounts)}. MaxFreq: ${newMaxFreq}. Replacements: ${replacementsNeeded}. `;

        if (replacementsNeeded <= k) {
            // Valid window
            const newMaxLen = Math.max(maxLen, windowLen);
            setMaxLen(newMaxLen);
            setMaxFreq(newMaxFreq);
            setCounts(newCounts);

            msg += `Valid (<= k=${k}). Update MaxLen to ${newMaxLen}. Expand Right.`;
            setMessage(msg);
            setWindowEnd(windowEnd + 1);
        } else {
            // Invalid, shrink from left
            // In optimal solution code, we might not shrink loop, but just shift window. 
            // For visualization, let's strictly shrink until valid to show validity check.

            // Standard approach: if (len - maxFreq > k) { remove s[l]; l++ }
            // Note: We used `newMaxFreq` derived from current addition. 
            // When shrinking, `maxFreq` might strictly decrease, or stay same.
            // In linear optimization, we don't need to decrement maxFreq.
            // But for clarity, let's maintain accurate counts.

            const removeChar = s[windowStart];
            newCounts[removeChar]--;
            // Update maxFreq? Scanning counts is O(26) ~ O(1).
            const recalculatedMaxFreq = Math.max(...Object.values(newCounts));

            msg += `Invalid (> k=${k}). Shrink Left. Removed '${removeChar}'.`;

            setCounts(newCounts);
            setWindowStart(windowStart + 1);
            setMaxFreq(recalculatedMaxFreq);
            setMessage(msg);
            // Don't expand right yet
            setWindowEnd(windowEnd + 1); // Actually we essentially slide: add one, remove one, so end moves too?
            // No, standard `if` block replacement:
            // r++, add char. if invalid, l++, remove char.
            // So r always increments. l conditionally increments.
            // So effectively we slide.
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
                        onChange={(e) => { setS(e.target.value.toUpperCase()); reset(); }}
                        style={{ width: '120px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                    <label>K:</label>
                    <input
                        type="number"
                        value={k}
                        onChange={(e) => { setK(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
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
                        Max Freq in Window: {maxFreq}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterReplacementVisualizer;
