import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import StockVisualizer from '../../Visualizer/Blind75/StockVisualizer';

const StockContent = () => {
    const codeSnippet = `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        
        for(int price : prices) {
            if(price < minPrice) {
                minPrice = price;
            } else if(price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Best Time to Buy and Sell Stock</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(46, 204, 113, 0.2)',
                        color: '#2ecc71',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(46, 204, 113, 0.4)'
                    }}>
                        Easy
                    </span>
                    <a
                        href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: One Pass Algorithm</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We assume we buy at the lowest price found *so far* (`minPrice`). For every subsequent day, we calculate the potential profit (`price - minPrice`) and update `maxProfit` if it's higher.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <StockVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - We only pass through the array once.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Only two variables (`minPrice`, `maxProfit`) are used.</li>
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

export default StockContent;
