import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProductExceptSelfVisualizer = () => {
    const [nums, setNums] = useState([1, 2, 3, 4]);
    const [prefix, setPrefix] = useState([]);
    const [suffix, setSuffix] = useState([]);
    const [result, setResult] = useState([]);
    const [step, setStep] = useState(0); // 0: Start, 1: Prefix, 2: Suffix, 3: Result
    const [message, setMessage] = useState('Click Start to visualize.');

    const reset = () => {
        setPrefix([]);
        setSuffix([]);
        setResult([]);
        setStep(0);
        setMessage('Ready.');
    };

    const handleNext = () => {
        if (step === 0) {
            // Calculate Prefix
            const pre = new Array(nums.length).fill(1);
            let temp = 1;
            for (let i = 0; i < nums.length; i++) {
                if (i > 0) temp *= nums[i - 1];
                pre[i] = temp;
            }
            setPrefix(pre);
            setStep(1);
            setMessage('Step 1: Calculate Prefix Products. Prefix[i] = Product of all elements to the LEFT of i.');
        } else if (step === 1) {
            // Calculate Suffix
            const suf = new Array(nums.length).fill(1);
            let temp = 1;
            for (let i = nums.length - 1; i >= 0; i--) {
                if (i < nums.length - 1) temp *= nums[i + 1];
                suf[i] = temp;
            }
            setSuffix(suf);
            setStep(2);
            setMessage('Step 2: Calculate Suffix Products. Suffix[i] = Product of all elements to the RIGHT of i.');
        } else if (step === 2) {
            // Calculate Result
            const res = new Array(nums.length);
            for (let i = 0; i < nums.length; i++) {
                res[i] = prefix[i] * suffix[i];
            }
            setResult(res);
            setStep(3);
            setMessage('Step 3: Final Result. Result[i] = Prefix[i] * Suffix[i].');
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={handleNext}
                    disabled={step === 3}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: step === 3 ? 0.5 : 1 }}
                >
                    {step === 0 ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '2rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Input Array */}
                <div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }}>Input (nums)</div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {nums.map((n, i) => (
                            <div key={i} style={{ width: '40px', height: '40px', background: '#222', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid #444' }}>
                                {n}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prefix */}
                {step >= 1 && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ fontSize: '0.9rem', color: '#4ECDC4', marginBottom: '0.5rem' }}>Prefix Products (Left)</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {prefix.map((n, i) => (
                                <div key={i} style={{ width: '40px', height: '40px', background: 'rgba(78, 205, 196, 0.1)', color: '#4ECDC4', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid rgba(78, 205, 196, 0.3)' }}>
                                    {n}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Suffix */}
                {step >= 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ fontSize: '0.9rem', color: '#FF6B6B', marginBottom: '0.5rem' }}>Suffix Products (Right)</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {suffix.map((n, i) => (
                                <div key={i} style={{ width: '40px', height: '40px', background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                                    {n}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Result */}
                {step >= 3 && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <div style={{ fontSize: '0.9rem', color: '#2ecc71', marginBottom: '0.5rem' }}>Result (Prefix * Suffix)</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {result.map((n, i) => (
                                <div key={i} style={{ width: '40px', height: '40px', background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid rgba(46, 204, 113, 0.5)' }}>
                                    {n}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProductExceptSelfVisualizer;
