import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import LCAVisualizer from '../../Visualizer/Blind75/LCAVisualizer';

const LCAContent = () => {
    const codeSnippet = `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root) return nullptr;
        
        // If both p and q are smaller than root, LCA is in left subtree
        if (p->val < root->val && q->val < root->val) {
            return lowestCommonAncestor(root->left, p, q);
        }
        
        // If both p and q are larger than root, LCA is in right subtree
        if (p->val > root->val && q->val > root->val) {
            return lowestCommonAncestor(root->right, p, q);
        }
        
        // Otherwise, this is the split point, hence the LCA
        return root;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Lowest Common Ancestor of a BST</h2>
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
                        href="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.
                    <br /><br />
                    The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow <strong>a node to be a descendant of itself</strong>).
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: BST Properties</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We leverage the BST property. Ideally, if we start from the root, the LCA is the node where the paths to <code>p</code> and <code>q</code> diverge.
                    If both <code>p</code> and <code>q</code> are smaller than the current node, the LCA must be in the left subtree.
                    If both are larger, it must be in the right subtree.
                    Otherwise, the current node is the LCA.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <LCAVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(H)</code> - Where H is the height of the tree. O(log N) for balanced, O(N) for skewed.</li>
                    <li><strong>Space Complexity:</strong> <code>O(H)</code> - Recursion stack (or O(1) if iterative).</li>
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

export default LCAContent;
