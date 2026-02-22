import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultN = 5;
const defaultEdges = [[0, 1], [1, 2], [3, 4]];

// Graph Node placements for default visualization (circle layout loosely)
const nodePositions = {
    0: { x: 50, y: 80 },
    1: { x: 150, y: 150 },
    2: { x: 50, y: 220 },
    3: { x: 300, y: 80 },
    4: { x: 300, y: 220 }
};

const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#34495e'];

const ConnectedComponentsVisualizer = () => {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    const initVisualizer = () => {
        const generatedSteps = [];
        let count = defaultN;
        const parent = Array.from({ length: defaultN }, (_, i) => i);
        const rank = Array(defaultN).fill(0);

        // Component Colors mappings to keep visual tracking
        const nodeColorSets = Array.from({ length: defaultN }, (_, i) => i); // Everyone starts in their own set

        generatedSteps.push({
            desc: `Initialization: n = ${defaultN}. We start with ${defaultN} disconnected components.`,
            count,
            parent: [...parent],
            rank: [...rank],
            nodeColorSets: [...nodeColorSets],
            activeEdge: null,
            action: 'INIT'
        });

        // Simulating the Union-Find process
        for (let i = 0; i < defaultEdges.length; i++) {
            const edge = defaultEdges[i];
            const u = edge[0];
            const v = edge[1];

            // Highlight Edge
            generatedSteps.push({
                desc: `Processing edge [${u}, ${v}]. Finding roots...`,
                count,
                parent: [...parent],
                rank: [...rank],
                nodeColorSets: [...nodeColorSets],
                activeEdge: edge,
                action: 'FIND',
                targetU: u,
                targetV: v
            });

            // Find root of u
            let rootU = u;
            while (rootU !== parent[rootU]) rootU = parent[rootU];

            // Find root of v
            let rootV = v;
            while (rootV !== parent[rootV]) rootV = parent[rootV];

            if (rootU !== rootV) {
                // Union
                generatedSteps.push({
                    desc: `Roots are different (root(${u})=${rootU}, root(${v})=${rootV}). Taking Union...`,
                    count,
                    parent: [...parent],
                    rank: [...rank],
                    nodeColorSets: [...nodeColorSets],
                    activeEdge: edge,
                    action: 'UNION_EVAL',
                    rootU, rootV
                });

                if (rank[rootU] < rank[rootV]) {
                    parent[rootU] = rootV;
                    generatedSteps.push({
                        desc: `Rank of ${rootV} is higher. Making ${rootV} the parent of ${rootU}. Count decreases from ${count} to ${count - 1}.`,
                        count: count - 1, parent: [...parent], rank: [...rank], nodeColorSets: [...nodeColorSets], activeEdge: edge, action: 'UNION_APPLY'
                    });
                } else if (rank[rootU] > rank[rootV]) {
                    parent[rootV] = rootU;
                    generatedSteps.push({
                        desc: `Rank of ${rootU} is higher. Making ${rootU} the parent of ${rootV}. Count decreases from ${count} to ${count - 1}.`,
                        count: count - 1, parent: [...parent], rank: [...rank], nodeColorSets: [...nodeColorSets], activeEdge: edge, action: 'UNION_APPLY'
                    });
                } else {
                    parent[rootV] = rootU;
                    rank[rootU]++;
                    generatedSteps.push({
                        desc: `Ranks are equal. Arbitrarily making ${rootU} the parent of ${rootV} and incrementing rank of ${rootU}. Count ${count} -> ${count - 1}.`,
                        count: count - 1, parent: [...parent], rank: [...rank], nodeColorSets: [...nodeColorSets], activeEdge: edge, action: 'UNION_APPLY'
                    });
                }
                count--;

                // Update color sets for visual grouping (find all with rootV's old color and change to rootU's color)
                const targetColor = nodeColorSets[parent[rootV] === rootU ? rootU : rootV];
                const oldColor = nodeColorSets[parent[rootV] === rootU ? rootV : rootU];
                for (let k = 0; k < defaultN; k++) {
                    if (nodeColorSets[k] === oldColor) {
                        nodeColorSets[k] = targetColor;
                    }
                }

                generatedSteps.push({
                    desc: `Union complete for edge [${u}, ${v}]. Component sets merged visually.`,
                    count,
                    parent: [...parent],
                    rank: [...rank],
                    nodeColorSets: [...nodeColorSets],
                    activeEdge: edge,
                    action: 'MERGED'
                });

            } else {
                generatedSteps.push({
                    desc: `Both nodes have the same root (${rootU}). They are already in the same component. Redundant edge detected! Count remains ${count}.`,
                    count,
                    parent: [...parent],
                    rank: [...rank],
                    nodeColorSets: [...nodeColorSets],
                    activeEdge: edge,
                    action: 'REDUNDANT'
                });
            }
        }

        generatedSteps.push({
            desc: `All edges processed. Final result: ${count} connected component(s)!`,
            count,
            parent: [...parent],
            rank: [...rank],
            nodeColorSets: [...nodeColorSets],
            activeEdge: null,
            action: 'DONE'
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

    const stepData = currentStep >= 0 ? steps[currentStep] : null;

    // Derived states for graph rendering
    const activeEdge = stepData?.activeEdge;
    const parentArr = stepData?.parent || Array.from({ length: defaultN }, (_, i) => i);
    const colorSets = stepData?.nodeColorSets || Array.from({ length: defaultN }, (_, i) => i);

    // Processed edges for graph history
    const processedEdges = [];
    if (currentStep >= 0) {
        for (let i = 0; i <= currentStep; i++) {
            if (steps[i].action === 'MERGED' || steps[i].action === 'REDUNDANT') {
                processedEdges.push(steps[i].activeEdge);
            }
        }
    }

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
                {stepData ? stepData.desc : 'Click Next Step to begin the Union-Find process.'}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Graph View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', position: 'relative', minHeight: '350px', overflow: 'hidden', padding: '1rem' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#888', fontWeight: 'bold' }}>Graph Representation</div>

                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                        {/* Processed Edges */}
                        {processedEdges.map((edge, idx) => (
                            <line
                                key={`proc-${idx}`}
                                x1={nodePositions[edge[0]].x + 20}
                                y1={nodePositions[edge[0]].y + 20}
                                x2={nodePositions[edge[1]].x + 20}
                                y2={nodePositions[edge[1]].y + 20}
                                stroke="rgba(255, 255, 255, 0.4)"
                                strokeWidth="3"
                            />
                        ))}

                        {/* Initially given edges (faded background) */}
                        {defaultEdges.map((edge, idx) => (
                            <line
                                key={`def-${idx}`}
                                x1={nodePositions[edge[0]].x + 20}
                                y1={nodePositions[edge[0]].y + 20}
                                x2={nodePositions[edge[1]].x + 20}
                                y2={nodePositions[edge[1]].y + 20}
                                stroke="rgba(255, 255, 255, 0.05)"
                                strokeWidth="3"
                                strokeDasharray="5,5"
                            />
                        ))}

                        {/* Active Edge Animation */}
                        {activeEdge && (
                            <motion.line
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5 }}
                                x1={nodePositions[activeEdge[0]].x + 20}
                                y1={nodePositions[activeEdge[0]].y + 20}
                                x2={nodePositions[activeEdge[1]].x + 20}
                                y2={nodePositions[activeEdge[1]].y + 20}
                                stroke={stepData?.action === 'REDUNDANT' ? "#e74c3c" : "#f1c40f"}
                                strokeWidth="4"
                            />
                        )}
                    </svg>

                    {/* Nodes */}
                    <AnimatePresence>
                        {Array.from({ length: defaultN }).map((_, i) => {
                            const isEvaluating = stepData?.action === 'FIND' && (stepData.targetU === i || stepData.targetV === i);
                            const isUnionRoots = stepData?.action === 'UNION_EVAL' && (stepData.rootU === i || stepData.rootV === i);

                            return (
                                <motion.div
                                    key={`node-${i}`}
                                    animate={{
                                        backgroundColor: isEvaluating ? '#f1c40f' : isUnionRoots ? '#2ecc71' : colors[colorSets[i] % colors.length],
                                        scale: (isEvaluating || isUnionRoots) ? 1.2 : 1,
                                        boxShadow: isEvaluating ? '0 0 15px #f1c40f' : isUnionRoots ? '0 0 15px #2ecc71' : 'none'
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
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        left: nodePositions[i].x,
                                        top: nodePositions[i].y,
                                        zIndex: 2,
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {i}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* State Variables Sidebar */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Component Count Card */}
                    <div style={{ background: '#222', borderRadius: '8px', padding: '1.5rem', border: '1px solid #444', textAlign: 'center' }}>
                        <div style={{ color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Total Components</div>
                        <motion.div
                            key={`count-${stepData?.count}`}
                            initial={{ scale: 1.5, color: '#f1c40f' }}
                            animate={{ scale: 1, color: '#fff' }}
                            style={{ fontSize: '3rem', fontWeight: 'bold' }}
                        >
                            {stepData ? stepData.count : defaultN}
                        </motion.div>
                    </div>

                    {/* Arrays View */}
                    <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444' }}>
                        <h4 style={{ color: '#888', marginBottom: '1rem' }}>Union-Find State Arrays</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ color: '#aaa', fontWeight: 'bold', fontSize: '0.9rem' }}>Index</div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {Array.from({ length: defaultN }).map((_, i) => (
                                    <div key={`idx-${i}`} style={{ width: '30px', textAlign: 'center', color: '#555', fontSize: '0.8rem' }}>{i}</div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ color: '#4ECDCA', fontWeight: 'bold', fontSize: '0.9rem' }}>Parent</div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {parentArr.map((p, i) => {
                                    const isUpdated = stepData?.action === 'UNION_APPLY' && parentArr[i] !== (steps[currentStep - 1]?.parent[i] ?? i);
                                    return (
                                        <motion.div
                                            key={`parent-${i}`}
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: '0.9rem' }}>Rank</div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {(stepData?.rank || Array(defaultN).fill(0)).map((r, i) => {
                                    const isUpdated = stepData?.action === 'UNION_APPLY' && r !== (steps[currentStep - 1]?.rank[i] ?? 0);
                                    return (
                                        <motion.div
                                            key={`rank-${i}`}
                                            animate={{
                                                backgroundColor: isUpdated ? '#f1c40f' : '#222',
                                                color: isUpdated ? '#111' : '#FF6B6B',
                                                scale: isUpdated ? 1.2 : 1
                                            }}
                                            style={{ width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #FF6B6B', opacity: 0.8 }}
                                        >
                                            {r}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem', fontStyle: 'italic' }}>
                            * Parent[i] = i means the node is the root of its component set.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectedComponentsVisualizer;
