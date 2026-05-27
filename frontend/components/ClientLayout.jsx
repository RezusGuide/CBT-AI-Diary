import React from 'react';
import Sidebar from './Sidebar';

const ClientLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default ClientLayout;
