import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import EncodeDecodeStringsVisualizer from '../../Visualizer/Blind75/EncodeDecodeStringsVisualizer';

const EncodeDecodeStringsContent = () => {
    const codeSnippet = `class Codec {
public:
    // Encodes a list of strings to a single string.
    string encode(vector<string>& strs) {
        string res = "";
        for (string s : strs) {
            res += to_string(s.length()) + "#" + s;
        }
        return res;
    }

    // Decodes a single string to a list of strings.
    vector<string> decode(string s) {
        vector<string> res;
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (s[j] != '#') {
                j++;
            }
            int length = stoi(s.substr(i, j - i));
            res.push_back(s.substr(j + 1, length));
            
            i = j + 1 + length;
        }
        return res;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Encode and Decode Strings</h2>
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
                        href="https://leetcode.com/problems/encode-and-decode-strings/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Please implement <code>encode</code> and <code>decode</code>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Chunked Transfer Encoding</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    A robust way to encode is to prefix each string with its length, followed by a delimiter (like <code>#</code>).
                    For example, <code>"lint"</code> becomes <code>"4#lint"</code>. This ensures we can safely decode even if the strings contain the delimiter itself!
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <EncodeDecodeStringsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Approach & Complexity</h3>
                <div className="responsive-grid-2">
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px' }}>
                        <h4 style={{ color: '#FF6B6B', marginBottom: '0.5rem' }}>Delimiter Only (Flawed)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Join strings with a special character.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Flaw: Fails if the delimiter exists naturally in the original strings.</li>
                        </ul>
                    </div>
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                        <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Length + Delimiter (Optimal)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Unambiguously determine start/end of strings.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Time: <code>O(N)</code> (Where N is total number of characters)</li>
                            <li>Space: <code>O(N)</code> (For the encoded string)</li>
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

export default EncodeDecodeStringsContent;
