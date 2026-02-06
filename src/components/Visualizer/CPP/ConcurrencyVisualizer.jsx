import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Concurrency.css';

const ConcurrencyVisualizer = () => {
    // State
    const [counter, setCounter] = useState(0);
    const [threads, setThreads] = useState({
        t1: { id: 1, name: 'Thread 1', state: 'idle', reg: null, locked: false },
        t2: { id: 2, name: 'Thread 2', state: 'idle', reg: null, locked: false }
    });
    const [mutex, setMutex] = useState({ locked: false, owner: null });
    const [mode, setMode] = useState('unsafe'); // unsafe | safe
    const [logs, setLogs] = useState(["Select mode: Unsafe (Race Condition) or Safe (Mutex)"]);
    const [isRunning, setIsRunning] = useState(false);

    const log = (msg) => setLogs(prev => [...prev.slice(-3), msg]);

    const reset = () => {
        setCounter(0);
        setThreads({
            t1: { id: 1, name: 'Thread 1', state: 'idle', reg: null, locked: false },
            t2: { id: 2, name: 'Thread 2', state: 'idle', reg: null, locked: false }
        });
        setMutex({ locked: false, owner: null });
        setLogs(["Reset complete."]);
        setIsRunning(false);
    };

    const runRaceCondition = async () => {
        if (isRunning) return;
        setIsRunning(true);
        reset();
        await delay(300);
        setLogs([]);
        log("Starting Race Condition simulation...");

        // 1. Both Read (Interleaved)
        // T1 Reads 0
        updateThread('t1', { state: 'reading' });
        log("T1 reads counter (0)");
        await delay(1000);
        updateThread('t1', { reg: 0, state: 'processing' });

        // T2 Reads 0 (BEFORE T1 writes!)
        updateThread('t2', { state: 'reading' });
        log("T2 reads counter (0) -- SAME VALUE!");
        await delay(1000);
        updateThread('t2', { reg: 0, state: 'processing' });

        // 2. Both Increment Local Register
        await delay(500);
        updateThread('t1', { reg: 1 });
        log("T1 increments local register to 1");

        await delay(500);
        updateThread('t2', { reg: 1 });
        log("T2 increments local register to 1");

        // 3. Both Write Back
        // T1 writes 1
        await delay(800);
        updateThread('t1', { state: 'writing' });
        log("T1 writes 1 to shared memory");
        setCounter(1);
        await delay(500);
        updateThread('t1', { state: 'idle', reg: null });

        // T2 writes 1 (Overwriting T1 effectively, though value is same 1)
        await delay(800);
        updateThread('t2', { state: 'writing' });
        log("T2 writes 1 to shared memory (CLOBBERED!)");
        setCounter(1); // Still 1!
        await delay(500);
        updateThread('t2', { state: 'idle', reg: null });

        log("Finished. Count is 1. Expected 2. (Lost Update!)");
        setIsRunning(false);
    };

    const runSafe = async () => {
        if (isRunning) return;
        setIsRunning(true);
        reset();
        await delay(300);
        setLogs([]);
        log("Starting Mutex Protected simulation...");

        // T1 Acquires Lock
        log("T1 attempts to lock Mutex...");
        updateThread('t1', { state: 'locking' });
        await delay(800);
        setMutex({ locked: true, owner: 't1' });
        updateThread('t1', { locked: true, state: 'idle' });
        log("T1 acquired lock. (Green)");

        // T2 Tries to Acquire Lock (BLOCKED)
        log("T2 attempts to lock Mutex...");
        updateThread('t2', { state: 'blocked' }); // Red
        await delay(1000);
        log("T2 is BLOCKED by Mutex.");

        // T1 Critical Section
        updateThread('t1', { state: 'reading' });
        log("T1 reads counter (0)");
        await delay(800);
        updateThread('t1', { reg: 0, state: 'processing' });

        await delay(500);
        updateThread('t1', { reg: 1 });
        log("T1 increments local (1)");

        updateThread('t1', { state: 'writing' });
        log("T1 writes 1");
        setCounter(1);
        await delay(800);

        // T1 Release Lock
        setMutex({ locked: false, owner: null });
        updateThread('t1', { locked: false, state: 'idle', reg: null });
        log("T1 releases lock.");

        // NOW T2 can proceed
        updateThread('t2', { state: 'locking' });
        await delay(500);
        setMutex({ locked: true, owner: 't2' });
        updateThread('t2', { locked: true, state: 'idle' });
        log("T2 acquired lock.");

        // T2 Critical Section
        updateThread('t2', { state: 'reading' });
        log("T2 reads counter (1)");
        await delay(800);
        updateThread('t2', { reg: 1, state: 'processing' });

        await delay(500);
        updateThread('t2', { reg: 2 });
        log("T2 increments local (2)");

        updateThread('t2', { state: 'writing' });
        log("T2 writes 2");
        setCounter(2);
        await delay(800);

        // T2 Release
        setMutex({ locked: false, owner: null });
        updateThread('t2', { locked: false, state: 'idle', reg: null });
        log("T2 releases lock.");

        log("Finished. Count is 2. Correct!");
        setIsRunning(false);
    };

    const updateThread = (key, updates) => {
        setThreads(prev => ({
            ...prev,
            [key]: { ...prev[key], ...updates }
        }));
    };

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    return (
        <div className="conc-viz-container">
            <div className="conc-header">
                <div className="visualizer-controls">
                    <button className="conc-btn btn-unsafe" onClick={runRaceCondition} disabled={isRunning}>Unsafe Increment</button>
                    <button className="conc-btn btn-safe" onClick={runSafe} disabled={isRunning}>Safe (Mutex)</button>
                    <button className="conc-btn btn-reset" onClick={reset} disabled={isRunning}>Reset</button>
                </div>
            </div>

            <div className="conc-stage">
                {/* Thread T1 */}
                <ThreadLane thread={threads.t1} mutex={mutex} />

                {/* Shared Resources */}
                <div className="shared-zone">
                    <div className={`mutex-box ${mutex.locked ? (mutex.owner === 't1' ? 'owned-t1' : 'owned-t2') : 'free'}`}>
                        <div className="mutex-icon">🔒</div>
                        <div className="mutex-label">{mutex.locked ? `Locked by ${mutex.owner === 't1' ? 'T1' : 'T2'}` : 'Unlocked'}</div>
                    </div>

                    <div className="memory-box">
                        <div className="mem-label">Shared Memory</div>
                        <div className="mem-val">{counter}</div>
                    </div>
                </div>

                {/* Thread T2 */}
                <ThreadLane thread={threads.t2} mutex={mutex} />
            </div>

            <div className="conc-console">
                {logs.map((l, i) => <div key={i} className="log-line">{l}</div>)}
            </div>
        </div>
    );
};

const ThreadLane = ({ thread, mutex }) => {
    return (
        <div className={`thread-lane ${thread.state === 'blocked' ? 'blocked' : ''}`}>
            <div className="thread-header">
                <div className="thread-icon">⚙️</div>
                <div className="thread-name">{thread.name}</div>
            </div>

            <div className="thread-body">
                <div className="register-box">
                    <span className="reg-label">Register (Local)</span>
                    <span className="reg-val">{thread.reg !== null ? thread.reg : '-'}</span>
                </div>

                {/* Actions visualizer */}
                <div className="action-area">
                    {thread.state === 'reading' && <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="action-pill read">Reading...</motion.div>}
                    {thread.state === 'writing' && <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="action-pill write">Writing...</motion.div>}
                    {thread.state === 'locking' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="action-pill lock">Acquiring Lock...</motion.div>}
                    {thread.state === 'blocked' && <motion.div animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity }} className="action-pill block">BLOCKED!</motion.div>}
                </div>
            </div>
        </div>
    );
};

export default ConcurrencyVisualizer;
