import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import FindMedianVisualizer from '../../Visualizer/Blind75/FindMedianVisualizer';

const FindMedianContent = () => {
    const codeSnippet = `class MedianFinder {
    priority_queue<int> maxHeap; // Left (Small half)
    priority_queue<int, vector<int>, greater<int>> minHeap; // Right (Large half)

public:
    void addNum(int num) {
        maxHeap.push(num);
        
        // Move max of left to right
        minHeap.push(maxHeap.top());
        maxHeap.pop();
        
        // Balance: Left size >= Right size
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    
    double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.top();
        }
        return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Find Median from Data Stream</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(231, 76, 60, 0.2)', // Red for Hard
                        color: '#e74c3c',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(231, 76, 60, 0.4)'
                    }}>
                        Hard
                    </span>
                    <a
                        href="https://leetcode.com/problems/find-median-from-data-stream/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    The <strong>median</strong> is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.
                    <br /><br />
                    Implement the <code>MedianFinder</code> class:
                    <ul>
                        <li><code>void addNum(int num)</code> adds the integer <code>num</code> from the data stream to the data structure.</li>
                        <li><code>double findMedian()</code> returns the median of all elements so far.</li>
                    </ul>
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Two Heaps Strategy</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We maintain two heaps: a <strong>Max-Heap</strong> for the smaller half of the numbers and a <strong>Min-Heap</strong> for the larger half.
                    By keeping the heaps balanced (size difference at most 1), the median is always efficiently accessible from the tops of the heaps.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <FindMedianVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(log N)</code> for <code>addNum</code>, <code>O(1)</code> for <code>findMedian</code>.</li>
                    <li><strong>Space Complexity:</strong> <code>O(N)</code> - To store all numbers.</li>
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

export default FindMedianContent;
