import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import SameTreeVisualizer from '../../Visualizer/Blind75/SameTreeVisualizer';

const SameTreeContent = () => {
    const codeSnippet = `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        // Both empty -> True
        if (!p && !q) return true;
        
        // One empty or values different -> False
        if (!p || !q || p->val != q->val) return false;
        
        // Recurse on children
        return isSameTree(p->left, q->left) && 
               isSameTree(p->right, q->right);
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Same Tree</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(46, 204, 113, 0.2)',
                        color: '#2ecc71',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(46, 204, 113, 0.4)'
                    }}>
                        Easy
                    </span>
                    <a
                        href="https://leetcode.com/problems/same-tree/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to check if they are the same or not.
                    <br /><br />
                    Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Parallel Traversal</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We traverse both trees simultaneously. At each step, we check if the current nodes match in value and structure (both null or both non-null).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <SameTreeVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - N is the number of nodes in the smaller tree (checks terminate early).</li>
                    <li><strong>Space Complexity:</strong> <code>O(H)</code> - Recursion stack.</li>
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

export default SameTreeContent;
