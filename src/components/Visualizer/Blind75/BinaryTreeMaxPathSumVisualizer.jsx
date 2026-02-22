import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hardcoded Tree structure for visualizing the problem bounds properly
// representing: [-10, 9, 20, null, null, 15, 7]
const defaultTree = {
    id: 1, val: -10, x: 0, y: 0,
    left: { id: 2, val: 9, x: -80, y: 80, left: null, right: null },
    right: {
        id: 3, val: 20, x: 80, y: 80,
        left: { id: 4, val: 15, x: 40, y: 160, left: null, right: null },
        right: { id: 5, val: 7, x: 120, y: 160, left: null, right: null }
    }
};

const BinaryTreeMaxPathSumVisualizer = () => {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    // Extracted flat list of nodes recursively for easy SVG rendering
    const flatNodes = [];
    const getNodes = (node, parentId = null) => {
        if (!node) return;
        flatNodes.push({ id: node.id, val: node.val, x: node.x, y: node.y, parentId });
        getNodes(node.left, node.id);
        getNodes(node.right, node.id);
    };
    getNodes(defaultTree);

    const initVisualizer = () => {
        const generatedSteps = [];
        let globalMax = -Infinity;

        const dfs = (node) => {
            if (!node) return 0;

            // Push ENTER step
            generatedSteps.push({
                type: 'ENTER',
                node: node.id,
                desc: `Entering node ${node.val}`,
                globalMax
            });

            const leftResult = dfs(node.left);
            const leftMax = Math.max(0, leftResult);

            const rightResult = dfs(node.right);
            const rightMax = Math.max(0, rightResult);

            const currentPathSum = node.val + leftMax + rightMax;

            if (currentPathSum > globalMax) {
                globalMax = currentPathSum;
                generatedSteps.push({
                    type: 'UPDATE_MAX',
                    node: node.id,
                    desc: `Calculated path sum through ${node.val} (left: ${leftMax} + val: ${node.val} + right: ${rightMax}) = ${currentPathSum}. New Global Max!`,
                    globalMax,
                    leftMax,
                    rightMax
                });
            } else {
                generatedSteps.push({
                    type: 'CALCULATE',
                    node: node.id,
                    desc: `Path sum through ${node.val} is ${currentPathSum}. (Global is ${globalMax})`,
                    globalMax,
                    leftMax,
                    rightMax
                });
            }

            const returnVal = node.val + Math.max(leftMax, rightMax);

            generatedSteps.push({
                type: 'RETURN',
                node: node.id,
                desc: `Returning max branch from ${node.val} (val: ${node.val} + max_branch: ${Math.max(leftMax, rightMax)}) = ${returnVal}`,
                globalMax,
                returnVal
            });

            return returnVal;
        };

        dfs(defaultTree);

        generatedSteps.push({
            type: 'DONE',
            node: null,
            desc: `Traversal complete. The absolute maximum path sum is ${globalMax}.`,
            globalMax
        });

        setSteps(generatedSteps);
        setCurrentStep(-1);
        setIsFinished(false);
    };

    useEffect(() => {
        initVisualizer();
        // eslint-disable-next-line
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

    const stepData = currentStep >= 0 ? steps[currentStep] : null;

    const TreeNodeLines = () => {
        return (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'visible' }}>
                {flatNodes.map(node => {
                    if (!node.parentId) return null;
                    const parent = flatNodes.find(n => n.id === node.parentId);

                    // Style lines based on progress
                    const isParentVisited = currentStep >= 0 && flatNodes.some(() => true); // Simplification, could track visited state if desired

                    return (
                        <line
                            key={`line-${node.id}`}
                            x1={`calc(50% + ${parent.x}px)`}
                            y1={`${parent.y + 20}px`}
                            x2={`calc(50% + ${node.x}px)`}
                            y2={`${node.y + 20}px`}
                            stroke={isParentVisited ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"}
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
                    {currentStep === -1 ? 'Start Post-Order Traversal' : 'Next Step'}
                </button>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(231, 76, 60, 0.2)', border: '1px solid #e74c3c', borderRadius: '4px', color: '#e74c3c', fontWeight: 'bold' }}>
                        Global Max: {stepData ? (stepData.globalMax === -Infinity ? '-∞' : stepData.globalMax) : '-∞'}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {stepData ? stepData.desc : 'Click Next Step to begin the Post-Order Traversal.'}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Tree View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', position: 'relative', minHeight: '300px', overflow: 'hidden', padding: '1rem' }}>
                    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <TreeNodeLines />
                        <AnimatePresence>
                            {flatNodes.map((node) => {
                                const isCurrent = stepData?.node === node.id;
                                const isUpdating = stepData?.type === 'UPDATE_MAX' && isCurrent;
                                const isReturning = stepData?.type === 'RETURN' && isCurrent;

                                return (
                                    <motion.div
                                        key={node.id}
                                        animate={{
                                            scale: isCurrent ? (isUpdating ? 1.2 : 1.1) : 1,
                                            boxShadow: isUpdating ? '0 0 20px #e74c3c' : isReturning ? '0 0 15px #f1c40f' : isCurrent ? '0 0 10px #4ECDCA' : '0 0 0px transparent',
                                            borderColor: isUpdating ? '#e74c3c' : isCurrent ? '#4ECDCA' : '#333'
                                        }}
                                        style={{
                                            position: 'absolute',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: '#222',
                                            color: 'white',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold',
                                            border: '3px solid',
                                            zIndex: 2,
                                            y: node.y,
                                            x: `calc(50% + ${node.x}px - 20px)`,
                                        }}
                                    >
                                        {node.val}

                                        {/* Show Return value popout */}
                                        <AnimatePresence>
                                            {isReturning && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 0 }}
                                                    animate={{ opacity: 1, y: -30 }}
                                                    exit={{ opacity: 0 }}
                                                    style={{ position: 'absolute', color: '#f1c40f', fontWeight: 'bold', background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                                >
                                                    ↑ {stepData.returnVal}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* State Variable Panel Sidebar */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Current Node State Details</h4>

                    {stepData && stepData.type !== 'ENTER' && stepData.type !== 'DONE' && stepData.leftMax !== undefined ? (
                        <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444' }}>
                            <div style={{ color: '#4ECDCA', marginBottom: '0.5rem' }}>Left Branch Max (capped at 0): <strong>{stepData.leftMax}</strong></div>
                            <div style={{ color: '#FF6B6B', marginBottom: '0.5rem' }}>Right Branch Max (capped at 0): <strong>{stepData.rightMax}</strong></div>
                            <div style={{ margin: '1rem 0', borderTop: '1px dashed #555' }} />
                            <div style={{ color: 'white', marginBottom: '0.5rem' }}>
                                Arch Sum (Peak at {flatNodes.find(n => n.id === stepData.node)?.val}):
                                <br />
                                <span style={{ color: '#888' }}>{flatNodes.find(n => n.id === stepData.node)?.val} + {stepData.leftMax} + {stepData.rightMax}</span> = <strong>{flatNodes.find(n => n.id === stepData.node)?.val + stepData.leftMax + stepData.rightMax}</strong>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: '#555', fontStyle: 'italic', padding: '1rem', background: '#222', borderRadius: '8px', border: '1px solid #333' }}>
                            State details will appear upon post-order evaluation.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BinaryTreeMaxPathSumVisualizer;
