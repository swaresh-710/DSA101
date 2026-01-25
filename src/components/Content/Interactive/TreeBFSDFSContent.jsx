import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TreeTraversalVisualizer from '../../Visualizer/TreeTraversalVisualizer';

const TreeBFSDFSContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Tree BFS & DFS</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    **BFS (Breadth-First Search)** explores level by level (using a Queue). **DFS (Depth-First Search)** explores as deep as possible along each branch before backtracking (using a Stack or Recursion).
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Traversal Visualizer</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Compare how the nodes are visited in BFS vs DFS order on the same tree.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <TreeTraversalVisualizer />
                </div>
            </section>

            <section>
                <h3>C++ Implementation</h3>
                <CodeBlock code={`// BFS (Level Order)
void bfs(TreeNode* root) {
    queue<TreeNode*> q;
    q.push(root);
    while(!q.empty()) {
        TreeNode* curr = q.front(); q.pop();
        cout << curr->val;
        if(curr->left) q.push(curr->left);
        if(curr->right) q.push(curr->right);
    }
}`} />
            </section>
        </div>
    );
};

export default TreeBFSDFSContent;
