import React, { useState } from 'react';
import { motion } from 'framer-motion';

const isAlnum = (c) => {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
};

const ValidPalindromeVisualizer = () => {
    const defaultString = "A man, a plan, a canal: Panama";
    const [inputStr, setInputStr] = useState(defaultString);
    const [left, setLeft] = useState(-1);
    const [right, setRight] = useState(-1);
    const [message, setMessage] = useState('Click Start to begin.');
    const [isFinished, setIsFinished] = useState(false);
    const [isValidState, setIsValidState] = useState(null);

    const reset = () => {
        setLeft(-1);
        setRight(-1);
        setMessage('Ready to check.');
        setIsFinished(false);
        setIsValidState(null);
    };

    const handleStep = () => {
        if (isFinished) return;

        if (left === -1 && right === -1) {
            setLeft(0);
            setRight(inputStr.length - 1);
            setMessage('Initializing left and right pointers.');
            return;
        }

        if (left >= right) {
            setMessage('Pointers crossed or met. String is a valid palindrome!');
            setIsValidState(true);
            setIsFinished(true);
            return;
        }

        const charLeft = inputStr[left];
        const charRight = inputStr[right];

        if (!isAlnum(charLeft)) {
            setMessage(`'${charLeft}' is not alphanumeric. Moving left pointer rightwards.`);
            setLeft(left + 1);
        } else if (!isAlnum(charRight)) {
            setMessage(`'${charRight}' is not alphanumeric. Moving right pointer leftwards.`);
            setRight(right - 1);
        } else {
            const leftLower = charLeft.toLowerCase();
            const rightLower = charRight.toLowerCase();

            if (leftLower !== rightLower) {
                setMessage(`'${leftLower}' != '${rightLower}'. Not a palindrome!`);
                setIsValidState(false);
                setIsFinished(true);
            } else {
                setMessage(`'${leftLower}' == '${rightLower}'. Match! Moving both pointers.`);
                setLeft(left + 1);
                setRight(right - 1);
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
                        style={{ width: '250px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {left === -1 ? 'Start' : 'Next Step'}
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
                <div style={{ overflowX: 'auto', padding: '1rem 0', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'nowrap', minWidth: 'min-content' }}>
                        {inputStr.split('').map((char, i) => {
                            const isLeft = i === left;
                            const isRight = i === right;
                            const isProcessedLeft = i < left;
                            const isProcessedRight = i > right;
                            const isProcessed = isProcessedLeft || isProcessedRight;

                            // Highlight if it's currently comparing
                            const isComparing = isLeft || isRight;

                            return (
                                <motion.div
                                    key={`char-${i}`}
                                    animate={{
                                        scale: isComparing ? 1.1 : 1,
                                        borderColor: isComparing ? '#FF6B6B' : 'transparent',
                                        backgroundColor: isComparing ? '#444' : isProcessed ? 'rgba(78, 205, 196, 0.1)' : '#222',
                                        opacity: isProcessed && !isValidState && isValidState !== false ? 0.5 : 1
                                    }}
                                    style={{
                                        minWidth: '35px',
                                        height: '45px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px solid transparent',
                                        borderRadius: '8px',
                                        background: '#222',
                                        fontWeight: 'bold',
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>{char === ' ' ? '\u00A0' : char}</span>

                                    {/* Pointer Indicators */}
                                    {isLeft && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ position: 'absolute', bottom: '-25px', color: '#FF6B6B', fontSize: '0.8rem', fontWeight: 'bold' }}
                                        >
                                            L
                                        </motion.div>
                                    )}
                                    {isRight && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ position: 'absolute', bottom: '-25px', color: '#4ECDCA', fontSize: '0.8rem', fontWeight: 'bold' }}
                                        >
                                            R
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValidPalindromeVisualizer;
