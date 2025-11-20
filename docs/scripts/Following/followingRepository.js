// ====================================================================
// CONTACTS REPOSITORY - Fetch contacts from backend API
// ====================================================================

const API_URL = 'http://localhost:5174';

// TODO: Replace with real userId from localStorage when login is implemented
// After implementing login, use: const userId = localStorage.getItem('userId');
const TEMP_USER_ID = 1; // Temporary hardcoded user ID for testing

/**
 * Fetches all contacts (followed users) for a given user
 * @param {number} userId - The ID of the user whose contacts to fetch
 * @returns {Promise<Array>} Array of contact objects formatted for the frontend
 * 
 * TODO FUTURE (when login is implemented):
 * 1. Remove TEMP_USER_ID constant
 * 2. Get userId from: localStorage.getItem('userId')
 * 3. Get token from: localStorage.getItem('token')
 * 4. Add Authorization header: 'Authorization': `Bearer ${token}`
 */
async function getContacts(userId = TEMP_USER_ID) {
    try {
        const response = await fetch(`${API_URL}/api/Following/following/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                // TODO: Add when login is implemented:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        
        // Map backend response to frontend format
        return users.map(user => ({
            imgUser: user.imageUrl || "assets/imgwebp/default.webp", // TODO: Verify if backend returns imageUrl
            nameUser: `${user.name} ${user.lastName}`,
            isFollowing: true
        }));
        
    } catch (error) {
        console.error('Error fetching contacts:', error);
        
        // Fallback: Return mock data if API fails (for development)
        console.warn('Using mock data as fallback');
        return [
            {
                imgUser: "assets/imgwebp/veronicacontacts.webp",
                nameUser: "Verónica Ramirez",
                isFollowing: true
            },
            {
                imgUser: "assets/imgwebp/danielcontacts.webp",
                nameUser: "Daniel Llanes",
                isFollowing: true
            },
            {
                imgUser: "assets/imgwebp/constanzacontacts.webp",
                nameUser: "Constanza Rodriguez",
                isFollowing: true
            }
        ];
    }
}
