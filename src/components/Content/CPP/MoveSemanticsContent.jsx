import React from 'react';
import MoveSemanticsVisualizer from '../../Visualizer/CPP/MoveSemanticsVisualizer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MoveSemanticsContent = () => {
    return (
        <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'sans-serif', lineHeight: '1.6' }}>

            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #4ade80, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Move Semantics: The Cost of Copying
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
                    In C++98, returning large objects meant copying them (slow!). C++11 introduced <strong>Move Semantics</strong> to "steal" resources from temporary objects instead of copying them.
                </p>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
                    Interactive: Copy vs Move
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    Compare the cost. <strong>Deep Copy</strong> allocates new memory (slow). <strong>Move</strong> just swaps pointers (fast).
                </p>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <MoveSemanticsVisualizer />
                </div>
            </section>

            {/* Theory Breakdown */}
            <section style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1rem' }}>
                        Value Categories
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li>
                            <strong>lvalue (Left Value):</strong> Has a name, has an address, persists. (e.g., `int x`).
                        </li>
                        <li>
                            <strong>rvalue (Right Value):</strong> A temporary value, no name, dies at end of line. (e.g., `5`, `x + y`, `Func()`).
                        </li>
                        <li>
                            <strong>std::move(x):</strong> A cast that treats an <em>lvalue</em> `x` as an <em>rvalue</em>, allowing its resources to be stolen.
                        </li>
                    </ul>
                </div>
                <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                    <h4 style={{ color: '#facc15', fontWeight: 'bold', marginBottom: '0.5rem' }}>The Move Constructor</h4>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        It takes an <strong>rvalue reference (`Type&& other`)</strong>.
                    </p>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ fontSize: '0.8rem', borderRadius: '0.25rem' }}>
                        {`String(String&& other) {
    // 1. Steal the pointer
    this->data = other.data;
    
    // 2. Nullify the source
    // (Crucial! Otherwise destructor kills details)
    other.data = nullptr; 
}`}
                    </SyntaxHighlighter>
                </div>
            </section>
        </div>
    );
};

export default MoveSemanticsContent;
