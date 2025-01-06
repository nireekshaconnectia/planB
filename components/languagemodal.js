// components/LanguageModal.js
import React, { useState } from 'react';
import LoginForm from '@/components/login/userlogin'

const LanguageModal = ({ showModal, setShowModal }) => {
    return (
        <>
            {showModal && (
                <div className="lang-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Select Language</h2>
                        <ul>
                            <li><a href="?lang=en">English</a></li>
                            <li><a href="?lang=ar">Arabic</a></li>
                        </ul>
                    </div>
                </div>
                
            )}
            
        </>
    );
}

export default LanguageModal;
