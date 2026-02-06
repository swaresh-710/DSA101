import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import CountingBitsVisualizer from '../../Visualizer/Blind75/CountingBitsVisualizer';

const CountingBitsContent = () => {
    const codeSnippet = `class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> dp(n + 1);
        dp[0] = 0;
        for (int i = 1; i <= n; i++) {
            // dp[i] = dp[i / 2] + (i % 2)
            // i >> 1 is equivalent to i / 2
            // i & 1 is equivalent to i % 2
            dp[i] = dp[i >> 1] + (i & 1);
        }
        return dp;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Counting Bits</h2>
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
                        href="https://leetcode.com/problems/counting-bits/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an integer <code>n</code>, return an array <code>ans</code> of length <code>n + 1</code> such that for each <code>i</code> (<code>0 &lt;= i &lt;= n</code>), <code>ans[i]</code> is the <strong>number of 1's</strong> in the binary representation of <code>i</code>.
                    <br /><br />
                    Build it in <code>O(n)</code> time via Dynamic Programming.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Dynamic Programming</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We reuse the result from <code>i &gt;&gt; 1</code>.
                    <br />
                    <code>count(i) = count(i / 2) + (is_last_bit_1 ?)</code>.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <CountingBitsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - One pass.</li>
                    <li><strong>Space Complexity:</strong> <code>O(N)</code> - To store the output array.</li>
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

export default CountingBitsContent;
