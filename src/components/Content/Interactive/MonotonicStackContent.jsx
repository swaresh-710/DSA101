import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import MonotonicStackVisualizer from '../../Visualizer/MonotonicStackVisualizer';

const MonotonicStackContent = () => {
    const codeSnippet = `vector<int> nextGreaterElements(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> s; // Stores indices

    for (int i = 0; i < n; i++) {
        // While stack is not empty and current element is greater than
        // the element at the index stored at top of stack
        while (!s.empty() && nums[i] > nums[s.top()]) {
            int index = s.top();
            s.pop();
            result[index] = nums[i];
        }
        s.push(i);
    }
    return result;
}`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Monotonic Stack</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    A Monotonic Stack is a stack whose elements are always sorted (either increasing or decreasing). It is incredibly efficient for finding the <strong>Next Greater Element</strong> (NGE) or <strong>Next Smaller Element</strong> (NSE) in linear time O(N).
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Next Greater Element Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We iterate through the array. If the current element is greater than the element at the top of the stack, it means we found the NGE for the stack top. We pop the stack and repeat. Then we push the current index.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <MonotonicStackVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Implementation Details</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    The key insight is that we only push an element onto the stack if it maintains the monotonic property (decreasing, in the case of finding the next greater element). When we find a larger element, it resolves the "Next Greater" query for all smaller elements waiting in the stack.
                </p>
                <CodeBlock
                    code={codeSnippet}
                    language="cpp"
                    showLineNumbers={true}
                />
            </section>
        </div>
    );
};

export default MonotonicStackContent;
