import React, { useState } from 'react';

const LinkedListVisualizer = () => {
    const [nodes, setNodes] = useState([10, 20, 30]);

    // For visual purposes, we treat this array as a list of nodes linked together

    const addNode = () => {
        const newVal = Math.floor(Math.random() * 100);
        setNodes(prev => [...prev, newVal]);
    };

    const removeNode = () => {
        if (nodes.length > 0) {
            setNodes(prev => prev.slice(0, prev.length - 1));
        }
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={addNode} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                    Append Node
                </button>
                <button onClick={removeNode} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                    Remove Last
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', padding: '1rem 0' }}>
                <div style={{ marginRight: '1rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>HEAD &rarr;</div>

                {nodes.map((val, idx) => (
                    <React.Fragment key={idx}>
                        <div style={{
                            minWidth: '60px',
                            height: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--accent-secondary)',
                            background: 'var(--bg-secondary)',
                            borderRadius: '50%',
                            fontWeight: 'bold',
                            position: 'relative',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div>{val}</div>
                            <div style={{ fontSize: '0.6rem', color: '#666', marginTop: '2px' }}>Next</div>
                        </div>

                        {/* Arrow or Null */}
                        {idx < nodes.length - 1 ? (
                            <div style={{ margin: '0 10px', color: 'var(--text-secondary)', fontSize: '1.5rem' }}>&rarr;</div>
                        ) : (
                            <div style={{ margin: '0 10px', color: 'var(--text-secondary)' }}>&rarr; NULL</div>
                        )}
                    </React.Fragment>
                ))}

                {nodes.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>NULL</div>}
            </div>
        </div>
    );
};

export default LinkedListVisualizer;
