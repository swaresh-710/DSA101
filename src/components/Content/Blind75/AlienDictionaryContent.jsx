import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import AlienDictionaryVisualizer from '../../Visualizer/Blind75/AlienDictionaryVisualizer';

const AlienDictionaryContent = () => {
    const codeSnippet = `class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char, unordered_set<char>> adj;
        unordered_map<char, int> inDegree;
        
        // Initialize graphs and in-degrees for all unique chars
        for (string word : words) {
            for (char c : word) {
                inDegree[c] = 0;
            }
        }
        
        // Build Graph
        for (int i = 0; i < words.size() - 1; i++) {
            string w1 = words[i];
            string w2 = words[i + 1];
            
            // Edge case: invalid sequence (e.g., "abc", "ab")
            if (w1.length() > w2.length() && w1.substr(0, w2.length()) == w2) {
                return "";
            }
            
            // Find first differing character
            for (int j = 0; j < min(w1.length(), w2.length()); j++) {
                if (w1[j] != w2[j]) {
                    if (adj[w1[j]].find(w2[j]) == adj[w1[j]].end()) {
                        adj[w1[j]].insert(w2[j]);
                        inDegree[w2[j]]++;
                    }
                    break; // Only the first different character determines order
                }
            }
        }
        
        // Topological Sort (Kahn's Algorithm - BFS)
        queue<char> q;
        for (auto& pair : inDegree) {
            if (pair.second == 0) q.push(pair.first);
        }
        
        string result = "";
        while (!q.empty()) {
            char c = q.front();
            q.pop();
            result += c;
            
            for (char next : adj[c]) {
                inDegree[next]--;
                if (inDegree[next] == 0) {
                    q.push(next);
                }
            }
        }
        
        // If result doesn't contain all unique characters, there was a cycle
        if (result.length() != inDegree.size()) return "";
        
        return result;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Alien Dictionary</h2>
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
                        href="https://leetcode.com/problems/alien-dictionary/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are given a list of strings <code>words</code> from the alien language's dictionary, where the strings in <code>words</code> are <strong>sorted lexicographically</strong> by the rules of this new language.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Return a string of the unique letters in the new alien language sorted in <strong>lexicographically increasing order</strong> by the new language's rules. If there is no valid ordering (e.g. cycle exists), return <code>""</code>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Kahn's Algorithm (Topological Sort)</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    First, we compare adjacent words to build a <strong>Directed Graph</strong> capturing dependencies (e.g. <code>w -&gt; e</code>).
                    Then, we use <strong>Kahn's Algorithm (BFS)</strong> by maintaining an <strong>In-Degree</strong> count for each character. Nodes with 0 in-degree have no dependencies and are safely processed next!
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <AlienDictionaryVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Approach & Complexity</h3>
                <div className="responsive-grid-2">
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                        <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Topological Sort (Kahn's or DFS Post-Order)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Determine strict dependencies as a Directed Acyclic Graph (DAG) and sort it.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Time: <code>O(C)</code> (Where C is total length of all words combined. Building graph takes O(C) and Traversal takes O(V+E) = O(26 + 26^2) = O(1))</li>
                            <li>Space: <code>O(1)</code> or <code>O(V + E)</code> (Since V ≤ 26 and E ≤ 26^2, it is strictly bounded to max 26 characters, yielding O(1) space)</li>
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

export default AlienDictionaryContent;
