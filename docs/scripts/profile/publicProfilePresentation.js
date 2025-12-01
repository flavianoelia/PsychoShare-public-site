// Presentation logic for viewing a public user's profile
let publicProfileCurrentPage = 1;
const publicProfilePageSize = 10;
let publicProfileIsLoading = false;
let publicProfileHasMorePosts = true;
let publicProfileUserId = null;

function getProfileUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userId');
}

function renderProfileHeader(user) {
  const userNameElement = document.querySelector('.user-name');
  if (userNameElement) userNameElement.textContent = `${user.name || ''} ${user.lastName || ''}`.trim() || 'Usuario';

  const profileAvatar = document.getElementById('profile-avatar');
  if (profileAvatar) {
    if (user.avatarUrl) {
      profileAvatar.src = user.avatarUrl;
      profileAvatar.onerror = function() {
        this.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="profile-avatar"></i>';
      };
    } else {
      // keep default image or replace with icon
      // do nothing if default present
    }
  }
}

function loadPublicPosts(page = 1, append = false) {
  if (publicProfileIsLoading || (!publicProfileHasMorePosts && page > 1)) return;
  publicProfileIsLoading = true;

  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) loadingIndicator.style.display = 'block';

  getUserPosts(publicProfileUserId, page, publicProfilePageSize, function(result) {
    publicProfileIsLoading = false;
    if (loadingIndicator) loadingIndicator.style.display = 'none';

    if (!result.success) {
      console.error('Error loading public posts:', result.message);
      return;
    }

    const posts = result.data || [];
    publicProfileHasMorePosts = posts.length === publicProfilePageSize;

    // Update posts count
    if (page === 1) {
      const postsCountElement = document.getElementById('posts-count');
      if (postsCountElement) postsCountElement.textContent = posts.length;
    }

    const container = document.querySelector('main');
    if (!container) return;

    // Remove existing articles if not appending
    const existingArticles = container.querySelectorAll('article.article');
    if (!append && existingArticles.length > 0) {
      existingArticles.forEach(a => a.remove());
    }

    const insertAfter = container.firstElementChild;

    posts.forEach(postData => {
      const postObj = new Post(postData);
      const postElement = postObj.getNode();
      if (insertAfter && insertAfter.nextSibling) {
        container.insertBefore(postElement, insertAfter.nextSibling);
      } else {
        container.appendChild(postElement);
      }
    });

    // Initialize like buttons if handler exists
    if (typeof initializeLikeButtons === 'function') {
      initializeLikeButtons();
    }
  });
}

function loadPublicProfile() {
  const profileUserId = getProfileUserIdFromUrl();
  if (!profileUserId) {
    console.error('No userId provided in query');
    return;
  }

  publicProfileUserId = profileUserId;

  getUserProfile(profileUserId, function(result) {
    if (!result.success) {
      console.error('Error loading profile:', result.message);
      return;
    }

    renderProfileHeader(result.data || {});
  });

  // Get the contacts that this public user follows
  getContacts(profileUserId, function(contacts) {
    const contactsCountElement = document.getElementById('contacts-count');
    if (contactsCountElement) {
      const count = Array.isArray(contacts) ? contacts.length : 0;
      contactsCountElement.textContent = count;
    }
  });

  // Load first page of posts
  loadPublicPosts(1, false);
}

function initializePublicInfiniteScroll() {
  window.addEventListener('scroll', () => {
    if (publicProfileIsLoading || !publicProfileHasMorePosts) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 500;

    if (scrollPosition >= threshold) {
      publicProfileCurrentPage++;
      loadPublicPosts(publicProfileCurrentPage, true);
    }
  });
}

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadPublicProfile();
    initializePublicInfiniteScroll();
  });
} else {
  loadPublicProfile();
  initializePublicInfiniteScroll();
}
