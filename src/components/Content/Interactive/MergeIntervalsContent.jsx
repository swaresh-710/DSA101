import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import MergeIntervalsVisualizer from '../../Visualizer/MergeIntervalsVisualizer';

const MergeIntervalsContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Merge Intervals</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    The **Merge Intervals** pattern describes an efficient technique to deal with overlapping intervals. In a lot of problems involving intervals, you either need to find overlapping intervals or merge intervals if they overlap.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Given a set of intervals sorted by their start time, we iterate through them. If the current interval overlaps with the previous merged interval (i.e., Start(current) &le; End(prev)), we merge them by taking the max end time.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <MergeIntervalsVisualizer />
                </div>
            </section>

            <section>
                <h3>Algorithm</h3>
                <CodeBlock code={`vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end()); // 1. Sort by start time
    
    vector<vector<int>> merged;
    for (auto interval : intervals) {
        // If empty or no overlap, add new interval
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            // Overlap detected, merge
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}`} />
            </section>
        </div>
    );
};

export default MergeIntervalsContent;
