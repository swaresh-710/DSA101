import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import CourseScheduleVisualizer from '../../Visualizer/Blind75/CourseScheduleVisualizer';

const CourseScheduleContent = () => {
    const codeSnippet = `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for(auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
        }
        
        vector<int> visited(numCourses, 0); 
        // 0 = unvisited, 1 = visiting, 2 = visited
        
        function<bool(int)> hasCycle = [&](int node) {
            if (visited[node] == 1) return true; // Cycle detected
            if (visited[node] == 2) return false; // Already processed
            
            visited[node] = 1; // Mark engaging
            for (int neighbor : adj[node]) {
                if (hasCycle(neighbor)) return true;
            }
            visited[node] = 2; // Mark safe
            return false;
        };
        
        for (int i = 0; i < numCourses; i++) {
            if (hasCycle(i)) return false;
        }
        return true;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Course Schedule</h2>
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
                        href="https://leetcode.com/problems/course-schedule/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you <strong>must</strong> take course <code>bi</code> first if you want to take course <code>ai</code>.
                    <br /><br />
                    Return <em>true if you can finish all courses. Otherwise, return false</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Cycle Detection (DFS)</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We model the courses as a Directed Graph. If there is a <strong>Cycle</strong>, it is impossible to finish all courses.
                    <br />
                    We use DFS with 3 states:
                    <br />
                    - <strong>Unvisited (Gray)</strong>: Not yet processed.
                    <br />
                    - <strong>Visiting (Orange)</strong>: Currently in the recursion stack. If we see this again, there is a cycle!
                    <br />
                    - <strong>Visited (Green)</strong>: Fully processed and safe.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <CourseScheduleVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(V + E)</code> - Visit every node and edge.</li>
                    <li><strong>Space Complexity:</strong> <code>O(V)</code> - Recursion stack + visited arrays.</li>
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

export default CourseScheduleContent;
