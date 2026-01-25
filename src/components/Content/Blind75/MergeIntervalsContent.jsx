import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import MergeIntervalsVisualizer from '../../Visualizer/Blind75/MergeIntervalsVisualizer';

const MergeIntervalsContent = () => {
    const codeSnippet = `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        
        // 1. Sort by start time
        sort(intervals.begin(), intervals.end());
        
        vector<vector<int>> merged;
        merged.push_back(intervals[0]);
        
        for (int i = 1; i < intervals.size(); i++) {
            // Get last interval in merged list
            vector<int>& last = merged.back();
            
            // Check for overlap
            if (intervals[i][0] <= last[1]) {
                // Merge
                last[1] = max(last[1], intervals[i][1]);
            } else {
                // No overlap associated
                merged.push_back(intervals[i]);
            }
        }
        
        return merged;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Merge Intervals</h2>
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
                        href="https://leetcode.com/problems/merge-intervals/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an array of <code>intervals</code> where <code>intervals[i] = [starti, endi]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Sort & Merge</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    First, we sort the intervals by their start times. This puts potential overlaps adjacent to each other.
                    Then we traverse the sorted intervals and either merge with the previous one (if they overlap) or add as a new interval.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <MergeIntervalsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N log N)</code> - Dominated by sorting.</li>
                    <li><strong>Space Complexity:</strong> <code>O(N)</code> - Worst case to store sorted output.</li>
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

export default MergeIntervalsContent;
