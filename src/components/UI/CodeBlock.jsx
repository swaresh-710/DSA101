import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language = 'cpp', code }) => {
    return (
        <div className="code-block-wrapper" style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            margin: '1.5rem 0',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--glass-border)'
        }}>
            <div style={{
                background: '#1e1e1e', // Match vscDarkPlus bg
                padding: '0.5rem 1rem',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>{language}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
                </div>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers={true}
                customStyle={{ margin: 0, padding: '1.5rem' }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
