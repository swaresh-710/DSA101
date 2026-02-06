import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TopKFrequentVisualizer from '../../Visualizer/Blind75/TopKFrequentVisualizer';

const TopKFrequentContent = () => {
    const codeSnippet = `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> counts;
        for (int num : nums) counts[num]++;
        
        // Min-Heap of pair<freq, val>
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;
        
        for (auto& entry : counts) {
            minHeap.push({entry.second, entry.first});
            
            if (minHeap.size() > k) {
                minHeap.pop(); // Remove element with smallest frequency
            }
        }
        
        vector<int> result;
        while (!minHeap.empty()) {
            result.push_back(minHeap.top().second);
            minHeap.pop();
        }
        return result;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Top K Frequent Elements</h2>
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
                        href="https://leetcode.com/problems/top-k-frequent-elements/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements. You may return the answer in any order.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Hash Map + Min Heap</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We first count the frequency of every element using a Hash Map. Then we iterate through the unique elements and maintain a <strong>Min-Heap of size K</strong>.
                    Because the heap is a Min-Heap, the root is always the element with the smallest frequency among the K elements we are tracking. If we find a new element with a higher frequency than the root, we pop the root and push the new element.
                    This ensures that after processing all elements, the heap contains the K elements with the largest frequencies.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <TopKFrequentVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N log K)</code> - Counting is O(N). Heap operations are O(log K) done N times.</li>
                    <li><strong>Space Complexity:</strong> <code>O(N + K)</code> - Map stores N items, Heap stores K items.</li>
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

export default TopKFrequentContent;
