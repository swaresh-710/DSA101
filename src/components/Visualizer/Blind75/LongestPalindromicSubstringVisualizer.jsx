import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LongestPalindromicSubstringVisualizer = () => {
    const defaultString = "babad";
    const [inputStr, setInputStr] = useState(defaultString);
    const [centerIndex, setCenterIndex] = useState(-1);
    const [isEvenCenter, setIsEvenCenter] = useState(false); // false = char, true = between chars
    const [left, setLeft] = useState(-1);
    const [right, setRight] = useState(-1);
    const [longest, setLongest] = useState("");
    const [message, setMessage] = useState('Click Start to begin.');
    const [isFinished, setIsFinished] = useState(false);
    const [phase, setPhase] = useState("INIT"); // INIT, SELECT_CENTER, EXPANDING, DONE_CENTER

    const reset = () => {
        setCenterIndex(-1);
        setIsEvenCenter(false);
        setLeft(-1);
        setRight(-1);
        setLongest("");
        setMessage('Ready to search.');
        setIsFinished(false);
        setPhase("INIT");
    };

    const handleStep = () => {
        if (isFinished) return;

        if (phase === "INIT") {
            setCenterIndex(0);
            setIsEvenCenter(false);
            setPhase("SELECT_CENTER");
            setMessage('Selected center at index 0 (odd length check).');
            return;
        }

        if (phase === "SELECT_CENTER") {
            // Set up left and right pointers for expanding
            let l = centerIndex;
            let r = isEvenCenter ? centerIndex + 1 : centerIndex;
            setLeft(l);
            setRight(r);
            setPhase("EXPANDING");
            setMessage(`Expanding from pointers L:${l}, R:${r}`);
            return;
        }

        if (phase === "EXPANDING") {
            if (left >= 0 && right < inputStr.length && inputStr[left] === inputStr[right]) {
                setMessage(`'${inputStr[left]}' == '${inputStr[right]}'. Match! Expanding...`);

                // Track longest palindrome
                const currentLen = right - left + 1;
                if (currentLen > longest.length) {
                    setLongest(inputStr.substring(left, right + 1));
                }

                setLeft(left - 1);
                setRight(right + 1);
            } else {
                setMessage(`Mismatch or bounds reached (L:${left}, R:${right}). Finishing center.`);
                setPhase("DONE_CENTER");
            }
            return;
        }

        if (phase === "DONE_CENTER") {
            if (!isEvenCenter) {
                // Next is even center for same char
                setIsEvenCenter(true);
                setLeft(-1);
                setRight(-1);
                setPhase("SELECT_CENTER");
                setMessage(`Selected even center after index ${centerIndex}.`);
            } else {
                // Next is odd center for next char
                if (centerIndex + 1 < inputStr.length) {
                    setCenterIndex(centerIndex + 1);
                    setIsEvenCenter(false);
                    setLeft(-1);
                    setRight(-1);
                    setPhase("SELECT_CENTER");
                    setMessage(`Selected center at index ${centerIndex + 1} (odd length check).`);
                } else {
                    setMessage(`Reached end of string. Longest Palindrome: "${longest}"`);
                    setIsFinished(true);
                }
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls" style={{ flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>String:</label>
                    <input
                        type="text"
                        value={inputStr}
                        onChange={(e) => { setInputStr(e.target.value); reset(); }}
                        style={{ width: '150px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {phase === "INIT" ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ marginLeft: 'auto', padding: '0.5rem 1rem', background: 'rgba(255, 107, 107, 0.2)', border: '1px solid #FF6B6B', borderRadius: '4px', color: '#FF6B6B', fontWeight: 'bold' }}>
                    Longest: "{longest}"
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ overflowX: 'auto', padding: '2rem 0', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'nowrap', minWidth: 'min-content', position: 'relative' }}>
                        {inputStr.split('').map((char, i) => {
                            // Determine statuses for highlighting
                            const isCenterChar = i === centerIndex && !isEvenCenter && (phase === "SELECT_CENTER" || phase === "EXPANDING");
                            const isInsidePalindrome = phase === "EXPANDING" && i > left && i < right; // Area known to be palindrome
                            const isCurrentlyChecking = phase === "EXPANDING" && (i === left || i === right);

                            return (
                                <div key={i} style={{ display: 'flex', position: 'relative' }}>
                                    {/* The Character Block */}
                                    <motion.div
                                        animate={{
                                            scale: isCurrentlyChecking ? 1.1 : 1,
                                            borderColor: isCurrentlyChecking ? '#FF6B6B' : 'transparent',
                                            backgroundColor: isCurrentlyChecking ? '#444' : isInsidePalindrome ? 'rgba(78, 205, 196, 0.2)' : isCenterChar ? 'rgba(241, 196, 15, 0.2)' : '#222',
                                            color: isCenterChar ? '#f1c40f' : isInsidePalindrome ? '#4ECDCA' : 'white'
                                        }}
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '2px solid transparent',
                                            borderRadius: '8px',
                                            background: '#222',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            zIndex: 2
                                        }}
                                    >
                                        {char}

                                        {/* Left / Right Indicators */}
                                        {i === left && phase === "EXPANDING" && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', bottom: '-25px', color: '#FF6B6B', fontSize: '0.8rem' }}>L</motion.div>
                                        )}
                                        {i === right && phase === "EXPANDING" && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', bottom: '-25px', color: '#FF6B6B', fontSize: '0.8rem' }}>R</motion.div>
                                        )}
                                    </motion.div>

                                    {/* The space between block (for even centers) */}
                                    {i < inputStr.length - 1 && (
                                        <div style={{ width: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                            {isEvenCenter && centerIndex === i && (phase === "SELECT_CENTER" || phase === "EXPANDING") && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: '100%' }}
                                                    style={{ width: '2px', background: '#f1c40f', position: 'absolute' }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LongestPalindromicSubstringVisualizer;
