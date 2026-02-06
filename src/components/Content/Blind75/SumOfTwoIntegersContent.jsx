import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import SumOfTwoIntegersVisualizer from '../../Visualizer/Blind75/SumOfTwoIntegersVisualizer';

const SumOfTwoIntegersContent = () => {
    const codeSnippet = `class Solution {
public:
    int getSum(int a, int b) {
        while(b != 0) {
            // Calculate sum without carry
            int sum = a ^ b;
            // Calculate carry (bits where both are 1), shifted left
            // Cast to unsigned to handle negative number shift behavior cleanly in C++ if needed
            int carry = (unsigned int)(a & b) << 1;
            
            a = sum;
            b = carry;
        }
        return a;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Sum of Two Integers</h2>
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
                        href="https://leetcode.com/problems/sum-of-two-integers/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given two integers <code>a</code> and <code>b</code>, return <em>the sum of the two integers</em> without using the operators <code>+</code> and <code>-</code>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Bitwise Logic</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We simulate addition using <strong>XOR</strong> (`^`) for the sum without carry and <strong>AND</strong> (`&`) followed by left shift (`{'<<'}`) for the carry.
                    <br />
                    We repeat this until there is no carry left (`b == 0`).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <SumOfTwoIntegersVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(1)</code> - Since integers are fixed size (32-bit), the loop runs a constant number of times (at most 32).</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code>.</li>
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

export default SumOfTwoIntegersContent;
