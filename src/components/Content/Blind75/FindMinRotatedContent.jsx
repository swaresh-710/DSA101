import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import FindMinRotatedVisualizer from '../../Visualizer/Blind75/FindMinRotatedVisualizer';

const FindMinRotatedContent = () => {
    const codeSnippet = `class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                // Minimum is in the right part
                left = mid + 1;
            } else {
                // Minimum is in the left part (or is mid)
                right = mid;
            }
        }
        return nums[left];
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Find Minimum in Rotated Sorted Array</h2>
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
                        href="https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Suppose an array of length <code>n</code> sorted in ascending order is rotated between <code>1</code> and <code>n</code> times. Find the minimum element.
                    <br /><br />
                    You must write an algorithm that runs in <strong style={{ color: 'var(--accent-primary)' }}>O(log n)</strong> time.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Binary Search</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We compare <code>nums[mid]</code> to <code>nums[right]</code>.
                    <br />
                    - If <code>nums[mid] &gt; nums[right]</code>, the rotation point (minimum) must be to the right.
                    <br />
                    - Otherwise, the minimum is to the left (or is <code>mid</code>).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <FindMinRotatedVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(log N)</code> - We halve the search space at each step.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - We only use pointers.</li>
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

export default FindMinRotatedContent;
