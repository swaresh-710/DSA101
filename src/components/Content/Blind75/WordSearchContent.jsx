import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import WordSearchVisualizer from '../../Visualizer/Blind75/WordSearchVisualizer';

const WordSearchContent = () => {
    const codeSnippet = `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        int m = board.size();
        int n = board[0].size();
        
        for(int i=0; i<m; i++){
            for(int j=0; j<n; j++){
                if(backtrack(board, word, 0, i, j, m, n))
                    return true;
            }
        }
        return false;
    }
    
    bool backtrack(vector<vector<char>>& board, string& word, int idx, int r, int c, int m, int n){
        if(idx == word.size()) return true;
        
        if(r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word[idx])
            return false;
            
        char temp = board[r][c];
        board[r][c] = '#'; // Mark visited
        
        bool found = backtrack(board, word, idx+1, r+1, c, m, n) ||
                     backtrack(board, word, idx+1, r-1, c, m, n) ||
                     backtrack(board, word, idx+1, r, c+1, m, n) ||
                     backtrack(board, word, idx+1, r, c-1, m, n);
                     
        board[r][c] = temp; // Backtrack
        
        return found;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Word Search</h2>
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
                        href="https://leetcode.com/problems/word-search/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if <code>word</code> exists in the grid.
                    <br /><br />
                    The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. <strong>The same letter cell may not be used more than once.</strong>
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Backtracking</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We use Depth First Search (DFS) with Backtracking. We start from every cell. If the character matches, we explore neighbors.
                    If we hit a dead end (no matching neighbor), we <strong>backtrack</strong> by marking the cell as unvisited and returning to the previous state.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <WordSearchVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N * 3^L)</code> - N is number of cells, L is length of word. Branching factor is 3 (visiting parent excluded).</li>
                    <li><strong>Space Complexity:</strong> <code>O(L)</code> - Recursion depth.</li>
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

export default WordSearchContent;
