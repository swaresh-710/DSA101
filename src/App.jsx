import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ModulePage from './pages/ModulePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/modules/:moduleId/:topicId" element={<ModulePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

function HomePlaceholder() {
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
        Master <span style={{ color: 'var(--accent-primary)' }}>DSA</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
        Interactive visualizations, premium design, and deep dives into C++ fundamentals and algorithmic patterns.
      </p>
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button style={{
          padding: '1rem 2rem',
          background: 'var(--accent-primary)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          fontSize: '1.1rem',
          fontWeight: '600',
          boxShadow: 'var(--shadow-lg)'
        }}>
          Start Learning
        </button>
      </div>
    </div>
  );
}

export default App;
