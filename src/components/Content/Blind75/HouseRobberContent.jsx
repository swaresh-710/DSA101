import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import HouseRobberVisualizer from '../../Visualizer/Blind75/HouseRobberVisualizer';

const HouseRobberContent = () => {
    const codeSnippet = `class Solution {
public:
    int rob(vector<int>& nums) {
        if (nums.empty()) return 0;
        if (nums.size() == 1) return nums[0];
        
        // dp[i] = max loot from first i houses
        vector<int> dp(nums.size());
        dp[0] = nums[0];
        dp[1] = max(nums[0], nums[1]);
        
        for (int i = 2; i < nums.size(); i++) {
            dp[i] = max(dp[i-1], nums[i] + dp[i-2]);
        }
        
        return dp.back();
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>House Robber</h2>
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
                        href="https://leetcode.com/problems/house-robber/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and <strong>it will automatically contact the police if two adjacent houses were broken into on the same night</strong>.
                    <br /><br />
                    Given an integer array <code>nums</code> representing the amount of money of each house, return <em>the maximum amount of money you can rob tonight without alerting the police</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Dynamic Programming</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    For each house <code>i</code>, we have two choices:
                    <br />
                    1. <strong>Rob it</strong>: We add its value to the max loot from <code>i-2</code>.
                    <br />
                    2. <strong>Skip it</strong>: We take the max loot from <code>i-1</code>.
                    <br />
                    <code>dp[i] = max(dp[i-1], nums[i] + dp[i-2])</code>.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <HouseRobberVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Single pass.</li>
                    <li><strong>Space Complexity:</strong> <code>O(N)</code> (or <code>O(1)</code> if optimized to just store prev two values).</li>
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

export default HouseRobberContent;
