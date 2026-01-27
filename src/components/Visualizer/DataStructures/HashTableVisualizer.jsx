import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HashTable.css';

const HashTableVisualizer = () => {
    // Configuration
    const INITIAL_CAPACITY = 5;
    const LOAD_FACTOR_THRESHOLD = 0.7;

    // State
    // buckets is an array of arrays: [ [{key,val}, {key,val}], [], ... ]
    const [buckets, setBuckets] = useState(Array.from({ length: INITIAL_CAPACITY }, () => []));
    const [capacity, setCapacity] = useState(INITIAL_CAPACITY);
    const [size, setSize] = useState(0);
    const [inputKey, setInputKey] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [log, setLog] = useState([]);
    const [activeOp, setActiveOp] = useState(null); // { key, hash, index, step }

    const addLog = (msg) => setLog(prev => [...prev.slice(-4), msg]);

    // Simple Hash Function: Sum of char codes
    const hashFunc = (key) => {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash;
    };

    const insert = async () => {
        if (!inputKey || !inputValue) return;
        if (activeOp) return;

        const key = inputKey;
        const val = inputValue;
        const rawHash = hashFunc(key);
        const index = rawHash % capacity;

        setActiveOp({ key, hash: rawHash, index, step: 'hashing' });
        addLog(`Hashing "${key}": ${rawHash} % ${capacity} = Index ${index}`);

        await delay(1000);

        setActiveOp({ key, hash: rawHash, index, step: 'inserting' });

        setBuckets(prev => {
            const newBuckets = [...prev];
            const chain = [...newBuckets[index]];

            // Check for update
            const existingIdx = chain.findIndex(item => item.key === key);
            if (existingIdx !== -1) {
                chain[existingIdx] = { key, val };
                addLog(`Key "${key}" exists. Updating value.`);
            } else {
                chain.push({ key, val });
                addLog(`Inserted "${key}" into Bucket ${index}.`);
                setSize(s => s + 1);
            }
            newBuckets[index] = chain;
            return newBuckets;
        });

        await delay(800);
        setActiveOp(null);
        setInputKey('');
        setInputValue('');

        // Check Resize
        if ((size + 1) / capacity > LOAD_FACTOR_THRESHOLD) {
            // trigger resize? (Simplification: Just warn or separate button for simplicity, 
            // but automatic is cooler)
            // Let's do automatic resize for the "Wow" factor.
            // But we need to wait for the state update of 'size' which is async. 
            // Ideally we check size + 1.
            // Implemented in a separate effect or just logic here? 
            // Logic here is fine if we use the *new* size.
        }
    };

    const resize = async () => {
        if (activeOp) return;
        addLog(`Load Factor > ${LOAD_FACTOR_THRESHOLD}. Resizing...`);
        const newCap = capacity * 2;
        const newBuckets = Array.from({ length: newCap }, () => []);

        // Rehash all
        let count = 0;
        buckets.flat().forEach(item => {
            const h = hashFunc(item.key);
            const idx = h % newCap;
            newBuckets[idx].push(item);
            count++;
        });

        setCapacity(newCap);
        setBuckets(newBuckets);
        addLog(`Resized to ${newCap}. Rehashed ${count} items.`);
    };

    const clear = () => {
        setBuckets(Array.from({ length: INITIAL_CAPACITY }, () => []));
        setCapacity(INITIAL_CAPACITY);
        setSize(0);
        setLog([]);
    };

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    const loadFactor = (size / capacity).toFixed(2);

    return (
        <div className="ht-viz-container">
            <div className="ht-header">
                <div className="ht-stats">
                    <div className="stat-box">
                        <span className="label">Size</span>
                        <span className="val">{size}</span>
                    </div>
                    <div className="stat-box">
                        <span className="label">Buckets</span>
                        <span className="val">{capacity}</span>
                    </div>
                    <div className="stat-box">
                        <span className="label">Load Factor</span>
                        <span className={`val ${loadFactor > 0.7 ? 'warn' : ''}`}>{loadFactor}</span>
                    </div>
                </div>
                <div className="ht-controls">
                    <input
                        className="ht-input"
                        placeholder="Key"
                        value={inputKey}
                        onChange={e => setInputKey(e.target.value)}
                    />
                    <input
                        className="ht-input"
                        placeholder="Value"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <button className="ht-btn insert" onClick={insert}>Insert</button>
                    {(size / capacity > LOAD_FACTOR_THRESHOLD) && (
                        <button className="ht-btn resize animate-pulse" onClick={resize}>Diffuse Load (Resize)</button>
                    )}
                    <button className="ht-btn clear" onClick={clear}>Clear</button>
                </div>
            </div>

            <div className="ht-console">
                {log.map((l, i) => <div key={i} className="log-line">{l}</div>)}
            </div>

            <div className="ht-buckets-container">
                {buckets.map((chain, index) => (
                    <div key={index} className={`bucket-row ${activeOp?.index === index ? 'active-bucket' : ''}`}>
                        <div className="bucket-index">
                            <span className="b-idx">{index}</span>
                        </div>
                        <div className="bucket-chain">
                            <AnimatePresence>
                                {chain.map((item, i) => (
                                    <motion.div
                                        key={item.key}
                                        initial={{ scale: 0, x: -20 }}
                                        animate={{ scale: 1, x: 0 }}
                                        exit={{ scale: 0 }}
                                        className="chain-node"
                                    >
                                        <div className="node-key">{item.key}</div>
                                        <div className="node-val">{item.val}</div>
                                        {i < chain.length - 1 && <div className="chain-link">➔</div>}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {chain.length === 0 && <span className="empty-indicator">nullptr</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Animation Overlay for Hashing? */}
            {activeOp && activeOp.step === 'hashing' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hash-calculation"
                >
                    <div className="calc-text">
                        hash("{activeOp.key}") = {activeOp.hash} <br />
                        {activeOp.hash} % {capacity} = <strong>{activeOp.index}</strong>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default HashTableVisualizer;
