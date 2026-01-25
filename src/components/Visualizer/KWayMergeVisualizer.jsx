import React, { useState } from 'react';

const KWayMergeVisualizer = () => {
    // 3 Sorted Arrays
    const [lists, setLists] = useState([
        [2, 6, 8],
        [3, 6, 7],
        [1, 3, 4]
    ]);
    const [merged, setMerged] = useState([]);
    // Pointers for each list
    const [pointers, setPointers] = useState([0, 0, 0]);
    const [message, setMessage] = useState('Click Next to merge smallest.');
    const [done, setDone] = useState(false);

    const step = () => {
        if (done) return;

        let minVal = Infinity;
        let minListIdx = -1;

        // Find min among current heads
        for (let i = 0; i < lists.length; i++) {
            if (pointers[i] < lists[i].length) {
                if (lists[i][pointers[i]] < minVal) {
                    minVal = lists[i][pointers[i]];
                    minListIdx = i;
                }
            }
        }

        if (minListIdx === -1) {
            setDone(true);
            setMessage('All lists merged!');
            return;
        }

        // Push min to merged, advance pointer
        setMerged(prev => [...prev, minVal]);
        setPointers(prev => {
            const newP = [...prev];
            newP[minListIdx]++;
            return newP;
        });
        setMessage(`Picked ${minVal} from List ${minListIdx + 1}.`);
    };

    const reset = () => {
        setMerged([]);
        setPointers([0, 0, 0]);
        setDone(false);
        setMessage('Ready.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={step} disabled={done} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px' }}>
                        Next Step
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {lists.map((list, listIdx) => (
                    <div key={listIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '60px', fontWeight: 'bold' }}>List {listIdx + 1}:</div>
                        {list.map((val, idx) => (
                            <div key={idx} style={{
                                padding: '5px 10px',
                                background: idx < pointers[listIdx] ? '#333' : (idx === pointers[listIdx] ? 'var(--accent-primary)' : 'var(--bg-secondary)'),
                                opacity: idx < pointers[listIdx] ? 0.3 : 1,
                                borderRadius: '4px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                {val}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div style={{ borderTop: '1px solid #555', paddingTop: '1rem' }}>
                <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Merged Result:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {merged.map((val, idx) => (
                        <div key={idx} style={{
                            padding: '5px 10px',
                            background: 'var(--accent-secondary)',
                            borderRadius: '4px',
                            color: 'black',
                            animation: 'fadeIn 0.3s ease'
                        }}>
                            {val}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default KWayMergeVisualizer;
