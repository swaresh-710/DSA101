import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EncodeDecodeStringsVisualizer = () => {
    const defaultInput = "lint,code,love,you";
    const [inputStr, setInputStr] = useState(defaultInput);

    // States
    const [originalList, setOriginalList] = useState(defaultInput.split(',').map(s => s.trim()));
    const [encodedString, setEncodedString] = useState("");
    const [decodedList, setDecodedList] = useState([]);

    // Execution State
    const [mode, setMode] = useState("ENCODE"); // ENCODE, DECODE
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [decodePtr, setDecodePtr] = useState(-1);

    const [message, setMessage] = useState('Click Start Encoding to begin.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setOriginalList(inputStr.split(',').map(s => s.trim()));
        setEncodedString("");
        setDecodedList([]);
        setMode("ENCODE");
        setCurrentIndex(-1);
        setDecodePtr(-1);
        setMessage('Ready to encode.');
        setIsFinished(false);
    };

    const handleStep = () => {
        if (isFinished) return;

        if (mode === "ENCODE") {
            if (currentIndex === -1) {
                setCurrentIndex(0);
                setMessage(`Starting encoding ${originalList.length} strings...`);
                return;
            }

            if (currentIndex < originalList.length) {
                const s = originalList[currentIndex];
                const prefix = `${s.length}#`;
                setEncodedString(prev => prev + prefix + s);
                setMessage(`Encoded "${s}" as "${prefix}${s}". Appending to result.`);
                setCurrentIndex(currentIndex + 1);
            } else {
                setMessage("Encoding finished! Ready to decode network payload.");
                setMode("DECODE");
                setCurrentIndex(-1);
                setDecodePtr(-1);
            }
        }
        else if (mode === "DECODE") {
            if (decodePtr === -1) {
                setDecodePtr(0);
                setMessage("Starting to decode the string...");
                return;
            }

            if (decodePtr < encodedString.length) {
                // Find delimiter
                let j = decodePtr;
                while (j < encodedString.length && encodedString[j] !== '#') {
                    j++;
                }

                if (j >= encodedString.length) {
                    setMessage("Error parsing string. Halting.");
                    setIsFinished(true);
                    return;
                }

                // Parse length
                const lengthStr = encodedString.substring(decodePtr, j);
                const length = parseInt(lengthStr, 10);

                // Extract word
                const startOfWord = j + 1;
                const endOfWord = startOfWord + length;
                const word = encodedString.substring(startOfWord, endOfWord);

                setDecodedList(prev => [...prev, word]);
                setDecodePtr(endOfWord);

                setMessage(`Read length ${length}. Extracted "${word}". Updating pointer to ${endOfWord}.`);
            } else {
                setMessage("Decoding completely finished! Data successfully reconstructed.");
                setIsFinished(true);
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls" style={{ flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Strings (comma-separated):</label>
                    <input
                        type="text"
                        value={inputStr}
                        onChange={(e) => { setInputStr(e.target.value); reset(); }}
                        disabled={mode !== "ENCODE" || currentIndex !== -1}
                        style={{ width: '250px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: mode === "ENCODE" ? 'var(--accent-primary)' : '#4ECDCA', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1, color: mode === "ENCODE" ? 'white' : '#222', fontWeight: 'bold' }}
                >
                    {mode === "ENCODE" ? (currentIndex === -1 ? 'Start Encoding' : 'Encode Next') : (decodePtr === -1 ? 'Start Decoding' : 'Decode Next')}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Encode Side */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>SENDER (Original Array)</h4>
                    <div className="responsive-flex" style={{ gap: '10px', flexWrap: 'wrap' }}>
                        {originalList.map((str, i) => {
                            const isCurrent = mode === "ENCODE" && i === currentIndex;
                            const isProcessed = mode === "DECODE" || (mode === "ENCODE" && i < currentIndex);
                            return (
                                <motion.div
                                    key={`orig-${i}`}
                                    animate={{
                                        scale: isCurrent ? 1.05 : 1,
                                        borderColor: isCurrent ? '#FF6B6B' : 'transparent',
                                        backgroundColor: isProcessed ? 'rgba(78, 205, 196, 0.1)' : '#222',
                                        opacity: isProcessed ? 0.5 : 1
                                    }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: '2px solid transparent',
                                        borderRadius: '8px',
                                        background: '#222',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    "{str}"
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Network Side */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>NETWORK (Encoded String)</h4>
                    <div style={{
                        padding: '1rem',
                        minHeight: '60px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        letterSpacing: '2px',
                        wordBreak: 'break-all',
                        position: 'relative'
                    }}>
                        {encodedString === "" ? (
                            <span style={{ color: '#555', fontStyle: 'italic', fontSize: '1rem', letterSpacing: 'normal' }}>Awaiting data...</span>
                        ) : (
                            <span>
                                {encodedString.split('').map((char, i) => {
                                    const isDecoded = mode === "DECODE" && i < decodePtr;
                                    const isCurrentlyDecoding = mode === "DECODE" && i >= decodePtr;
                                    return (
                                        <span key={`net-${i}`} style={{
                                            color: isDecoded ? '#555' : isCurrentlyDecoding ? '#FF6B6B' : 'white',
                                            textDecoration: isDecoded ? 'line-through' : 'none'
                                        }}>
                                            {char}
                                        </span>
                                    );
                                })}
                            </span>
                        )}

                        {mode === "DECODE" && decodePtr >= 0 && decodePtr < encodedString.length && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ position: 'absolute', bottom: '-20px', left: `calc(${(decodePtr / encodedString.length) * 100}% + 1rem)`, color: '#f1c40f', fontSize: '1rem' }}
                            >
                                ▲
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Decode Side */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>RECEIVER (Decoded Array)</h4>
                    <div className="responsive-flex" style={{ gap: '10px', flexWrap: 'wrap', minHeight: '60px', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                        <AnimatePresence>
                            {decodedList.length === 0 ? (
                                <span style={{ color: '#555', fontStyle: 'italic' }}>Awaiting data...</span>
                            ) : (
                                decodedList.map((str, i) => (
                                    <motion.div
                                        key={`dec-${i}`}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            background: 'rgba(78, 205, 196, 0.2)',
                                            color: '#4ECDCA',
                                            border: '1px solid rgba(78, 205, 196, 0.4)',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        "{str}"
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

export default EncodeDecodeStringsVisualizer;
