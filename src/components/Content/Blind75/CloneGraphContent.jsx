import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import CloneGraphVisualizer from '../../Visualizer/Blind75/CloneGraphVisualizer';

const CloneGraphContent = () => {
    const codeSnippet = `class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> visited;
        queue<Node*> q;
        
        // Clone the first node
        visited[node] = new Node(node->val);
        q.push(node);
        
        while (!q.empty()) {
            Node* curr = q.front();
            q.pop();
            
            for (Node* neighbor : curr->neighbors) {
                if (visited.find(neighbor) == visited.end()) {
                    // Clone neighbor if not visited
                    visited[neighbor] = new Node(neighbor->val);
                    q.push(neighbor);
                }
                
                // Add edge to the clone
                // visited[curr] is the clone of current node
                // visited[neighbor] is the clone of neighbor
                visited[curr]->neighbors.push_back(visited[neighbor]);
            }
        }
        
        return visited[node];
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Clone Graph</h2>
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
                        href="https://leetcode.com/problems/clone-graph/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given a reference of a node in a <strong>connected</strong> undirected graph. Return a <strong>deep copy</strong> (clone) of the graph.
                    <br /><br />
                    Each node in the graph contains a value (<code>int</code>) and a list (<code>List[Node]</code>) of its neighbors.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: BFS / DFS + Hash Map</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We use a Hash Map to store the mapping from <code>Original Node</code> -&gt; <code>Cloned Node</code>.
                    <br />
                    This ensures that if we encounter a node/neighbor that has already been cloned, we assume the existing clone reference instead of creating a new one (avoiding cycles and duplicates).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <CloneGraphVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(V + E)</code> - Visit every node and edge.</li>
                    <li><strong>Space Complexity:</strong> <code>O(V)</code> - Hash Map to store visited nodes.</li>
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

export default CloneGraphContent;
