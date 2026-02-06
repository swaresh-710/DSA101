import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TrieVisualizer from '../../Visualizer/Blind75/TrieVisualizer';

const TrieContent = () => {
    const codeSnippet = `class TrieNode {
public:
    TrieNode* children[26];
    bool isEnd;
    
    TrieNode() {
        for(int i=0; i<26; i++) children[i] = nullptr;
        isEnd = false;
    }
};

class Trie {
    TrieNode* root;
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for(char c : word){
            int idx = c - 'a';
            if(!node->children[idx]){
                node->children[idx] = new TrieNode();
            }
            node = node->children[idx];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for(char c : word){
            int idx = c - 'a';
            if(!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->isEnd;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for(char c : prefix){
            int idx = c - 'a';
            if(!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Implement Trie (Prefix Tree)</h2>
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
                        href="https://leetcode.com/problems/implement-trie-prefix-tree/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    A <strong>Trie</strong> (pronounced "try") or <strong>Prefix Tree</strong> is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spell checker.
                    <br /><br />
                    Implement the <code>Trie</code> class:
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li><code>insert(word)</code>: Inserts the string <code>word</code> into the trie.</li>
                        <li><code>search(word)</code>: Returns true if the string <code>word</code> is in the trie.</li>
                        <li><code>startsWith(prefix)</code>: Returns true if there is a previously inserted string <code>word</code> that has the prefix <code>prefix</code>.</li>
                    </ul>
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Interactive Trie</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    The Trie consists of nodes where each node represents a character. Edges connect characters.
                    Marking the end of a word is crucial to distinguish between a prefix and a complete word.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <TrieVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(L)</code> for insert and search, where L is word length.</li>
                    <li><strong>Space Complexity:</strong> <code>O(N * L)</code> where N is number of words and L is average length (in worst case).</li>
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

export default TrieContent;
