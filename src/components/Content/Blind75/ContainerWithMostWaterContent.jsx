import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import ContainerWithMostWaterVisualizer from '../../Visualizer/Blind75/ContainerWithMostWaterVisualizer';

const ContainerWithMostWaterContent = () => {
    const codeSnippet = `class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0; 
        int right = height.size() - 1;
        int maxArea = 0;
        
        while (left < right) {
            int currentArea = min(height[left], height[right]) * (right - left);
            maxArea = max(maxArea, currentArea);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Container With Most Water</h2>
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
                        href="https://leetcode.com/problems/container-with-most-water/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>ith</code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.
                    <br /><br />
                    Find two lines that together with the x-axis form a container, such that the container contains the most water. Return <em>the maximum amount of water a container can store</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Two Pointers</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We start with pointers at the beginning and end. At each step, we calculate the area. Then, we move the pointer pointing to the <strong>shorter line</strong> inward, hoping to find a taller line that compensates for the reduced width.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <ContainerWithMostWaterVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Single pass with two pointers.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Constant extra space.</li>
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

export default ContainerWithMostWaterContent;
