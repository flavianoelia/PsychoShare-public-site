// ====================================================================
// CONTACTS REPOSITORY - Fetch contacts from backend API
// ====================================================================

// TODO: Replace with real userId from localStorage when login is implemented
// After implementing login, use: const userId = localStorage.getItem('userId');
const TEMP_USER_ID = 1; // Temporary hardcoded user ID for testing

/**
 * Fetches all contacts (followed users) for a given user
 * @param {number} userId - The ID of the user whose contacts to fetch
 * @param {Function} callback - Callback function to handle the response
 * 
 * TODO FUTURE (when login is implemented):
 * 1. Remove TEMP_USER_ID constant
 * 2. Get userId from: localStorage.getItem('userId')
 * 3. Get token from: localStorage.getItem('token')
 * 4. Uncomment Authorization header in server() config
 */
function getContacts(userId = TEMP_USER_ID, callback) {
    const url = `/api/Following/following/${userId}`;
    
    const config = {
        method: 'GET'
        // TODO: Add when login is implemented:
        // headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        // }
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
