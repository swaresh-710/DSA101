import React from 'react';
import HashTableVisualizer from '../../Visualizer/DataStructures/HashTableVisualizer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HashTableContent = () => {
    return (
        <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'sans-serif', lineHeight: '1.6' }}>

            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Hash Table Internals
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
                    How does <code>std::unordered_map</code> or <code>HashMap</code> achieve O(1) lookups? It uses an array of <strong>Buckets</strong> and a <strong>Hash Function</strong> to jump directly to data.
                </p>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem', borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
                    Interactive: Separate Chaining
                </h3>
                <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                    Insert keys to see them hashed to a bucket index.
                    <br />
                    <strong>Try this:</strong> Insert "Cat" and "Dog". If they land in the same bucket, a <strong>Linked List</strong> (Chain) forms to handle the collision.
                </p>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <HashTableVisualizer />
                </div>
            </section>

            {/* Theory Breakdown */}
            <section style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1rem' }}>
                        Core Concepts
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li>
                            <strong>Hash Function:</strong> Converts a Key (string/int) into a specialized integer.
                        </li>
                        <li>
                            <strong>Bucket Index:</strong> Calculated as <code>Hash % Capacity</code>. This maps the huge hash range to the small array size.
                        </li>
                        <li>
                            <strong>Collision:</strong> When two keys map to the same bucket.
                        </li>
                    </ul>
                </div>
                <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                    <h4 style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '0.5rem' }}>Separate Chaining</h4>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        The most common strategy. Each bucket points to a Linked List.
                    </p>
                    <SyntaxHighlighter language="cpp" style={dracula} customStyle={{ fontSize: '0.8rem', borderRadius: '0.25rem' }}>
                        {`struct Node {
    Key key;
    Value value;
    Node* next;
};

// The Table is an array of pointers
Node* buckets[CAPACITY];

// Insert
int index = hash(key) % CAPACITY;
Node* newNode = new Node{key, val, buckets[index]};
buckets[index] = newNode; // Prepend`}
                    </SyntaxHighlighter>
                </div>
            </section>
        </div>
    );
};

export default HashTableContent;
