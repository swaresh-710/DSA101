import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ValidAnagramVisualizer = () => {
    const [sStr, setSStr] = useState("anagram");
    const [tStr, setTStr] = useState("nagaram");
    const [counts, setCounts] = useState(Array(26).fill(0));
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [message, setMessage] = useState('Click Start to begin.');
    const [isFinished, setIsFinished] = useState(false);
    const [isValidState, setIsValidState] = useState(null); // true, false, or null

    const reset = () => {
        setCounts(Array(26).fill(0));
        setCurrentIndex(-1);
        setMessage('Ready to compare.');
        setIsFinished(false);
        setIsValidState(null);
    };

    const handleStep = () => {
        if (isFinished) return;

        if (currentIndex === -1) {
            if (sStr.length !== tStr.length) {
                setMessage('Lengths are different. Not an anagram!');
                setIsValidState(false);
                setIsFinished(true);
                return;
            }
            setCurrentIndex(0);
            setMessage(`Strings have same length. Starting to count characters...`);
            return;
        }

        if (currentIndex < sStr.length) {
            const charS = sStr[currentIndex];
            const charT = tStr[currentIndex];
            const sIdx = charS.charCodeAt(0) - 97;
            const tIdx = charT.charCodeAt(0) - 97;

            const newCounts = [...counts];
            if (sIdx >= 0 && sIdx < 26) newCounts[sIdx]++;
            if (tIdx >= 0 && tIdx < 26) newCounts[tIdx]--;

            setCounts(newCounts);
            setMessage(`Incrementing count for '${charS}'. Decrementing count for '${charT}'.`);
            setCurrentIndex(currentIndex + 1);
        } else if (currentIndex === sStr.length) {
            // Check counts
            const isAnagram = counts.every(c => c === 0);
            if (isAnagram) {
                setMessage(`All character counts are 0. It is an anagram!`);
                setIsValidState(true);
            } else {
                setMessage(`Some counts are not 0. Not an anagram!`);
                setIsValidState(false);
            }
            setIsFinished(true);
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>s:</label>
                    <input
                        type="text"
                        value={sStr}
                        onChange={(e) => { setSStr(e.target.value.toLowerCase()); reset(); }}
                        style={{ width: '100px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>t:</label>
                    <input
                        type="text"
                        value={tStr}
                        onChange={(e) => { setTStr(e.target.value.toLowerCase()); reset(); }}
                        style={{ width: '100px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentIndex === -1 ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: isValidState === true ? '#2ecc71' : isValidState === false ? '#FF6B6B' : 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h4 style={{ color: '#888', marginBottom: '1rem' }}>String s</h4>
                        <div className="responsive-flex" style={{ gap: '5px', flexWrap: 'wrap' }}>
                            {sStr.split('').map((char, i) => (
                                <motion.div
                                    key={`s-${i}`}
                                    animate={{
                                        scale: i === currentIndex && currentIndex < sStr.length ? 1.1 : 1,
                                        borderColor: i === currentIndex && currentIndex < sStr.length ? '#FF6B6B' : 'transparent',
                                        backgroundColor: i < currentIndex ? 'rgba(78, 205, 196, 0.1)' : '#222',
                                    }}
                                    style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid transparent', borderRadius: '8px', background: '#222', fontWeight: 'bold' }}
                                >
                                    {char}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: '#888', marginBottom: '1rem' }}>String t</h4>
                        <div className="responsive-flex" style={{ gap: '5px', flexWrap: 'wrap' }}>
                            {tStr.split('').map((char, i) => (
                                <motion.div
                                    key={`t-${i}`}
                                    animate={{
                                        scale: i === currentIndex && currentIndex < sStr.length ? 1.1 : 1,
                                        borderColor: i === currentIndex && currentIndex < sStr.length ? '#FF6B6B' : 'transparent',
                                        backgroundColor: i < currentIndex ? 'rgba(78, 205, 196, 0.1)' : '#222',
                                    }}
                                    style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid transparent', borderRadius: '8px', background: '#222', fontWeight: 'bold' }}
                                >
                                    {char}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Character Frequency (Non-Zero)</h4>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <AnimatePresence>
                            {counts.map((count, idx) => {
                                if (count === 0 && currentIndex !== sStr.length) return null; // hide zeros until end
                                return (
                                    <motion.div
                                        key={idx}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: count === 0 ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                                            color: count === 0 ? '#2ecc71' : '#FF6B6B',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            border: count === 0 ? '1px solid #2ecc71' : '1px solid #FF6B6B'
                                        }}
                                    >
                                        <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{String.fromCharCode(97 + idx)}</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{count}</span>
                                    </motion.div>
                                );
                            })}
                            {!counts.some(c => c !== 0) && currentIndex !== sStr.length && (
                                <div style={{ color: '#555', fontStyle: 'italic' }}>All counts are 0</div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValidAnagramVisualizer;
