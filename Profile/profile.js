function toggleEditMode() {
    var profileInfo = document.getElementById('profile-info');
    var editButton = document.getElementsByClassName('edit-profile-button')[0];
  
    if (profileInfo.contentEditable === 'true') {
      // Disable editing mode
      profileInfo.contentEditable = 'false';
      profileInfo.classList.remove('edit-mode');
      editButton.innerText = 'Edit Profile';
      editButton.classList.remove('active');
    } else {
      // Enable editing mode
      profileInfo.contentEditable = 'true';
      profileInfo.classList.add('edit-mode');
      editButton.innerText = 'Save Profile';
      editButton.classList.add('active');
    }
}

function openPictureDialog() {
    const pictureInput = document.getElementById('picture-input');
    pictureInput.click();
  }
  
  function handlePictureChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function(e) {
      const newProfilePicture = e.target.result;
      const profileImageElement = document.getElementById('profile-image');
      profileImageElement.src = newProfilePicture;
    };
  
    reader.readAsDataURL(file);
  }
  
  const pictureInput = document.getElementById('picture-input');
  pictureInput.addEventListener('change', handlePictureChange);