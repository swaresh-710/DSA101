import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultList1 = [1, 2, 4];
const defaultList2 = [1, 3, 4];

const MergeTwoSortedListsVisualizer = () => {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    const initVisualizer = () => {
        const generatedSteps = [];

        let l1Idx = 0;
        let l2Idx = 0;
        let mergedList = ['D']; // D for Dummy Node

        generatedSteps.push({
            desc: "Initialization: Create a 'Dummy' node. Let 'tail' point to the Dummy node.",
            l1Idx,
            l2Idx,
            mergedList: [...mergedList],
            action: 'INIT',
            activeList: null
        });

        while (l1Idx < defaultList1.length && l2Idx < defaultList2.length) {
            const val1 = defaultList1[l1Idx];
            const val2 = defaultList2[l2Idx];

            generatedSteps.push({
                desc: `Comparing list1[${l1Idx}] (${val1}) with list2[${l2Idx}] (${val2}).`,
                l1Idx,
                l2Idx,
                mergedList: [...mergedList],
                action: 'COMPARE',
                activeList: null
            });

            if (val1 <= val2) {
                mergedList.push(val1);
                generatedSteps.push({
                    desc: `${val1} <= ${val2}. Appending node (${val1}) from list1 to tail. Advancing list1 pointer.`,
                    l1Idx: l1Idx + 1,
                    l2Idx,
                    mergedList: [...mergedList],
                    action: 'APPEND_L1',
                    activeList: 1
                });
                l1Idx++;
            } else {
                mergedList.push(val2);
                generatedSteps.push({
                    desc: `${val1} > ${val2}. Appending node (${val2}) from list2 to tail. Advancing list2 pointer.`,
                    l1Idx,
                    l2Idx: l2Idx + 1,
                    mergedList: [...mergedList],
                    action: 'APPEND_L2',
                    activeList: 2
                });
                l2Idx++;
            }
        }

        if (l1Idx < defaultList1.length) {
            generatedSteps.push({
                desc: `list2 is exhausted. Append remainder of list1 directly to the tail.`,
                l1Idx,
                l2Idx,
                mergedList: [...mergedList],
                action: 'APPEND_REMAINDER',
                activeList: 1
            });
            while (l1Idx < defaultList1.length) {
                mergedList.push(defaultList1[l1Idx]);
                generatedSteps.push({
                    desc: `Appending remaining ${defaultList1[l1Idx]} from list1.`,
                    l1Idx: l1Idx + 1,
                    l2Idx,
                    mergedList: [...mergedList],
                    action: 'APPEND_L1',
                    activeList: 1
                });
                l1Idx++;
            }
        } else if (l2Idx < defaultList2.length) {
            generatedSteps.push({
                desc: `list1 is exhausted. Append remainder of list2 directly to the tail.`,
                l1Idx,
                l2Idx,
                mergedList: [...mergedList],
                action: 'APPEND_REMAINDER',
                activeList: 2
            });
            while (l2Idx < defaultList2.length) {
                mergedList.push(defaultList2[l2Idx]);
                generatedSteps.push({
                    desc: `Appending remaining ${defaultList2[l2Idx]} from list2.`,
                    l1Idx,
                    l2Idx: l2Idx + 1,
                    mergedList: [...mergedList],
                    action: 'APPEND_L2',
                    activeList: 2
                });
                l2Idx++;
            }
        }

        generatedSteps.push({
            desc: "Finished! Return dummy.next as the head of the new sorted list.",
            l1Idx,
            l2Idx,
            mergedList: [...mergedList],
            action: 'DONE',
            activeList: null
        });

        setSteps(generatedSteps);
        setCurrentStep(-1);
        setIsFinished(false);
    };

    useEffect(() => {
        initVisualizer();
    }, []);

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
        l1Idx: 0,
        l2Idx: 0,
        mergedList: [],
        action: 'WAITING',
        desc: 'Click Next Step to begin the merging process.'
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
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

            <div style={{ marginBottom: '1.5rem', minHeight: '3em', color: 'var(--accent-secondary)' }}>
                {stepData.desc}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Source Lists Row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* List 1 */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ color: '#3498db', margin: 0, width: '100px' }}>list1</h4>
                            <div style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>
                                ptr1 = {stepData.l1Idx === defaultList1.length ? 'null' : stepData.l1Idx}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {defaultList1.map((val, idx) => {
                                const isUsed = idx < stepData.l1Idx;
                                const isCurrent = idx === stepData.l1Idx;
                                const isComparing = isCurrent && stepData.action === 'COMPARE';
                                const isAppending = isCurrent && stepData.action === 'APPEND_L1';

                                return (
                                    <React.Fragment key={`l1-${idx}`}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <AnimatePresence>
                                                {isCurrent && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        style={{ color: '#3498db', fontSize: '0.7rem', fontWeight: 'bold' }}
                                                    >
                                                        curr1
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <motion.div
                                                animate={{
                                                    backgroundColor: isAppending ? '#3498db' : isUsed ? '#111' : '#222',
                                                    color: isUsed ? '#555' : isAppending ? '#fff' : '#3498db',
                                                    borderColor: isAppending ? '#2980b9' : isUsed ? '#333' : isComparing ? '#f1c40f' : '#3498db',
                                                    scale: isAppending ? 1.1 : isComparing ? 1.05 : 1,
                                                    boxShadow: isAppending ? '0 0 15px rgba(52, 152, 219, 0.5)' : isComparing ? '0 0 10px rgba(241, 196, 15, 0.3)' : 'none'
                                                }}
                                                style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', opacity: isUsed ? 0.5 : 1 }}
                                            >
                                                {val}
                                            </motion.div>
                                        </div>
                                        {idx < defaultList1.length - 1 && (
                                            <div style={{ color: isUsed ? '#333' : '#3498db', fontSize: '1.2rem', padding: '0 5px', marginTop: '15px', opacity: isUsed ? 0.5 : 1 }}>→</div>
                                        )}
                                        {idx === defaultList1.length - 1 && (
                                            <div style={{ color: isUsed ? '#333' : '#3498db', fontSize: '0.8rem', padding: '0 5px', marginTop: '15px', fontFamily: 'monospace', opacity: isUsed ? 0.5 : 1 }}>→ null</div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* List 2 */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ color: '#e74c3c', margin: 0, width: '100px' }}>list2</h4>
                            <div style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>
                                ptr2 = {stepData.l2Idx === defaultList2.length ? 'null' : stepData.l2Idx}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {defaultList2.map((val, idx) => {
                                const isUsed = idx < stepData.l2Idx;
                                const isCurrent = idx === stepData.l2Idx;
                                const isComparing = isCurrent && stepData.action === 'COMPARE';
                                const isAppending = isCurrent && stepData.action === 'APPEND_L2';

                                return (
                                    <React.Fragment key={`l2-${idx}`}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <AnimatePresence>
                                                {isCurrent && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        style={{ color: '#e74c3c', fontSize: '0.7rem', fontWeight: 'bold' }}
                                                    >
                                                        curr2
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <motion.div
                                                animate={{
                                                    backgroundColor: isAppending ? '#e74c3c' : isUsed ? '#111' : '#222',
                                                    color: isUsed ? '#555' : isAppending ? '#fff' : '#e74c3c',
                                                    borderColor: isAppending ? '#c0392b' : isUsed ? '#333' : isComparing ? '#f1c40f' : '#e74c3c',
                                                    scale: isAppending ? 1.1 : isComparing ? 1.05 : 1,
                                                    boxShadow: isAppending ? '0 0 15px rgba(231, 76, 60, 0.5)' : isComparing ? '0 0 10px rgba(241, 196, 15, 0.3)' : 'none'
                                                }}
                                                style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', opacity: isUsed ? 0.5 : 1 }}
                                            >
                                                {val}
                                            </motion.div>
                                        </div>
                                        {idx < defaultList2.length - 1 && (
                                            <div style={{ color: isUsed ? '#333' : '#e74c3c', fontSize: '1.2rem', padding: '0 5px', opacity: isUsed ? 0.5 : 1 }}>→</div>
                                        )}
                                        {idx === defaultList2.length - 1 && (
                                            <div style={{ color: isUsed ? '#333' : '#e74c3c', fontSize: '0.8rem', padding: '0 5px', fontFamily: 'monospace', opacity: isUsed ? 0.5 : 1 }}>→ null</div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Merged Target Row */}
                <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444', minHeight: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ color: '#2ecc71', margin: 0, width: '150px' }}>Merged List</h4>
                        <div style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>
                            tail pointing at latest merged node
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflowX: 'auto', paddingBottom: '1rem', minHeight: '75px' }}>
                        <AnimatePresence initial={false}>
                            {stepData.mergedList.map((val, idx) => {
                                const isRecent = idx === stepData.mergedList.length - 1;
                                const isDummy = val === 'D';

                                return (
                                    <React.Fragment key={`merge-${idx}`}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0, x: -20 }}
                                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: isDummy ? '#333' : '#2ecc71',
                                                    color: isDummy ? '#fff' : '#111',
                                                    border: '2px solid',
                                                    borderColor: isDummy ? '#555' : '#27ae60',
                                                    borderRadius: '8px',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem',
                                                    boxShadow: isRecent ? '0 0 15px rgba(46, 204, 113, 0.4)' : 'none'
                                                }}
                                            >
                                                {val}
                                            </motion.div>
                                            <AnimatePresence>
                                                {isRecent && stepData.action !== 'WAITING' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        style={{ color: '#2ecc71', fontSize: '0.7rem', fontWeight: 'bold', position: 'absolute', marginTop: '60px' }}
                                                    >
                                                        tail
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {idx < stepData.mergedList.length - 1 && (
                                            <motion.div
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                style={{ color: '#2ecc71', fontSize: '1.2rem', padding: '0 5px' }}
                                            >
                                                →
                                            </motion.div>
                                        )}
                                        {idx === stepData.mergedList.length - 1 && isFinished && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                style={{ color: '#2ecc71', fontSize: '0.8rem', padding: '0 5px', fontFamily: 'monospace' }}
                                            >
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
        </div>
    );
};

export default MergeTwoSortedListsVisualizer;
