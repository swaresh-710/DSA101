import React from 'react';

const IntroContent = () => {
    return (
        <div className="theory-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Welcome to C++ Fundamentals</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    C++ is a high-performance, general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language. It is widely used for systems programming, game development, and high-frequency trading applications where performance is critical.
                </p>

                <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Performance</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Direct memory manipulation and zero-overhead abstractions make C++ extremely fast.</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>Control</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You have complete control over memory management (Stack vs Heap).</p>
                    </div>
                    <div>
                        <h3 style={{ color: '#ffbd2e', marginBottom: '0.5rem' }}>Standard Library</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The STL provides highly optimized data structures and algorithms out of the box.</p>
                    </div>
                </div>
            </div>

            <section>
                <h3>Why Learn Data Structures in C++?</h3>
                <p>
                    Most competitive programming libraries and high-performance systems use C++ because of the STL (Standard Template Library).
                    Understanding how <code>std::vector</code>, <code>std::map</code>, and <code>std::set</code> work under the hood is crucial for writing efficient code.
                </p>
            </section>
        </div>
    );
};

export default IntroContent;
