import React from 'react';
import PsychologistSidebar from './PsychologistSidebar';
import { Toaster } from 'react-hot-toast';

export default function PsychologistLayout({ children }) {
    return (
        <div className="app-layout">
            <PsychologistSidebar />
            <main className="main-content">
                <Toaster position="top-center" />
                {children}
            </main>
        </div>
    );
}
