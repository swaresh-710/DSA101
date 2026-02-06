import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import MergeKListsVisualizer from '../../Visualizer/Blind75/MergeKListsVisualizer';

const MergeKListsContent = () => {
    const codeSnippet = `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    struct compare {
        bool operator()(ListNode* a, ListNode* b) {
            return a->val > b->val; // Min-Heap
        }
    };

    ListNode* mergeKLists(vector<ListNode*>& lists) {
        priority_queue<ListNode*, vector<ListNode*>, compare> pq;
        
        // Push heads of all lists
        for(ListNode* list : lists) {
            if(list) pq.push(list);
        }
        
        ListNode* dummy = new ListNode(0);
        ListNode* tail = dummy;
        
        while(!pq.empty()) {
            ListNode* minNode = pq.top();
            pq.pop();
            
            tail->next = minNode;
            tail = tail->next;
            
            if(minNode->next) {
                pq.push(minNode->next);
            }
        }
        
        return dummy->next;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div className="responsive-header">
                    <h2 style={{ margin: 0 }}>Merge K Sorted Lists</h2>
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
                        href="https://leetcode.com/problems/merge-k-sorted-lists/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.
                    <br />
                    Merge all the linked-lists into one sorted linked-list and return it.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Min-Heap Approach</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We can efficiently find the smallest element among the heads of the <code>K</code> lists using a <strong>Min-Heap</strong> (Priority Queue).
                    We push the head of every list into the heap. Then, we repeatedly pop the smallest element, add it to our result, and push the next element from the same list into the heap.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <MergeKListsVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N log K)</code> - Where N is total number of nodes and K is number of lists. Heap operations take log K.</li>
                    <li><strong>Space Complexity:</strong> <code>O(K)</code> - To hold K nodes in the heap.</li>
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

export default MergeKListsContent;
