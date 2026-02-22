import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const examples = [
    { name: "Even Length", list: [1, 2, 3, 4] },
    { name: "Odd Length", list: [1, 2, 3, 4, 5] },
];

const ReorderListVisualizer = () => {
    const [activeExampleIdx, setActiveExampleIdx] = useState(1);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    const activeList = examples[activeExampleIdx].list;

    const initVisualizer = () => {
        const generatedSteps = [];
        const n = activeList.length;

        // Step 1: Find middle
        let slow = 0;
        let fast = 1;

        generatedSteps.push({
            phase: 'FIND_MIDDLE',
            desc: "Step 1: Use Fast & Slow pointers to find the middle of the Linked List.",
            slow, fast,
            listState: [...activeList],
            splitAt: null,
            firstHalf: null,
            secondHalf: null,
            merged: null
        });

        // Fast pointer goes 2x the speed
        while (fast < n && fast + 1 < n) {
            slow++;
            fast += 2;
            generatedSteps.push({
                phase: 'FIND_MIDDLE',
                desc: `Slow advances by 1. Fast advances by 2.`,
                slow, fast,
                listState: [...activeList],
                splitAt: null,
                firstHalf: null,
                secondHalf: null,
                merged: null
            });
        }

        // Split
        const splitAt = slow;
        const firstHalf = activeList.slice(0, splitAt + 1);
        let secondHalf = activeList.slice(splitAt + 1);

        generatedSteps.push({
            phase: 'SPLIT',
            desc: `Slow pointer found the middle! Split the list after index ${splitAt}.`,
            slow: null, fast: null,
            listState: null,
            splitAt,
            firstHalf: [...firstHalf],
            secondHalf: [...secondHalf],
            merged: null
        });

        // Step 2: Reverse second half
        generatedSteps.push({
            phase: 'REVERSE',
            desc: "Step 2: Reverse the second half of the list.",
            slow: null, fast: null,
            listState: null,
            splitAt,
            firstHalf: [...firstHalf],
            secondHalf: [...secondHalf], // Initially not reversed
            merged: null
        });

        secondHalf.reverse();

        generatedSteps.push({
            phase: 'REVERSED',
            desc: "Second half reversed!",
            slow: null, fast: null,
            listState: null,
            splitAt,
            firstHalf: [...firstHalf],
            secondHalf: [...secondHalf], // Reversed
            merged: null
        });

        // Step 3: Merge
        generatedSteps.push({
            phase: 'MERGE_START',
            desc: "Step 3: Merge the two halves alternatingly.",
            slow: null, fast: null,
            listState: null,
            splitAt,
            firstHalf: [...firstHalf],
            secondHalf: [...secondHalf],
            merged: [],
            m1: 0, m2: 0
        });

        let merged = [];
        let m1 = 0;
        let m2 = 0;

        while (m1 < firstHalf.length || m2 < secondHalf.length) {
            if (m1 < firstHalf.length) {
                merged.push(firstHalf[m1]);
                generatedSteps.push({
                    phase: 'MERGING',
                    desc: `Take element from first half.`,
                    slow: null, fast: null,
                    listState: null,
                    splitAt,
                    firstHalf: [...firstHalf],
                    secondHalf: [...secondHalf],
                    merged: [...merged],
                    m1: m1 + 1, m2
                });
                m1++;
            }
            if (m2 < secondHalf.length) {
                merged.push(secondHalf[m2]);
                generatedSteps.push({
                    phase: 'MERGING',
                    desc: `Take element from second half.`,
                    slow: null, fast: null,
                    listState: null,
                    splitAt,
                    firstHalf: [...firstHalf],
                    secondHalf: [...secondHalf],
                    merged: [...merged],
                    m1, m2: m2 + 1
                });
                m2++;
            }
        }

        generatedSteps.push({
            phase: 'DONE',
            desc: "Singly Linked List is completely reordered.",
            slow: null, fast: null,
            listState: null,
            splitAt,
            firstHalf: null,
            secondHalf: null,
            merged: [...merged]
        });

        setSteps(generatedSteps);
        setCurrentStep(-1);
        setIsFinished(false);
    };

    useEffect(() => {
        initVisualizer();
        // eslint-disable-next-line
    }, [activeExampleIdx]);

    const reset = () => {
        setCurrentStep(-1);
        setIsFinished(false);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const nextIdx = currentStep + 1;
            setCurrentStep(nextIdx);
            if (nextIdx === steps.length - 1) setIsFinished(true);
        }
    };

    const stepData = currentStep >= 0 ? steps[currentStep] : {
        phase: 'WAITING',
        listState: activeList,
        desc: "Click Next Step to find the middle."
    };

    const renderNodeList = (listArr, activeIndexPrimary, activeIndexSecondary, fadeThreshold = -1, variant = 'default') => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '10px 0' }}>
                {listArr.map((val, idx) => {
                    const isFaded = fadeThreshold !== -1 && idx < fadeThreshold;
                    const isPrimary = idx === activeIndexPrimary;
                    const isSecondary = idx === activeIndexSecondary;

                    let bgColor = '#222';
                    let borderColor = '#444';
                    let textColor = '#fff';

                    if (variant === 'merged') {
                        bgColor = '#2ecc71';
                        borderColor = '#27ae60';
                        textColor = '#111';
                    } else if (variant === 'firstHalf' && isFaded) {
                        bgColor = '#111';
                        textColor = '#555';
                    } else if (variant === 'secondHalf' && isFaded) {
                        bgColor = '#111';
                        textColor = '#555';
                    }

                    if (isPrimary && variant !== 'merged') {
                        bgColor = '#e74c3c';
                        borderColor = '#c0392b';
                        textColor = '#fff';
                    }
                    if (isSecondary && variant !== 'merged') {
                        bgColor = '#3498db';
                        borderColor = '#2980b9';
                        textColor = '#fff';
                    }

                    return (
                        <React.Fragment key={`node-${variant}-${idx}-${val}`}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                <motion.div
                                    animate={{
                                        backgroundColor: bgColor,
                                        borderColor: borderColor,
                                        scale: isPrimary || isSecondary ? 1.1 : 1,
                                    }}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px solid',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        color: textColor,
                                        opacity: isFaded ? 0.3 : 1
                                    }}
                                >
                                    {val}
                                </motion.div>
                                <div style={{ minHeight: '15px' }}>
                                    {isPrimary && <span style={{ color: '#e74c3c', fontSize: '0.7rem', fontWeight: 'bold' }}>Slow</span>}
                                    {isSecondary && <span style={{ color: '#3498db', fontSize: '0.7rem', fontWeight: 'bold' }}>Fast</span>}
                                </div>
                            </div>
                            {idx < listArr.length - 1 && (
                                <div style={{ color: isFaded ? '#333' : '#888', fontSize: '1.2rem' }}>→</div>
                            )}
                            {idx === listArr.length - 1 && (
                                <div style={{ color: '#555', fontSize: '0.8rem', fontFamily: 'monospace' }}>→ null</div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {examples.map((ex, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveExampleIdx(idx)}
                            style={{
                                padding: '0.4rem 1rem',
                                background: activeExampleIdx === idx ? 'var(--accent-primary)' : '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                color: activeExampleIdx === idx ? '#111' : 'white',
                                fontWeight: 'bold',
                                opacity: currentStep > -1 ? 0.5 : 1
                            }}
                            disabled={currentStep > -1}
                        >
                            {ex.name}
                        </button>
                    ))}
                </div>
                <div style={{ paddingLeft: '1rem', borderLeft: '1px solid #444', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={reset}
                        style={{ padding: '0.4rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                    >
                        Reset Visualizer
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={isFinished}
                        style={{ padding: '0.4rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1, color: 'white', fontWeight: 'bold' }}
                    >
                        {currentStep === -1 ? 'Start Algorithm' : 'Next Step'}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '3em', color: 'var(--accent-secondary)' }}>
                {stepData.desc}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Find Middle View */}
                {(stepData.phase === 'WAITING' || stepData.phase === 'FIND_MIDDLE' || stepData.phase === 'SPLIT') && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                        <h4 style={{ color: '#aaa', margin: '0 0 1rem 0' }}>Step 1: Finding the Middle</h4>
                        {renderNodeList(stepData.listState || activeList, stepData.slow, stepData.fast)}
                    </div>
                )}

                {/* Reverse View */}
                {(stepData.phase === 'REVERSE' || stepData.phase === 'REVERSED' || stepData.phase === 'MERGE_START' || stepData.phase === 'MERGING') && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                            <h4 style={{ color: '#aaa', margin: '0 0 1rem 0' }}>First Half</h4>
                            {renderNodeList(stepData.firstHalf, -1, -1, stepData.m1, 'firstHalf')}
                        </div>
                        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(231, 76, 60, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
                            <h4 style={{ color: '#e74c3c', margin: '0 0 1rem 0' }}>{stepData.phase === 'REVERSE' ? 'Second Half (Unreversed)' : 'Second Half (Reversed)'}</h4>
                            {renderNodeList(stepData.secondHalf, -1, -1, stepData.m2, 'secondHalf')}
                        </div>
                    </div>
                )}

                {/* Merge View */}
                {(stepData.phase === 'MERGE_START' || stepData.phase === 'MERGING' || stepData.phase === 'DONE') && (
                    <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444' }}>
                        <h4 style={{ color: '#2ecc71', margin: '0 0 1rem 0' }}>Reordered List</h4>
                        <div style={{ minHeight: '80px' }}>
                            {stepData.merged?.length > 0 ? (
                                renderNodeList(stepData.merged, -1, -1, -1, 'merged')
                            ) : (
                                <div style={{ color: '#555', fontStyle: 'italic', paddingTop: '10px' }}>Merged list is building...</div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReorderListVisualizer;
