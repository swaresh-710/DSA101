import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MoveSemantics.css';

const MoveSemanticsVisualizer = () => {
    // Heap Memory Blocks
    // We simulate "Heavy Data" lying at some address
    const [heapBlocks, setHeapBlocks] = useState([
        { id: 1, address: '0x5000', content: 'Huge Data', owner: 'A' }
    ]);

    const [objA, setObjA] = useState({ name: 'Source (A)', ptr: '0x5000' });
    const [objB, setObjB] = useState({ name: 'Dest (B)', ptr: 'nullptr' });

    const [log, setLog] = useState("Ready. Choose Copy or Move.");
    const [animState, setAnimState] = useState('idle'); // idle, copying, moving

    const reset = () => {
        setHeapBlocks([{ id: 1, address: '0x5000', content: 'Huge Data', owner: 'A' }]);
        setObjA({ name: 'Source (A)', ptr: '0x5000' });
        setObjB({ name: 'Dest (B)', ptr: 'nullptr' });
        setLog("Ready. Reset complete.");
        setAnimState('idle');
    };

    const runCopy = async () => {
        if (animState !== 'idle') return;
        if (objA.ptr === 'nullptr') {
            setLog("Error: Source is empty!");
            return;
        }

        setAnimState('copying');
        setLog("Deep Copy started...");

        // 1. Allocate
        await delay(500);
        setLog("Allocating new memory for B...");

        // 2. Copy Data
        await delay(800);
        setLog("Copying data byte-by-byte... (Slow)");

        await delay(800);
        const newAddr = '0x6000';
        setHeapBlocks(prev => [...prev, { id: 2, address: newAddr, content: 'Huge Data', owner: 'B' }]);
        setObjB(prev => ({ ...prev, ptr: newAddr }));

        setLog("Done! B has its own independent copy. (Time: ~50ns)");
        setAnimState('idle');
    };

    const runMove = async () => {
        if (animState !== 'idle') return;
        if (objA.ptr === 'nullptr') {
            setLog("Error: Source is empty!");
            return;
        }

        setAnimState('moving');
        setLog("Move Assignment started...");

        // 1. Steal Pointer
        await delay(600);
        setLog("Stealing pointer from A to B...");

        // Update B to point to A's data
        // Update A to nullptr
        const addr = objA.ptr;

        setObjB(prev => ({ ...prev, ptr: addr }));
        setObjA(prev => ({ ...prev, ptr: 'nullptr' }));
        setHeapBlocks(prev => prev.map(b => b.address === addr ? { ...b, owner: 'B' } : b));

        setLog("Done! B stole A's data. A is empty. (Time: ~1ns)");
        setAnimState('idle');
    };

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    return (
        <div className="mv-viz-container">
            <div className="mv-header">
                <h3>Visualizing Ownership Transfer</h3>
                <div className="visualizer-controls">
                    <button className="mv-btn btn-copy" onClick={runCopy} disabled={animState !== 'idle'}>Deep Copy (const &)</button>
                    <button className="mv-btn btn-move" onClick={runMove} disabled={animState !== 'idle'}>Move (&&)</button>
                    <button className="mv-btn btn-reset" onClick={reset} disabled={animState !== 'idle'}>Reset</button>
                </div>
            </div>

            <div className="mv-status-bar">
                {log}
            </div>

            <div className="mv-main-view">
                {/* Stack Objects */}
                <div className="stack-panel">
                    <div className="panel-label">Stack Frame</div>

                    <div className="obj-container">
                        <div className="stack-obj">
                            <div className="obj-title">{objA.name}</div>
                            <div className={`ptr-box ${objA.ptr === 'nullptr' ? 'null' : ''}`}>
                                <span className="label">ptr:</span>
                                <span className="val">{objA.ptr}</span>
                            </div>
                        </div>

                        <div className="transfer-arrow-area">
                            {animState === 'moving' && <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 20, opacity: 1 }}
                                className="arrow-icon"
                            >➔</motion.div>}
                        </div>

                        <div className="stack-obj">
                            <div className="obj-title">{objB.name}</div>
                            <div className={`ptr-box ${objB.ptr === 'nullptr' ? 'null' : ''}`}>
                                <span className="label">ptr:</span>
                                <span className="val">{objB.ptr}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heap Memory */}
                <div className="heap-panel">
                    <div className="panel-label">Heap Memory</div>
                    <div className="heap-grid">
                        <AnimatePresence>
                            {heapBlocks.map(block => (
                                <motion.div
                                    key={block.address}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`heap-block owner-${block.owner}`}
                                >
                                    <div className="block-addr">{block.address}</div>
                                    <div className="block-content">{block.content}</div>
                                    <div className="block-owner">Owner: {block.owner}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* SVG Connections could simulate pointers, but simplistic UI is often clearer */}
        </div>
    );
};

export default MoveSemanticsVisualizer;
