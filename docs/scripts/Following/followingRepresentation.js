// ====================================================================
// CONTACTS PRESENTATION - Render contacts to DOM
// ====================================================================

/**
 * Fetches and renders all contacts for the current user
 * Uses Following class for HTML generation
 */
function renderContacts() {
    // TODO: When login is implemented, replace TEMP_USER_ID with:
    // const userId = localStorage.getItem('userId');
    
    getContacts(undefined, function(contacts) {
        const sectionFollowing = document.getElementById("following_collection");
        
        if (!sectionFollowing) {
            console.error('Element #following_collection not found');
            return;
        }
        
        sectionFollowing.innerHTML = "";
        
        // Render each contact using Following class
        for (const contactData of contacts) {
            const following = new Following(contactData);
            const node = following.getNode();
            sectionFollowing.append(node);
        }
        
        // Update contacts count dynamically
        updateContactsCount(contacts.length);
    });
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
