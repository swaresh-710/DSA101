import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import CoinChangeVisualizer from '../../Visualizer/Blind75/CoinChangeVisualizer';

const CoinChangeContent = () => {
    const codeSnippet = `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // dp[i] = min coins to make amount i
        // Initialize with amount + 1 (representing infinity)
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) {
                    dp[i] = min(dp[i], 1 + dp[i - c]);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Coin Change</h2>
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
                        href="https://leetcode.com/problems/coin-change/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money. Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Dynamic Programming (Bottom-Up)</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We build a table <code>dp</code> where <code>dp[i]</code> stores the minimum coins needed for amount <code>i</code>.
                    <br />
                    For each amount, we try every coin: <code>dp[i] = min(dp[i], 1 + dp[i - coin])</code>.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <CoinChangeVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(A * C)</code> - Where A is amount and C is number of coins.</li>
                    <li><strong>Space Complexity:</strong> <code>O(A)</code> - For the DP table.</li>
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

export default CoinChangeContent;
