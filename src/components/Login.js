import React from 'react';

const Login = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3001/auth/github';
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>Login with GitHub</button>
        </div>
    );
};

export default Login;