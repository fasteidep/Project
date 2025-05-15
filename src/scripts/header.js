import { authInstance } from './auth.js';

export function initHeader() {
  const authButtons = document.getElementById('auth-buttons');
  const userProfile = document.getElementById('user-profile');

  if (authInstance.currentUser) {
    authButtons.style.display = 'none';
    userProfile.style.display = 'flex';
    const img = userProfile.querySelector('img');
    img.src = authInstance.currentUser.avatar;
    img.alt = authInstance.currentUser.username;
    userProfile.onclick = () => window.location.href = `profile.html?id=${authInstance.currentUser.id}`;
  } else {
    authButtons.style.display = 'flex';
    userProfile.style.display = 'none';
  }
}