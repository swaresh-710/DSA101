import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VTableVisualizer.css';

const VTableVisualizer = () => {
    // V-Table Definitions
    const vtables = {
        Animal: {
            name: 'Animal_vtable',
            address: '0x8000',
            entries: [
                { offset: 0, func: 'speak', codeAddr: '0x100 (Animal::speak)' },
                { offset: 1, func: 'eat', codeAddr: '0x120 (Animal::eat)' }
            ]
        },
        Dog: {
            name: 'Dog_vtable',
            address: '0x8040',
            entries: [
                { offset: 0, func: 'speak', codeAddr: '0x200 (Dog::speak)' },
                { offset: 1, func: 'eat', codeAddr: '0x120 (Animal::eat)' } // Inherited
            ]
        },
        Cat: {
            name: 'Cat_vtable',
            address: '0x8080',
            entries: [
                { offset: 0, func: 'speak', codeAddr: '0x300 (Cat::speak)' },
                { offset: 1, func: 'eat', codeAddr: '0x120 (Animal::eat)' } // Inherited
            ]
        }
    };

    // Heap Objects
    const [objects, setObjects] = useState([]);
    const [nextId, setNextId] = useState(1);

    // Animation State
    const [activeTrace, setActiveTrace] = useState(null); // { step: 0-3, objId: 1, func: 'speak' }
    const [log, setLog] = useState([]);

    const addLog = (msg) => setLog(prev => [...prev.slice(-4), msg]);

    const createObject = (type) => {
        const id = nextId;
        setNextId(prev => prev + 1);
        const addr = 0x5000 + (id * 16);

        const newObj = {
            id,
            type,
            address: `0x${addr.toString(16)}`,
            vptr: vtables[type].address,
            data: type === 'Dog' ? 'bones: 5' : (type === 'Cat' ? 'lives: 9' : 'generic: 0')
        };
        setObjects(prev => [...prev, newObj]);
        addLog(`Animal* p${id} = new ${type}();`);
    };

    const callFunction = async (obj, funcName) => {
        if (activeTrace) return;

        // Start Animation Sequence
        // Step 1: Dereference ptr to get Object
        setActiveTrace({ step: 1, objId: obj.id, func: funcName });
        addLog(`p${obj.id}->${funcName}();`);
        addLog(`1. Access Object at ${obj.address}`);

        await delay(1000);

        // Step 2: Read vptr
        setActiveTrace({ step: 2, objId: obj.id, func: funcName });
        addLog(`2. Read vptr: ${obj.vptr} (Points to ${obj.type}_vtable)`);

        await delay(1000);

        // Step 3: Lookup in V-Table
        setActiveTrace({ step: 3, objId: obj.id, func: funcName, vtable: obj.type });
        const entry = vtables[obj.type].entries.find(e => e.func === funcName);
        addLog(`3. Lookup '${funcName}' at offset ${entry.offset}`);

        await delay(1000);

        // Step 4: Jump to Code
        setActiveTrace({ step: 4, objId: obj.id, func: funcName, vtable: obj.type, code: entry.codeAddr });
        addLog(`4. CALL ${entry.codeAddr}`);

        await delay(1500);
        setActiveTrace(null);
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const reset = () => {
        setObjects([]);
        setNextId(1);
        setLog([]);
        setActiveTrace(null);
    };

    return (
        <div className="vt-viz-container">
            {/* Control Panel */}
            <div className="visualizer-controls">
                <h3 className="vt-title">Runtime Simulation</h3>
                <div className="btn-group">
                    <button className="vt-btn" onClick={() => createObject('Animal')}>new Animal()</button>
                    <button className="vt-btn" onClick={() => createObject('Dog')}>new Dog()</button>
                    <button className="vt-btn" onClick={() => createObject('Cat')}>new Cat()</button>
                </div>
                <button className="vt-btn btn-reset" onClick={reset}>Reset</button>

                <div className="vt-console">
                    {log.map((l, i) => <div key={i} className="log-entry">{l}</div>)}
                </div>
            </div>

            {/* Memory View */}
            <div className="vt-memory">

                {/* Heap Area */}
                <div className="memory-section heap">
                    <div className="section-label">Heap (Objects)</div>
                    <div className="objects-list">
                        <AnimatePresence>
                            {objects.map(obj => (
                                <motion.div
                                    key={obj.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1, y: 0,
                                        borderColor: activeTrace?.objId === obj.id ? '#facc15' : '#475569',
                                        scale: activeTrace?.objId === obj.id && activeTrace?.step === 1 ? 1.05 : 1
                                    }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="heap-object"
                                >
                                    <div className="obj-header">
                                        <span className="obj-name">p{obj.id}</span>
                                        <span className="obj-addr">{obj.address}</span>
                                    </div>

                                    {/* Member Variables */}
                                    <div className={`obj-member vptr ${activeTrace?.objId === obj.id && activeTrace?.step === 2 ? 'active-vptr' : ''}`}>
                                        <span className="mem-type">vptr</span>
                                        <span className="mem-val">{obj.vptr}</span>
                                    </div>
                                    <div className="obj-member">
                                        <span className="mem-type">data</span>
                                        <span className="mem-val">{obj.data}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="obj-actions">
                                        <button className="btn-call" disabled={!!activeTrace} onClick={() => callFunction(obj, 'speak')}>speak()</button>
                                        <button className="btn-call" disabled={!!activeTrace} onClick={() => callFunction(obj, 'eat')}>eat()</button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* V-Table Area (Static Data) */}
                <div className="memory-section static">
                    <div className="section-label">Code / Static Data (V-Tables)</div>
                    <div className="vtables-list">
                        {Object.entries(vtables).map(([type, table]) => (
                            <div
                                key={type}
                                className={`vtable-card ${activeTrace?.vtable === type ? 'active-table' : ''}`}
                            >
                                <div className="vt-header">
                                    <div className="vt-name">{table.name}</div>
                                    <div className="vt-addr">{table.address}</div>
                                </div>
                                {table.entries.map((entry, i) => (
                                    <div
                                        key={i}
                                        className={`vt-row ${activeTrace?.vtable === type && activeTrace?.func === entry.func && activeTrace?.step >= 3 ? 'active-row' : ''}`}
                                    >
                                        <span className="vt-offset">+{entry.offset * 8}</span>
                                        <span className="vt-func">{entry.func}</span>
                                        <span className="vt-ptr">→ {entry.codeAddr}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Overlay Connection Lines could go here with SVG, but simplifying to Step-based Highlighting for robustness */}
        </div>
    );
};

export default VTableVisualizer;
