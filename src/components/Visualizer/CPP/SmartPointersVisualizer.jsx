import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SmartPointers.css';

const SmartPointersVisualizer = () => {
    // We simulate a stack of scopes. 
    // Each scope has ID and list of pointers.
    // Pointers point to a specific Resource ID.
    const [scopes, setScopes] = useState([
        { id: 'global', name: 'Global Scope', pointers: [] }
    ]);

    // Resources: { id, type: 'Car', name: 'Car A', refCount: 0, weakCount: 0 }
    const [resources, setResources] = useState([]);

    // Auto-incrementers
    const [nextResId, setNextResId] = useState(1);
    const [logs, setLogs] = useState([]);

    const log = (msg) => setLogs(prev => [...prev.slice(-3), msg]);

    // Actions
    const pushScope = () => {
        const newId = `scope_${Date.now()}`;
        setScopes(prev => [...prev, { id: newId, name: `Scope ${prev.length}`, pointers: [] }]);
        log(`Entered new Scope { ... }`);
    };

    const popScope = () => {
        if (scopes.length <= 1) {
            log("Cannot pop Global scope!");
            return;
        }

        const scopeToEnd = scopes[scopes.length - 1];

        // Destroy all pointers in this scope
        // For shared_ptr this means decrement refCount
        // For unique_ptr this means destroy resource

        // We need to process this carefully to animate
        const pointersToRemove = scopeToEnd.pointers;

        let newResources = [...resources];

        pointersToRemove.forEach(ptr => {
            if (ptr.type === 'shared') {
                const resIndex = newResources.findIndex(r => r.id === ptr.targetId);
                if (resIndex !== -1) {
                    newResources[resIndex].refCount--;
                    log(`shared_ptr ${ptr.name} destroyed. RefCount: ${newResources[resIndex].refCount}`);
                    if (newResources[resIndex].refCount === 0) {
                        log(`Resource ${newResources[resIndex].name} destroyed! (RAII)`);
                    }
                }
            } else if (ptr.type === 'unique') {
                // Determine if unique ptr owns it (it always should)
                const resIndex = newResources.findIndex(r => r.id === ptr.targetId);
                if (resIndex !== -1) {
                    // Destroy resource
                    newResources[resIndex].refCount = 0; // Mark for death
                    log(`unique_ptr ${ptr.name} out of scope. Resource destroyed!`);
                }
            }
        });

        // Remove dead resources
        const aliveResources = newResources.filter(r => r.refCount > 0);

        setResources(aliveResources);
        setScopes(prev => prev.slice(0, -1));
        log(`Exited Scope.`);
    };

    const createUnique = () => {
        const activeScope = scopes[scopes.length - 1];
        const resId = nextResId;
        setNextResId(prev => prev + 1);

        const newRes = { id: resId, type: 'Car', name: `Car ${resId}`, refCount: 1 };
        const newPtr = { id: Date.now(), name: `u${resId}`, type: 'unique', targetId: resId };

        setResources(prev => [...prev, newRes]);
        updateScope(activeScope.id, [...activeScope.pointers, newPtr]);
        log(`auto u${resId} = make_unique<Car>();`);
    };

    const createShared = () => {
        const activeScope = scopes[scopes.length - 1];

        // If there are existing shared resources, maybe create a pointer TO them?
        // Simplicity: Button "Copy Shared" vs "New Shared"

        const resId = nextResId;
        setNextResId(prev => prev + 1);

        const newRes = { id: resId, type: 'Widget', name: `Widget ${resId}`, refCount: 1 };
        const newPtr = { id: Date.now(), name: `s${resId}`, type: 'shared', targetId: resId };

        setResources(prev => [...prev, newRes]);
        updateScope(activeScope.id, [...activeScope.pointers, newPtr]);
        log(`auto s${resId} = make_shared<Widget>(); // RefCount: 1`);
    };

    const copyShared = (ptrToCopy) => {
        const activeScope = scopes[scopes.length - 1];
        const newPtrName = `s${ptrToCopy.targetId}_copy`;
        const newPtr = { id: Date.now(), type: 'shared', name: newPtrName, targetId: ptrToCopy.targetId };

        // Inc Ref Count
        setResources(prev => prev.map(r =>
            r.id === ptrToCopy.targetId ? { ...r, refCount: r.refCount + 1 } : r
        ));

        updateScope(activeScope.id, [...activeScope.pointers, newPtr]);
        const r = resources.find(r => r.id === ptrToCopy.targetId);
        log(`shared_ptr ${newPtrName} = ${ptrToCopy.name}; // RefCount: ${r.refCount + 1}`);
    };

    const updateScope = (scopeId, newPointers) => {
        setScopes(prev => prev.map(s => s.id === scopeId ? { ...s, pointers: newPointers } : s));
    };

    const reset = () => {
        setScopes([{ id: 'global', name: 'Global Scope', pointers: [] }]);
        setResources([]);
        setNextResId(1);
        setLogs([]);
    };

    return (
        <div className="sp-viz-container">
            <div className="sp-sidebar">
                <h3 className="sp-title">Code Actions</h3>
                <div className="visualizer-controls">
                    <button className="sp-btn btn-scope" onClick={pushScope}>Push Scope {'{'}</button>
                    <button className="sp-btn btn-scope-pop" onClick={popScope} disabled={scopes.length === 1}>Pop Scope {'}'}</button>
                    <div className="sp-divider"></div>
                    <button className="sp-btn btn-unique" onClick={createUnique}>make_unique</button>
                    <button className="sp-btn btn-shared" onClick={createShared}>make_shared</button>
                    <div className="sp-divider"></div>
                    <button className="sp-btn btn-reset" onClick={reset}>Reset</button>
                </div>
                <div className="sp-logs">
                    {logs.map((l, i) => <div key={i} className="log-line">{l}</div>)}
                </div>
            </div>

            <div className="sp-display-area">
                {/* Visualizing Scopes as nested boxes? Or stacked? Stacked is clearer for stack frames. */}
                <div className="scopes-stack">
                    <AnimatePresence>
                        {scopes.map((scope, index) => (
                            <motion.div
                                key={scope.id}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 50, opacity: 0 }}
                                className="scope-box"
                                style={{ marginLeft: `${index * 20}px`, zIndex: index }}
                            >
                                <div className="scope-label">{scope.name}</div>
                                <div className="pointers-container">
                                    {scope.pointers.map(ptr => (
                                        <div key={ptr.id} className={`pointer-card ${ptr.type}`}>
                                            <div className="ptr-name">{ptr.name}</div>
                                            <div className="ptr-arrow">⬇</div>
                                            {/* If shared, allow copy */}
                                            {ptr.type === 'shared' && (
                                                <button className="btn-copy-tiny" onClick={() => copyShared(ptr)}>Copy</button>
                                            )}
                                        </div>
                                    ))}
                                    {scope.pointers.length === 0 && <span className="empty-text">Empty Scope</span>}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Heap Area */}
                <div className="heap-area">
                    <div className="heap-label">Heap Memory</div>
                    <div className="resources-grid">
                        <AnimatePresence>
                            {resources.map(res => (
                                <motion.div
                                    key={res.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{
                                        scale: 0, opacity: 0,
                                        rotate: 20, backgroundColor: '#ef4444'
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="resource-card"
                                >
                                    <div className="res-name">{res.name}</div>
                                    <div className="res-type">{res.type}</div>
                                    <div className="ref-count-badge">
                                        Refs: <span className="count-val">{res.refCount}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartPointersVisualizer;
