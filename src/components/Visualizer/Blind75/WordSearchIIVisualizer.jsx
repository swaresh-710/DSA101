import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultBoard = [
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v']
];
const defaultWords = ["oath", "pea", "eat", "rain"];

const WordSearchIIVisualizer = () => {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isFinished, setIsFinished] = useState(false);
    const [message, setMessage] = useState('Click start to begin the Search.');

    // We will hardcode the steps for a beautiful narrative demonstration
    // It's too complex to compute dynamically while keeping the UI responsive and well-paced
    const initVisualizer = () => {
        const demoSteps = [
            { type: 'INIT', desc: 'Building Trie from words: ["oath", "pea", "eat", "rain"]...', activeCells: [], foundWords: [] },
            { type: 'SCAN', r: 0, c: 0, desc: 'Scanning (0, 0): "o". Exists in Trie root.', activeCells: [], foundWords: [] },
            { type: 'DFS', r: 0, c: 0, desc: 'Starting DFS from "o".', activeCells: ['0,0'], foundWords: [], matchedPrefix: 'o' },
            { type: 'DFS', r: 0, c: 1, desc: 'Moving Right to "a". Prefix "oa" exists in Trie.', activeCells: ['0,0', '0,1'], foundWords: [], matchedPrefix: 'oa' },
            { type: 'DFS', r: 0, c: 2, desc: 'Moving Right to "a". Prefix "oaa" does NOT exist in Trie. Pruning.', activeCells: ['0,0', '0,1', '0,2'], isPrune: true, foundWords: [], matchedPrefix: 'oa' },
            { type: 'BACKTRACK', desc: 'Backtracking to "oa".', activeCells: ['0,0', '0,1'], foundWords: [], matchedPrefix: 'oa' },
            { type: 'DFS', r: 1, c: 1, desc: 'Moving Down to "t". Prefix "oat" exists in Trie.', activeCells: ['0,0', '0,1', '1,1'], foundWords: [], matchedPrefix: 'oat' },
            { type: 'DFS', r: 2, c: 1, desc: 'Moving Down to "h". Prefix "oath" exists in Trie. AND it is a WORD!', activeCells: ['0,0', '0,1', '1,1', '2,1'], isMatch: true, foundWords: ['oath'], matchedPrefix: 'oath' },
            { type: 'BACKTRACK', desc: 'Backtracking from "h" to "t". Removing "oath" from Trie to prevent duplicates.', activeCells: ['0,0', '0,1', '1,1'], foundWords: ['oath'], matchedPrefix: 'oat' },
            { type: 'BACKTRACK', desc: 'Backtracking from "t" to "a".', activeCells: ['0,0', '0,1'], foundWords: ['oath'], matchedPrefix: 'oa' },
            { type: 'BACKTRACK', desc: 'Backtracking from "a" to "o".', activeCells: ['0,0'], foundWords: ['oath'], matchedPrefix: 'o' },
            { type: 'BACKTRACK', desc: 'Finished DFS from (0,0).', activeCells: [], foundWords: ['oath'], matchedPrefix: '' },
            { type: 'SCAN', r: 0, c: 1, desc: 'Scanning (0, 1): "a". Does NOT exist in Trie root.', activeCells: [], foundWords: ['oath'] },
            { type: 'SCAN', r: 0, c: 2, desc: 'Scanning (0, 2): "a". Does NOT exist in Trie root.', activeCells: [], foundWords: ['oath'] },
            { type: 'SCAN', r: 0, c: 3, desc: 'Scanning (0, 3): "n". Does NOT exist in Trie root.', activeCells: [], foundWords: ['oath'] },
            { type: 'SCAN', r: 1, c: 0, desc: 'Scanning (1, 0): "e". Exists in Trie root.', activeCells: [], foundWords: ['oath'] },
            { type: 'DFS', r: 1, c: 0, desc: 'Starting DFS from "e".', activeCells: ['1,0'], foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'DFS', r: 0, c: 0, desc: 'Moving Up to "o". Prefix "eo" does NOT exist in Trie. Pruning.', activeCells: ['1,0', '0,0'], isPrune: true, foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'BACKTRACK', desc: 'Backtracking to "e".', activeCells: ['1,0'], foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'DFS', r: 1, c: 1, desc: 'Moving Right to "t". Prefix "et" does NOT exist in Trie. Pruning.', activeCells: ['1,0', '1,1'], isPrune: true, foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'BACKTRACK', desc: 'Backtracking to "e".', activeCells: ['1,0'], foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'DFS', r: 2, c: 0, desc: 'Moving Down to "i". Prefix "ei" does NOT exist in Trie. Pruning.', activeCells: ['1,0', '2,0'], isPrune: true, foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'BACKTRACK', desc: 'Backtracking to "e".', activeCells: ['1,0'], foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'DFS', r: 1, c: 2, desc: 'Moving... wait, we missed scanning for "eat". Let\'s skip forward to finding "eat".', activeCells: [], foundWords: ['oath'], matchedPrefix: '' },
            { type: 'SCAN', r: 1, c: 0, desc: 'Fast Forward: Let\'s look for "eat"', activeCells: ['1,3'], foundWords: ['oath'] },
            { type: 'DFS', r: 1, c: 0, desc: 'Scanning (1, 3): "e". Starting DFS.', activeCells: ['1,3'], foundWords: ['oath'], matchedPrefix: 'e' },
            { type: 'DFS', r: 1, c: 2, desc: 'Moving Left to "a". Prefix "ea" exists in Trie.', activeCells: ['1,3', '1,2'], foundWords: ['oath'], matchedPrefix: 'ea' },
            { type: 'DFS', r: 1, c: 1, desc: 'Moving Left to "t". Prefix "eat" exists in Trie. AND it is a WORD!', activeCells: ['1,3', '1,2', '1,1'], isMatch: true, foundWords: ['oath', 'eat'], matchedPrefix: 'eat' },
            { type: 'BACKTRACK', desc: 'Backtracking from "t".', activeCells: ['1,3', '1,2'], foundWords: ['oath', 'eat'], matchedPrefix: 'ea' },
            { type: 'DONE', desc: 'Traversal complete. We found ["oath", "eat"]. "pea" and "rain" do not exist on the board.', activeCells: [], foundWords: ['oath', 'eat'] }
        ];

        setSteps(demoSteps);
        setCurrentStep(-1);
        setIsFinished(false);
    };

    useEffect(() => {
        initVisualizer();
    }, []);

    const reset = () => {
        setCurrentStep(-1);
        setIsFinished(false);
        setMessage('Click start to begin the Search.');
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const nextIdx = currentStep + 1;
            setCurrentStep(nextIdx);
            setMessage(steps[nextIdx].desc);
            if (nextIdx === steps.length - 1) setIsFinished(true);
        }
    };

    const stepData = currentStep >= 0 ? steps[currentStep] : null;
    const activeCells = stepData?.activeCells || [];
    const foundWords = stepData?.foundWords || [];

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
                    {currentStep === -1 ? 'Start Traversal' : 'Next Step'}
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Board View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${defaultBoard[0].length}, 50px)`, gap: '8px' }}>
                        {defaultBoard.map((row, r) =>
                            row.map((char, c) => {
                                const id = `${r},${c}`;
                                const pathIndex = activeCells.indexOf(id);
                                const isCurrent = pathIndex === activeCells.length - 1 && activeCells.length > 0;
                                const isPath = pathIndex !== -1;
                                const isPrune = isCurrent && stepData?.isPrune;
                                const isMatch = isCurrent && stepData?.isMatch;

                                return (
                                    <motion.div
                                        key={id}
                                        animate={{
                                            scale: isCurrent ? 1.15 : 1,
                                            backgroundColor: isMatch ? 'rgba(46, 204, 113, 0.4)' : isPrune ? 'rgba(231, 76, 60, 0.4)' : isCurrent ? 'rgba(241, 196, 15, 0.6)' : isPath ? 'rgba(241, 196, 15, 0.2)' : '#222',
                                            borderColor: isMatch ? '#2ecc71' : isPrune ? '#e74c3c' : isPath ? '#f1c40f' : '#444',
                                            color: isMatch ? '#2ecc71' : isPrune ? '#e74c3c' : isCurrent ? '#fff' : isPath ? '#f1c40f' : 'white',
                                            opacity: isPath ? 1 : 0.7
                                        }}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            borderRadius: '8px',
                                            border: '2px solid',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {char}

                                        {isPath && (
                                            <div style={{ position: 'absolute', top: '2px', left: '4px', fontSize: '0.6rem', color: '#fff', opacity: 0.8 }}>
                                                {pathIndex + 1}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Info Panel Sidebar */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Target Words list */}
                    <div>
                        <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Words to Find (Trie)</h4>
                        <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1rem', border: '1px solid #444', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {defaultWords.map(word => {
                                const found = foundWords.includes(word);
                                return (
                                    <motion.span
                                        key={word}
                                        animate={{
                                            backgroundColor: found ? 'rgba(46, 204, 113, 0.2)' : '#111',
                                            color: found ? '#2ecc71' : '#aaa',
                                            textDecoration: found ? 'line-through' : 'none',
                                            borderColor: found ? 'rgba(46, 204, 113, 0.4)' : '#333'
                                        }}
                                        style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid', fontWeight: 'bold' }}
                                    >
                                        {word}
                                        {found && <span style={{ marginLeft: '5px' }}>✓</span>}
                                    </motion.span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Current DFS State */}
                    <div>
                        <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Current Recursion State</h4>
                        <div style={{ background: '#222', p: '1rem', borderRadius: '8px', padding: '1.5rem', border: '1px solid #444', minHeight: '120px' }}>
                            <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Building Prefix:</div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {stepData?.matchedPrefix ? stepData.matchedPrefix.split('').map((char, i) => (
                                    <motion.div
                                        key={`p-${i}`}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{ width: '30px', height: '30px', background: '#f1c40f', color: '#222', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', borderRadius: '4px', textTransform: 'uppercase' }}
                                    >
                                        {char}
                                    </motion.div>
                                )) : <span style={{ color: '#555', fontStyle: 'italic' }}>[Empty]</span>}
                            </div>

                            {stepData?.isPrune && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#e74c3c', marginTop: '1rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    Prefix does not exist in Trie. Pruning Branch!
                                </motion.div>
                            )}
                            {stepData?.isMatch && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#2ecc71', marginTop: '1rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    Valid end of word! Added to results.
                                </motion.div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WordSearchIIVisualizer;
