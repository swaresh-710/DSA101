import React from 'react';
import CodeBlock from '../../UI/CodeBlock';

const STLContainers = () => {
    return (
        <div className="theory-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Understanding STL Containers</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    The Standard Template Library (STL) is a powerful set of C++ template classes to provide general-purpose classes and functions with templates that implement many popular and commonly used algorithms and data structures like vectors, lists, queues, and stacks.
                </p>

                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)', background: 'linear-gradient(90deg, rgba(80, 40, 150, 0.1), transparent)' }}>
                    <p><strong>Key Insight:</strong> STL containers manage memory automatically and provide safe, efficient implementations of common data structures.</p>
                </div>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>1. std::vector</h3>
                <p>Vectors are sequence containers representing arrays that can change in size. They use contiguous storage locations for their elements, which means that their elements can also be accessed using offsets on regular pointers to its elements.</p>

                <CodeBlock code={`#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Initialization
    vector<int> numbers = {1, 2, 3};
    
    // Add elements
    numbers.push_back(4); // [1, 2, 3, 4]
    
    // Access elements
    cout << "First element: " << numbers[0] << endl;
    cout << "Size: " << numbers.size() << endl;
    
    // Iteration
    for(int num : numbers) {
        cout << num << " ";
    }
    
    return 0;
}`} />
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>2. std::map</h3>
                <p>Maps are associative containers that store elements formed by a combination of a key value and a mapped value, following a specific order.</p>
                <CodeBlock code={`#include <map>
#include <string>

int main() {
    map<string, int> ages;
    
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    
    // Check if key exists
    if (ages.count("Alice")) {
        // Key exists
    }
}`} />
            </section>
        </div>
    );
};

export default STLContainers;
