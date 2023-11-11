// Layout.js
import React from 'react';
import Sidebar from './Navbar';
import '../Styles/Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
