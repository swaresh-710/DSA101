import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import JumpGameVisualizer from '../../Visualizer/Blind75/JumpGameVisualizer';

const JumpGameContent = () => {
    const codeSnippet = `class Solution {
public:
    bool canJump(vector<int>& nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.size(); i++) {
            if (i > maxReach) return false; // Cannot reach this index
            maxReach = max(maxReach, i + nums[i]);
            if (maxReach >= nums.size() - 1) return true; // Can reach end
        }
        return true;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Jump Game</h2>
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
                        href="https://leetcode.com/problems/jump-game/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are given an integer array <code>nums</code>. You are initially positioned at the array's <strong>first index</strong>. Each element in the array represents your maximum jump length at that position.
                    <br /><br />
                    Return <em>true if you can reach the last index, or false otherwise</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Greedy</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We iterate through the array and keep track of the <code>maxReach</code> index we can jump to.
                    <br />
                    - If current index <code>i</code> is greater than <code>maxReach</code>, it means we cannot reach <code>i</code>, so we return false.
                    <br />
                    - Otherwise, update <code>maxReach = max(maxReach, i + nums[i])</code>.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <JumpGameVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Single pass.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - One variable.</li>
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

export default JumpGameContent;
