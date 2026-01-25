import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import CharacterReplacementVisualizer from '../../Visualizer/Blind75/CharacterReplacementVisualizer';

const CharacterReplacementContent = () => {
    const codeSnippet = `class Solution {
public:
    int characterReplacement(string s, int k) {
        vector<int> count(26, 0);
        int maxCount = 0; // Most frequent char count in current window
        int l = 0;
        int res = 0;
        
        for (int r = 0; r < s.length(); r++) {
            count[s[r] - 'A']++;
            maxCount = max(maxCount, count[s[r] - 'A']);
            
            // Check validity: window_len - maxCount <= k
            // If invalid, shrink window
            if ((r - l + 1) - maxCount > k) {
                count[s[l] - 'A']--;
                l++;
            }
            
            res = max(res, r - l + 1);
        }
        return res;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Longest Repeating Character Replacement</h2>
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
                        href="https://leetcode.com/problems/longest-repeating-character-replacement/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are given a string <code>s</code> and an integer <code>k</code>. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most <code>k</code> times.
                    <br /><br />
                    Return <em>the length of the longest substring containing the same letter you can get after performing the above operations</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Sliding Window</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We want to make the whole substring match the <strong>most frequent character</strong> in that substring.
                    <br />
                    Number of replacements needed = <code>Window Length - Max Frequency Character Count</code>.
                    <br />
                    If replacements needed &le; <code>k</code>, the window is valid. Expand Right.
                    <br />
                    If replacements needed &gt; <code>k</code>, the window is invalid. Shrink Left.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <CharacterReplacementVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - Window slides once.</li>
                    <li><strong>Space Complexity:</strong> <code>O(26) = O(1)</code> - Store counts for 26 uppercase letters.</li>
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

export default CharacterReplacementContent;
