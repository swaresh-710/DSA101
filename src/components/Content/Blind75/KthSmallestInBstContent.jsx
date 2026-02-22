import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import KthSmallestInBstVisualizer from '../../Visualizer/Blind75/KthSmallestInBstVisualizer';

const KthSmallestInBstContent = () => {
    const codeSnippet = `class Solution {
    int count = 0;
    int result = -1;
public:
    int kthSmallest(TreeNode* root, int k) {
        inorder(root, k);
        return result;
    }
    
private:
    void inorder(TreeNode* node, int k) {
        if (!node || result != -1) return;
        
        inorder(node->left, k);
        
        count++;
        if (count == k) {
            result = node->val;
            return;
        }
        
        inorder(node->right, k);
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Kth Smallest Element in a BST</h2>
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
                        href="https://leetcode.com/problems/kth-smallest-element-in-a-bst/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return the <code>kth</code> smallest value (<strong>1-indexed</strong>) of all the values of the nodes in the tree.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: In-Order Traversal</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    One of the most important properties of a Binary Search Tree (BST) is that an <strong>in-order traversal</strong> (Left, Root, Right) explores the nodes in sorted ascending order.
                    We can simply keep a counter while doing an in-order traversal and stop when the counter hits <code>k</code>.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <KthSmallestInBstVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Approach & Complexity</h3>
                <div className="responsive-grid-2">
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                        <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Recursive In-Order Traversal (Optimal)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Stop early when the Kth element is reached.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Time: <code>O(H + k)</code> (Where H is a tree height. We traverse down to the leftmost leaf, taking O(H) time, then visit k nodes)</li>
                            <li>Space: <code>O(H)</code> (For the recursion stack, bounded by the height of the tree)</li>
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

export default KthSmallestInBstContent;
