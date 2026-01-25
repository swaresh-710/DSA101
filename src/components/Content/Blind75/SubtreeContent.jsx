import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import SubtreeVisualizer from '../../Visualizer/Blind75/SubtreeVisualizer';

const SubtreeContent = () => {
    const codeSnippet = `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if (!p || !q || p->val != q->val) return false;
        return isSameTree(p->left, q->left) && 
               isSameTree(p->right, q->right);
    }

    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!root) return false;
        
        // Check if current tree matches subRoot
        if (isSameTree(root, subRoot)) return true;
        
        // Otherwise recurse left and right
        return isSubtree(root->left, subRoot) || 
               isSubtree(root->right, subRoot);
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Subtree of Another Tree</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(46, 204, 113, 0.2)', // Green for Easy
                        color: '#2ecc71',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(46, 204, 113, 0.4)'
                    }}>
                        Easy
                    </span>
                    <a
                        href="https://leetcode.com/problems/subtree-of-another-tree/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given the roots of two binary trees <code>root</code> and <code>subRoot</code>, return <code>true</code> if there is a subtree of <code>root</code> with the same structure and node values of <code>subRoot</code> and <code>false</code> otherwise.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Traversal & Match</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We traverse the main tree. For every node, if its value matches the subRoot value, we initiate a structure check (Same Tree check).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <SubtreeVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(M * N)</code> - M is nodes in Main tree, N in Subtree. For each of M nodes, we might perform O(N) check.</li>
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

export default SubtreeContent;
