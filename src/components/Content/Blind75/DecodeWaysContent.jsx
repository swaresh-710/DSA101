import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import DecodeWaysVisualizer from '../../Visualizer/Blind75/DecodeWaysVisualizer';

const DecodeWaysContent = () => {
    const codeSnippet = `class Solution {
public:
    int numDecodings(string s) {
        if (s[0] == '0') return 0;
        int n = s.size();
        vector<int> dp(n + 1, 0);
        dp[0] = 1;
        dp[1] = 1;

        for (int i = 2; i <= n; i++) {
            // Check single digit
            if (s[i-1] != '0') {
                dp[i] += dp[i-1];
            }
            // Check two digits
            int twoDigit = stoi(s.substr(i-2, 2));
            if (twoDigit >= 10 && twoDigit <= 26) {
                dp[i] += dp[i-2];
            }
        }
        
        return dp[n];
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Decode Ways</h2>
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
                        href="https://leetcode.com/problems/decode-ways/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    A message containing letters from <code>A-Z</code> can be <strong>encoded</strong> into numbers using the mapping:
                    <br />
                    <code>'A' -&gt; "1", 'B' -&gt; "2", ... 'Z' -&gt; "26"</code>.
                    <br />
                    To <strong>decode</strong> an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways). For example, <code>"11106"</code> can be mapped into:
                    <br />
                    - "AAJF" with the grouping (1 1 10 6)
                    <br />
                    - "KJF" with the grouping (11 10 6)
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Dynamic Programming</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Let <code>dp[i]</code> be the number of ways to decode the prefix of length <code>i</code>.
                    <br />
                    - If <code>s[i-1]</code> is not '0', we can form a single digit number: add <code>dp[i-1]</code>.
                    <br />
                    - If <code>s[i-2]s[i-1]</code> forms a valid number between 10 and 26, we can form a two-digit number: add <code>dp[i-2]</code>.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <DecodeWaysVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Single pass.</li>
                    <li><strong>Space Complexity:</strong> <code>O(N)</code> (can be optimized to <code>O(1)</code>).</li>
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

export default DecodeWaysContent;
