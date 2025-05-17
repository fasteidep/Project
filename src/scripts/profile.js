import { initHeader } from './header.js';
import { fetchUserProfile, fetchUserAds } from './dataLoader.js';
import { authInstance } from './auth.js';

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

async function loadProfile() {
  try {
    const [user, ads] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserAds(userId)
    ]);
    renderProfile(user, ads);
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

function renderProfile(user, ads) {
  const container = document.getElementById('profileContainer');

  const isOwnProfile = authInstance.currentUser &&
                       String(authInstance.currentUser.id) === String(user.id);

  let actionsHtml = '';
  if (isOwnProfile) {
    actionsHtml = `
      <button class="post-ad-btn">Выставить объявление</button>
      <button class="logout-btn">Выйти</button>
    `;
  } else {
    actionsHtml = `<button class="message-btn">Написать сообщение</button>`;
  }

  container.innerHTML = `
    <section class="profile-header">
      <div class="avatar">
        <img src="${user.avatar}" alt="${user.username}">
      </div>
      <div class="user-info">
        <div class="user-name">${user.username}</div>
        <div class="user-rating">
          Рейтинг: ${calculateRatingStars(user.rating)} (${user.rating.toFixed(1)})
        </div>
        <div class="user-stats">
          Активных объявлений: ${user.activeAds} | Всего: ${user.totalAds}<br>
          На сайте с: ${new Date(user.registrationDate).toLocaleDateString()}
        </div>
        <div class="user-actions">
          ${actionsHtml}
        </div>
      </div>
    </section>

    <section class="listings">
      <h2>Активные объявления</h2>
      <div class="cards">
        ${ads.filter(ad => ad.isActive).map(ad => `
          <div class="card" data-ad-id="${ad.id}">
            <img src="${ad.image}" alt="${ad.title}">
            <div class="card-body">
              <div class="card-title">${ad.title}</div>
              <div class="card-price">${ad.price.toLocaleString()} ₽</div>
              <div class="card-meta">
                ${new Date(ad.date).toLocaleDateString()} · 
                Просмотров: ${ad.views}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const adId = card.dataset.adId;
      window.location.href = `product.html?id=${adId}`;
    });
  });

  if (isOwnProfile) {
    const postBtn = container.querySelector('.post-ad-btn');
    postBtn.addEventListener('click', () => {
      window.location.href = 'create.html';
    });

    const logoutBtn = container.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      authInstance.currentUser = null;
      window.location.href = '/';
    });
  } else {
    const msgBtn = container.querySelector('.message-btn');
    if (msgBtn) {
      msgBtn.addEventListener('click', () => {
        alert('Это пока что нельзя сделать потому что');
      });
    }
  }
}

function calculateRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? '½' : '';
  return '★'.repeat(fullStars) + halfStar + '☆'.repeat(5 - Math.ceil(rating));
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  loadProfile();
});
