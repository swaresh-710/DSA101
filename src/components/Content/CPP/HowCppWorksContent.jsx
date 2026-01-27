import React from 'react';
import MemoryLayoutVisualizer from '../../Visualizer/CPP/MemoryLayoutVisualizer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HowCppWorksContent = () => {
    return (
        <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'sans-serif', lineHeight: '1.6' }}>

            {/* Intro Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Under the Hood: How C++ Runs
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
                    When you write C++ code and hit "Run", a complex chain of events turns your text into a running program.
                    Unlike interpreted languages (Python/JS), C++ runs directly on the hardware. Let's explore the magic.
                </p>
            </div>

            {/* Compilation Pipeline */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
                    1. The Compilation Pipeline
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <PipelineStep
                        step="1" title="Preprocessor"
                        desc="Handles #include, #define. Replaces text."
                        icon="📄" color="#3b82f6"
                    />
                    <PipelineStep
                        step="2" title="Compiler"
                        desc="Translates C++ to Assembly instructions."
                        icon="⚙️" color="#8b5cf6"
                    />
                    <PipelineStep
                        step="3" title="Assembler"
                        desc="Converts Assembly to Machine Code (0s & 1s)."
                        icon="🤖" color="#10b981"
                    />
                    <PipelineStep
                        step="4" title="Linker"
                        desc="Combines object files into one executable (.exe)."
                        icon="🔗" color="#f59e0b"
                    />
                </div>

                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#cbd5e1' }}>Example Transformation</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Source Code (.cpp)</span>
                            <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ margin: '0.5rem 0', borderRadius: '0.25rem', fontSize: '0.9rem' }}>
                                {`#define PI 3.14\nint main() {\n  return PI * 2;\n}`}
                            </SyntaxHighlighter>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#64748b' }}>↓</div>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>After Preprocessor (Translation Unit)</span>
                            <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ margin: '0.5rem 0', borderRadius: '0.25rem', fontSize: '0.9rem' }}>
                                {`// content of iostream included here...\nint main() {\n  return 3.14 * 2;\n}`}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
            </section>

            {/* Memory Model */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
                    2. Memory Layout: Stack vs Heap
                </h3>
                <p style={{ marginBottom: '1.5rem', color: '#cbd5e1' }}>
                    Once your program runs, the OS assigns it a chunk of memory (RAM). This memory is divided into specific segments, each with a unique purpose.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ background: '#1e1b4b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #4338ca' }}>
                        <h4 style={{ color: '#818cf8', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>The Stack</h4>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c7d2fe', fontSize: '0.95rem', spaceY: '0.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Stores local variables and function calls.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Fast allocation</strong> (just moving a pointer).</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Automatic</strong>: memory is freed when variables go out of scope.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Size is limited (Stack Overflow if too deep).</li>
                        </ul>
                    </div>
                    <div style={{ background: '#064e3b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #059669' }}>
                        <h4 style={{ color: '#34d399', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>The Heap</h4>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#d1fae5', fontSize: '0.95rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Stores dynamic objects (`new`, `malloc`).</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Slower allocation</strong> (must find free space).</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Manual</strong>: You must `delete` or use smart pointers.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Size is large (limited by system RAM).</li>
                        </ul>
                    </div>
                </div>

                {/* Interactive Visualizer */}
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#e2e8f0', marginBottom: '1rem', fontWeight: 'bold' }}>Interactive Memory Explorer</h4>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Click the buttons below to act like the OS and allocate memory. Watch how Stack grows down and Heap grows up!
                    </p>
                    <MemoryLayoutVisualizer />
                </div>
            </section>

            {/* Code Deep Dive */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #f59e0b', paddingLeft: '1rem' }}>
                    3. Code Breakdown
                </h3>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #334155', background: '#1e293b' }}>
                        <span style={{ fontWeight: 'bold', color: '#94a3b8' }}>memory_demo.cpp</span>
                    </div>
                    <div style={{ padding: '0' }}>
                        <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ margin: 0, padding: '1.5rem' }} showLineNumbers={true}>
                            {`#include <iostream>

int globalVar = 42;        // [Data Segment] Initialized global

int main() {
    int x = 10;            // [Stack] Local variable (4 bytes)
    
    int* ptr = new int(5); // [Stack] Pointer (8 bytes) stores address 0x...
                           // [Heap] Actual integer (4 bytes) at address 0x...
    
    delete ptr;            // [Heap] Mark object as free
                           // [Stack] 'ptr' still exists but is dangling!
                           
    return 0;              // [Stack] 'x' and 'ptr' popped automatically
}`}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </section>

        </div>
    );
};

// Helper component for pipeline steps
const PipelineStep = ({ step, title, desc, icon, color }) => (
    <div style={{ background: `${color}15`, border: `1px solid ${color}40`, padding: '1.25rem', borderRadius: '0.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '-10px', background: color, color: 'white', width: '24px', height: '24px', borderRadius: '50%', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', lineHeight: '24px' }}>{step}</div>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
        <h4 style={{ fontWeight: 'bold', color: color, marginBottom: '0.5rem' }}>{title}</h4>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{desc}</p>
    </div>
);

export default HowCppWorksContent;
