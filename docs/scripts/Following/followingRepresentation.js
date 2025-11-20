// ====================================================================
// CONTACTS PRESENTATION - Render contacts to DOM
// ====================================================================

/**
 * Fetches and renders all contacts for the current user
 * Uses Following class for HTML generation
 */
async function renderContacts() {
    try {
        // TODO: When login is implemented, replace TEMP_USER_ID with:
        // const userId = localStorage.getItem('userId');
        const contacts = await getContacts(); // Uses TEMP_USER_ID from repository
        
        const sectionFollowing = document.getElementById("following_collection");
        
        if (!sectionFollowing) {
            console.error('Element #following_collection not found');
            return;
        }
        
        sectionFollowing.innerHTML = "";
        
        // Render each contact using Following class
        contacts.forEach(contactData => {
            const following = new Following(contactData);
            const node = following.getNode();
            sectionFollowing.append(node);
        });
        
        // Update contacts count dynamically
        updateContactsCount(contacts.length);
        
    } catch (error) {
        console.error('Error rendering contacts:', error);
    }
}

/**
 * Updates the contacts counter in the UI
 * @param {number} count - Number of contacts to display
 */
function updateContactsCount(count) {
    const countElem = document.querySelector('.contacts-count');
    if (countElem) {
        countElem.textContent = count + (count === 1 ? ' Contacto' : ' Contactos');
    }
}

// Initialize: Render contacts when page loads
renderContacts();
