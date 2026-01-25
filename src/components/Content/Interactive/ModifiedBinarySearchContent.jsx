import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import BinarySearchVisualizer from '../../Visualizer/BinarySearchVisualizer';

const ModifiedBinarySearchContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Modified Binary Search</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Binary Search is the most efficient way to search in a sorted collection (O(log N)). Modified versions include Order-Agnostic Binary Search or searching in Bitonic arrays.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Binary Search Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    See how the search space (highlighted) is cut in half in every step.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <BinarySearchVisualizer />
                </div>
            </section>

            <section>
                <h3>Standard Implementation</h3>
                <CodeBlock code={`int search(vector<int>& nums, int target) {
    int start = 0;
    int end = nums.size() - 1;

    while(start <= end) {
        int mid = start + (end - start) / 2;
        
        if(target < nums[mid]) {
            end = mid - 1;
        } else if (target > nums[mid]) {
            start = mid + 1;
        } else {
            return mid; // Found
        }
    }
    return -1;
}`} />
            </section>
        </div>
    );
};

export default ModifiedBinarySearchContent;
