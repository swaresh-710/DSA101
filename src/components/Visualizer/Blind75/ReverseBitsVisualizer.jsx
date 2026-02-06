import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReverseBitsVisualizer = () => {
    // We visualize 8 bits for simplicity, but algorithm conceptually applies to 32
    const [num, setNum] = useState(43261596); // Some large number
    const [displayBits, setDisplayBits] = useState(8);
    const [inputVal, setInputVal] = useState(1);

    // Visualization state
    const [currentBit, setCurrentBit] = useState(0);
    const [result, setResult] = useState(0);
    const [message, setMessage] = useState('Click Start to reverse bits.');
    const [isFinished, setIsFinished] = useState(false);
    const [stepPhase, setStepPhase] = useState('INIT');

    // Helper to get binary string
    const toBin = (n, len) => (n >>> 0).toString(2).padStart(len, '0');

    const reset = () => {
        setResult(0);
        setCurrentBit(0);
        setIsFinished(false);
        setMessage('Ready.');
        setStepPhase('INIT');
    };

    const handleStep = () => {
        if (isFinished) return;

        // We will visualize 8 bits for better UX
        const TOTAL_BITS = 8;
        const n = inputVal;

        if (stepPhase === 'INIT') {
            setMessage(`Starting with n = ${n} (${toBin(n, TOTAL_BITS)}). Result = 0.`);
            setStepPhase('PROCESS_BIT');
            return;
        }

        if (stepPhase === 'PROCESS_BIT') {
            if (currentBit >= TOTAL_BITS) {
                setMessage(`Finished! Reversed Value: ${result} (${toBin(result, TOTAL_BITS)}).`);
                setIsFinished(true);
                return;
            }

            // Logic: 
            // 1. Get bit at 'currentBit' from input (from right)
            // 2. Place it at 'TOTAL_BITS - 1 - currentBit' in result (from left)

            const bit = (n >> currentBit) & 1;
            const targetPos = TOTAL_BITS - 1 - currentBit;

            // Or simpler loop used in solution:
            // res = (res << 1) | (n & 1); n >>= 1; (repeat 32 times)
            // Let's visualize that approach as it's cleaner code.

            // Wait, to visualize "res << 1 | bit", we need to change state management slightly.
            // Let's stick to the random access approach for visual clarity of "swapping": 
            // "Taking bit at index ${currentBit} and putting it at index ${targetPos}"

            const newRes = result | (bit << targetPos);
            setResult(newRes);

            setMessage(`Bit at pos ${currentBit} is ${bit}. \nMoving it to pos ${targetPos}. \nResult so far: ${toBin(newRes, TOTAL_BITS)}.`);

            setCurrentBit(currentBit + 1);
        }
    };

    // For the loop implementation variant (shifting)
    // Let's do the standard (res << 1) | bit approach actually, it's more instructive for the algorithm.
    // We need to maintain 'remaining N' state.

    const [remN, setRemN] = useState(0);

    const handleStepShift = () => {
        if (isFinished) return;

        // 8-bit visualization
        const TOTAL_BITS = 8;

        if (stepPhase === 'INIT') {
            setRemN(inputVal);
            setResult(0);
            setCurrentBit(0);
            setMessage(`Starting with n = ${inputVal} (${toBin(inputVal, TOTAL_BITS)}). Result = 0.`);
            setStepPhase('SHIFT_STEP');
            return;
        }

        if (stepPhase === 'SHIFT_STEP') {
            if (currentBit >= TOTAL_BITS) {
                setMessage(`Done. Reversed: ${result} (${toBin(result, TOTAL_BITS)}).`);
                setIsFinished(true);
                return;
            }

            const bit = remN & 1;
            const newRes = (result << 1) | bit;
            const newRemN = remN >>> 1; // unsigned shift

            setResult(newRes);
            setRemN(newRemN);
            setCurrentBit(currentBit + 1);

            setMessage(`Step ${currentBit + 1}: \nTake LSB of n (${bit}). \nShift result left & add bit -> ${toBin(newRes, currentBit + 1).padStart(TOTAL_BITS, '.')}. \nShift n right.`);
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={handleStepShift}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {stepPhase === 'INIT' ? 'Start' : 'Next Bit'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>n (8-bit):</label>
                    <input
                        type="number"
                        value={inputVal}
                        onChange={(e) => { setInputVal(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '60px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                        max={255}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)', height: '4em' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                {/* Visual Bits */}
                <div className="responsive-flex" style={{ gap: '2rem' }}>
                    <div>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Remaining Input (n)</div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {stepPhase === 'INIT' ? toBin(inputVal, 8).split('').map((b, i) => <BitBox key={i} val={b} />) :
                                toBin(remN, 8).split('').map((b, i) => <BitBox key={i} val={b} highlight={i === 7} />)}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                        {'->'}
                    </div>

                    <div>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>Result (Building)</div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {toBin(result, 8).split('').map((b, i) => (
                                // Highlight the bit we just added? It's always at the right end LSB (idx 7) after shift?
                                // Actually in "res << 1 | bit", the new bit enters at LSB.
                                <BitBox key={i} val={b} highlight={i === 7 && stepPhase === 'SHIFT_STEP'} color="var(--accent-primary)" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BitBox = ({ val, highlight, color = '#fff' }) => (
    <motion.div
        animate={{
            backgroundColor: highlight ? 'rgba(255,255,255,0.2)' : '#222',
            scale: highlight ? 1.1 : 1
        }}
        style={{
            width: '30px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #444', borderRadius: '4px',
            color: val === '1' ? color : '#444',
            fontWeight: 'bold'
        }}
    >
        {val}
    </motion.div>
);

export default ReverseBitsVisualizer;
