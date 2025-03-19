// RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { registerUser } from '../Services/UserService';

const RegisterPage = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');  // Default role is 'CUSTOMER'
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const user = {
            userName,
            userEmail,
            userPassword,
            role,
        };
    
        try {
            // POST request, not GET request
            const response = await registerUser(user);
            console.log('User registered successfully:', response);
            setMessage('User registered successfully!');
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={userPassword} 
                        onChange={(e) => setUserPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TEAMMEMBER">Team Member</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegisterPage;
