import { fetchAds } from './dataLoader.js';
import { fetchAccounts } from './dataLoader.js';
import { initHeader } from './header.js';

const urlParams = new URLSearchParams(window.location.search);
const adId = urlParams.get('id');

async function loadProductData() {
  try {
    const [ads, accounts] = await Promise.all([fetchAds(), fetchAccounts()]);
    const ad = ads.find(a => a.id == adId);
    const seller = accounts.find(a => a.id == ad.sellerId);
    
    renderProduct(ad, seller);
  } catch (error) {
    console.error('Error loading product data:', error);
  }
}

function renderProduct(ad, seller) {
  const container = document.getElementById('productContainer');
  
  container.innerHTML = `
    <nav class="breadcrumb">
      <a href="/">Главная</a> &gt; 
      <a href="/?category=${ad.category}">${ad.category}</a> &gt; 
      ${ad.title}
    </nav>
    
    <div class="product">
      <div class="product-img">
        <img src="${ad.image}" alt="${ad.title}">
      </div>
      <div class="product-details">
        <h1 class="product-title">${ad.title}</h1>
        <div class="product-price">${ad.price.toLocaleString()} ₽</div>
        <div class="product-meta">
          Категория: ${ad.category} | 
          Состояние: ${ad.condition} | 
          Город: ${ad.city}
        </div>
        <div class="product-desc">${ad.description}</div>
        
        <div class="seller">
          <div class="seller-avatar">
            <img src="${seller.avatar}" alt="${seller.username}">
          </div>
          <div class="seller-info">
            <a href="profile.html?id=${ad.sellerId}" class="seller-name">${seller.username}</a>
            <div class="seller-rating">Рейтинг: ${calculateRatingStars(seller.rating)}</div>
          </div>
        </div>
        
        <button class="message-btn">Написать сообщение</button>
      </div>
    </div>
  `;
}

function calculateRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? '½' : '';
  return '★'.repeat(fullStars) + halfStar + '☆'.repeat(5 - Math.ceil(rating));
}


loadProductData();

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  loadProductData();
});