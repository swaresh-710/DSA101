import React, { useState } from 'react';

const MergeIntervalsVisualizer = () => {
    // Initial Intervals: [1,3], [2,6], [8,10], [15,18]
    const [intervals, setIntervals] = useState([
        { id: 1, start: 1, end: 3, merged: false },
        { id: 2, start: 2, end: 6, merged: false },
        { id: 3, start: 8, end: 10, merged: false },
        { id: 4, start: 15, end: 18, merged: false }
    ]);
    const [result, setResult] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('Sorted Intervals loaded. Click Merge.');

    const reset = () => {
        setIntervals([
            { id: 1, start: 1, end: 3, merged: false },
            { id: 2, start: 2, end: 6, merged: false },
            { id: 3, start: 8, end: 10, merged: false },
            { id: 4, start: 15, end: 18, merged: false }
        ]);
        setResult([]);
        setCurrentIndex(0);
        setProcessing(false);
        setMessage('Reset complete.');
    };

    const nextStep = () => {
        if (currentIndex >= intervals.length && !processing) {
            setMessage('All merged!');
            return;
        }

        // Logic handled step-by-step
        // 1. Initialize result with first interval
        if (result.length === 0) {
            setResult([intervals[0]]);
            setCurrentIndex(1);
            setMessage(`Started with first interval [${intervals[0].start}, ${intervals[0].end}]`);
            return;
        }

        const current = intervals[currentIndex];
        const lastMerged = result[result.length - 1];

        // 2. Check overlap
        if (current.start <= lastMerged.end) {
            // Overlap! Merge.
            const newEnd = Math.max(lastMerged.end, current.end);
            const mergedInterval = { ...lastMerged, end: newEnd };

            // UI Update
            const newResult = [...result];
            newResult[newResult.length - 1] = mergedInterval;
            setResult(newResult);

            setMessage(`Overlap detected! [${current.start}, ${current.end}] merges with [${lastMerged.start}, ${lastMerged.end}] -> [${lastMerged.start}, ${newEnd}]`);
        } else {
            // No overlap, add to result
            setResult(prev => [...prev, current]);
            setMessage(`No overlap. Adding [${current.start}, ${current.end}] to result.`);
        }

        setCurrentIndex(prev => prev + 1);
    };

    const timelineScale = 25; // pixels per unit

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>{message}</p>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={nextStep} disabled={currentIndex > intervals.length} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                        Next Step
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ position: 'relative', height: '150px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem', overflowX: 'auto' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.8rem', color: '#666' }}>Input Intervals</div>
                {intervals.map((int, i) => (
                    <div key={int.id} style={{
                        position: 'absolute',
                        left: int.start * timelineScale,
                        width: (int.end - int.start) * timelineScale,
                        top: 40,
                        height: '30px',
                        background: i < currentIndex ? '#444' : 'var(--accent-secondary)', // Gray out processed
                        opacity: i < currentIndex ? 0.3 : 1,
                        borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.8rem',
                        border: '1px solid #fff'
                    }}>
                        [{int.start}, {int.end}]
                    </div>
                ))}
            </div>

            <div style={{ position: 'relative', height: '150px', marginTop: '1rem', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem', overflowX: 'auto' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Merged Result</div>
                {result.map((int, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: int.start * timelineScale,
                        width: (int.end - int.start) * timelineScale,
                        top: 40,
                        height: '30px',
                        background: 'var(--accent-primary)',
                        borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.8rem',
                        border: '1px solid #fff',
                        transition: 'width 0.5s ease'
                    }}>
                        [{int.start}, {int.end}]
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MergeIntervalsVisualizer;
