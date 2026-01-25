import React, { useState } from 'react';

const SetsMapsVisualizer = () => {
    // Determine bucket from hash
    const bucketCount = 5;
    const [buckets, setBuckets] = useState(Array(bucketCount).fill(null).map(() => []));
    const [inputKey, setInputKey] = useState('');

    const hashFunction = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash + str.charCodeAt(i)) % bucketCount;
        }
        return hash;
    };

    const insert = () => {
        if (!inputKey) return;
        const idx = hashFunction(inputKey);

        const newBuckets = [...buckets];
        if (!newBuckets[idx].includes(inputKey)) {
            newBuckets[idx].push(inputKey);
            setBuckets(newBuckets);
        }
        setInputKey('');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Key to Insert"
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white', marginRight: '1rem' }}
                />
                <button onClick={insert} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                    Insert Key
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                {buckets.map((bucket, idx) => (
                    <div key={idx} style={{
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        minHeight: '150px'
                    }}>
                        <div style={{ borderBottom: '1px solid #444', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#888' }}>
                            Bucket {idx}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {bucket.map((k, i) => (
                                <div key={i} style={{
                                    padding: '0.4rem',
                                    background: 'var(--accent-secondary)',
                                    borderRadius: '4px',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    animation: 'slideIn 0.3s ease'
                                }}>
                                    {k}
                                </div>
                            ))}
                            {bucket.length === 0 && <span style={{ fontSize: '0.8rem', color: '#555', fontStyle: 'italic' }}>Empty</span>}
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SetsMapsVisualizer;
