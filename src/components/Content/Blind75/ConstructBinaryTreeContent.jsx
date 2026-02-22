import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import ConstructBinaryTreeVisualizer from '../../Visualizer/Blind75/ConstructBinaryTreeVisualizer';

const ConstructBinaryTreeContent = () => {
    const codeSnippet = `class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        unordered_map<int, int> inMap;
        for (int i = 0; i < inorder.size(); i++) {
            inMap[inorder[i]] = i;
        }
        return buildTree(preorder, 0, preorder.size() - 1, 
                         inorder, 0, inorder.size() - 1, inMap);
    }
    
private:
    TreeNode* buildTree(vector<int>& preorder, int preStart, int preEnd, 
                        vector<int>& inorder, int inStart, int inEnd, 
                        unordered_map<int, int>& inMap) {
        if (preStart > preEnd || inStart > inEnd) return nullptr;
        
        TreeNode* root = new TreeNode(preorder[preStart]);
        
        int inRoot = inMap[root->val];
        int numsLeft = inRoot - inStart;
        
        root->left = buildTree(preorder, preStart + 1, preStart + numsLeft, 
                               inorder, inStart, inRoot - 1, inMap);
                               
        root->right = buildTree(preorder, preStart + numsLeft + 1, preEnd, 
                                inorder, inRoot + 1, inEnd, inMap);
                                
        return root;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Construct Binary Tree</h2>
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
                        href="https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given two integer arrays <code>preorder</code> and <code>inorder</code> where <code>preorder</code> is the preorder traversal of a binary tree and <code>inorder</code> is the inorder traversal of the same tree, construct and return the binary tree.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    <strong>Preorder:</strong> Root, Left, Right<br />
                    <strong>Inorder:</strong> Left, Root, Right
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Recursive Construction</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We know that the first element in <strong>preorder</strong> is always the root. We can find this root in the <strong>inorder</strong> traversal array.
                    The elements to the left of the root in the inorder array will form the left subtree, and the elements to the right will form the right subtree. We can recursively build the tree like this!
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <ConstructBinaryTreeVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Approach & Complexity</h3>
                <div className="responsive-grid-2">
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                        <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Recursive + Hash Map (Optimal)</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Use Hash Map to find inorder index in O(1).</p>
                        <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.9rem' }}>
                            <li>Time: <code>O(N)</code> (We visit each node once)</li>
                            <li>Space: <code>O(N)</code> (For the Hash Map & Recursion Stack)</li>
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

export default ConstructBinaryTreeContent;
