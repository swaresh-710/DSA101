import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { modules } from '../../data/modules';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState({});

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (window.innerWidth <= 768 && onClose) {
            onClose();
        }
    }, [location.pathname]);

    // Initialize state to expand the section matching the current URL or all by default?
    // Let's expand all by default for now, or just the one user is on.
    // Actually, expand all initially might be better for discovery, but user wanted "Dropdown" implies default closed or toggleable.
    // Let's do: Default ALL CLOSED except the active one.
    useEffect(() => {
        const currentPath = location.pathname;
        const newExpanded = { ...expandedSections };
        let hasActive = false;

        modules.forEach(module => {
            // Check if any topic in this module is active
            const isActive = module.topics.some(t => currentPath.includes(`/modules/${module.id}/${t.id}`));
            if (isActive) {
                newExpanded[module.id] = true;
                hasActive = true;
            }
        });

        // Optional: If no active section (e.g. home), maybe keep them all closed or open first one?
        // Let's just update if we have a new active match to ensure it opens.
        if (hasActive) {
            setExpandedSections(prev => ({ ...prev, ...newExpanded }));
        }
    }, [location.pathname]);

    const toggleSection = (moduleId) => {
        setExpandedSections(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    return (
        <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-text">DSA Mastery</div>
                <button className="mobile-close-btn" onClick={onClose}>&times;</button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        Home
                    </NavLink>
                </div>

                {modules.map(module => {
                    const isExpanded = !!expandedSections[module.id];
                    return (
                        <div className="nav-section" key={module.id}>
                            <div
                                className="nav-section-title clickable"
                                onClick={() => toggleSection(module.id)}
                            >
                                <span>{module.title}</span>
                                <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>›</span>
                            </div>

                            <div className={`nav-items-container ${isExpanded ? 'open' : ''}`}>
                                {module.topics.map(topic => (
                                    <NavLink
                                        key={topic.id}
                                        to={`/modules/${module.id}/${topic.id}`}
                                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        {topic.title}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                &copy; 2026 DSA Platform
            </div>
        </aside>
    );
};

export default Sidebar;
