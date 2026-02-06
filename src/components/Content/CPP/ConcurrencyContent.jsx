import React from 'react';
import ConcurrencyVisualizer from '../../Visualizer/CPP/ConcurrencyVisualizer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ConcurrencyContent = () => {
    return (
        <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'sans-serif', lineHeight: '1.6' }}>

            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #ef4444, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Multithreading & Race Conditions
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
                    Standard C++11 introduced powerful concurrency tools. But with great power comes the most dangerous bug in programming: <strong>The Race Condition</strong>.
                </p>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444', paddingLeft: '1rem' }}>
                    Interactive: The "Lost Update" Bug
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    Try the <strong>Unsafe</strong> mode. Two threads attempt to increment `Counter`. Because the operation isn't atomic (Read &rarr; Modify &rarr; Write), one update overwrites the other. Then use <strong>Safe</strong> mode to fix it with a Mutex.
                </p>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <ConcurrencyVisualizer />
                </div>
            </section>

            {/* Theory Breakdown */}
            <section className="responsive-grid-2" style={{ marginBottom: "4rem" }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1rem' }}>
                        Concurrency Concepts
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li>
                            <strong>Race Condition:</strong> When the outcome depends on the unpredictable order of thread execution.
                        </li>
                        <li>
                            <strong>Critical Section:</strong> Code that accesses shared resources. Only one thread should execute this at a time.
                        </li>
                        <li>
                            <strong>Mutex (Mutual Exclusion):</strong> A lock that ensures only one thread can enter the Critical Section.
                        </li>
                    </ul>
                </div>
                <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                    <h4 style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>Safe Locking (RAII)</h4>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Never manually `lock()` and `unlock()`. Use `std::lock_guard` to automatically unlock when scopes end (even if exceptions are thrown!).
                    </p>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ fontSize: '0.8rem', borderRadius: '0.25rem' }}>
                        {`// Shared Data
int counter = 0;
std::mutex mtx;

void safeIncrement() {
    // Constructor locks mutex
    std::lock_guard<std::mutex> lock(mtx); 
    
    // Critical Section
    counter++; 
    
    // Destructor unlocks mutex
}`}
                    </SyntaxHighlighter>
                </div>
            </section>
        </div>
    );
};

export default ConcurrencyContent;
