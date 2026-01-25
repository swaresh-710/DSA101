import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import SetsMapsVisualizer from '../../Visualizer/SetsMapsVisualizer';

const SetsMapsContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Sets & Maps (Hashing)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    <code>std::unordered_set</code> and <code>std::unordered_map</code> use Hashing to achieve O(1) average time complexity for insertions and lookups.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Hash Table Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    See how keys are mapped to buckets using a simple hash function: <code>sum(ASCII) % 5</code>. Keys with the same hash land in the same bucket (Collision), handled here by Chaining.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <SetsMapsVisualizer />
                </div>
            </section>

            <section>
                <h3>C++ STL Syntax</h3>
                <CodeBlock code={`#include <unordered_set>
#include <unordered_map>

int main() {
    // Set (Unique keys)
    std::unordered_set<int> distinct;
    distinct.insert(10);
    distinct.insert(10); // Ignored
    
    // Map (Key-Value pairs)
    std::unordered_map<string, int> counts;
    counts["apple"] = 5;
    
    if (counts.find("apple") != counts.end()) {
        // Found
    }
}`} />
            </section>
        </div>
    );
};

export default SetsMapsContent;
