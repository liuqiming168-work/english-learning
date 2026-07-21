import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'nav-active' : '';

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">🌟 英语跟读小助手</h1>
        <p className="app-subtitle">冀教版 · 小学三年级</p>
      </header>
      <nav className="app-nav">
        <Link to="/" className={`nav-link ${isActive('/')}`}>🏠 首页</Link>
        <Link to="/units" className={`nav-link ${isActive('/units')}`}>📚 单元学习</Link>
        <Link to="/review" className={`nav-link ${isActive('/review')}`}>📝 重点复习</Link>
      </nav>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>河北廊坊 · 小学三年级英语学习工具 · 冀教版（三年级起点）</p>
      </footer>
    </div>
  );
};

export default Layout;
