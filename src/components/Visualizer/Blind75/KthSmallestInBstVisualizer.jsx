import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Example BST: 
//        5
//      /   \
//     3     6
//    / \
//   2   4
//  /
// 1
const defaultBST = {
    id: 'n5', val: 5, x: 0, y: 0,
    left: {
        id: 'n3', val: 3, x: -80, y: 70,
        left: {
            id: 'n2', val: 2, x: -140, y: 140,
            left: { id: 'n1', val: 1, x: -180, y: 210, left: null, right: null },
            right: null
        },
        right: { id: 'n4', val: 4, x: -20, y: 140, left: null, right: null }
    },
    right: { id: 'n6', val: 6, x: 80, y: 70, left: null, right: null }
};

const KthSmallestInBstVisualizer = () => {
    const [kValue, setKValue] = useState(3);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    // Flat nodes map for rendering SVG
    const flatNodes = [];
    const getNodes = (node, parentId = null) => {
        if (!node) return;
        flatNodes.push({ id: node.id, val: node.val, x: node.x, y: node.y, parentId });
        getNodes(node.left, node.id);
        getNodes(node.right, node.id);
    };
    getNodes(defaultBST);

    const initVisualizer = () => {
        const generatedSteps = [];
        let count = 0;
        let found = false;
        const visitedList = [];

        const inorder = (node) => {
            if (!node || found) return;

            // Go Left
            generatedSteps.push({
                type: 'TRAVERSE',
                node: node.id,
                desc: `Traversing left child of ${node.val}...`,
                count,
                visitedList: [...visitedList]
            });

            inorder(node.left);

            if (found) return;

            // Process Node
            count++;
            visitedList.push(node.val);

            if (count === kValue) {
                found = true;
                generatedSteps.push({
                    type: 'FOUND',
                    node: node.id,
                    desc: `Processed ${node.val}. Count is ${count}, which equals k (${kValue})! We found our answer.`,
                    count,
                    visitedList: [...visitedList]
                });
                return;
            } else {
                generatedSteps.push({
                    type: 'PROCESS',
                    node: node.id,
                    desc: `Processed ${node.val}. Count is now ${count}. Not our target yet.`,
                    count,
                    visitedList: [...visitedList]
                });
            }

            // Go Right
            generatedSteps.push({
                type: 'TRAVERSE',
                node: node.id,
                desc: `Traversing right child of ${node.val}...`,
                count,
                visitedList: [...visitedList]
            });

            inorder(node.right);
        };

        inorder(defaultBST);

        if (!found) {
            generatedSteps.push({
                type: 'DONE',
                node: null,
                desc: `Traversal complete. k (${kValue}) is larger than the number of nodes!`,
                count,
                visitedList: [...visitedList]
            });
        }

        setSteps(generatedSteps);
        setCurrentStep(-1);
        setIsFinished(false);
    };

    useEffect(() => {
        initVisualizer();
        // eslint-disable-next-line
    }, [kValue]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const nextIdx = currentStep + 1;
            setCurrentStep(nextIdx);
            if (nextIdx === steps.length - 1 || steps[nextIdx].type === 'FOUND' || steps[nextIdx].type === 'DONE') {
                setIsFinished(true);
            }
        }
    };

    const reset = () => {
        setCurrentStep(-1);
        setIsFinished(false);
    };

    const stepData = currentStep >= 0 ? steps[currentStep] : null;

    const TreeNodeLines = () => {
        return (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'visible' }}>
                {flatNodes.map(node => {
                    if (!node.parentId) return null;
                    const parent = flatNodes.find(n => n.id === node.parentId);

                    return (
                        <line
                            key={`line-${node.id}`}
                            x1={`calc(50% + ${parent.x}px)`}
                            y1={`${parent.y + 20}px`}
                            x2={`calc(50% + ${node.x}px)`}
                            y2={`${node.y + 20}px`}
                            stroke="rgba(255, 255, 255, 0.15)"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label>Value of k:</label>
                    <input
                        type="number"
                        min="1"
                        max="6"
                        value={kValue}
                        onChange={(e) => setKValue(parseInt(e.target.value) || 1)}
                        disabled={currentStep > -1}
                        style={{ width: '60px', padding: '0.4rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>

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
                    {currentStep === -1 ? 'Start In-Order Traversal' : 'Next Step'}
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {stepData ? stepData.desc : `Set a value for k and click Start to begin finding the ${kValue}th smallest element.`}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Tree View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', position: 'relative', minHeight: '350px', overflow: 'hidden', padding: '1rem' }}>
                    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <TreeNodeLines />
                        <AnimatePresence>
                            {flatNodes.map((node) => {
                                const isCurrent = stepData?.node === node.id;
                                const isFound = stepData?.type === 'FOUND' && isCurrent;
                                const isProcessed = stepData?.visitedList?.includes(node.val);

                                return (
                                    <motion.div
                                        key={node.id}
                                        animate={{
                                            scale: isFound ? 1.3 : isCurrent ? 1.1 : 1,
                                            boxShadow: isFound ? '0 0 20px #f1c40f' : isCurrent ? '0 0 10px #4ECDCA' : '0 0 0px transparent',
                                            borderColor: isFound ? '#f1c40f' : isCurrent ? '#4ECDCA' : isProcessed ? '#4ECDCA' : '#333',
                                            backgroundColor: isFound ? 'rgba(241, 196, 15, 0.2)' : isProcessed ? 'rgba(78, 205, 196, 0.1)' : '#222',
                                            color: isFound ? '#f1c40f' : isProcessed ? '#4ECDCA' : 'white'
                                        }}
                                        style={{
                                            position: 'absolute',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold',
                                            border: '3px solid',
                                            zIndex: isFound || isCurrent ? 3 : 2,
                                            y: node.y + 40, // offset down a bit for aesthetics 
                                            x: `calc(50% + ${node.x}px - 20px)`,
                                        }}
                                    >
                                        {node.val}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* State Variables Sidebar */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Current Traversal State</h4>

                    <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1.5rem', border: '1px solid #444', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Target (k):</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f1c40f' }}>{kValue}</div>
                        </div>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Nodes Extracted (count):</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stepData?.count === kValue ? '#f1c40f' : '#4ECDCA' }}>
                                {stepData ? stepData.count : 0}
                            </div>
                        </div>

                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Sorted Visited Array:</span>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem', minHeight: '32px' }}>
                                {stepData ? stepData.visitedList.map((val, idx) => (
                                    <motion.div
                                        key={`vk-${idx}`}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            background: idx === kValue - 1 ? 'rgba(241, 196, 15, 0.2)' : 'rgba(78, 205, 196, 0.2)',
                                            color: idx === kValue - 1 ? '#f1c40f' : '#4ECDCA',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            border: `1px solid ${idx === kValue - 1 ? 'rgba(241, 196, 15, 0.4)' : 'rgba(78, 205, 196, 0.4)'}`
                                        }}
                                    >
                                        {val}
                                    </motion.div>
                                )) : <span style={{ color: '#555', fontStyle: 'italic', fontSize: '0.9rem' }}>[Empty]</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KthSmallestInBstVisualizer;
