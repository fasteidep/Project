import { fetchAds } from './dataLoader.js';
import { initHeader } from './header.js';
document.addEventListener('DOMContentLoaded', initHeader);
let allAds = [];
const adsContainer = document.getElementById('adsContainer');
const searchInput = document.getElementById('searchInput');
const filterBtn = document.querySelector('.filter-btn');
const filterPanel = document.getElementById('filterPanel');

async function init() {
    try {
      allAds = await fetchAds();
      if(allAds.length === 0) {
        adsContainer.innerHTML = '<p>Объявления не найдены</p>';
        return;
      }
      renderAds(allAds);
      setupEventListeners();
    } catch (error) {
      console.error('Ошибка инициализации:', error);
      adsContainer.innerHTML = '<p>Ошибка загрузки данных</p>';
    }
}


function renderAds(ads) {
    adsContainer.innerHTML = ads.map(ad => `
      <div class="card" data-ad-id="${ad.id}">
        <img src="${ad.image}" alt="${ad.title}">
        <div class="card-body">
          <div class="card-title">${ad.title}</div>
          <div class="card-desc">${ad.category}, ${ad.condition}</div>
          <div class="card-price">${ad.price.toLocaleString()} ₽</div>
          ${ad.isActive ? '<div class="card-status">Активно</div>' : ''}
        </div>
      </div>
    `).join('');

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const adId = card.dataset.adId;
      window.location.href = `product.html?id=${adId}`;
    });
  });
}

function applyFilters() {
  const category = document.getElementById('categoryFilter').value;
  const minPrice = parseInt(document.getElementById('priceMin').value) || 0;
  const maxPrice = parseInt(document.getElementById('priceMax').value) || Infinity;
  const condition = document.getElementById('conditionFilter').value;
  const city = document.getElementById('cityFilter').value.toLowerCase();

  const filtered = allAds.filter(ad => {
    return (!category || ad.category === category) &&
           ad.price >= minPrice &&
           ad.price <= maxPrice &&
           (!condition || ad.condition === condition) &&
           (!city || ad.city.toLowerCase().includes(city));
  });

  renderAds(filtered);
}

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = allAds.filter(ad => 
    ad.title.toLowerCase().includes(searchTerm) ||
    ad.description.toLowerCase().includes(searchTerm)
  );
  renderAds(filtered);
}

function setupEventListeners() {
  filterBtn.addEventListener('click', () => {
    filterPanel.classList.toggle('open');
  });

  searchInput.addEventListener('input', handleSearch);

  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  document.querySelectorAll('.filters input, .filters select').forEach(element => {
    element.addEventListener('change', applyFilters);
  });
}

init();