import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VectorVisualizer.css'; // reusing CSS strategy

const VectorVisualizer = () => {
    const [vector, setVector] = useState({
        data: [],      // The elements
        capacity: 2,   // Current capacity
        address: 0x1000 // Fake memory address base
    });

    const [isResizing, setIsResizing] = useState(false);
    const [message, setMessage] = useState("Vector initialized. Capacity: 2");

    const pushBack = async () => {
        if (isResizing) return;

        const val = Math.floor(Math.random() * 99) + 1;
        const newSize = vector.data.length + 1;

        if (newSize > vector.capacity) {
            // Needs resize
            setMessage(`Capacity ${vector.capacity} reached! resizing to ${vector.capacity * 2}...`);
            setIsResizing(true);

            // Step 1: Show "old" block being full and maybe flash red
            await new Promise(r => setTimeout(r, 1000));

            // Step 2: "Allocate" new block (logically we just update state, visually we handle it)
            setMessage("Allocating new memory block... Copying elements...");
            // We simulate the resize delay
            await new Promise(r => setTimeout(r, 1500));

            setVector(prev => ({
                data: [...prev.data, val],
                capacity: prev.capacity * 2,
                address: prev.address + 0x500 // Move to "new" address
            }));

            setMessage(`Resized! Elements copied to new address 0x${(vector.address + 0x500).toString(16)}. New Capacity: ${vector.capacity * 2}`);
            setIsResizing(false);
        } else {
            setVector(prev => ({
                ...prev,
                data: [...prev.data, val]
            }));
            setMessage(`push_back(${val})`);
        }
    };

    const popBack = () => {
        if (vector.data.length === 0 || isResizing) {
            setMessage("Vector is empty!");
            return;
        }
        setVector(prev => ({
            ...prev,
            data: prev.data.slice(0, -1)
        }));
        setMessage("pop_back()");
    };

    const clear = () => {
        setVector({ data: [], capacity: 2, address: 0x1000 });
        setMessage("Vector cleared.");
    };

    return (
        <div className="vector-viz-container">
            {/* Header / Metrics */}
            <div className="vector-header">
                <div className="metric">
                    <span className="label">Size:</span>
                    <span className="value">{vector.data.length}</span>
                </div>
                <div className="metric">
                    <span className="label">Capacity:</span>
                    <span className="value">{vector.capacity}</span>
                </div>
                <div className="metric">
                    <span className="label">Data Ptr:</span>
                    <span className="value font-mono">0x{vector.address.toString(16)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="visualizer-controls">
                <button onClick={pushBack} disabled={isResizing} className="v-btn push">
                    push_back()
                </button>
                <button onClick={popBack} disabled={isResizing} className="v-btn pop">
                    pop_back()
                </button>
                <button onClick={clear} disabled={isResizing} className="v-btn clear">
                    Reset
                </button>
            </div>

            {/* Console/Message Area */}
            <div className="vector-message">
                {isResizing && <span className="animate-pulse">⚠️ </span>}
                {message}
            </div>

            {/* Visualizer Area */}
            <div className="vector-memory-view">
                <div className="memory-label">Heap Memory</div>
                <div className="vector-block" className="vector-block-responsive">
                    {/* Render actual elements */}
                    <AnimatePresence>
                        {vector.data.map((val, idx) => (
                            <motion.div
                                key={`${vector.address}-${idx}`} // Key changes on resize to force re-render/animation
                                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="vector-cell filled"
                            >
                                <div className="cell-index">{idx}</div>
                                <div className="cell-value">{val}</div>
                                <div className="cell-addr">0x{(vector.address + idx * 4).toString(16)}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Render empty capacity slots */}
                    {Array.from({ length: vector.capacity - vector.data.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="vector-cell empty">
                            <div className="cell-index">{vector.data.length + i}</div>
                            <div className="cell-value-placeholder">?</div>
                        </div>
                    ))}
                </div>

                {isResizing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="resize-overlay"
                    >
                        <div className="resize-arrow">⤵</div>
                        <div className="resize-text">Moving to new larger block...</div>
                    </motion.div>
                )}
            </div>

            <div className="viz-explanation">
                <p>
                    <strong>Visualizing Abstract Concepts:</strong> The
                    <span className="code-pill">std::vector</span> maintains a dynamic array.
                    When you <span className="code-pill">push_back</span> more elements than the current
                    <span className="code-pill">capacity</span>, it must:
                </p>
                <ol>
                    <li>Allocate a NEW block of memory (usually 2x size).</li>
                    <li>Move/Copy all existing elements to the new block.</li>
                    <li>Delete the OLD block.</li>
                </ol>
                <p>This is why pointers/iterators become invalid after a resize!</p>
            </div>
        </div>
    );
};

export default VectorVisualizer;
