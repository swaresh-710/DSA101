import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultWords = ["wrt", "wrf", "er", "ett", "rftt"];
// Extracted dependencies from defaultWords:
// w->e (wrt, er)
// r->t (wrt, wrf)
// t->f (wrt, wrf)
// e->r (er, ett)
// t->r (ett, rftt) -> Wait, e->r is from er, ett? No, er vs ett diff is r vs t. So r->t. Wait, the actual differences:
// wrt vs wrf: length 3, w=w, r=r, t!=f => t->f
// wrt vs er: w!=e => w->e
// er vs ett: e=e, r!=t => r->t
// ett vs rftt: e!=r -> e->r
// Let's refine the extracted dependencies accurately for visualizer:
// 1. wrt, wrf -> t->f
// 2. wrf, er -> w->e
// 3. er, ett -> r->t
// 4. ett, rftt -> e->r

const extractedEdges = [
    { from: 't', to: 'f', words: ['wrt', 'wrf'] },
    { from: 'w', to: 'e', words: ['wrf', 'er'] },
    { from: 'r', to: 't', words: ['er', 'ett'] },
    { from: 'e', to: 'r', words: ['ett', 'rftt'] }
];

// Graph Nodes layout constraints
const nodePos = {
    'w': { x: 50, y: 50 },
    'e': { x: 150, y: 50 },
    'r': { x: 250, y: 50 },
    't': { x: 350, y: 50 },
    'f': { x: 450, y: 50 }
};

const uniqueChars = ['w', 'e', 'r', 't', 'f'];

const AlienDictionaryVisualizer = () => {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);

    const initVisualizer = () => {
        const generatedSteps = [];

        let inDegree = { 'w': 0, 'e': 0, 'r': 0, 't': 0, 'f': 0 };
        let adj = { 'w': [], 'e': [], 'r': [], 't': [], 'f': [] };

        generatedSteps.push({
            desc: "Step 1: Extracted rules by comparing adjacent words. (e.g. 'wrt' & 'wrf' -> 't' comes before 'f'). Let's build the Adjacency List and In-Degree array.",
            phase: 'BUILD',
            inDegree: { ...inDegree },
            adj: JSON.parse(JSON.stringify(adj)),
            highlightEdge: null,
            queue: [],
            result: ""
        });

        // Building Graph Phase
        for (let edge of extractedEdges) {
            adj[edge.from].push(edge.to);
            inDegree[edge.to]++;

            generatedSteps.push({
                desc: `Comparing "${edge.words[0]}" & "${edge.words[1]}": Added edge ${edge.from} -> ${edge.to}. In-degree of '${edge.to}' increases.`,
                phase: 'BUILD',
                inDegree: { ...inDegree },
                adj: JSON.parse(JSON.stringify(adj)),
                highlightEdge: edge,
                queue: [],
                result: ""
            });
        }

        // Kahn's Algorithm Phase
        let queue = [];
        let result = "";

        generatedSteps.push({
            desc: "Step 2: Kahn's Algorithm. Add all characters with In-Degree = 0 to the Queue. These have no dependencies.",
            phase: 'KAHN_INIT',
            inDegree: { ...inDegree },
            adj: JSON.parse(JSON.stringify(adj)),
            highlightEdge: null,
            queue: [...queue],
            result
        });

        for (let char in inDegree) {
            if (inDegree[char] === 0) {
                queue.push(char);
            }
        }

        generatedSteps.push({
            desc: `Enqueued characters with 0 dependencies: [${queue.join(', ')}]`,
            phase: 'KAHN_INIT',
            inDegree: { ...inDegree },
            adj: JSON.parse(JSON.stringify(adj)),
            highlightEdge: null,
            queue: [...queue],
            result
        });

        while (queue.length > 0) {
            let u = queue.shift();
            result += u;

            generatedSteps.push({
                desc: `Dequeued '${u}' and added to final result string. Processing its outgoing edges...`,
                phase: 'KAHN_PROC',
                inDegree: { ...inDegree },
                adj: JSON.parse(JSON.stringify(adj)),
                highlightNode: u,
                highlightEdge: null,
                queue: [...queue],
                result
            });

            if (adj[u]) {
                for (let v of adj[u]) {
                    inDegree[v]--;

                    let newlyAdded = false;
                    if (inDegree[v] === 0) {
                        queue.push(v);
                        newlyAdded = true;
                    }

                    generatedSteps.push({
                        desc: `Removed edge ${u} -> ${v}. Decremented in-degree of '${v}'.${newlyAdded ? ` In-degree is now 0, adding '${v}' to queue!` : ''}`,
                        phase: 'KAHN_EDGE',
                        inDegree: { ...inDegree },
                        adj: JSON.parse(JSON.stringify(adj)),
                        highlightNode: u,
                        highlightEdge: { from: u, to: v },
                        queue: [...queue],
                        result
                    });
                }
            }
        }

        generatedSteps.push({
            desc: result.length === uniqueChars.length
                ? `Algorithm Complete! All characters processed. Result: "${result}".`
                : "Queue empty but not all chars processed... Cycle detected! Reurning \"\"",
            phase: 'DONE',
            inDegree: { ...inDegree },
            adj: JSON.parse(JSON.stringify(adj)),
            highlightNode: null,
            highlightEdge: null,
            queue: [],
            result
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

    // Derived view state
    const adj = stepData?.adj || { 'w': [], 'e': [], 'r': [], 't': [], 'f': [] };
    const inDegree = stepData?.inDegree || { 'w': 0, 'e': 0, 'r': 0, 't': 0, 'f': 0 };
    const queue = stepData?.queue || [];
    const result = stepData?.result || "";
    const activeEdge = stepData?.highlightEdge;
    const activeNode = stepData?.highlightNode;

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
                    {currentStep === -1 ? 'Start Topological Sort' : 'Next Step'}
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '3em', color: 'var(--accent-secondary)' }}>
                {stepData ? stepData.desc : 'Click Next Step to trace Kahn\'s Algorithm.'}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>

                {/* Graph View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', position: 'relative', minHeight: '200px', overflow: 'hidden', padding: '1rem' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#888', fontWeight: 'bold' }}>DAG Representation</div>

                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                        <defs>
                            <marker id="arrowhead-normal" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                            </marker>
                            <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#f1c40f" />
                            </marker>
                        </defs>

                        {/* Render edges based on current adj state */}
                        {uniqueChars.map(u =>
                            (adj[u] || []).map(v => {
                                const isActive = activeEdge?.from === u && activeEdge?.to === v;
                                const isBeingRemoved = stepData?.phase === 'KAHN_EDGE' && isActive;

                                return (
                                    <motion.line
                                        key={`edge-${u}-${v}`}
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: isBeingRemoved ? 0 : 1, // Fades out if being removed
                                            stroke: isActive ? "#f1c40f" : "rgba(255,255,255,0.3)",
                                            strokeWidth: isActive ? 4 : 2
                                        }}
                                        x1={nodePos[u].x + 20}
                                        y1={nodePos[u].y + 20}
                                        x2={nodePos[v].x + 20}
                                        y2={nodePos[v].y + 20}
                                        markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead-normal)"}
                                        style={{ transition: 'stroke 0.3s' }}
                                    />
                                );
                            })
                        )}
                    </svg>

                    <AnimatePresence>
                        {uniqueChars.map(char => {
                            const isProcessed = result.includes(char);
                            const isNodeActive = activeNode === char || (activeEdge?.from === char || activeEdge?.to === char);

                            return (
                                <motion.div
                                    key={`node-${char}`}
                                    animate={{
                                        backgroundColor: isProcessed ? 'rgba(46, 204, 113, 0.2)' : isNodeActive ? 'rgba(241, 196, 15, 0.2)' : '#222',
                                        borderColor: isProcessed ? '#2ecc71' : isNodeActive ? '#f1c40f' : '#444',
                                        color: isProcessed ? '#2ecc71' : isNodeActive ? '#f1c40f' : 'white',
                                        scale: isNodeActive ? 1.15 : 1,
                                        opacity: isProcessed && !isNodeActive ? 0.5 : 1, // fade out when entirely processed
                                        boxShadow: isNodeActive ? '0 0 15px rgba(241, 196, 15, 0.5)' : 'none'
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
                                        border: '2px solid',
                                        left: nodePos[char].x,
                                        top: nodePos[char].y,
                                        zIndex: 2,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {char}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* State Variable Panel Sidebar */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* In Degree Table */}
                    <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444' }}>
                        <h4 style={{ color: '#888', marginBottom: '1rem' }}>In-Degree Array</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ color: '#aaa', fontWeight: 'bold', fontSize: '0.9rem' }}>Char</div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {uniqueChars.map(char => (
                                    <div key={`idx-${char}`} style={{ width: '30px', textAlign: 'center', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{char}</div>
                                ))}
                            </div>

                            <div style={{ color: '#4ECDCA', fontWeight: 'bold', fontSize: '0.9rem' }}>Count</div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {uniqueChars.map(char => {
                                    const count = inDegree[char];
                                    const isTargeted = activeEdge?.to === char && stepData?.phase === 'KAHN_EDGE';
                                    return (
                                        <motion.div
                                            key={`indegree-${char}`}
                                            animate={{
                                                backgroundColor: count === 0 ? 'rgba(46, 204, 113, 0.2)' : isTargeted ? 'rgba(241, 196, 15, 0.3)' : '#111',
                                                color: count === 0 ? '#2ecc71' : isTargeted ? '#f1c40f' : '#4ECDCA',
                                                scale: isTargeted ? 1.2 : 1,
                                                borderColor: count === 0 ? '#2ecc71' : isTargeted ? '#f1c40f' : '#333'
                                            }}
                                            style={{ width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', fontWeight: 'bold', border: '1px solid' }}
                                        >
                                            {count}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Queue */}
                    <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444' }}>
                        <h4 style={{ color: '#888', marginBottom: '1rem' }}>Queue</h4>
                        <div style={{ display: 'flex', gap: '5px', minHeight: '40px', background: '#111', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
                            {queue.length === 0 ? <span style={{ color: '#555', fontStyle: 'italic', margin: 'auto' }}>Empty</span> : null}
                            <AnimatePresence>
                                {queue.map((char, i) => (
                                    <motion.div
                                        key={`q-${char}-${i}`}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        style={{ width: '30px', height: '30px', background: '#3498db', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', borderRadius: '4px', textTransform: 'uppercase' }}
                                    >
                                        {char}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Result */}
                    <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444' }}>
                        <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Final Alien Alphabet Result</h4>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71', minHeight: '30px', display: 'flex', gap: '2px', textTransform: 'uppercase', letterSpacing: '4px' }}>
                            {result || <span style={{ color: '#555' }}>...</span>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AlienDictionaryVisualizer;
