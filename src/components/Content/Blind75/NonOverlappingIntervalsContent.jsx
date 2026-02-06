import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import NonOverlappingIntervalsVisualizer from '../../Visualizer/Blind75/NonOverlappingIntervalsVisualizer';

const NonOverlappingIntervalsContent = () => {
    const codeSnippet = `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        // 1. Sort by End Time
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];
             });
             
        int count = 0;
        int end = intervals[0][1];
        
        for (int i = 1; i < intervals.size(); i++) {
            // If current starts before previous ends -> overlap
            if (intervals[i][0] < end) {
                count++; // Remove current (greedily keep the one ending earlier)
            } else {
                end = intervals[i][1]; // Update end
            }
        }
        
        return count;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Non-overlapping Intervals</h2>
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
                        href="https://leetcode.com/problems/non-overlapping-intervals/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an array of intervals <code>intervals</code> where <code>intervals[i] = [starti, endi]</code>, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Greedy Strategy</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We sort intervals by their <strong>end times</strong>. This allows us to always pick the interval that ends earliest, leaving as much room as possible for subsequent intervals. If an interval overlaps with the previous one, we remove it.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <NonOverlappingIntervalsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N log N)</code> - Sorting dominated.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Auxiliary space (ignoring sort stack).</li>
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

export default NonOverlappingIntervalsContent;
