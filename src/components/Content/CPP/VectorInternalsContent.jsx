import React from 'react';
import VectorVisualizer from '../../Visualizer/CPP/VectorVisualizer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const VectorInternalsContent = () => {
    return (
        <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'sans-serif', lineHeight: '1.6' }}>

            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    std::vector Internals: Dynamic Arrays
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
                    The <code>std::vector</code> is the workhorse of C++. It looks like a magical array that grows infinitely, but under the hood, it's just a raw C-pointer managing a block of memory.
                </p>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
                    Interactive Demo: The Doubling Strategy
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    Add elements and watch what happens when <strong>Size</strong> exceeds <strong>Capacity</strong>.
                </p>
                <VectorVisualizer />
            </section>

            {/* Theory Breakdown */}
            <section className="responsive-grid-2" style={{ marginBottom: "4rem" }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1rem' }}>
                        How it Works
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>
                            <strong>Triple Pointers</strong>: A typical vector is implemented with 3 pointers:
                            <code style={{ background: '#1e293b', padding: '2px 5px', borderRadius: '4px', marginLeft: '5px' }}>_start</code>,
                            <code style={{ background: '#1e293b', padding: '2px 5px', borderRadius: '4px', marginLeft: '5px' }}>_finish</code> (end of data),
                            <code style={{ background: '#1e293b', padding: '2px 5px', borderRadius: '4px', marginLeft: '5px' }}>_end_of_storage</code> (end of capacity).
                        </li>
                        <li>
                            <strong>Doubling</strong>: When full, it allocates a new block <strong>2x</strong> the current size.
                        </li>
                        <li>
                            <strong>Copying</strong>: It copies (or moves) all existing elements to the new block.
                        </li>
                        <li>
                            <strong>Deallocation</strong>: The old block is deleted from the heap.
                        </li>
                    </ul>
                </div>
                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                    <h4 style={{ color: '#facc15', fontWeight: 'bold', marginBottom: '0.5rem' }}>⚠️ Pointer Invalidation</h4>
                    <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
                        Because the entire memory block moves to a new address during resize, <strong>all pointers and iterators to elements become invalid</strong>.
                    </p>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ marginTop: '1rem', fontSize: '0.8rem', borderRadius: '0.25rem' }}>
                        {`std::vector<int> v = {1, 2};
int* p = &v[0]; // Points to 1

v.push_back(3); // Triggers resize! 
                // Moves to new address

cout << *p;     // CRASH! or Garbage`}
                    </SyntaxHighlighter>
                </div>
            </section>

            {/* Code Deep Dive */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
                    Simplified Implementation
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    Here is a bare-bones implementation of a vector to illustrate the logic.
                </p>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ margin: 0, padding: '1.5rem' }} showLineNumbers={true}>
                        {`template <typename T>
class MyVector {
    T* data;
    size_t capacity;
    size_t size;

public:
    void push_back(const T& value) {
        if (size == capacity) {
            // 1. Calculate new capacity
            size_t newCap = (capacity == 0) ? 1 : capacity * 2;
            
            // 2. Allocate new block
            T* newData = new T[newCap];
            
            // 3. Copy elements
            for (size_t i = 0; i < size; i++) {
                newData[i] = data[i]; // or std::move
            }
            
            // 4. Delete old block
            delete[] data;
            
            // 5. Update pointers
            data = newData;
            capacity = newCap;
        }
        
        // Insert new element
        data[size] = value;
        size++;
    }
};`}
                    </SyntaxHighlighter>
                </div>
            </section>
        </div>
    );
};

export default VectorInternalsContent;
