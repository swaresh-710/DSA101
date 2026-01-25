import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import LongestSubstringVisualizer from '../../Visualizer/Blind75/LongestSubstringVisualizer';

const LongestSubstringContent = () => {
    const codeSnippet = `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> charSet;
        int l = 0;
        int res = 0;
        
        for (int r = 0; r < s.length(); r++) {
            while (charSet.find(s[r]) != charSet.end()) {
                charSet.erase(s[l]);
                l++;
            }
            charSet.insert(s[r]);
            res = max(res, r - l + 1);
        }
        return res;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Longest Substring Without Repeating Characters</h2>
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
                        href="https://leetcode.com/problems/longest-substring-without-repeating-characters/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Sliding Window</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We use a <strong>Sliding Window</strong> approach with a Set to track characters in the current window.
                    <br />
                    - Expand <code>Right</code> pointer. If character is new, add to set.
                    <br />
                    - If character is a duplicate, shrink <code>Left</code> pointer (remove chars) until duplicate is removed.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <LongestSubstringVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Each char visited at most twice.</li>
                    <li><strong>Space Complexity:</strong> <code>O(min(N, M))</code> - Set size (M = charset size).</li>
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

export default LongestSubstringContent;
