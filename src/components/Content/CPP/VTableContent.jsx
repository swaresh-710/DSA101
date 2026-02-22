import React from 'react';
import VTableVisualizer from '../../Visualizer/CPP/VTableVisualizer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const VTableContent = () => {
    return (
        <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'sans-serif', lineHeight: '1.6' }}>

            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #facc15, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Polymorphism & Virtual Tables
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
                    How does C++ know which function to call when you have a pointer to a Base class? The secret lies in the <strong>Virtual Table (vtable)</strong>.
                </p>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #facc15', paddingLeft: '1rem' }}>
                    Interactive: The "vptr" Lookup
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    Create objects and click 'speak()'. Watch the yellow highlight trace the path from the <strong>Object</strong> &rarr; <strong>V-Table</strong> &rarr; <strong>Code</strong>.
                </p>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <VTableVisualizer />
                </div>
            </section>

            {/* Theory Breakdown */}
            <section className="responsive-grid-2" style={{ marginBottom: "4rem" }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1rem' }}>
                        Under the Hood
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li>
                            <strong>The Hidden Member:</strong> Every object of a class with virtual functions contains a hidden pointer called <strong>vptr</strong>.
                        </li>
                        <li>
                            <strong>The Static Table:</strong> The compiler creates a static table (V-Table) for <em>each class</em> containing addresses of its virtual functions.
                        </li>
                        <li>
                            <strong>Dynamic Dispatch:</strong> When you call <code>{"ptr->speak()"}</code>, the compiler runs:
                            <br />
                            <code style={{ background: '#020617', padding: '0.2rem', fontFamily: 'monospace', color: '#facc15' }}>
                                {"call (ptr->vptr[0])"}
                            </code>
                        </li>
                    </ul>
                </div>
                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                    <h4 style={{ color: '#f43f5e', fontWeight: 'bold', marginBottom: '0.5rem' }}>The Cost of "virtual"</h4>
                    <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Polymorphism isn't free!
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Space:</span>
                        <span style={{ color: '#64748b' }}>+8 bytes per object (for the vptr).</span>

                        <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Time:</span>
                        <span style={{ color: '#64748b' }}>Extra memory hop (dereference vptr) + pipeline stalls.</span>
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem' }}>
                    Code Structure
                </h3>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ margin: 0, padding: '1.5rem' }} showLineNumbers={true}>
                        {`class Animal {
public:
    virtual void speak() { cout << "Generic noise"; } // offset 0
    void eat() { ... } // Non-virtual (Direct call)
};

class Dog : public Animal {
public:
    void speak() override { cout << "Woof!"; } // Overrides slot 0
};

int main() {
    Animal* p = new Dog(); // p->vptr points to Dog_vtable
    
    p->speak(); 
    // Runtime: finds Dog::speak() via vptr -> Woof!
    
    p->eat();
    // Compile-time: Jump directly to Animal::eat()
}`}
                    </SyntaxHighlighter>
                </div>
            </section>
        </div>
    );
};

export default VTableContent;
