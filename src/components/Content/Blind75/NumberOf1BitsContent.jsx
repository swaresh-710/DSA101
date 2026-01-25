import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import NumberOf1BitsVisualizer from '../../Visualizer/Blind75/NumberOf1BitsVisualizer';

const NumberOf1BitsContent = () => {
    const codeSnippet = `class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count = 0;
        while (n != 0) {
            n = n & (n - 1);
            count++;
        }
        return count;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Number of 1 Bits</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(46, 204, 113, 0.2)',
                        color: '#2ecc71',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(46, 204, 113, 0.4)'
                    }}>
                        Easy
                    </span>
                    <a
                        href="https://leetcode.com/problems/number-of-1-bits/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Brian Kernighan's Algorithm</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Instead of checking every bit, we can use the trick <code>n & (n - 1)</code> which removes the <strong>rightmost set bit</strong> from <code>n</code>. We repeat this until <code>n</code> becomes 0.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <NumberOf1BitsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(K)</code> where K is the number of set bits. In worst case <code>O(32) ≈ O(1)</code>.</li>
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

export default NumberOf1BitsContent;
