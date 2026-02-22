import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const examples = [
    {
        name: "Valid Tree",
        n: 5,
        edges: [[0, 1], [0, 2], [0, 3], [1, 4]],
        desc: "Graph has 5 nodes and 4 edges with no cycles. It is a Valid Tree.",
        positions: { 0: { x: 150, y: 50 }, 1: { x: 50, y: 150 }, 2: { x: 150, y: 150 }, 3: { x: 250, y: 150 }, 4: { x: 50, y: 250 } }
    },
    {
        name: "Cycle Detected",
        n: 5,
        edges: [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]],
        desc: "Graph has a cycle (1-2-3). It is NOT a Valid Tree.",
        positions: { 0: { x: 150, y: 50 }, 1: { x: 150, y: 150 }, 2: { x: 50, y: 220 }, 3: { x: 250, y: 220 }, 4: { x: 150, y: 280 } }
    },
    {
        name: "Disconnected",
        n: 4,
        edges: [[0, 1], [2, 3]],
        desc: "Graph does not have n - 1 edges (has 2, needs 3). Immediate rejection.",
        positions: { 0: { x: 50, y: 100 }, 1: { x: 150, y: 100 }, 2: { x: 250, y: 100 }, 3: { x: 350, y: 100 } }
    }
];

const GraphValidTreeVisualizer = () => {
    const [activeExampleIdx, setActiveExampleIdx] = useState(0);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    const activeExample = examples[activeExampleIdx];

    const initVisualizer = () => {
        const generatedSteps = [];
        const n = activeExample.n;
        const edges = activeExample.edges;

        // Initial Phase
        generatedSteps.push({
            desc: `Checking preconditions: Given n = ${n}, edges constraint requires exactly n - 1 = ${n - 1} edges.`,
            phase: 'INIT',
            activeEdge: null,
            parent: Array.from({ length: n }, (_, i) => i),
            isValid: null,
            failedEarly: false
        });

        if (edges.length !== n - 1) {
            generatedSteps.push({
                desc: `Edges length is ${edges.length}, which is NOT equal to ${n - 1}. The graph is Disconnected or too dense. NOT a valid tree!`,
                phase: 'DONE',
                activeEdge: null,
                parent: Array.from({ length: n }, (_, i) => i),
                isValid: false,
                failedEarly: true,
                cycleEdge: null
            });
            setSteps(generatedSteps);
            setCurrentStep(-1);
            setIsFinished(false);
            return;
        }

        generatedSteps.push({
            desc: `Edges count is exactly ${n - 1}. Condition met! Proceeding to Cycle Detection via Union-Find.`,
            phase: 'INIT',
            activeEdge: null,
            parent: Array.from({ length: n }, (_, i) => i),
            isValid: null,
            failedEarly: false
        });

        const parent = Array.from({ length: n }, (_, i) => i);
        let cycleDetected = false;
        let cycleEdge = null;

        const find = (i) => {
            let root = i;
            while (root !== parent[root]) root = parent[root];
            return root;
        };

        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const u = edge[0];
            const v = edge[1];

            generatedSteps.push({
                desc: `Processing Edge [${u}, ${v}]. Finding roots...`,
                phase: 'FIND',
                activeEdge: edge,
                parent: [...parent],
                isValid: null,
                failedEarly: false
            });

            const rootU = find(u);
            const rootV = find(v);

            if (rootU === rootV) {
                cycleDetected = true;
                cycleEdge = edge;
                generatedSteps.push({
                    desc: `Both ${u} and ${v} have the same root (${rootU}). This forms a CYCLE! Graph is NOT a valid tree.`,
                    phase: 'UNION_FAIL',
                    activeEdge: edge,
                    parent: [...parent],
                    isValid: false,
                    failedEarly: false,
                    cycleEdge
                });
                break;
            } else {
                parent[rootU] = rootV; // Simple Union (no rank for simplicity of visualizer logic)
                generatedSteps.push({
                    desc: `Roots differ (${rootU} != ${rootV}). Unioning nodes! Set parent[${rootU}] = ${rootV}.`,
                    phase: 'UNION_SUCCESS',
                    activeEdge: edge,
                    parent: [...parent],
                    isValid: null,
                    failedEarly: false
                });
            }
        }

        if (!cycleDetected) {
            generatedSteps.push({
                desc: `All edges processed without finding cycles. The graph is perfectly connected with n - 1 edges. It is a VALID TREE!`,
                phase: 'DONE',
                activeEdge: null,
                parent: [...parent],
                isValid: true,
                failedEarly: false,
                cycleEdge: null
            });
        }

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

    const stepData = currentStep >= 0 ? steps[currentStep] : null;
    const parentArr = stepData?.parent || Array.from({ length: activeExample.n }, (_, i) => i);

    // Determine which edges have been successfully merged over time
    const mergedEdges = [];
    if (currentStep >= 0 && !stepData?.failedEarly) {
        for (let i = 0; i <= currentStep; i++) {
            if (steps[i].phase === 'UNION_SUCCESS') {
                mergedEdges.push(steps[i].activeEdge);
            }
        }
    }

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
                        {currentStep === -1 ? 'Start Validation' : 'Next Step'}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '3em', color: 'var(--accent-secondary)' }}>
                {stepData ? stepData.desc : `Currently loaded: ${activeExample.name}. Click Next Step to validate.`}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Graph View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', position: 'relative', minHeight: '340px', overflow: 'hidden', padding: '1rem' }}>
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                        {/* Render all potential edges as faint background lines */}
                        {activeExample.edges.map((edge, idx) => {
                            const isBeingEvaluated = stepData?.activeEdge === edge;
                            const isMerged = mergedEdges.some(e => e[0] === edge[0] && e[1] === edge[1]);
                            const isCycle = stepData?.cycleEdge && stepData.cycleEdge[0] === edge[0] && stepData.cycleEdge[1] === edge[1];

                            return (
                                <motion.line
                                    key={`edge-${idx}`}
                                    initial={{ stroke: "rgba(255, 255, 255, 0.05)" }}
                                    animate={{
                                        stroke: isCycle ? "#e74c3c" : isMerged ? "rgba(46, 204, 113, 0.4)" : isBeingEvaluated ? "#f1c40f" : "rgba(255, 255, 255, 0.05)",
                                        strokeWidth: (isCycle || isBeingEvaluated || isMerged) ? 4 : 2,
                                        strokeDasharray: isMerged ? "0" : isCycle ? "0" : "5,5"
                                    }}
                                    x1={activeExample.positions[edge[0]].x + 20}
                                    y1={activeExample.positions[edge[0]].y + 20}
                                    x2={activeExample.positions[edge[1]].x + 20}
                                    y2={activeExample.positions[edge[1]].y + 20}
                                />
                            );
                        })}
                    </svg>

                    <AnimatePresence>
                        {Array.from({ length: activeExample.n }).map((_, i) => {
                            const isEvalEdge = stepData?.activeEdge && (stepData.activeEdge[0] === i || stepData.activeEdge[1] === i);
                            const isCycleEdge = stepData?.cycleEdge && (stepData.cycleEdge[0] === i || stepData.cycleEdge[1] === i);

                            return (
                                <motion.div
                                    key={`node-${i}`}
                                    animate={{
                                        backgroundColor: isCycleEdge ? '#e74c3c' : isEvalEdge ? '#f1c40f' : '#222',
                                        borderColor: isCycleEdge ? '#c0392b' : isEvalEdge ? '#f39c12' : '#444',
                                        scale: (isEvalEdge || isCycleEdge) ? 1.2 : 1,
                                        boxShadow: isCycleEdge ? '0 0 20px #e74c3c' : isEvalEdge ? '0 0 15px #f1c40f' : '0 0 0px transparent'
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
                                        color: '#fff',
                                        border: '2px solid',
                                        left: activeExample.positions[i].x,
                                        top: activeExample.positions[i].y,
                                        zIndex: 2
                                    }}
                                >
                                    {i}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* State Sidebar */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Validation Status Block */}
                    <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1.5rem', border: '1px solid #444', textAlign: 'center' }}>
                        <h4 style={{ color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase', fontSize: '0.8rem' }}>Verdict</h4>
                        {stepData?.isValid === true && (
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ color: '#2ecc71', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                ✓ VALID TREE
                            </motion.div>
                        )}
                        {stepData?.isValid === false && (
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ color: '#e74c3c', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                ✗ INVALID TREE
                            </motion.div>
                        )}
                        {stepData?.isValid === null && (
                            <div style={{ color: '#aaa', fontSize: '1.2rem', fontStyle: 'italic' }}>
                                Processing...
                            </div>
                        )}
                    </div>

                    {/* Preconditions check */}
                    <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444' }}>
                        <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Tree Properties Checklist</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: stepData?.failedEarly ? '#e74c3c' : (currentStep > 0 ? '#2ecc71' : '#333'), display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem' }}>
                                {(stepData?.failedEarly || currentStep > 0) && '✓'}
                            </div>
                            <span style={{ color: currentStep > 0 ? '#fff' : '#888' }}>Edges = n - 1 ({activeExample.edges.length} == {activeExample.n - 1})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: stepData?.isValid === true ? '#2ecc71' : stepData?.cycleEdge ? '#e74c3c' : '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem' }}>
                                {(stepData?.isValid === true || stepData?.cycleEdge) && '✓'}
                            </div>
                            <span style={{ color: (stepData?.isValid === true || stepData?.cycleEdge) ? '#fff' : '#888' }}>No Cycles Detected</span>
                        </div>
                    </div>

                    {/* Parent Array view */}
                    {!stepData?.failedEarly && (
                        <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444' }}>
                            <h4 style={{ color: '#888', marginBottom: '1rem' }}>Union-Find State Array</h4>

                            <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ color: '#aaa', fontWeight: 'bold', fontSize: '0.9rem' }}>Index</div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {Array.from({ length: activeExample.n }).map((_, i) => (
                                        <div key={`iidx-${i}`} style={{ width: '30px', textAlign: 'center', color: '#555', fontSize: '0.8rem' }}>{i}</div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ color: '#4ECDCA', fontWeight: 'bold', fontSize: '0.9rem' }}>Parent</div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {parentArr.map((p, i) => {
                                        const isUpdated = stepData?.phase === 'UNION_SUCCESS' && parentArr[i] !== (steps[currentStep - 1]?.parent[i] ?? i);
                                        return (
                                            <motion.div
                                                key={`iparent-${i}`}
                                                animate={{
                                                    backgroundColor: isUpdated ? '#2ecc71' : p === i ? '#333' : '#4ECDCA',
                                                    color: p === i ? '#aaa' : '#111',
                                                    scale: isUpdated ? 1.2 : 1
                                                }}
                                                style={{ width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #555' }}
                                            >
                                                {p}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GraphValidTreeVisualizer;
