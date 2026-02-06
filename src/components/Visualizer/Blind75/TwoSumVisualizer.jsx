import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TwoSumVisualizer = () => {
    const [array, setArray] = useState([2, 7, 11, 15]);
    const [target, setTarget] = useState(9);
    const [mapState, setMapState] = useState({}); // { value: index }
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [foundIndices, setFoundIndices] = useState([]);
    const [message, setMessage] = useState('Click Start to begin.');
    const [isFinished, setIsFinished] = useState(false);
    const [algoMode, setAlgoMode] = useState('HASH_MAP'); // 'BRUTE_FORCE', 'HASH_MAP'

    const reset = () => {
        setMapState({});
        setCurrentIndex(-1);
        setFoundIndices([]);
        setMessage('Ready to search.');
        setIsFinished(false);
    };

    const handleStep = () => {
        if (isFinished) return;

        if (currentIndex === -1) {
            setCurrentIndex(0);
            setMessage(`Starting search for target ${target}...`);
            return;
        }

        if (algoMode === 'HASH_MAP') {
            const idx = currentIndex;
            const val = array[idx];
            const complement = target - val;

            setMessage(`Checking index ${idx} (Value: ${val})... Need complement ${complement}.`);

            // Check map
            if (mapState.hasOwnProperty(complement)) {
                // Found!
                const complementIndex = mapState[complement];
                setFoundIndices([complementIndex, idx]);
                setMessage(`Found! ${val} + ${complement} = ${target}. Indices: [${complementIndex}, ${idx}]`);
                setIsFinished(true);
            } else {
                // Not found, add to map
                const newMap = { ...mapState };
                newMap[val] = idx;
                setMapState(newMap);

                if (idx + 1 < array.length) {
                    setCurrentIndex(idx + 1);
                } else {
                    setMessage('Reached end of array. No solution found.');
                    setIsFinished(true);
                }
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            {/* Controls */}
            <div className="visualizer-controls">
                <select
                    value={algoMode}
                    onChange={(e) => { setAlgoMode(e.target.value); reset(); }}
                    style={{ padding: '0.5rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    <option value="HASH_MAP">Hash Map (O(n))</option>
                    {/* <option value="BRUTE_FORCE">Brute Force (O(n²))</option> */}
                </select>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Target:</label>
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => { setTarget(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '60px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
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

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                {/* Array View */}
                <div>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Array (nums)</h4>
                    <div className="responsive-flex" style={{ gap: '10px' }}>
                        {array.map((val, i) => {
                            const isCurrent = i === currentIndex;
                            const isFound = foundIndices.includes(i);
                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: isCurrent || isFound ? 1.1 : 1,
                                        borderColor: isFound ? 'var(--accent-primary)' : isCurrent ? '#FF6B6B' : 'transparent',
                                        backgroundColor: isFound ? 'rgba(78, 205, 196, 0.2)' : '#222'
                                    }}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px solid transparent',
                                        borderRadius: '8px',
                                        background: '#222',
                                        fontWeight: 'bold',
                                        position: 'relative'
                                    }}
                                >
                                    {val}
                                    <div style={{ position: 'absolute', top: '-20px', fontSize: '0.7rem', color: '#666' }}>{i}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Hash Map View */}
                <div style={{ width: '100%', maxWidth: '300px' }}>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Hash Map (Value {'->'} Index)</h4>
                    <div style={{
                        border: '1px solid #444',
                        borderRadius: '8px',
                        padding: '1rem',
                        minWidth: '200px',
                        minHeight: '100px',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <AnimatePresence>
                            {Object.entries(mapState).length === 0 ? (
                                <div style={{ color: '#555', fontStyle: 'italic' }}>Empty</div>
                            ) : (
                                Object.entries(mapState).map(([key, val]) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #333', paddingBottom: '2px' }}
                                    >
                                        <span style={{ color: '#aaa' }}>{key}</span>
                                        <span style={{ color: 'var(--accent-primary)' }}>{val}</span>
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

export default TwoSumVisualizer;
