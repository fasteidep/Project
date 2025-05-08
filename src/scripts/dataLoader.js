export async function fetchAds() {
    const response = await fetch('/src/data/ads.json');
    return await response.json();
  }
  
  export async function fetchAccounts() {
    const response = await fetch('/src/data/accounts.json');
    return await response.json();
  }