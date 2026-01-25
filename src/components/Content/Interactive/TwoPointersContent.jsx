import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TwoPointersVisualizer from '../../Visualizer/TwoPointersVisualizer';

const TwoPointersContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Two Pointers Pattern</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    The Two Pointers pattern involves using two pointers to iterate through a data structure (typically an array or linked list) to maximize efficiency. It is often used to search for pairs in a sorted array, or to reverse an array.
                </p>

                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-secondary)' }}>
                    <h3>Problem: Two Sum (Sorted)</h3>
                    <p>Given a sorted array of integers, find two numbers such that they add up to a specific target number.</p>
                </div>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Interactive Visualization</h3>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <TwoPointersVisualizer />
                </div>
            </section>

            <section>
                <h3>Algorithm Implementation</h3>
                <CodeBlock code={`vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;

    while (left < right) {
        int sum = numbers[left] + numbers[right];
        
        if (sum == target) {
            return {left + 1, right + 1}; // 1-based index
        } else if (sum < target) {
            left++; // Need larger sum
        } else {
            right--; // Need smaller sum
        }
    }
    return {};
}`} />
            </section>
        </div>
    );
};

export default TwoPointersContent;
