import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import MaxProductSubarrayVisualizer from '../../Visualizer/Blind75/MaxProductSubarrayVisualizer';

const MaxProductSubarrayContent = () => {
    const codeSnippet = `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maxSoFar = nums[0];
        int minSoFar = nums[0];
        int result = maxSoFar;
        
        for(int i = 1; i < nums.size(); i++) {
            int curr = nums[i];
            // Store previous max because it gets updated
            int tempMax = max({curr, curr * maxSoFar, curr * minSoFar});
            minSoFar = min({curr, curr * maxSoFar, curr * minSoFar});
            
            maxSoFar = tempMax;
            result = max(result, maxSoFar);
        }
        return result;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Maximum Product Subarray</h2>
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
                        href="https://leetcode.com/problems/maximum-product-subarray/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an integer array <code>nums</code>, find a subarray that has the largest product, and return <em>the product</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Tracking Min & Max</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Because multiplying by a negative number flips the sign, we must track both the <strong>Maximum</strong> product and <strong>Minimum</strong> product ending at the current position.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <MaxProductSubarrayVisualizer />
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

export default MaxProductSubarrayContent;
