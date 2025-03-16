import React, { useState } from 'react';
import BackButton from "@/components/backbutton/backbutton";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import styles from './userlogin.module.css';

const LoginFormModal = ({ showLoginModal, setShowLoginModal }) => {
    const [loginNumber, setLoginNumber] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (!/^\d+$/.test(loginNumber)) {
            setLoginError('Please enter a valid number');
        } else {
            setLoginError('');
            setIsLoading(true);
            // Simulate an async operation
            setTimeout(() => {
                // Handle successful login logic here
                console.log('Number submitted:', loginNumber);
                // setShowLoginModal(false); // Remove or comment out this line to keep the modal open
                setIsLoading(false); // Hide loader after process is done
            }, 2000); // Simulate a 2-second delay
        }
    };

    return (
        <>
            {showLoginModal && (
                <div className={styles.loginModal}>
                    <div className={styles.loginModalContent}>
                        <BackButton />
                        <span className={styles.loginClose} onClick={() => setShowLoginModal(false)}>&times;</span>
                        <h4>Login</h4>
                        <form onSubmit={handleLoginSubmit}>
                            <div className={styles.loginFormGroup}>
                                <label htmlFor="loginNumber">Phone Number</label>
                                <input 
                                    type="text" 
                                    id="loginNumber" 
                                    value={loginNumber} 
                                    onChange={(e) => setLoginNumber(e.target.value)} 
                                    required 
                                    pattern="\d*" 
                                    maxLength="10"
                                />
                                {loginError && <p className={styles.loginError}>{loginError}</p>}
                            </div>
                            <button type="submit" className={styles.loginButton} disabled={isLoading}>
                                {isLoading ? <LoadingSpinner /> : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginFormModal;
