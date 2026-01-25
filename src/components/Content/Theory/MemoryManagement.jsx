import React from 'react';
import CodeBlock from '../../UI/CodeBlock';

const MemoryManagement = () => {
    return (
        <div className="theory-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Memory Management in C++</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    One of C++'s most powerful features is manual memory management. Understanding how memory works is crucial for writing efficient and bug-free programs. The two main areas of memory are the **Stack** and the **Heap**.
                </p>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--accent-secondary)' }}>Stack</h4>
                        <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                            <li>Static memory allocation</li>
                            <li>Fast access / allocation</li>
                            <li>Automatic deallocation (scope-based)</li>
                            <li>Limited size</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--accent-primary)' }}>Heap</h4>
                        <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                            <li>Dynamic memory allocation</li>
                            <li>Slower access / allocation</li>
                            <li>Manual deallocation (delete / smart pointers)</li>
                            <li>Size limited only by RAM</li>
                        </ul>
                    </div>
                </div>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Stack vs Heap Example</h3>
                <p>Observe how variables are allocated. Stack variables are destroyed when they go out of scope, while Heap variables persist until explicitly deleted.</p>

                <CodeBlock code={`void stackExample() {
    int x = 10; // Allocated on Stack
    // x is automatically removed when function ends
}

void heapExample() {
    int* p = new int(10); // Allocated on Heap
    
    // We must manually delete it to prevent memory leaks
    delete p; 
}`} />
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Pointers and References</h3>
                <p>Pointers store memory addresses, while References are aliases for existing variables.</p>
                <CodeBlock code={`int main() {
    int a = 10;
    int* ptr = &a; // Pointer stores address of a
    int& ref = a;  // Reference is an alias for a
    
    *ptr = 20; // Modifies a through pointer
    ref = 30;  // Modifies a through reference
    
    // a is now 30
    return 0;
}`} />
            </section>
        </div>
    );
};

export default MemoryManagement;
