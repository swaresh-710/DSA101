import React, { useState } from 'react';

const PointersVisualizer = () => {
    // Simulated Memory Block
    const [memory, setMemory] = useState([
        { address: '0x100', value: 10, name: 'a' },
        { address: '0x104', value: '0x100', name: 'ptr' },
        { address: '0x108', value: 42, name: 'b' },
        { address: '0x10C', value: null, name: null },
    ]);

    // pointer 'ptr' points to 'a' initially (value is 0x100)

    const [explanation, setExplanation] = useState('We have an integer "a" at address 0x100 and a pointer "ptr" at 0x104 storing the address of "a".');

    const updateValue = () => {
        // *ptr = 20
        const newMemory = [...memory];
        newMemory[0].value = 20; // accessing via address 0x100
        setMemory(newMemory);
        setExplanation('Executed *ptr = 20. Since ptr holds 0x100, we follow it to the address 0x100 and change the value there.');
    };

    const pointToB = () => {
        // ptr = &b
        const newMemory = [...memory];
        newMemory[1].value = '0x108';
        setMemory(newMemory);
        setExplanation('Executed ptr = &b. Now ptr stores 0x108, which is the address of variable "b".');
    };

    const reset = () => {
        setMemory([
            { address: '0x100', value: 10, name: 'a' },
            { address: '0x104', value: '0x100', name: 'ptr' },
            { address: '0x108', value: 42, name: 'b' },
            { address: '0x10C', value: null, name: null },
        ]);
        setExplanation('Reset state. ptr points to a.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={updateValue} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                        *ptr = 20
                    </button>
                    <button onClick={pointToB} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px' }}>
                        ptr = &b
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
                <p style={{ color: 'var(--text-primary)' }}>{explanation}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0' }}>
                {memory.map((cell) => {
                    const isPointer = typeof cell.value === 'string' && cell.value.startsWith('0x');

                    return (
                        <div key={cell.address} style={{
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '1rem',
                            minWidth: '120px',
                            background: 'var(--bg-secondary)',
                            position: 'relative'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {cell.address}
                            </div>

                            <div style={{
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: isPointer ? 'var(--accent-secondary)' : 'var(--text-primary)',
                                background: 'var(--bg-primary)',
                                borderRadius: '4px',
                                border: '1px solid #333'
                            }}>
                                {cell.value ?? '-'}
                            </div>

                            {cell.name && (
                                <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                    {cell.name}
                                </div>
                            )}

                            {/* Visual Arrow for Pointer simulation */}
                            {isPointer && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.8rem',
                                    color: 'var(--accent-secondary)'
                                }}>
                                    points to {cell.value}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PointersVisualizer;
