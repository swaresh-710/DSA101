import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import AddAndSearchWordVisualizer from '../../Visualizer/Blind75/AddAndSearchWordVisualizer';

const AddAndSearchWordContent = () => {
    const codeSnippet = `class TrieNode {
public:
    TrieNode* children[26];
    bool isWord;
    
    TrieNode() {
        for (int i = 0; i < 26; i++) {
            children[i] = nullptr;
        }
        isWord = false;
    }
};

class WordDictionary {
private:
    TrieNode* root;
    
    bool searchInNode(string& word, int i, TrieNode* node) {
        if (!node) return false;
        if (i == word.length()) return node->isWord;
        
        char c = word[i];
        if (c != '.') {
            // Normal character routing
            return searchInNode(word, i + 1, node->children[c - 'a']);
        } else {
            // '.' character can match any letter, so we check all children
            for (int j = 0; j < 26; j++) {
                if (node->children[j] && searchInNode(word, i + 1, node->children[j])) {
                    return true;
                }
            }
        }
        return false;
    }

public:
    WordDictionary() {
        root = new TrieNode();
    }
    
    // Time: O(M), Space: O(M) where M is word length
    void addWord(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c - 'a']) {
                node->children[c - 'a'] = new TrieNode();
            }
            node = node->children[c - 'a'];
        }
        node->isWord = true;
    }
    
    // Time: O(M) for words without '.', O(26^M) for words with only '.'
    bool search(string word) {
        return searchInNode(word, 0, root);
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Design Add and Search Words Data Structure</h2>
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
                        href="https://leetcode.com/problems/design-add-and-search-words-data-structure/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Design a data structure that supports adding new words and finding if a string matches any previously added string.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Implement the <code>WordDictionary</code> class:
                </p>
                <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                    <li><code>WordDictionary()</code> Initializes the object.</li>
                    <li><code>void addWord(word)</code> Adds <code>word</code> to the data structure, it can be matched later.</li>
                    <li><code>bool search(word)</code> Returns <code>true</code> if there is any string in the data structure that matches <code>word</code>. <code>word</code> may contain dots <code>'.'</code> where dots can be matched with any letter.</li>
                </ul>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Trie (Prefix Tree) with Backtracking</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    A <strong>Trie</strong> (Prefix Tree) is the perfect data structure for storing words character by character.
                    When we search, we traverse this tree. If we hit a <code>.</code> wildcard, we must <strong>backtrack</strong> and explore all possible existing children paths!
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <AddAndSearchWordVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Approach & Complexity</h3>
                <div className="responsive-grid-2">
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                        <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Trie + DFS (Optimal)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Store words efficiently in a tree; DFS on wildcards.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Add Time: <code>O(M)</code> (Where M is word length)</li>
                            <li>Search Time: <code>O(M)</code> for normal words, up to <code>O(26^M)</code> for full wildcards (worst case)</li>
                            <li>Space: <code>O(T)</code> (Where T is total characters across all added words)</li>
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

export default AddAndSearchWordContent;
