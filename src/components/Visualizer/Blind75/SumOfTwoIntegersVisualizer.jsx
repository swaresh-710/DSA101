import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SumOfTwoIntegersVisualizer = () => {
    const [a, setA] = useState(1);
    const [b, setB] = useState(2);

    // State for simulation
    const [currA, setCurrA] = useState(1);
    const [currB, setCurrB] = useState(2);
    const [carry, setCarry] = useState(0);
    const [step, setStep] = useState('INIT'); // INIT, XOR_AND, SHIFT, UPDATE, DONE
    const [message, setMessage] = useState('Click Start to add numbers using bits.');
    const [history, setHistory] = useState([]);

    const toBin = (num) => {
        // Handle negative numbers for 32-bit display if needed, but for simplicity let's stick to positive visualization or basic 8-bit
        // JS bitwise operators work on 32-bit signed integers.
        return (num >>> 0).toString(2).padStart(8, '0').slice(-8); // Show last 8 bits
    };

    const reset = () => {
        setCurrA(a);
        setCurrB(b);
        setCarry(0);
        setStep('INIT');
        setHistory([]);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (step === 'DONE') return;

        if (step === 'INIT') {
            setCurrA(a);
            setCurrB(b);
            setMessage(`Starting: A = ${a} (${toBin(a)}), B = ${b} (${toBin(b)}).`);
            setStep('XOR_AND');
            return;
        }

        if (step === 'XOR_AND') {
            if (currB === 0) {
                setMessage(`B is 0. Done! Result is A = ${currA}.`);
                setStep('DONE');
                return;
            }

            // Calculate Sum (without carry) and Carry
            const sum = currA ^ currB;
            const car = currA & currB;

            setHistory(prev => [...prev, { a: currA, b: currB, sum, carry: car }]);

            // Just visualization state, not updating main A/B yet
            // Actually A becomes sum, B becomes carry << 1. 
            // In this step we show the calculation.
            setMessage(`Detailed Step:\nSum (A ^ B) = ${toBin(sum)} (${sum})\nCarry (A & B) = ${toBin(car)} (${car})`);
            setStep('SHIFT');
            return;
        }

        if (step === 'SHIFT') {
            const lastLog = history[history.length - 1];
            const shiftedCarry = lastLog.carry << 1;
            setMessage(`Shift Carry: (${toBin(lastLog.carry)}) << 1 = ${toBin(shiftedCarry)} (${shiftedCarry}).`);
            setStep('UPDATE');
            return;
        }

        if (step === 'UPDATE') {
            const lastLog = history[history.length - 1];
            const newA = lastLog.sum;
            const newB = lastLog.carry << 1;

            setCurrA(newA);
            setCurrB(newB);

            if (newB === 0) {
                setMessage(`B is now 0. Calculation Complete. Result: ${newA}.`);
                setStep('DONE');
            } else {
                setMessage(`Update A = ${newA}, B = ${newB}. Iterate again.`);
                setStep('XOR_AND');
            }
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={handleStep}
                    disabled={step === 'DONE'}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: step === 'DONE' ? 0.5 : 1 }}
                >
                    {step === 'INIT' ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>A:</label>
                    <input
                        type="number"
                        value={a}
                        onChange={(e) => { setA(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                    <label>B:</label>
                    <input
                        type="number"
                        value={b}
                        onChange={(e) => { setB(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 100px 150px', gap: '1rem', alignItems: 'center', background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontWeight: 'bold' }}>Var</div>
                    <div style={{ color: '#888', fontWeight: 'bold' }}>Decimal</div>
                    <div style={{ color: '#888', fontWeight: 'bold' }}>Binary (8-bit)</div>

                    <div style={{ color: '#4ECDC4' }}>Current A</div>
                    <div style={{ fontSize: '1.2rem' }}>{currA}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#4ECDC4' }}>{toBin(currA)}</div>

                    <div style={{ color: '#FF6B6B' }}>Current B</div>
                    <div style={{ fontSize: '1.2rem' }}>{currB}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#FF6B6B' }}>{toBin(currB)}</div>
                </div>

                {/* operations check */}
                {step !== 'INIT' && step !== 'DONE' && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#888' }}>Bitwise Logic</div>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <div>A ^ B (Sum without carry)</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                                    {toBin(currA ^ currB)}
                                </div>
                            </div>
                            <div>
                                <div>(A & B) (Carry)</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#FF6B6B' }}>
                                    {toBin(currA & currB)}
                                </div>
                            </div>
                            {step === 'SHIFT' && (
                                <div>
                                    <div>Carry {'<<'} 1</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#f1c40f' }}>
                                        {toBin((currA & currB) << 1)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SumOfTwoIntegersVisualizer;
