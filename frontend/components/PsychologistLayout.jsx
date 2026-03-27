import React from 'react';
import PsychologistSidebar from './PsychologistSidebar';
import './App.css';

export default function PsychologistLayout({ children }) {
    return (
        <div className="client-layout">
            <PsychologistSidebar />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
}