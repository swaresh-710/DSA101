import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import PacificAtlanticVisualizer from '../../Visualizer/Blind75/PacificAtlanticVisualizer';

const PacificAtlanticContent = () => {
    const codeSnippet = `class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        int m = heights.size();
        int n = heights[0].size();
        
        vector<vector<bool>> pacific(m, vector<bool>(n, false));
        vector<vector<bool>> atlantic(m, vector<bool>(n, false));
        
        // DFS helper to flow uphill from ocean
        function<void(int, int, vector<vector<bool>>&)> dfs = 
            [&](int r, int c, vector<vector<bool>>& visited) {
            visited[r][c] = true;
            int dr[] = {0, 0, 1, -1};
            int dc[] = {1, -1, 0, 0};
            
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i];
                int nc = c + dc[i];
                
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
                    // Check if neighbor is higher or equal (uphill)
                    if (heights[nr][nc] >= heights[r][c]) {
                        dfs(nr, nc, visited);
                    }
                }
            }
        };
        
        // Start from Pacific borders (Top & Left)
        for (int i = 0; i < m; i++) dfs(i, 0, pacific);
        for (int j = 0; j < n; j++) dfs(0, j, pacific);
        
        // Start from Atlantic borders (Bottom & Right)
        for (int i = 0; i < m; i++) dfs(i, n - 1, atlantic);
        for (int j = 0; j < n; j++) dfs(m - 1, j, atlantic);
        
        vector<vector<int>> res;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pacific[i][j] && atlantic[i][j]) {
                    res.push_back({i, j});
                }
            }
        }
        return res;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Pacific Atlantic Water Flow</h2>
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
                        href="https://leetcode.com/problems/pacific-atlantic-water-flow/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    There is an <code>m x n</code> rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The <strong>Pacific Ocean</strong> touches the island's left and top edges, and the <strong>Atlantic Ocean</strong> touches the island's right and bottom edges.
                    <br /><br />
                    The island is partitioned into a grid of square cells. You are given an <code>m x n</code> integer matrix <code>heights</code> where <code>heights[r][c]</code> represents the height above sea level of the cell at coordinate <code>(r, c)</code>.
                    <br /><br />
                    Rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is <strong>less than or equal to</strong> the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.
                    <br /><br />
                    Return <em>a 2D list of grid coordinates <code>result</code> where <code>result[i] = [r, c]</code> denotes that rain water can flow from cell <code>(r, c)</code> to <strong>both</strong> the Pacific and Atlantic oceans</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Reverse Flow (DFS/BFS)</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Instead of checking every cell to see if it can reach the oceans, we start <strong>from the oceans</strong> and flow "uphill" (to cells with equal or greater height).
                    <br />
                    1. Find all cells reachable from Pacific.
                    <br />
                    2. Find all cells reachable from Atlantic.
                    <br />
                    3. The intersection of these two sets is the answer.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <PacificAtlanticVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(M * N)</code> - Visit each cell constant times.</li>
                    <li><strong>Space Complexity:</strong> <code>O(M * N)</code> - Recursion stack + visited arrays.</li>
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

export default PacificAtlanticContent;
