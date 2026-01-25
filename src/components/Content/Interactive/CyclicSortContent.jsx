import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import CyclicSortVisualizer from '../../Visualizer/CyclicSortVisualizer';

const CyclicSortContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Cyclic Sort</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    This pattern is perfect for problems involving arrays containing numbers in a given range (like 1 to N). We can sort the array in **O(N)** time without using extra space by placing each number at its correct index.
                </p>
                <div className="glass-panel" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-secondary)' }}>
                    <p>
                        **Core Idea:** In a sorted array of 1 to N, the number 'val' should be at index 'val-1'. If it's not, swap it to its correct place.
                    </p>
                </div>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Interactive Sort</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Watch how we continually swap the current number to its correct index until the correct number for the current position lands there.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <CyclicSortVisualizer />
                </div>
            </section>

            <section>
                <h3>Algorithm</h3>
                <CodeBlock code={`void cyclicSort(vector<int> &nums) {
    int i = 0;
    while (i < nums.size()) {
        int correct = nums[i] - 1; // 1-based to 0-based
        if (nums[i] != nums[correct]) {
            swap(nums[i], nums[correct]);
        } else {
            i++;
        }
    }
}`} />
            </section>
        </div>
    );
};

export default CyclicSortContent;
