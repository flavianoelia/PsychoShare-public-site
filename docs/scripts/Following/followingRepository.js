// ====================================================================
// CONTACTS REPOSITORY - Fetch contacts from backend API
// ====================================================================

/**
 * Fetches all contacts (followed users) for a given user
 * @param {number} userId - Optional. If not provided, gets from localStorage
 * @param {Function} callback - Callback function to handle the response
 */
function getContacts(userId, callback) {
    // Get userId and token from localStorage
    const currentUserId = userId || localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!currentUserId) {
        console.error('No userId found in localStorage');
        callback([]);
        return;
    }
    
    const url = `/api/Following/following/${currentUserId}`;
    
    const config = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    // Use server() function for consistency with the rest of the project
    server(url, config, (users) => {
        // Map backend response to frontend format
        const contacts = users.map(user => ({
            imgUser: user.imageUrl || "assets/imgwebp/default.webp",
            nameUser: `${user.name} ${user.lastName}`,
            isFollowing: true
        }));
        
        callback(contacts);
    });
}
