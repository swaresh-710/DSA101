import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PalindromicSubstringsVisualizer = () => {
    const defaultString = "abc";
    const [inputStr, setInputStr] = useState(defaultString);
    const [centerIndex, setCenterIndex] = useState(-1);
    const [isEvenCenter, setIsEvenCenter] = useState(false);
    const [left, setLeft] = useState(-1);
    const [right, setRight] = useState(-1);
    const [totalCount, setTotalCount] = useState(0);
    const [foundPalindromes, setFoundPalindromes] = useState([]);
    const [message, setMessage] = useState('Click Start to begin.');
    const [isFinished, setIsFinished] = useState(false);
    const [phase, setPhase] = useState("INIT");

    const reset = () => {
        setCenterIndex(-1);
        setIsEvenCenter(false);
        setLeft(-1);
        setRight(-1);
        setTotalCount(0);
        setFoundPalindromes([]);
        setMessage('Ready to count.');
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
                const newPal = inputStr.substring(left, right + 1);
                setFoundPalindromes([...foundPalindromes, newPal]);
                setTotalCount(totalCount + 1);

                setMessage(`'${inputStr[left]}' == '${inputStr[right]}'. Match! Found palindrome "${newPal}". Expanding...`);
                setLeft(left - 1);
                setRight(right + 1);
            } else {
                setMessage(`Mismatch or bounds reached. Finishing center.`);
                setPhase("DONE_CENTER");
            }
            return;
        }

        if (phase === "DONE_CENTER") {
            if (!isEvenCenter) {
                // Check even center next
                setIsEvenCenter(true);
                setLeft(-1);
                setRight(-1);
                setPhase("SELECT_CENTER");
                setMessage(`Selected even center after index ${centerIndex}.`);
            } else {
                // Check odd center for next char
                if (centerIndex + 1 < inputStr.length) {
                    setCenterIndex(centerIndex + 1);
                    setIsEvenCenter(false);
                    setLeft(-1);
                    setRight(-1);
                    setPhase("SELECT_CENTER");
                    setMessage(`Selected center at index ${centerIndex + 1} (odd length check).`);
                } else {
                    setMessage(`Reached end of string. Total Palindromic Substrings: ${totalCount}`);
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

                <div style={{ marginLeft: 'auto', padding: '0.5rem 1rem', background: 'rgba(78, 205, 196, 0.2)', border: '1px solid #4ECDCA', borderRadius: '4px', color: '#4ECDCA', fontWeight: 'bold' }}>
                    Total Count: {totalCount}
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ overflowX: 'auto', padding: '2rem 0', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'nowrap', minWidth: 'min-content', position: 'relative' }}>
                        {inputStr.split('').map((char, i) => {
                            const isCenterChar = i === centerIndex && !isEvenCenter && (phase === "SELECT_CENTER" || phase === "EXPANDING");
                            const isInsidePalindrome = phase === "EXPANDING" && i >= left && i <= right && i > left && i < right;
                            const isCurrentlyChecking = phase === "EXPANDING" && (i === left || i === right);

                            return (
                                <div key={i} style={{ display: 'flex', position: 'relative' }}>
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

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Found Palindromes</h4>
                    <div style={{
                        border: '1px solid #444',
                        borderRadius: '8px',
                        padding: '1rem',
                        minHeight: '150px',
                        background: 'rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        alignContent: 'flex-start'
                    }}>
                        <AnimatePresence>
                            {foundPalindromes.map((pal, idx) => (
                                <motion.div
                                    key={`${pal}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        background: 'rgba(78, 205, 196, 0.2)',
                                        color: '#4ECDCA',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(78, 205, 196, 0.4)',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {pal}
                                </motion.div>
                            ))}
                            {foundPalindromes.length === 0 && (
                                <div style={{ color: '#555', fontStyle: 'italic', width: '100%', textAlign: 'center', marginTop: '1rem' }}>
                                    None yet
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PalindromicSubstringsVisualizer;
