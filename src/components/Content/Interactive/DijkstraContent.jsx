import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import DijkstraVisualizer from '../../Visualizer/DijkstraVisualizer';

const DijkstraContent = () => {
    const codeSnippet = `vector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(V, 1e9);

    dist[S] = 0;
    pq.push({0, S}); // {distance, node}

    while (!pq.empty()) {
        int dis = pq.top().first;
        int node = pq.top().second;
        pq.pop();

        if (dis > dist[node]) continue;

        for (auto it : adj[node]) {
            int v = it.first;
            int weight = it.second;
            if (dist[node] + weight < dist[v]) {
                dist[v] = dist[node] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Dijkstra's Algorithm</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Dijkstra's algorithm is a greedy algorithm that finds the shortest path from a source node to all other nodes in a weighted graph (with non-negative weights).
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    It uses a <strong>Min-Priority Queue</strong> to always explore the nearest unprocessed node next. Time complexity: <code>O(E log V)</code>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Shortest Path Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Click "Next Step" to watch the algorithm relax edges. Nodes turn Green when they are visited (final shortest distance confirmed). The floating number above each node is its current shortest distance from Node 0.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <DijkstraVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Implementation Details</h3>
                <CodeBlock
                    code={codeSnippet}
                    language="cpp"
                    showLineNumbers={true}
                />
            </section>
        </div>
    );
};

export default DijkstraContent;
