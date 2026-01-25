import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ClimbingStairsVisualizer = () => {
    const [n, setN] = useState(5);
    const [steps, setSteps] = useState([0]); // Represents stairs 0 to n
    const [dp, setDp] = useState([1]); // Ways to reach each step. dp[0]=1 (base case)
    const [currentStep, setCurrentStep] = useState(0);
    const [message, setMessage] = useState('Click Start to climb stairs.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setDp([1]);
        setCurrentStep(0);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // Logic: dp[i] = dp[i-1] + dp[i-2]

        if (currentStep === 0) {
            // Setup base cases
            // dp[0] = 1 is already set
            // dp[1] = 1 (1 way: single step)
            // But let's iterate normally?
            // Usually we treat index as step number. 
            // Step 0: Ground (1 way to be there).
            // Step 1: 1 way (from 0).
            // Step 2: 2 ways (from 0 (+2) or 1 (+1)).

            // Let's implement visualizer loop starting from calculating step 1.

            setDp([1, 1]); // Manually set step 1 base case for smoother viz or calc it?
            // Let's calculate step 1 based on just step 0 if we assume step -1 is 0.
            // Or simpler: Base cases dp[0]=1, dp[1]=1. 
            // Loop from 2 to n.

            setCurrentStep(2);
            setMessage('Base cases: Step 0 (1 way), Step 1 (1 way). Calculating Step 2...');
            return;
        }

        if (currentStep > n) {
            setMessage(`Finished! There are ${dp[n]} distinct ways to climb to the top (${n} steps).`);
            setIsFinished(true);
            return;
        }

        const waysOneStepBack = dp[currentStep - 1];
        const waysTwoStepsBack = dp[currentStep - 2];
        const totalWays = waysOneStepBack + waysTwoStepsBack;

        const newDp = [...dp, totalWays];
        setDp(newDp);

        setMessage(`Step ${currentStep}: \nFrom Step ${currentStep - 1} (1 hop): ${waysOneStepBack} ways. \nFrom Step ${currentStep - 2} (2 hops): ${waysTwoStepsBack} ways. \nTotal: ${waysOneStepBack} + ${waysTwoStepsBack} = ${totalWays}.`);

        setCurrentStep(currentStep + 1);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentStep === 0 ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Stairs (n):</label>
                    <input
                        type="number"
                        value={n}
                        onChange={(e) => { setN(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                        min={1} max={20}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            {/* Stairs Visualization */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', paddingBottom: '20px', overflowX: 'auto' }}>
                {/* We simulate stairs growing in height */}
                {Array.from({ length: n + 1 }).map((_, idx) => {
                    const isCurrent = idx === currentStep;
                    const isPrev1 = idx === currentStep - 1;
                    const isPrev2 = idx === currentStep - 2;
                    const val = dp[idx] !== undefined ? dp[idx] : '?';

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px' }}>
                            <div style={{ marginBottom: '5px', color: isCurrent ? 'var(--accent-primary)' : '#888', fontWeight: isCurrent ? 'bold' : 'normal' }}>
                                {val}
                            </div>
                            <motion.div
                                animate={{
                                    height: `${(idx + 1) * 15}px`,
                                    backgroundColor: (isPrev1 || isPrev2) ? 'rgba(52, 152, 219, 0.5)' : idx === currentStep ? 'var(--accent-primary)' : '#444'
                                }}
                                style={{
                                    width: '40px',
                                    borderRadius: '4px 4px 0 0',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ position: 'absolute', bottom: '5px', width: '100%', textAlign: 'center', fontSize: '0.7rem', color: 'black', fontWeight: 'bold' }}>
                                    {idx}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClimbingStairsVisualizer;
