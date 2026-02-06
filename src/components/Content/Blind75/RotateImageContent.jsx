import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import RotateImageVisualizer from '../../Visualizer/Blind75/RotateImageVisualizer';

const RotateImageContent = () => {
    const codeSnippet = `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        
        // 1. Transpose the matrix
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                swap(matrix[i][j], matrix[j][i]);
            }
        }
        
        // 2. Reverse each row
        for (int i = 0; i < n; i++) {
            reverse(matrix[i].begin(), matrix[i].end());
        }
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Rotate Image</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(241, 196, 15, 0.2)', // Yellow for Medium
                        color: '#f1c40f',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(241, 196, 15, 0.4)'
                    }}>
                        Medium
                    </span>
                    <a
                        href="https://leetcode.com/problems/rotate-image/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are given an <code>n x n</code> 2D matrix representing an image, rotate the image by <strong>90 degrees</strong> (clockwise).
                    <br /><br />
                    You have to rotate the image <strong>in-place</strong>, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Layer-by-Layer Rotation</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    The visualizer demonstrates the <strong>Layer-by-Layer</strong> approach, rotating groups of 4 cells at a time.
                    <br />
                    Another common approach (shown in code below) is to <strong>Transpose</strong> the matrix (swap <code>[i][j]</code> with <code>[j][i]</code>) and then <strong>Reverse</strong> each row. Both achieve the same result.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <RotateImageVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(M * N)</code> - We visit each cell once (technically twice for Transpose+Reverse).</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - In-place rotation.</li>
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

export default RotateImageContent;
