import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const examples = [
    { name: "Remove Middle", list: [1, 2, 3, 4, 5], n: 2 },
    { name: "Remove Head", list: [1, 2], n: 2 },
    { name: "Remove Only Node", list: [1], n: 1 },
];

const RemoveNthNodeVisualizer = () => {
    const [activeExampleIdx, setActiveExampleIdx] = useState(0);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    const activeList = examples[activeExampleIdx].list;
    const targetN = examples[activeExampleIdx].n;

    const initVisualizer = () => {
        const generatedSteps = [];
        const listWithDummy = ['D', ...activeList];

        // Initial setup
        generatedSteps.push({
            desc: `Initialization: Attach a Dummy Node. Left and Right pointers start at the Dummy Node. We want to remove the ${targetN}th node from the end.`,
            left: 0,
            right: 0,
            listState: [...listWithDummy],
            action: 'INIT',
            targetN
        });

        // Move Right pointer n steps ahead
        let right = 0;
        let left = 0;

        for (let i = 0; i < targetN; i++) {
            right++;
            generatedSteps.push({
                desc: `Phase 1: Move Right pointer ${targetN} steps ahead. (Step ${i + 1}/${targetN})`,
                left,
                right,
                listState: [...listWithDummy],
                action: 'MOVE_RIGHT',
                targetN
            });
        }

        // Move both pointers until right reaches the last node
        while (right < listWithDummy.length - 1) {
            generatedSteps.push({
                desc: `Phase 2: Right is not at the end. Move both Left and Right pointers one step.`,
                left,
                right,
                listState: [...listWithDummy],
                action: 'EVALUATE',
                targetN
            });

            left++;
            right++;

            generatedSteps.push({
                desc: `Left and Right moved forward.`,
                left,
                right,
                listState: [...listWithDummy],
                action: 'MOVE_BOTH',
                targetN
            });
        }

        generatedSteps.push({
            desc: `Phase 3: Right reached the end of the list. The node after Left is the target node to delete!`,
            left,
            right,
            listState: [...listWithDummy],
            action: 'FOUND_TARGET',
            targetN
        });

        // Remove node
        const targetNodeIdx = left + 1;
        const targetVal = listWithDummy[targetNodeIdx];

        generatedSteps.push({
            desc: `Removing target node (${targetVal}). Update pointer: Left.next = Left.next.next.`,
            left,
            right,
            listState: [...listWithDummy],
            action: 'DELETE',
            targetNodeIdx,
            targetN
        });

        // Final state
        const finalList = [...listWithDummy];
        finalList.splice(targetNodeIdx, 1); // physically remove from array to show

        generatedSteps.push({
            desc: `Deletion complete! Return dummy.next as the new head.`,
            left,
            right: right > targetNodeIdx ? right - 1 : right,
            listState: [...finalList],
            action: 'DONE',
            targetN
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
        listState: ['D', ...activeList],
        left: 0,
        right: 0,
        desc: `Click Next Step to initialize pointers.`
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

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem 1.5rem', borderRadius: '8px', border: '1px solid #333', minHeight: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '2rem' }}>
                    <AnimatePresence>
                        {stepData.listState.map((val, idx) => {
                            const isDummy = val === 'D';
                            const isLeft = idx === stepData.left;
                            const isRight = idx === stepData.right;
                            const isTarget = stepData.action === 'DELETE' && idx === stepData.targetNodeIdx;

                            return (
                                <React.Fragment key={`n-${val}-${idx}`}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '60px' }}>
                                        <div style={{ minHeight: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            {isLeft && <motion.div layoutId="leftPtr" style={{ color: '#e74c3c', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>Left</motion.div>}
                                            {isRight && <motion.div layoutId="rightPtr" style={{ color: '#3498db', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>Right</motion.div>}
                                        </div>

                                        <motion.div
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{
                                                backgroundColor: isTarget ? '#e74c3c' : isDummy ? '#333' : '#222',
                                                borderColor: isTarget ? '#c0392b' : isLeft ? '#e74c3c' : isRight ? '#3498db' : '#444',
                                                color: isDummy ? '#888' : '#fff',
                                                scale: isTarget ? 1.2 : isLeft || isRight ? 1.1 : 1,
                                                opacity: 1
                                            }}
                                            exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
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
                                                zIndex: 2,
                                                boxShadow: isTarget ? '0 0 20px rgba(231, 76, 60, 0.8)' : 'none'
                                            }}
                                        >
                                            {val}
                                        </motion.div>
                                    </div>

                                    {idx < stepData.listState.length - 1 && (
                                        <motion.div layout style={{ color: '#888', fontSize: '1.2rem', marginTop: '25px', zIndex: 1, position: 'relative' }}>
                                            {stepData.action === 'DELETE' && idx === stepData.left ? (
                                                <svg width="80" height="40" style={{ position: 'absolute', left: '-10px', top: '-15px', pointerEvents: 'none', zIndex: 3 }}>
                                                    <motion.path
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        d="M 10 20 Q 40 -20 70 20"
                                                        fill="transparent"
                                                        stroke="#e74c3c"
                                                        strokeWidth="3"
                                                        markerEnd="url(#arrowhead)"
                                                    />
                                                    <defs>
                                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                            <polygon points="0 0, 10 3.5, 0 7" fill="#e74c3c" />
                                                        </marker>
                                                    </defs>
                                                </svg>
                                            ) : (
                                                <span style={{ opacity: (stepData.action === 'DELETE' && idx === stepData.left) ? 0.2 : 1 }}>→</span>
                                            )}
                                        </motion.div>
                                    )}
                                    {idx === stepData.listState.length - 1 && (
                                        <motion.div layout style={{ color: '#555', fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '30px' }}>
                                            → null
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RemoveNthNodeVisualizer;
