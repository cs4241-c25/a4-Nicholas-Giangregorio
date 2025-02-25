import React from 'react';

function Header() {
    const handleLogout = async () => {
        console.log('Logout button clicked'); // Debug log
        try {
            const response = await fetch('/api/logout', { // Make sure the path matches the server-side route
                method: 'POST',
                credentials: 'same-origin'
            });
            console.log('Logout response:', response); // Debug log
            if (response.ok) {
                window.location.href = '/login.html';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header id="main-header" className="bg-primary text-white text-center py-3">
            <h1>Recipe Organizer</h1>
            <button onClick={handleLogout} className="btn btn-secondary float-right mr-4">Logout</button>
        </header>
    );
}

export default Header;
