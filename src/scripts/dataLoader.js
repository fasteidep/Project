const ACCOUNTS_JSON_PATH = '/src/data/accounts.json';
const ADS_JSON_PATH     = '/src/data/ads.json';

async function fetchJson(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Ошибка загрузки ${path}:`, err);
    return [];
  }
}

export async function fetchAccounts() {
  const jsonAccounts = await fetchJson(ACCOUNTS_JSON_PATH);
  const local = JSON.parse(localStorage.getItem('accounts')) || [];

  return [...jsonAccounts, ...local];
}

export async function fetchUserProfile(userId) {
  const accounts = await fetchAccounts();
  return accounts.find(a => String(a.id) === String(userId)) || null;
}

export async function fetchAds() {
  return await fetchJson(ADS_JSON_PATH);
}

export async function fetchUserAds(userId) {
  const ads = await fetchAds();
  return ads.filter(ad => String(ad.sellerId) === String(userId));
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/upload', { method: 'POST', body: formData });
  return await response.json();
}
