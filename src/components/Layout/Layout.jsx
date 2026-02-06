import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    return (
        <div className="layout-wrapper">
            {!isMobileSidebarOpen && (
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            )}

            <Sidebar isOpen={isMobileSidebarOpen} onClose={closeSidebar} />

            {isMobileSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
