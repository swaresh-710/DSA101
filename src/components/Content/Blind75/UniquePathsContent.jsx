import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import UniquePathsVisualizer from '../../Visualizer/Blind75/UniquePathsVisualizer';

const UniquePathsContent = () => {
    const codeSnippet = `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> dp(m, vector<int>(n, 0));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 || j == 0) {
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
        }
        return dp[m-1][n-1];
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Unique Paths</h2>
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
                        href="https://leetcode.com/problems/unique-paths/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    There is a robot on an <code>m x n</code> grid. The robot is initially located at the <strong>top-left corner</strong> (i.e., <code>grid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>). The robot can only move either down or right at any point in time.
                    <br /><br />
                    Given the two integers <code>m</code> and <code>n</code>, return <em>the number of possible unique paths that the robot can take to reach the bottom-right corner</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Dynamic Programming</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Let <code>dp[i][j]</code> be the number of unique paths to reach cell <code>(i, j)</code>.
                    <br />
                    To reach <code>(i, j)</code>, we must come from either above <code>(i-1, j)</code> or left <code>(i, j-1)</code>.
                    <br />
                    Thus, <code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code>.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <UniquePathsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(M * N)</code> - Fill the grid.</li>
                    <li><strong>Space Complexity:</strong> <code>O(M * N)</code> - DP Table (can be optimized to O(N)).</li>
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

export default UniquePathsContent;
