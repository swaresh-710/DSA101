import React from 'react';
import SmartPointersVisualizer from '../../Visualizer/CPP/SmartPointersVisualizer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SmartPointersContent = () => {
    return (
        <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'sans-serif', lineHeight: '1.6' }}>

            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Memory Safety with Smart Pointers (RAII)
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
                    Manual memory management (`new` / `delete`) is error-prone. Modern C++ solves this with <strong>RAII (Resource Acquisition Is Initialization)</strong>: wrapping resources in objects that automatically delete them when they go out of scope.
                </p>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #8b5cf6', paddingLeft: '1rem' }}>
                    Interactive: Scopes & Ownership
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    Use the simulator to create scopes (`{ }`) and variables. Watch how <strong>RefCount</strong> changes and when objects are destroyed.
                </p>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <SmartPointersVisualizer />
                </div>
            </section>

            {/* Theory Breakdown */}
            <section style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: '#1e1b4b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #4338ca' }}>
                    <h4 style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
                        std::unique_ptr
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#c7d2fe', marginBottom: '1rem' }}>
                        Sole ownership. An object can only be owned by one `unique_ptr`. It cannot be copied, only moved.
                    </p>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ fontSize: '0.8rem', borderRadius: '0.25rem' }}>
                        {`{
    auto p1 = std::make_unique<Car>();
    
    // auto p2 = p1; // ERROR! No copy
    
    auto p2 = std::move(p1); 
    // Now p2 owns Car, p1 includes nullptr
} // Car destroyed (p2 goes out of scope)`}
                    </SyntaxHighlighter>
                </div>

                <div style={{ background: '#064e3b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #059669' }}>
                    <h4 style={{ color: '#34d399', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
                        std::shared_ptr
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#d1fae5', marginBottom: '1rem' }}>
                        Shared ownership. Multiple pointers can own the same object. The object is destroyed only when the <strong>last</strong> pointer is destroyed (Reference Counting).
                    </p>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ fontSize: '0.8rem', borderRadius: '0.25rem' }}>
                        {`{
    auto p1 = std::make_shared<Car>();
    // RefCount: 1
    
    {
        auto p2 = p1; // Copy allowed!
        // RefCount: 2
    } // p2 dies, RefCount: 1
    
} // p1 dies, RefCount: 0 -> DESTROY`}
                    </SyntaxHighlighter>
                </div>
            </section>

            {/* RAII Deep Dive */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #f59e0b', paddingLeft: '1rem' }}>
                    The Magic of Destructors
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    RAII works because C++ guarantees that when a stack variable goes out of scope, its <strong>Destructor (`~Class()`)</strong> is called. Smart pointers simply call `delete` inside their destructor.
                </p>
            </section>
        </div>
    );
};

export default SmartPointersContent;
