import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import NumberOfIslandsVisualizer from '../../Visualizer/Blind75/NumberOfIslandsVisualizer';

const NumberOfIslandsContent = () => {
    const codeSnippet = `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int m = grid.size();
        int n = grid[0].size();
        int count = 0;
        
        function<void(int, int)> dfs = [&](int r, int c) {
            if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] == '0') return;
            
            grid[r][c] = '0'; // Mark as visited (sink the island)
            
            dfs(r+1, c);
            dfs(r-1, c);
            dfs(r, c+1);
            dfs(r, c-1);
        };
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(i, j);
                }
            }
        }
        return count;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Number of Islands</h2>
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
                        href="https://leetcode.com/problems/number-of-islands/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return <em>the number of islands</em>.
                    <br /><br />
                    An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Connected Components (BFS/DFS)</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We iterate through every cell in the grid.
                    <br />
                    1. If we find a land cell <code>'1'</code> that hasn't been visited, we increment the island count.
                    <br />
                    2. We then run DFS or BFS to visit <strong>all connected land cells</strong> belonging to this island, marking them as visited (or "sinking" them) so we don't count them again.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <NumberOfIslandsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(M * N)</code> - Visit every cell once.</li>
                    <li><strong>Space Complexity:</strong> <code>O(M * N)</code> - Recursion stack or queue in worst case (all land).</li>
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

export default NumberOfIslandsContent;
