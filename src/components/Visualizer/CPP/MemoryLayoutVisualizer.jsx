import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MemoryLayout.css';

const MemoryLayoutVisualizer = () => {
    const [memoryState, setMemoryState] = useState({
        stack: [],
        heap: [],
        data: [], // Globals/Statics
        text: true // Code segment, always there
    });

    const [activeSnippet, setActiveSnippet] = useState(null);
    const [consoleOutput, setConsoleOutput] = useState([]);

    const addToConsole = (msg) => {
        setConsoleOutput(prev => [...prev.slice(-4), msg]);
    };

    const runSnippet = (type) => {
        setActiveSnippet(type);

        switch (type) {
            case 'stack_var':
                setMemoryState(prev => ({
                    ...prev,
                    stack: [...prev.stack, { id: Date.now(), name: 'int x = 10', size: 4, value: '10' }]
                }));
                addToConsole('> int x = 10; // Pushed to Stack');
                break;
            case 'heap_alloc':
                const addr = '0x' + Math.floor(Math.random() * 10000).toString(16);
                const ptrId = Date.now();

                // Add pointer to stack, object to heap
                setMemoryState(prev => ({
                    ...prev,
                    stack: [...prev.stack, { id: ptrId, name: 'int* p', size: 8, value: addr, pointsTo: addr }],
                    heap: [...prev.heap, { id: addr, address: addr, value: '20', size: 4 }]
                }));
                addToConsole('> int* p = new int(20); // Stack ptr -> Heap');
                break;
            case 'function_call':
                // Simulate a stack frame
                setMemoryState(prev => ({
                    ...prev,
                    stack: [...prev.stack, { id: Date.now(), name: 'func() frame', size: 64, type: 'frame' }]
                }));
                addToConsole('> func(); // New Stack Frame');
                break;
            case 'pop':
                if (memoryState.stack.length > 0) {
                    const item = memoryState.stack[memoryState.stack.length - 1];
                    setMemoryState(prev => ({
                        ...prev,
                        stack: prev.stack.slice(0, -1)
                    }));
                    // If it was a pointer, remove corresponding heap if we were simulating full RAII (optional, manually for now)
                    addToConsole(`> End of scope; ${item.name} popped.`);
                } else {
                    addToConsole('> Stack is empty!');
                }
                break;
            case 'delete':
                // Find a heap pointer in stack? For simplicity just clear last heap alloc
                if (memoryState.heap.length > 0) {
                    setMemoryState(prev => ({
                        ...prev,
                        heap: prev.heap.slice(0, -1)
                    }));
                    addToConsole('> delete p; // Freed from Heap');
                } else {
                    addToConsole('> Nothing in Heap to delete!');
                }
                break;
            case 'global':
                if (memoryState.data.length === 0) {
                    setMemoryState(prev => ({
                        ...prev,
                        data: [...prev.data, { id: 'g1', name: 'static int Count', value: '0' }]
                    }));
                    addToConsole('> static int Count = 0; // Stored in Data Segment');
                } else {
                    addToConsole('> Global already initialized.');
                }
                break;
            default:
                break;
        }
    };

    const reset = () => {
        setMemoryState({ stack: [], heap: [], data: [], text: true });
        setConsoleOutput([]);
        setActiveSnippet(null);
    };

    return (
        <div className="memory-viz-container">
            {/* Controls Panel */}
            <div className="viz-panel-controls">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Memory Operations</h3>

                <div className="control-group">
                    <ControlBtn onClick={() => runSnippet('stack_var')} label="Stack Var (int x)" desc="Fast allocation, automatic cleanup" color="blue" />
                    <ControlBtn onClick={() => runSnippet('function_call')} label="Function Call" desc="New Stack Frame (context)" color="indigo" />
                    <ControlBtn onClick={() => runSnippet('heap_alloc')} label="Heap Alloc (new)" desc="Dynamic memory, manual management" color="emerald" />
                    <ControlBtn onClick={() => runSnippet('global')} label="Static/Global" desc="Fixed size, Data Segment" color="purple" />

                    <div style={{ height: '1rem' }}></div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <ControlBtn onClick={() => runSnippet('pop')} label="Pop Stack" color="red" small />
                        <ControlBtn onClick={() => runSnippet('delete')} label="Delete Heap" color="orange" small />
                    </div>

                    <button onClick={reset} className="control-btn btn-slate" style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Reset Memory
                    </button>
                </div>

                <div className="console-output">
                    <div className="console-header">Console Output</div>
                    {consoleOutput.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>

            {/* Visualizer Panel */}
            <div className="viz-panel-display">

                {/* Header showing High vs Low Address */}
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>High Address (0xFFFFFFFF)</div>
                <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>Low Address (0x00000000)</div>

                {/* Stack (Grows Down) */}
                <div className="stack-section">
                    <div className="segment-label label-stack">STACK</div>
                    <AnimatePresence>
                        {memoryState.stack.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                className={`memory-block ${item.type === 'frame' ? 'block-frame' : 'block-stack'}`}
                            >
                                <span style={{ fontFamily: 'monospace' }}>{item.name}</span>
                                {item.pointsTo && <span style={{ fontSize: '0.75rem', color: '#34d399' }}>→ {item.pointsTo}</span>}
                                {!item.pointsTo && item.value && <span className="small-tag">{item.value}</span>}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Free Space */}
                <div style={{ height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: '0.75rem', fontStyle: 'italic' }}>
                    Available Memory Space
                </div>

                {/* Heap (Grows Up) */}
                <div className="heap-section">
                    <div className="segment-label label-heap">HEAP</div>
                    <AnimatePresence>
                        {memoryState.heap.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="memory-block block-heap"
                            >
                                <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontFamily: 'monospace' }}>{item.address}</div>
                                <div style={{ fontSize: '0.875rem' }}>Value: {item.value}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Data & Text Segments */}
                <div className="static-section">
                    <div className="data-segment">
                        <div className="segment-title title-data">Data Segment</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {memoryState.data.map(d => (
                                <span key={d.id} className="small-tag">{d.name}</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-segment">
                        <div className="segment-title title-text">Text Segment (Code)</div>
                        <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#64748b' }}>
                            01010011 11010101...
                            <br />Binary instructions
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ControlBtn = ({ onClick, label, desc, color, small }) => {
    return (
        <button
            onClick={onClick}
            className={`control-btn btn-${color}`}
            style={{ padding: small ? '0.5rem' : '0.75rem' }}
        >
            <div className="btn-label" style={{ fontSize: small ? '0.875rem' : '1rem' }}>{label}</div>
            {!small && desc && <div className="btn-desc">{desc}</div>}
        </button>
    );
};

export default MemoryLayoutVisualizer;
