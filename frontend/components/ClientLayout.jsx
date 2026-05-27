import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const ClientLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Toaster position="top-center" />
                {children}
            </main>
        </div>
    );
};

export default ClientLayout;
