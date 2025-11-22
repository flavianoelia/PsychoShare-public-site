// ====================================================================
// LIKE HANDLER - Handle like button interactions
// ====================================================================

/**
 * Initialize all like buttons in posts
 * Call this after posts are rendered
 */
function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll(".like-button");

  likeButtons.forEach((button) => {
    const postId = parseInt(button.getAttribute("data-post-id"));

    if (!postId) {
      console.error("Like button missing data-post-id attribute");
      return;
    }

    // Load initial like stats
    getLikeStats(postId, function (result) {
      if (result.success) {
        updateLikeButton(button, result.data.likeCount, result.data.isLikedByCurrentUser);
      }
    });

    // Add click handler
    button.addEventListener("click", function () {
      handleLikeClick(this, postId);
    });
  });
}

/**
 * Update button appearance based on like status
 * @param {HTMLElement} button - The like button element
 * @param {number} likeCount - Number of likes
 * @param {boolean} isLiked - Whether current user liked this post
 */
function updateLikeButton(button, likeCount, isLiked) {
  const icon = button.querySelector("i");
  const textSpan = button.querySelector(".like-text");

  // Update icon style
  if (isLiked) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    button.classList.add("liked");
  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
    button.classList.remove("liked");
  }

  // Update text
  if (textSpan) {
    textSpan.textContent = likeCount + (likeCount === 1 ? " Me gusta" : " Me gusta");
  }
}

/**
 * Handle like button click
 * @param {HTMLElement} button - The clicked button
 * @param {number} postId - The post ID
 */
function handleLikeClick(button, postId) {
  // Prevent race condition: if button is disabled, ignore click
  if (button.disabled) {
    return;
  }

  // Disable button during request
  button.disabled = true;

  const icon = button.querySelector("i");
  const textSpan = button.querySelector(".like-text");
  const isCurrentlyLiked = button.classList.contains("liked");

  // Get current count
  let currentCount = 0;
  if (textSpan) {
    const match = textSpan.textContent.match(/(\d+)/);
    currentCount = match ? parseInt(match[1]) : 0;
  }

  // Optimistic update (update UI immediately)
  const newCount = isCurrentlyLiked ? currentCount - 1 : currentCount + 1;
  updateLikeButton(button, newCount, !isCurrentlyLiked);

  // Call backend
  toggleLike(postId, function (result) {
    button.disabled = false;

    if (result.success) {
      // Backend confirms the new state (result.data is true if now liked, false if unliked)
      // Refresh stats to get accurate count
      getLikeStats(postId, function (statsResult) {
        if (statsResult.success) {
          updateLikeButton(button, statsResult.data.likeCount, statsResult.data.isLikedByCurrentUser);
        }
      });
    } else {
      // Rollback on error
      updateLikeButton(button, currentCount, isCurrentlyLiked);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "No se pudo procesar el like. Intentá nuevamente.",
      });
    }
  });
}
