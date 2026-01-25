import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import MaxSubarrayVisualizer from '../../Visualizer/Blind75/MaxSubarrayVisualizer';

const MaxSubarrayContent = () => {
    const codeSnippet = `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSoFar = nums[0];
        int currentSum = nums[0];
        
        for(int i = 1; i < nums.size(); i++) {
            // Either extend the previous subarray or start a new one
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSoFar = max(maxSoFar, currentSum);
        }
        return maxSoFar;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Maximum Subarray</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(241, 196, 15, 0.2)',
                        color: '#f1c40f',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(241, 196, 15, 0.4)'
                    }}>
                        Medium
                    </span>
                    <a
                        href="https://leetcode.com/problems/maximum-subarray/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <em>its sum</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Kadane's Algorithm</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We traverse the array, maintaining a running <code>currentSum</code>. If adding the current number makes the sum smaller than the number itself (i.e., previous sum was negative), we "reset" the subarray to start at the current number.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <MaxSubarrayVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Single pass.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Linear space not required.</li>
                </ul>
                <CodeBlock
                    code={codeSnippet}
                    language="cpp"
                    showLineNumbers={true}
                />
            </section>
        </div>
    );
};

export default MaxSubarrayContent;
