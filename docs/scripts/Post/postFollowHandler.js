/**
 * Initialize all follow toggle buttons in posts
 * Call this after posts are rendered
 */
function initializeFollowButtons() {
    const followButtons = document.querySelectorAll('.follow-toggle-btn');
    
    followButtons.forEach(button => {
        const targetUserId = parseInt(button.getAttribute('data-user-id'));
        
        // Check if already following and update button
        checkIsFollowing(targetUserId, function(isFollowing) {
            updateFollowButton(button, isFollowing);
        });
        
        // Add click handler
        button.addEventListener('click', function() {
            handleFollowToggle(this, targetUserId);
        });
    });
}

/**
 * Update button text and style based on follow status
 */
function updateFollowButton(button, isFollowing) {
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner-border');
    
    spinner.classList.add('d-none');
    
    if (isFollowing) {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
        btnText.textContent = 'Dejar de seguir';
    } else {
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-primary');
        btnText.textContent = 'Seguir';
    }
}

/**
 * Handle follow/unfollow toggle
 */
function handleFollowToggle(button, targetUserId) {
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner-border');
    const isCurrentlyFollowing = btnText.textContent === 'Dejar de seguir';
    
    // Show loading
    spinner.classList.remove('d-none');
    btnText.textContent = 'Procesando...';
    button.disabled = true;
    
    if (isCurrentlyFollowing) {
        // Unfollow
        unfollowUser(targetUserId, function(success) {
            button.disabled = false;
            if (success) {
                updateFollowButton(button, false);
            } else {
                alert('Error al dejar de seguir');
                spinner.classList.add('d-none');
                btnText.textContent = 'Dejar de seguir';
            }
        });
    } else {
        // Follow
        followUser(targetUserId, function(response) {
            button.disabled = false;
            if (response && response.id) {
                updateFollowButton(button, true);
            } else {
                alert('Error al seguir usuario');
                spinner.classList.add('d-none');
                btnText.textContent = 'Seguir';
            }
        });
    }
}
