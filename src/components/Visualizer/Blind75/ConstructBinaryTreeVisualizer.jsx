import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultPreorder = [3, 9, 20, 15, 7];
const defaultInorder = [9, 3, 15, 20, 7];

const ConstructBinaryTreeVisualizer = () => {
    const [preorderStr, setPreorderStr] = useState(defaultPreorder.join(','));
    const [inorderStr, setInorderStr] = useState(defaultInorder.join(','));

    const [preorder, setPreorder] = useState(defaultPreorder);
    const [inorder, setInorder] = useState(defaultInorder);

    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [treeNodes, setTreeNodes] = useState([]); // Flat array of nodes to render
    const [isFinished, setIsFinished] = useState(false);

    // Parse arrays and generate steps
    const initVisualizer = () => {
        let preArr, inArr;
        try {
            preArr = preorderStr.split(',').map(s => parseInt(s.trim(), 10));
            inArr = inorderStr.split(',').map(s => parseInt(s.trim(), 10));

            if (preArr.length !== inArr.length || preArr.some(isNaN) || inArr.some(isNaN)) {
                setMessage("Error: Invalid input arrays. Please enter valid comma-separated integers of same length.");
                return;
            }
        } catch (e) {
            setMessage("Error parsing input.");
            return;
        }

        setPreorder(preArr);
        setInorder(inArr);

        const newSteps = [];
        let preIndex = 0;

        // Simulating the recursion to generate steps
        const buildStep = (inStart, inEnd, x, y, level, parentId = null, isLeft = false) => {
            if (inStart > inEnd) return null;

            const val = preArr[preIndex];
            const pIndex = preIndex; // capture current preIndex
            preIndex++;

            const id = `node-${val}-${pIndex}`;
            let inRoot = inStart;
            for (let i = inStart; i <= inEnd; i++) {
                if (inArr[i] === val) {
                    inRoot = i;
                    break;
                }
            }

            // Step 1: Select root from preorder
            newSteps.push({
                type: 'SELECT',
                val,
                preIndex: pIndex,
                inStart,
                inEnd,
                inRoot,
                desc: `Select ${val} from preorder as root for the current subtree.`,
                nodeData: { id, val, x, y, level, parentId, isLeft }
            });

            // Calculate child position offsets
            const xOffset = 120 / (level + 1);

            // Left child
            const leftChild = buildStep(inStart, inRoot - 1, x - xOffset, y + 60, level + 1, id, true);

            // Right child
            const rightChild = buildStep(inRoot + 1, inEnd, x + xOffset, y + 60, level + 1, id, false);

            return { id, val, leftChild, rightChild };
        };

        buildStep(0, inArr.length - 1, 0, 0, 0);

        setSteps(newSteps);
        setCurrentStep(-1);
        setTreeNodes([]);
        setIsFinished(false);
        setMessage("Ready to construct the tree.");
    };

    const [message, setMessage] = useState('Click Next to start.');

    useEffect(() => {
        initVisualizer();
        // eslint-disable-next-line
    }, []);

    const reset = () => {
        initVisualizer();
    };

    const handleNext = () => {
        if (currentStep + 1 < steps.length) {
            const nextStepIdx = currentStep + 1;
            const step = steps[nextStepIdx];

            if (step.type === 'SELECT') {
                setTreeNodes(prev => [...prev, step.nodeData]);
                setMessage(step.desc);
            }

            setCurrentStep(nextStepIdx);

            if (nextStepIdx === steps.length - 1) {
                setIsFinished(true);
                setMessage("Tree construction complete!");
            }
        }
    };

    const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;

    // SVG Line drawing component between nodes
    const TreeNodeLines = () => {
        return (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'visible' }}>
                {treeNodes.map(node => {
                    if (!node.parentId) return null;
                    const parent = treeNodes.find(n => n.id === node.parentId);
                    if (!parent) return null;

                    // Coordinates relative to the center of the viewport (which we shift by 50%)
                    return (
                        <motion.line
                            key={`line-${node.id}`}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            x1={`calc(50% + ${parent.x}px)`}
                            y1={`${parent.y + 20}px`}
                            x2={`calc(50% + ${node.x}px)`}
                            y2={`${node.y + 20}px`}
                            stroke="rgba(78, 205, 196, 0.5)"
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
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Preorder:</label>
                    <input
                        type="text"
                        value={preorderStr}
                        onChange={(e) => setPreorderStr(e.target.value)}
                        disabled={currentStep > -1}
                        style={{ width: '150px', padding: '0.4rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Inorder:</label>
                    <input
                        type="text"
                        value={inorderStr}
                        onChange={(e) => setInorderStr(e.target.value)}
                        disabled={currentStep > -1}
                        style={{ width: '150px', padding: '0.4rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>

                <button
                    onClick={currentStep > -1 ? reset : initVisualizer}
                    style={{ padding: '0.4rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    {currentStep > -1 ? 'Reset' : 'Initialize'}
                </button>
                <button
                    onClick={handleNext}
                    disabled={isFinished || steps.length === 0}
                    style={{ padding: '0.4rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: (isFinished || steps.length === 0) ? 0.5 : 1, color: 'white', fontWeight: 'bold' }}
                >
                    {currentStep === -1 ? 'Start Construction' : 'Next Step'}
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'stretch' }}>
                {/* Array View */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Preorder (Root, Left, Right)</h4>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {preorder.map((val, idx) => {
                                const isCurrentRoot = currentStepData?.preIndex === idx;
                                const isProcessed = currentStepData && idx <= currentStepData.preIndex;
                                return (
                                    <motion.div
                                        key={`pre-${idx}`}
                                        animate={{
                                            scale: isCurrentRoot ? 1.1 : 1,
                                            backgroundColor: isCurrentRoot ? 'rgba(241, 196, 15, 0.4)' : isProcessed ? 'rgba(241, 196, 15, 0.1)' : '#222',
                                            borderColor: isCurrentRoot ? '#f1c40f' : 'transparent',
                                            color: isCurrentRoot ? '#f1c40f' : 'white'
                                        }}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            border: '2px solid transparent',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {val}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Inorder (Left, Root, Right)</h4>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {inorder.map((val, idx) => {
                                // Determine the state of this element
                                let bgColor = '#222';
                                let borderColor = 'transparent';
                                let textColor = 'white';
                                let scale = 1;

                                if (currentStepData) {
                                    if (idx === currentStepData.inRoot) {
                                        bgColor = 'rgba(241, 196, 15, 0.4)'; // Root
                                        borderColor = '#f1c40f';
                                        textColor = '#f1c40f';
                                        scale = 1.1;
                                    } else if (idx >= currentStepData.inStart && idx <= currentStepData.inEnd) {
                                        // Rest of the active range
                                        if (idx < currentStepData.inRoot) {
                                            bgColor = 'rgba(78, 205, 196, 0.2)'; // Left subtree
                                            borderColor = 'rgba(78, 205, 196, 0.5)';
                                            textColor = '#4ECDCA';
                                        } else {
                                            bgColor = 'rgba(255, 107, 107, 0.2)'; // Right subtree
                                            borderColor = 'rgba(255, 107, 107, 0.5)';
                                            textColor = '#FF6B6B';
                                        }
                                    } else {
                                        // Outside current range
                                        bgColor = '#111';
                                        textColor = '#555';
                                    }
                                }

                                return (
                                    <motion.div
                                        key={`in-${idx}`}
                                        animate={{ backgroundColor: bgColor, borderColor, color: textColor, scale }}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            border: '2px solid',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {val}
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                            <div style={{ color: '#4ECDCA' }}>■ Left Subtree</div>
                            <div style={{ color: '#f1c40f' }}>■ Root</div>
                            <div style={{ color: '#FF6B6B' }}>■ Right Subtree</div>
                        </div>
                    </div>
                </div>

                {/* Tree View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', position: 'relative', minHeight: '300px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <TreeNodeLines />
                        <AnimatePresence>
                            {treeNodes.map((node) => {
                                const isLatest = currentStepData && currentStepData.nodeData.id === node.id;
                                return (
                                    <motion.div
                                        key={node.id}
                                        initial={{ opacity: 0, scale: 0.5, y: node.y - 20, x: `calc(50% + ${node.x}px - 20px)` }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: node.y,
                                            x: `calc(50% + ${node.x}px - 20px)`,
                                            boxShadow: isLatest ? '0 0 15px #f1c40f' : '0 0 0px transparent'
                                        }}
                                        style={{
                                            position: 'absolute',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'var(--accent-primary)',
                                            color: 'white',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold',
                                            border: isLatest ? '3px solid #f1c40f' : '3px solid #222',
                                            zIndex: 2
                                        }}
                                    >
                                        {node.val}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConstructBinaryTreeVisualizer;
