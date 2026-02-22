import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import WordSearchIIVisualizer from '../../Visualizer/Blind75/WordSearchIIVisualizer';

const WordSearchIIContent = () => {
    const codeSnippet = `class TrieNode {
public:
    TrieNode* children[26] = {nullptr};
    string word = ""; // Store word at leaf for easy collection
};

class Solution {
    vector<string> res;
    int rows, cols;
    vector<pair<int, int>> dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    void dfs(vector<vector<char>>& board, int r, int c, TrieNode* p) {
        char ch = board[r][c];
        if (ch == '#' || !p->children[ch - 'a']) return;
        
        p = p->children[ch - 'a'];
        if (p->word != "") {
            res.push_back(p->word);
            p->word = ""; // Prevent duplicates
        }

        board[r][c] = '#'; // Mark as visited
        
        for (auto dir : dirs) {
            int nr = r + dir.first;
            int nc = c + dir.second;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                dfs(board, nr, nc, p);
            }
        }
        
        board[r][c] = ch; // Restore state (Backtrack)
    }

public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        TrieNode* root = new TrieNode();
        for (string& w : words) {
            TrieNode* p = root;
            for (char c : w) {
                if (!p->children[c - 'a']) p->children[c - 'a'] = new TrieNode();
                p = p->children[c - 'a'];
            }
            p->word = w;
        }

        rows = board.size();
        cols = board[0].size();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                dfs(board, r, c, root);
            }
        }
        return res;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Word Search II</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(231, 76, 60, 0.2)',
                        color: '#e74c3c',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(231, 76, 60, 0.4)'
                    }}>
                        Hard
                    </span>
                    <a
                        href="https://leetcode.com/problems/word-search-ii/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an <code>m x n</code> board of characters and a list of strings <code>words</code>, return all words on the board.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Trie + Backtracking</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    To efficiently search for <strong>multiple</strong> words at once, we first build a <strong>Trie</strong> from the target list.
                    Then, we perform standard DFS Backtracking on the board, but we only continue our path if the current sequence exists as a valid prefix in our Trie!
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <WordSearchIIVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Approach & Complexity</h3>
                <div className="responsive-grid-2">
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px' }}>
                        <h4 style={{ color: '#FF6B6B', marginBottom: '0.5rem' }}>DFS For Each Word (Naive)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Run standard Word Search I for every single word in the list.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Time: <code>O(W * M * N * 4^L)</code></li>
                        </ul>
                    </div>
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                        <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Trie + DFS (Optimal)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Simultaneous parallel searching bounded by Trie nodes.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Time: <code>O(M * N * 4^L)</code> (Where L is max word length. Often much faster due to early pruning)</li>
                            <li>Space: <code>O(T)</code> (Where T is total letters in Trie)</li>
                        </ul>
                    </div>
                </div>

                <h4 style={{ marginBottom: '1rem', marginTop: '2rem' }}>C++ Solution</h4>
                <CodeBlock
                    code={codeSnippet}
                    language="cpp"
                    showLineNumbers={true}
                />
            </section>
        </div>
    );
};

export default WordSearchIIContent;
