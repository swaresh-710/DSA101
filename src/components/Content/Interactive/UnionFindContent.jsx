import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import UnionFindVisualizer from '../../Visualizer/UnionFindVisualizer';

const UnionFindContent = () => {
    const codeSnippet = `class UnionFind {
    vector<int> parent;
    vector<int> rank;
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for(int i=0; i<n; i++) parent[i] = i;
    }

    int find(int i) {
        if(parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path Compression
    }

    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if(root_i != root_j) {
            // Union by Rank
            if(rank[root_i] < rank[root_j])
                parent[root_i] = root_j;
            else if(rank[root_i] > rank[root_j])
                parent[root_j] = root_i;
            else {
                parent[root_i] = root_j;
                rank[root_j]++;
            }
        }
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Union Find (Disjoint Set)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    The Union-Find data structure tracks a set of elements partitioned into a number of disjoint (non-overlapping) subsets. Only two operations are needed:
                </p>
                <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Find:</strong> Determine which subset a particular element is in.</li>
                    <li><strong>Union:</strong> Join two subsets into a single subset.</li>
                </ul>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    It is extremely useful for Graph algorithms like <strong>Kruskal's Algorithm</strong> (MST) and <strong>Cycle Detection</strong>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Interactive Visualizer</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Experiment with <code>Union(A, B)</code> to merge sets and <code>Find(A)</code> to see path compression in action. Nodes with the same color belong to the same set.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <UnionFindVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Implementation Details</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    To achieve nearly O(1) time complexity (specifically Inverse Ackermann function), we use two optimizations:
                </p>
                <ul style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Path Compression:</strong> During <code>find</code>, we flatten the structure by making nodes point directly to the root.</li>
                    <li><strong>Union by Rank:</strong> Always attach the shorter tree to the taller tree to keep the tree height minimal.</li>
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

export default UnionFindContent;
