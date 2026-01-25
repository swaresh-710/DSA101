import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MonotonicStackVisualizer = () => {
    const [inputArray, setInputArray] = useState([2, 1, 5, 6, 2, 3]);
    const [stack, setStack] = useState([]); // Stores indices
    const [result, setResult] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [message, setMessage] = useState('Click Next to start.');
    const [isFinished, setIsFinished] = useState(false);

    // Step-by-step state
    const [stepState, setStepState] = useState('INIT'); // INIT, COMPARE, POP, PUSH

    const reset = () => {
        setStack([]);
        setResult(Array(inputArray.length).fill(-1));
        setCurrentIndex(0);
        setMessage('Starting: Loop from left to right.');
        setIsFinished(false);
        setStepState('COMPARE');
    };

    const handleNext = () => {
        if (isFinished) return;
        if (currentIndex === -1) {
            reset();
            return;
        }

        if (currentIndex >= inputArray.length) {
            setMessage('Traversal complete.');
            setIsFinished(true);
            return;
        }

        const currentVal = inputArray[currentIndex];

        if (stepState === 'COMPARE') {
            // Check if we need to pop
            if (stack.length > 0) {
                const topIndex = stack[stack.length - 1];
                const topVal = inputArray[topIndex];

                if (currentVal > topVal) {
                    setMessage(`${currentVal} is greater than ${topVal} (at index ${topIndex}). Popping ${topVal} and setting its NGE.`);
                    setStepState('POP');
                } else {
                    setMessage(`${currentVal} is not greater than ${topVal}. Pushing index ${currentIndex}.`);
                    setStepState('PUSH');
                }
            } else {
                setMessage(`Stack is empty. Pushing index ${currentIndex}.`);
                setStepState('PUSH');
            }
        }
        else if (stepState === 'POP') {
            // Perform the pop and update result
            const newStack = [...stack];
            const poppedIndex = newStack.pop();
            setStack(newStack);

            const newResult = [...result];
            newResult[poppedIndex] = currentVal;
            setResult(newResult);

            // After pop, we need to compare again with the new top
            setStepState('COMPARE');
        }
        else if (stepState === 'PUSH') {
            // Perform the push
            setStack([...stack, currentIndex]);
            setCurrentIndex(currentIndex + 1);
            setStepState('COMPARE');

            if (currentIndex + 1 >= inputArray.length) {
                setMessage('Traversal complete. Remaining items in stack have no Next Greater Element.');
                setIsFinished(true);
            } else {
                setMessage(`Moving to next element: ${inputArray[currentIndex + 1]}`);
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={handleNext}
                    disabled={isFinished && currentIndex !== -1}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {currentIndex === -1 ? 'Start' : isFinished ? 'Done' : 'Next Step'}
                </button>
                <button
                    onClick={() => {
                        const newArr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10) + 1);
                        setInputArray(newArr);
                        setResult(Array(6).fill(-1));
                        setStack([]);
                        setCurrentIndex(-1);
                        setIsFinished(false);
                        setMessage('Reset with new random array.');
                    }}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Randomize
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            {/* Visualization Container */}
            <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-end', justifyContent: 'center', minHeight: '300px' }}>

                {/* Array View */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '200px' }}>
                    {inputArray.map((val, idx) => {
                        const isCurrent = idx === currentIndex;
                        const isInStack = stack.includes(idx);
                        const isPopped = result[idx] !== -1;

                        return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ marginBottom: '5px', color: '#888' }}>{idx}</div>
                                <motion.div
                                    animate={{
                                        height: `${val * 20}px`,
                                        backgroundColor: isCurrent ? '#FF6B6B' : isInStack ? '#4ECDC4' : isPopped ? '#333' : '#666',
                                    }}
                                    style={{
                                        width: '40px',
                                        borderRadius: '4px 4px 0 0',
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        paddingTop: '5px'
                                    }}
                                >
                                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{val}</span>
                                </motion.div>
                                <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#4ECDC4' }}>
                                    {result[idx] !== -1 ? `NGE: ${result[idx]}` : '-'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stack View */}
                <div style={{
                    border: '2px solid #555',
                    borderTop: 'none',
                    width: '80px',
                    height: '250px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    padding: '10px',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', bottom: '-25px', color: '#888' }}>Stack (Idx)</div>
                    <AnimatePresence>
                        {stack.map((idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                style={{
                                    width: '100%',
                                    padding: '5px',
                                    background: '#4ECDC4',
                                    marginBottom: '5px',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    color: '#222',
                                    fontWeight: 'bold'
                                }}
                            >
                                {inputArray[idx]} <span style={{ fontSize: '0.7em' }}>({idx})</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MonotonicStackVisualizer;
