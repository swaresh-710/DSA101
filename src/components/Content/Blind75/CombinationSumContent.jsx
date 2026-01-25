import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import CombinationSumVisualizer from '../../Visualizer/Blind75/CombinationSumVisualizer';

const CombinationSumContent = () => {
    const codeSnippet = `class Solution {
public:
    void backtrack(vector<int>& candidates, int target, vector<vector<int>>& res, vector<int>& combination, int start) {
        if (target == 0) {
            res.push_back(combination);
            return;
        }
        
        for (int i = start; i < candidates.size(); i++) {
            if (candidates[i] > target) continue; // Optimization: candidates sorted usually
            
            combination.push_back(candidates[i]);
            // Recursive call: decrease target, allow choosing same element again (pass 'i' not 'i+1')
            backtrack(candidates, target - candidates[i], res, combination, i);
            combination.pop_back(); // Backtrack
        }
    }

    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> res;
        vector<int> combination;
        backtrack(candidates, target, res, combination, 0);
        return res;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Combination Sum</h2>
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
                        href="https://leetcode.com/problems/combination-sum/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target integer <code>target</code>, return <em>a list of all unique combinations of <code>candidates</code> where the chosen numbers sum to <code>target</code></em>. You may return the combinations in <strong>any order</strong>.
                    <br /><br />
                    The <strong>same</strong> number may be chosen from <code>candidates</code> an <strong>unlimited number of times</strong>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Backtracking</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We explore the decision tree: at each step, we can choose to include a candidate number. If we include it, we subtract it from the target and recurse. If the target becomes 0, we found a combination. If negative, we backtrack.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <CombinationSumVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N^((T/M)+1))</code> - Exponential, where N is number of candidates, T is target, M is min value in candidates.</li>
                    <li><strong>Space Complexity:</strong> <code>O(T/M)</code> - For recursion stack.</li>
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

export default CombinationSumContent;
