import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import ProductExceptSelfVisualizer from '../../Visualizer/Blind75/ProductExceptSelfVisualizer';

const ProductExceptSelfContent = () => {
    const codeSnippet = `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, 1);
        
        // Calculate prefix products directly into result
        int prefix = 1;
        for(int i=0; i<n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        
        // Calculate suffix products and multiply with result
        int suffix = 1;
        for(int i=n-1; i>=0; i--) {
            res[i] *= suffix;
            suffix *= nums[i];
        }
        
        return res;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Product of Array Except Self</h2>
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
                        href="https://leetcode.com/problems/product-of-array-except-self/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.
                    <br /><br />
                    You must write an algorithm that runs in <strong style={{ color: 'var(--accent-primary)' }}>O(n)</strong> time and without using the division operation.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Prefix & Suffix Products</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    The product of all elements except <code>i</code> is effectively (Product of all on Left) * (Product of all on Right). We can compute these two partial products in two passes.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <ProductExceptSelfVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Two passes (or three) over the array.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Excluding the output array, we only use scalar variables for prefix/suffix.</li>
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

export default ProductExceptSelfContent;
