import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import SpiralMatrixVisualizer from '../../Visualizer/Blind75/SpiralMatrixVisualizer';

const SpiralMatrixContent = () => {
    const codeSnippet = `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> result;
        if (matrix.empty()) return result;
        
        int top = 0;
        int bottom = matrix.size() - 1;
        int left = 0;
        int right = matrix[0].size() - 1;
        
        while (top <= bottom && left <= right) {
            // Traverse Right
            for (int i = left; i <= right; i++) {
                result.push_back(matrix[top][i]);
            }
            top++;
            
            // Traverse Down
            for (int i = top; i <= bottom; i++) {
                result.push_back(matrix[i][right]);
            }
            right--;
            
            // Traverse Left
            if (top <= bottom) {
                for (int i = right; i >= left; i--) {
                    result.push_back(matrix[bottom][i]);
                }
                bottom--;
            }
            
            // Traverse Up
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    result.push_back(matrix[i][left]);
                }
                left++;
            }
        }
        
        return result;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Spiral Matrix</h2>
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
                        href="https://leetcode.com/problems/spiral-matrix/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an <code>m x n</code> matrix, return all elements of the matrix in <strong>spiral order</strong>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Simulation</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We simulate the spiral movement by maintaining 4 boundaries: <code>top, bottom, left, right</code>. We move Right, then Down, then Left, then Up, shrinking the boundaries as we go.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <SpiralMatrixVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(M * N)</code> - We visit each element exactly once.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Output array is generally not counted towards space complexity.</li>
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

export default SpiralMatrixContent;
