import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ValidParenthesesVisualizer = () => {
    const defaultString = "()[]{}";
    const [inputStr, setInputStr] = useState(defaultString);
    const [stack, setStack] = useState([]); // Array of chars
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [message, setMessage] = useState('Click Start to begin.');
    const [isFinished, setIsFinished] = useState(false);
    const [isValidState, setIsValidState] = useState(null); // true, false, or null

    const reset = () => {
        setStack([]);
        setCurrentIndex(-1);
        setMessage('Ready to parse.');
        setIsFinished(false);
        setIsValidState(null);
    };

    const handleStep = () => {
        if (isFinished) return;

        if (currentIndex === -1) {
            setCurrentIndex(0);
            setMessage(`Starting parsing string of length ${inputStr.length}...`);
            return;
        }

        if (currentIndex >= inputStr.length) {
            if (stack.length === 0) {
                setMessage('Reached end of string. Stack is empty. Valid!');
                setIsValidState(true);
            } else {
                setMessage('Reached end of string but stack is not empty. Invalid!');
                setIsValidState(false);
            }
            setIsFinished(true);
            return;
        }

        const char = inputStr[currentIndex];
        const newStack = [...stack];

        if (char === '(' || char === '{' || char === '[') {
            newStack.push(char);
            setStack(newStack);
            setMessage(`'${char}' is an opening bracket. Pushed to stack.`);
            setCurrentIndex(currentIndex + 1);
        } else {
            if (newStack.length === 0) {
                setMessage(`'${char}' is a closing bracket, but stack is empty! Invalid.`);
                setIsValidState(false);
                setIsFinished(true);
                return;
            }

            const top = newStack[newStack.length - 1];
            if (
                (char === ')' && top === '(') ||
                (char === '}' && top === '{') ||
                (char === ']' && top === '[')
            ) {
                newStack.pop();
                setStack(newStack);
                setMessage(`'${char}' matches '${top}'. Popped from stack.`);
                setCurrentIndex(currentIndex + 1);
            } else {
                setMessage(`'${char}' does NOT match top of stack '${top}'. Invalid.`);
                setIsValidState(false);
                setIsFinished(true);
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
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

            <div className="responsive-flex" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                {/* String View */}
                <div>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Input String</h4>
                    <div className="responsive-flex" style={{ gap: '5px', flexWrap: 'wrap' }}>
                        {inputStr.split('').map((char, i) => {
                            const isCurrent = i === currentIndex;
                            const isProcessed = i < currentIndex;
                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: isCurrent ? 1.1 : 1,
                                        borderColor: isCurrent ? '#FF6B6B' : 'transparent',
                                        backgroundColor: isCurrent ? '#444' : isProcessed ? 'rgba(78, 205, 196, 0.1)' : '#222',
                                        opacity: isProcessed && !isValidState && isValidState !== false ? 0.5 : 1
                                    }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px solid transparent',
                                        borderRadius: '8px',
                                        background: '#222',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {char}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Stack View */}
                <div style={{ width: '100%', maxWidth: '150px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Stack</h4>
                    <div style={{
                        border: '2px solid #555',
                        borderTop: 'none',
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px',
                        padding: '1rem',
                        minHeight: '200px',
                        background: 'rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column-reverse', // To make stack grow upwards
                        gap: '5px'
                    }}>
                        <AnimatePresence>
                            {stack.length === 0 ? (
                                <div style={{ color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Empty</div>
                            ) : (
                                stack.map((char, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        style={{
                                            background: 'var(--accent-primary)',
                                            color: 'white',
                                            padding: '0.5rem',
                                            textAlign: 'center',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        {char}
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValidParenthesesVisualizer;
