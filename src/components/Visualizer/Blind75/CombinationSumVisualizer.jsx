import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CombinationSumVisualizer = () => {
    const [candidates, setCandidates] = useState([2, 3, 6, 7]);
    const [target, setTarget] = useState(7);
    const [steps, setSteps] = useState([]); // Array of states to visualize
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Generate steps for visualization
    useEffect(() => {
        const newSteps = [];
        const backtrack = (remain, combo, start) => {
            // Record state: checking current combo
            newSteps.push({
                type: 'check',
                combo: [...combo],
                remain,
                msg: `Checking combo: [${combo.join(', ')}]. Remaining target: ${remain}.`
            });

            if (remain === 0) {
                newSteps.push({
                    type: 'found',
                    combo: [...combo],
                    remain,
                    msg: `Found valid combination! [${combo.join(', ')}]`
                });
                return;
            } else if (remain < 0) {
                newSteps.push({
                    type: 'backtrack',
                    combo: [...combo],
                    remain,
                    msg: `Exceeded target. Backtracking.`
                });
                return;
            }

            for (let i = start; i < candidates.length; i++) {
                combo.push(candidates[i]);
                newSteps.push({
                    type: 'add',
                    combo: [...combo],
                    candidate: candidates[i],
                    remain: remain - candidates[i],
                    msg: `Adding ${candidates[i]}. New remain: ${remain - candidates[i]}.`
                });

                backtrack(remain - candidates[i], combo, i); // Allow reusing same element

                combo.pop(); // Backtrack
                newSteps.push({
                    type: 'pop',
                    combo: [...combo],
                    remain: remain, // This might be tricky to visualize exact "remain" after pop without context stack, but conceptually we are back to 'remain'
                    msg: `Popped last element. Back to [${combo.join(', ')}].`
                });
            }
        };

        // Sort candidates needed? Leetcode problem doesn't require, but good for consistent order
        // candidates.sort((a,b) => a-b); 

        backtrack(target, [], 0);
        newSteps.push({ type: 'finish', msg: 'Finished searching.' });
        setSteps(newSteps);
        setCurrentStep(0);
        setIsFinished(false);
    }, [candidates, target]);

    useEffect(() => {
        let timer;
        if (isPlaying && !isFinished) {
            timer = setInterval(() => {
                handleNext();
            }, 800); // Auto-play speed
        }
        return () => clearInterval(timer);
    }, [isPlaying, isFinished, currentStep]);


    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            if (steps[currentStep + 1].type === 'finish') {
                setIsFinished(true);
                setIsPlaying(false);
            }
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsFinished(false);
        setIsPlaying(false);
    };

    const currentData = steps[currentStep] || { combo: [], msg: '', type: 'init' };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {isPlaying ? 'Pause' : isFinished ? 'Restart' : 'Auto Play'}
                </button>
                <button
                    onClick={handleNext}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: '#444', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    Step
                </button>
                <button
                    onClick={handleReset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Target:</label>
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                        min={1} max={20}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', height: '3rem', color: 'var(--accent-secondary)' }}>
                {currentData.msg}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Candidates */}
                <div>
                    <div style={{ color: '#888', marginBottom: '0.5rem' }}>Candidates:</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {candidates.map(c => (
                            <div key={c} style={{ padding: '0.5rem', background: '#333', borderRadius: '4px' }}>{c}</div>
                        ))}
                    </div>
                </div>

                {/* Current Combination */}
                <div>
                    <div style={{ color: '#888', marginBottom: '0.5rem' }}>Current Path:</div>
                    <div style={{ display: 'flex', gap: '0.5rem', minHeight: '50px', alignItems: 'center' }}>
                        <AnimatePresence>
                            {currentData.combo.map((val, idx) => (
                                <motion.div
                                    key={`${val}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                                    style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '50%',
                                        background: currentData.type === 'found' ? 'var(--accent-primary)' : currentData.type === 'backtrack' ? '#e74c3c' : '#3498db',
                                        color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {val}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {currentData.combo.length === 0 && <span style={{ color: '#555', fontStyle: 'italic' }}>(Empty)</span>}
                    </div>
                </div>

                {/* Total */}
                <div>
                    <div style={{ color: '#888', marginBottom: '0.5rem' }}>Current Sum:</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {currentData.combo.reduce((a, b) => a + b, 0)}
                        <span style={{ fontSize: '1rem', color: '#666', marginLeft: '10px' }}>
                            (Target: {target})
                        </span>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default CombinationSumVisualizer;
