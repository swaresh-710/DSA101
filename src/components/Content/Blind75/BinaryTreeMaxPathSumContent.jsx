import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import BinaryTreeMaxPathSumVisualizer from '../../Visualizer/Blind75/BinaryTreeMaxPathSumVisualizer';

const BinaryTreeMaxPathSumContent = () => {
    const codeSnippet = `class Solution {
    int maxSum;
public:
    int maxPathSum(TreeNode* root) {
        maxSum = INT_MIN;
        dfs(root);
        return maxSum;
    }
    
private:
    int dfs(TreeNode* node) {
        if (!node) return 0;
        
        // Ignore negative path sums
        int leftMax = max(dfs(node->left), 0);
        int rightMax = max(dfs(node->right), 0);
        
        // Max path sum taking the current node as the highest point (an arch)
        int currentPathSum = node->val + leftMax + rightMax;
        
        maxSum = max(maxSum, currentPathSum);
        
        // Return the max path sum of simply going down one branch
        return node->val + max(leftMax, rightMax);
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Binary Tree Maximum Path Sum</h2>
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
                        href="https://leetcode.com/problems/binary-tree-maximum-path-sum/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them.
                    A node can only appear in the sequence <strong>at most once</strong>. Note that the path does not need to pass through the root.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given the <code>root</code> of a binary tree, return the maximum <strong>path sum</strong> of any non-empty path.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Post-Order DFS with State</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    For any given node, a path can either "split" at this node (acting as the arch's peak, going down both left and right),
                    or it can be part of a larger continuous branch going all the way up to its parent.
                    <br />The animation below demonstrates how a global max is updated as we get the optimal branches from child nodes in a post-order traversal.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <BinaryTreeMaxPathSumVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Approach & Complexity</h3>
                <div className="responsive-grid-2">
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                        <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Depth First Search (Optimal)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Recursive post-order traversal taking the max of branches.</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Time: <code>O(N)</code> (We visit each node exactly once)</li>
                            <li>Space: <code>O(H)</code> (Where H is height of the tree, for the recursion stack space)</li>
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

export default BinaryTreeMaxPathSumContent;
