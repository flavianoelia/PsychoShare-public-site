/**
 * Initialize all follow toggle buttons in posts
 * Call this after posts are rendered
 */
function initializeFollowButtons() {
  const followButtons = document.querySelectorAll(".follow-toggle-btn");

  followButtons.forEach((button) => {
    const targetUserId = parseInt(button.getAttribute("data-user-id"));

    // Check if already following and update button
    checkIsFollowing(targetUserId, function (result) {
      if (result.success) {
        updateFollowButton(button, result.data);
      }
    });

    // Add click handler
    button.addEventListener("click", function () {
      handleFollowToggle(this, targetUserId);
    });
  });
}

/**
 * Update button text and style based on follow status
 */
function updateFollowButton(button, isFollowing) {
  const btnText = button.querySelector(".btn-text");
  const spinner = button.querySelector(".spinner-border");

  spinner.classList.add("d-none");

  if (isFollowing) {
    button.classList.remove("btn-primary");
    button.classList.add("btn-outline-secondary");
    btnText.textContent = "Dejar de seguir";
  } else {
    button.classList.remove("btn-outline-secondary");
    button.classList.add("btn-primary");
    btnText.textContent = "Seguir";
  }
}

/**
 * Handle follow/unfollow toggle
 */
function handleFollowToggle(button, targetUserId) {
  const btnText = button.querySelector(".btn-text");
  const spinner = button.querySelector(".spinner-border");
  const isCurrentlyFollowing = btnText.textContent === "Dejar de seguir";

  // Show loading
  spinner.classList.remove("d-none");
  btnText.textContent = "Procesando...";
  button.disabled = true;

  if (isCurrentlyFollowing) {
    // Unfollow
    unfollowUser(targetUserId, function (result) {
      button.disabled = false;
      if (result.success) {
        updateFollowButton(button, false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error al dejar de seguir"
        });
        spinner.classList.add("d-none");
        btnText.textContent = "Dejar de seguir";
      }
    });
  } else {
    // Follow
    followUser(targetUserId, function (result) {
      button.disabled = false;
      if (result.success) {
        updateFollowButton(button, true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error al seguir usuario"
        });
        spinner.classList.add("d-none");
        btnText.textContent = "Seguir";
      }
    });
  }
}
