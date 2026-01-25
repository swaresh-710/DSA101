import React, { useState } from 'react';

const InPlaceReversalVisualizer = () => {
    // Initial List: 1 -> 2 -> 3 -> 4 -> 5
    const [list, setList] = useState([
        { val: 1, next: 2 },
        { val: 2, next: 3 },
        { val: 3, next: 4 },
        { val: 4, next: 5 },
        { val: 5, next: null }
    ]);
    const [prev, setPrev] = useState(null);
    const [curr, setCurr] = useState(1); // pointing to val 1
    const [next, setNext] = useState(null);
    const [step, setStep] = useState(0);
    const [message, setMessage] = useState('Ready to Reverse List (1 -> 5).');
    const [isReversed, setIsReversed] = useState(false);

    const nextStep = () => {
        if (curr === null) {
            setMessage('Reversal Complete! Head is now 5.');
            setIsReversed(true);
            return;
        }

        const currNodeIndex = list.findIndex(n => n.val === curr);
        const currNode = list[currNodeIndex];
        const nextVal = currNode.next;

        if (step === 0) {
            setNext(nextVal);
            setMessage(`Step: Save Next (${nextVal}). Prepping to change pointer.`);
            setStep(1);
        } else if (step === 1) {
            // Perform reversal in state
            const newList = [...list];
            newList[currNodeIndex].next = prev; // Point backwards
            setList(newList);
            setMessage(`Step: Curr (${curr}) -> next points to Prev (${prev}).`);
            setStep(2);
        } else if (step === 2) {
            // Move pointers
            setPrev(curr);
            setCurr(next);
            setNext(null); // Reset for next iteration visual
            setMessage('Step: Shift Prev and Curr forward.');
            setStep(0);
        }
    };

    const reset = () => {
        setList([
            { val: 1, next: 2 },
            { val: 2, next: 3 },
            { val: 3, next: 4 },
            { val: 4, next: 5 },
            { val: 5, next: null }
        ]);
        setPrev(null);
        setCurr(1);
        setNext(null);
        setStep(0);
        setIsReversed(false);
        setMessage('Reset.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={nextStep} disabled={isReversed} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                        Next Step
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', minHeight: '100px' }}>
                {list.map((node) => {
                    const isCurr = curr === node.val;
                    const isPrev = prev === node.val;
                    return (
                        <div key={node.val} style={{ position: 'relative' }}>
                            {/* Node */}
                            <div style={{
                                width: '50px', height: '50px',
                                border: '2px solid',
                                borderColor: isCurr ? 'var(--accent-secondary)' : (isPrev ? 'var(--accent-primary)' : 'var(--glass-border)'),
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {node.val}
                            </div>

                            {/* Arrow Logic (Visual approximation) */}
                            {node.next && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: node.next > node.val ? '60px' : '-40px', // Right or Left depending on reversal
                                    transform: 'translateY(-50%)',
                                    color: '#666',
                                    fontSize: '1.2rem'
                                }}>
                                    {node.next > node.val ? '→' : '←'}
                                </div>
                            )}

                            {isCurr && <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>Curr</div>}
                            {isPrev && <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Prev</div>}
                        </div>
                    );
                })}
            </div>
            <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
                Note: Visual arrows update after "Change Pointer" step.
            </p>
        </div>
    );
};

export default InPlaceReversalVisualizer;
