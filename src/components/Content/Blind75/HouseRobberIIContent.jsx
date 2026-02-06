import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import HouseRobberIIVisualizer from '../../Visualizer/Blind75/HouseRobberIIVisualizer';

const HouseRobberIIContent = () => {
    const codeSnippet = `class Solution {
public:
    int rob(vector<int>& nums) {
        if (nums.empty()) return 0;
        if (nums.size() == 1) return nums[0];
        
        // Helper function for linear House Robber
        auto robLinear = [&](int start, int end) {
            int prev2 = 0, prev1 = 0;
            for (int i = start; i <= end; i++) {
                int temp = max(prev1, prev2 + nums[i]);
                prev2 = prev1;
                prev1 = temp;
            }
            return prev1;
        };
        
        // Case 1: Rob 0 to n-2 (exclude last)
        // Case 2: Rob 1 to n-1 (exclude first)
        return max(robLinear(0, nums.size() - 2), robLinear(1, nums.size() - 1));
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>House Robber II</h2>
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
                        href="https://leetcode.com/problems/house-robber-ii/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are <strong>arranged in a circle</strong>. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and <strong>it will automatically contact the police if two adjacent houses were broken into on the same night</strong>.
                    <br /><br />
                    Given an integer array <code>nums</code>, return <em>the maximum amount of money you can rob tonight without alerting the police</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Breaking the Circle</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Since the first and last houses are neighbors, we cannot rob both. This reduces the problem to two linear House Robber problems:
                    <br />
                    1. Rob houses <code>0</code> to <code>n-2</code> (Ignore last).
                    <br />
                    2. Rob houses <code>1</code> to <code>n-1</code> (Ignore first).
                    <br />
                    Take the maximum of these two cases.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <HouseRobberIIVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Two passes.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Constant space for variables.</li>
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

export default HouseRobberIIContent;
