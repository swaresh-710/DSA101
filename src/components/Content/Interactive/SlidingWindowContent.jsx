import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import SlidingWindowVisualizer from '../../Visualizer/SlidingWindowVisualizer';

const SlidingWindowContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Sliding Window Pattern</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    The Sliding Window pattern is used to perform a required operation on a specific window size of a given array or linked list, such as finding the longest subarray containing all 1s. Sliding Windows start from the 1st element and keep shifting right by one element and adjust the length of the window according to the problem that you are solving.
                </p>

                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-secondary)' }}>
                    <h3>Problem: Max Sum Subarray of size K</h3>
                    <p>Given an array of integers and a number k, find the maximum sum of a subarray of size k.</p>
                </div>
            </div>

            {/* Visualizer Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Interactive Visualization</h3>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <SlidingWindowVisualizer />
                </div>
            </section>

            <section>
                <h3>Algorithm Implementation</h3>
                <CodeBlock code={`int maxSum(vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;

    int max_sum = 0;
    int current_sum = 0;

    // Calculate sum of first window
    for (int i = 0; i < k; i++)
        current_sum += arr[i];
    
    max_sum = current_sum;

    // Slide window
    for (int i = k; i < n; i++) {
        current_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, current_sum);
    }

    return max_sum;
}`} />
            </section>
        </div>
    );
};

export default SlidingWindowContent;
