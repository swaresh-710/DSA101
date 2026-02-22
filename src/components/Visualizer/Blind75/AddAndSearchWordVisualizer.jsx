import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddAndSearchWordVisualizer = () => {
    // Basic Trie Node structure
    const createNode = (char = '') => ({
        id: Math.random().toString(36).substr(2, 9),
        char,
        isWord: false,
        children: {} // map of char -> node
    });

    const [trie, setTrie] = useState({ ...createNode('*') }); // '*' represents root visually
    const [wordList, setWordList] = useState([]);

    // Inputs
    const [addInput, setAddInput] = useState('bad');
    const [searchInput, setSearchInput] = useState('.ad');

    // Execution State
    const [message, setMessage] = useState('Enter a word to add or search.');
    const [activePath, setActivePath] = useState([]); // Array of node IDs currently being explored
    const [foundNodeId, setFoundNodeId] = useState(null); // ID of the node where search succeeded
    const [isExecuting, setIsExecuting] = useState(false);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleAddWord = async () => {
        if (!addInput || isExecuting) return;
        setIsExecuting(true);
        const word = addInput.toLowerCase();

        setActivePath([trie.id]);
        setMessage(`Adding word "${word}"...`);
        await sleep(600);

        let curr = trie;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];

            if (!curr.children[char]) {
                curr.children[char] = createNode(char);
                setMessage(`Created new node for '${char}'`);
            } else {
                setMessage(`Node '${char}' already exists. Reusing it.`);
            }

            setTrie({ ...trie }); // Trigger re-render to show new node
            curr = curr.children[char];

            // Update active path for visualization
            setActivePath(prev => [...prev, curr.id]);
            await sleep(600);
        }

        if (!curr.isWord) {
            curr.isWord = true;
            setWordList(prev => [...new Set([...prev, word])]); // Only add if it's new
            setMessage(`Word "${word}" completely added. Marked leaf as end-of-word.`);
            setTrie({ ...trie });
        } else {
            setMessage(`Word "${word}" already strictly exists in the Trie.`);
        }

        await sleep(1000);
        setActivePath([]);
        setIsExecuting(false);
        setAddInput('');
    };

    const handleSearchWord = async () => {
        if (!searchInput || isExecuting) return;
        setIsExecuting(true);
        const word = searchInput.toLowerCase();

        setFoundNodeId(null);
        let wasFound = false;

        const dfs = async (node, index, currentPath) => {
            if (wasFound) return false; // Early exit if already found

            // Update visualization
            setActivePath([...currentPath, node.id]);

            if (index === word.length) {
                if (node.isWord) {
                    setMessage(`Found match at end of string! Validation Successful.`);
                    setFoundNodeId(node.id);
                    wasFound = true;
                    return true;
                }
                setMessage(`Reached end of string but node '${node.char}' is NOT marked as end-of-word.`);
                await sleep(800);
                return false;
            }

            const char = word[index];

            if (char === '.') {
                setMessage(`Wildcard '.' found. Branching out to ALL existing children of '${node.char}'`);
                await sleep(800);

                const childrenKeys = Object.keys(node.children);
                if (childrenKeys.length === 0) {
                    setMessage(`Wildcard search failed. Node '${node.char}' has no children.`);
                    await sleep(800);
                    return false;
                }

                for (let k of childrenKeys) {
                    if (wasFound) return true;
                    setMessage(`Wildcard matching child '${k}'`);
                    await sleep(600);
                    const res = await dfs(node.children[k], index + 1, [...currentPath, node.id]);
                    if (res) return true;
                }
                return false;
            } else {
                if (!node.children[char]) {
                    setMessage(`Character '${char}' not found in children of '${node.char}'. Search fails on this branch.`);
                    await sleep(800);
                    return false;
                }
                setMessage(`Character '${char}' matches! Proceeding deeper...`);
                await sleep(600);
                return await dfs(node.children[char], index + 1, [...currentPath, node.id]);
            }
        };

        setMessage(`Searching for "${word}"...`);
        await sleep(600);

        const finalResult = await dfs(trie, 0, []);

        if (finalResult) {
            setMessage(`Search returned TRUE. The word "${word}" matches!`);
        } else {
            setMessage(`Search returned FALSE. The word "${word}" does not exist in the Trie.`);
            setFoundNodeId(null);
        }

        setTimeout(() => setActivePath([]), 2000);
        setIsExecuting(false);
    };

    // Recursive component to render Trie naturally like a folder tree
    const TrieNodeRenderer = ({ node, level }) => {
        const isActive = activePath.includes(node.id);
        const isHead = activePath[activePath.length - 1] === node.id;
        const isFound = foundNodeId === node.id;

        return (
            <div style={{ paddingLeft: level === 0 ? '0' : '2rem', marginTop: '0.5rem', position: 'relative' }}>
                {/* SVG connection line from parent if not root */}
                {level > 0 && (
                    <div style={{ position: 'absolute', left: '0.5rem', top: '-0.5rem', width: '1.5rem', height: '1.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)' }} />
                )}

                <motion.div
                    animate={{
                        backgroundColor: isFound ? 'rgba(46, 204, 113, 0.3)' : isActive ? 'rgba(241, 196, 15, 0.2)' : '#222',
                        borderColor: isFound ? '#2ecc71' : isHead ? '#f1c40f' : isActive ? 'rgba(241, 196, 15, 0.4)' : '#444',
                        scale: isHead ? 1.05 : 1
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        border: '2px solid',
                        fontWeight: 'bold',
                        color: isFound ? '#2ecc71' : isActive ? '#f1c40f' : 'white',
                        boxShadow: isHead ? '0 0 10px rgba(241, 196, 15, 0.5)' : isFound ? '0 0 15px rgba(46, 204, 113, 0.5)' : 'none',
                        position: 'relative'
                    }}
                >
                    {node.char === '*' ? '(root)' : node.char}

                    {/* End of Word indicator */}
                    {node.isWord && (
                        <div style={{ position: 'absolute', right: '-8px', top: '-8px', background: '#e74c3c', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #222' }} title="End of Word" />
                    )}
                </motion.div>

                {/* Children */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <AnimatePresence>
                        {Object.values(node.children).map(childNode => (
                            <motion.div key={childNode.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <TrieNodeRenderer node={childNode} level={level + 1} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="responsive-flex" style={{ gap: '2rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1.5rem', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#888' }}>Add Word</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={addInput}
                                onChange={(e) => setAddInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                                placeholder="e.g. bad"
                                disabled={isExecuting}
                                style={{ flex: 1, padding: '0.6rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: 'white' }}
                            />
                            <button
                                onClick={handleAddWord}
                                disabled={isExecuting || !addInput}
                                style={{ padding: '0.6rem 1.2rem', background: '#e74c3c', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'white', opacity: isExecuting || !addInput ? 0.5 : 1 }}
                            >
                                Add (O(M))
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1.5rem', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#888' }}>Search Word</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value.replace(/[^a-zA-Z.]/g, ''))}
                                placeholder="e.g. .ad"
                                disabled={isExecuting}
                                title="Use a-z characters or '.' as a wildcard"
                                style={{ flex: 1, padding: '0.6rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: 'white' }}
                            />
                            <button
                                onClick={handleSearchWord}
                                disabled={isExecuting || !searchInput}
                                style={{ padding: '0.6rem 1.2rem', background: '#4ECDCA', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#111', opacity: isExecuting || !searchInput ? 0.5 : 1 }}
                            >
                                Search
                            </button>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.5rem' }}>* Use period (.) for wildcards</div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', minHeight: '1.5em', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Dictionary Sidebar */}
                <div style={{ flex: 0.5, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ color: '#888', marginBottom: '0.5rem' }}>Added Words Dictionary</h4>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', minHeight: '150px' }}>
                        {wordList.length === 0 ? (
                            <span style={{ color: '#555', fontStyle: 'italic' }}>No words added yet.</span>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <AnimatePresence>
                                    {wordList.map(word => (
                                        <motion.span
                                            key={word}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(231, 76, 60, 0.3)', fontWeight: 'bold' }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trie View */}
                <div style={{ flex: 1.5, minWidth: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '2rem', minHeight: '400px', overflowX: 'auto' }}>
                    <h4 style={{ color: '#888', marginBottom: '1.5rem' }}>Trie Real-Time Explorer</h4>
                    <TrieNodeRenderer node={trie} level={0} />

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#aaa' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#222', border: '1px solid #444' }}></div> Default Node
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#aaa' }}>
                            <div style={{ position: 'relative', width: '12px', height: '12px', borderRadius: '2px', background: '#222', border: '1px solid #444' }}>
                                <div style={{ position: 'absolute', right: '-4px', top: '-4px', background: '#e74c3c', width: '6px', height: '6px', borderRadius: '50%' }}></div>
                            </div> End of Word Node
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#aaa' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(241, 196, 15, 0.4)', border: '1px solid #f1c40f' }}></div> Traversing
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#aaa' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(46, 204, 113, 0.3)', border: '1px solid #2ecc71' }}></div> Found Word
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAndSearchWordVisualizer;
