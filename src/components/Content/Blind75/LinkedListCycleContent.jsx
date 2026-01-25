import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import LinkedListCycleVisualizer from '../../Visualizer/Blind75/LinkedListCycleVisualizer';

const LinkedListCycleContent = () => {
    const codeSnippet = `class Solution {
public:
    bool hasCycle(ListNode *head) {
        if (head == NULL) return false;
        
        ListNode *slow = head;
        ListNode *fast = head;
        
        while (fast != NULL && fast->next != NULL) {
            slow = slow->next;          // Move 1 step
            fast = fast->next->next;    // Move 2 steps
            
            if (slow == fast) {
                return true; // Cycle detected
            }
        }
        
        return false; // Reached end, no cycle
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Linked List Cycle</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(46, 204, 113, 0.2)', // Green for Easy
                        color: '#2ecc71',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(46, 204, 113, 0.4)'
                    }}>
                        Easy
                    </span>
                    <a
                        href="https://leetcode.com/problems/linked-list-cycle/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.
                    <br /><br />
                    There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Floyd's Tortoise and Hare</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We use two pointers, <strong>Slow</strong> and <strong>Fast</strong>. Slow moves one step at a time, while Fast moves two steps.
                    If there is a cycle, the Fast pointer will eventually "lap" the Slow pointer and they will meet. If there is no cycle, Fast will reach the end (NULL).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <LinkedListCycleVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - In the worst case, we traverse the cycle a few times.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - We only use two pointers.</li>
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

export default LinkedListCycleContent;
