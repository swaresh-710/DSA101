import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GroupAnagramsVisualizer = () => {
    const defaultInput = "eat,tea,tan,ate,nat,bat";
    const [inputStr, setInputStr] = useState(defaultInput);
    const [strs, setStrs] = useState(defaultInput.split(',').map(s => s.trim()));
    const [mapState, setMapState] = useState({}); // { key: [str1, str2] }
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [currentKey, setCurrentKey] = useState(null);
    const [message, setMessage] = useState('Click Start to begin.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setStrs(inputStr.split(',').map(s => s.trim()));
        setMapState({});
        setCurrentIndex(-1);
        setCurrentKey(null);
        setMessage('Ready to group.');
        setIsFinished(false);
    };

    const handleStep = () => {
        if (isFinished) return;

        if (currentIndex === -1) {
            setCurrentIndex(0);
            setMessage(`Starting to process ${strs.length} strings...`);
            return;
        }

        if (currentIndex < strs.length) {
            const currentStr = strs[currentIndex];

            // Just calculated the key or just started processing the word
            if (currentKey === null) {
                const sorted = currentStr.split('').sort().join('');
                setCurrentKey(sorted);
                setMessage(`Processing "${currentStr}". Its sorted key is "${sorted}".`);
            } else {
                // Now push to map
                const newMap = { ...mapState };
                if (!newMap[currentKey]) {
                    newMap[currentKey] = [];
                }
                newMap[currentKey].push(currentStr);
                setMapState(newMap);
                setMessage(`Added "${currentStr}" to the group with key "${currentKey}".`);

                // Advance
                setCurrentKey(null);
                setCurrentIndex(currentIndex + 1);
            }
        } else {
            setMessage(`Finished processing. Grouped into ${Object.keys(mapState).length} anagram groups.`);
            setIsFinished(true);
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
                        style={{ width: '250px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentIndex === -1 ? 'Start' : currentKey === null ? 'Sort Word' : 'Group Word'}
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
                {/* Input Array View */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Input Array (strs)</h4>
                    <div className="responsive-flex" style={{ gap: '10px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {strs.map((str, i) => {
                            const isCurrent = i === currentIndex;
                            const isProcessed = i < currentIndex;
                            return (
                                <motion.div
                                    key={`str-${i}`}
                                    animate={{
                                        scale: isCurrent ? 1.05 : 1,
                                        borderColor: isCurrent ? '#FF6B6B' : 'transparent',
                                        backgroundColor: isProcessed ? 'rgba(78, 205, 196, 0.1)' : '#222',
                                        opacity: isProcessed ? 0.5 : 1
                                    }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        border: '2px solid transparent',
                                        borderRadius: '8px',
                                        background: '#222',
                                        fontWeight: 'bold',
                                        position: 'relative'
                                    }}
                                >
                                    <span>{str}</span>
                                    {isCurrent && currentKey !== null && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#FF6B6B',
                                                marginTop: '0.5rem',
                                                background: 'rgba(255, 107, 107, 0.1)',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            key: {currentKey}
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Hash Map View */}
                <div style={{ flex: 1.5, minWidth: '300px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Hash Map (Sorted String {'->'} List of Strings)</h4>
                    <div style={{
                        border: '1px solid #444',
                        borderRadius: '8px',
                        padding: '1rem',
                        minHeight: '200px',
                        background: 'rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <AnimatePresence>
                            {Object.entries(mapState).length === 0 ? (
                                <div style={{ color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>Groups will appear here</div>
                            ) : (
                                Object.entries(mapState).map(([key, group]) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        layout
                                        style={{
                                            border: '1px solid #333',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            background: currentKey === key ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255,255,255,0.02)'
                                        }}
                                    >
                                        <div style={{ color: '#FF6B6B', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Key: "{key}"</div>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            <AnimatePresence>
                                                {group.map((item, idx) => (
                                                    <motion.div
                                                        key={`${key}-${idx}`}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        style={{
                                                            background: 'var(--accent-primary)',
                                                            color: 'white',
                                                            padding: '0.3rem 0.8rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        {item}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
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

export default GroupAnagramsVisualizer;
