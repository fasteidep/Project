import { fetchAccounts } from './dataLoader.js';

export class AuthService {
  constructor() {
    this.localAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    this.accounts = [];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    this._loaded = false;
    this._loadAccounts();
  }

  async _loadAccounts() {
    try {
      const jsonAccounts = await fetchAccounts();
      this.accounts = [...jsonAccounts, ...this.localAccounts];
    } catch (err) {
      console.error('Ошибка загрузки accounts.json:', err);
      this.accounts = [...this.localAccounts];
    } finally {
      this._loaded = true;
    }
  }

  register(userData) {
    if (this.accounts.some(u => u.email === userData.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      registrationDate: new Date().toISOString(),
      rating: 0,
      activeAds: 0,
      totalAds: 0,
      reviews: []
    };

    this.localAccounts.push(newUser);
    this.accounts.push(newUser);

    localStorage.setItem('accounts', JSON.stringify(this.localAccounts));
    this.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return newUser;
  }

  async login(email, password) {
    if (!this._loaded) {
      await this._loadAccounts();
    }

    const user = this.accounts.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );

    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
}

export const authInstance = new AuthService();

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      loginForm.classList.toggle('active', tab.dataset.tab === 'login');
      registerForm.classList.toggle('active', tab.dataset.tab === 'register');
    });
  });

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      await authInstance.login(email, password);
      window.location.href = '/';
    } catch (error) {
      alert(error.message);
      console.error('Ошибка входа:', error);
      document.getElementById('login-password').value = '';
    }
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const password = document.getElementById('reg-password').value;
      const passwordConfirm = document.getElementById('reg-password-confirm').value;

      if (password !== passwordConfirm) {
        throw new Error('Пароли не совпадают');
      }

      const avatarFile = document.getElementById('reg-avatar').files[0];
      const avatar = await readFileAsDataURL(avatarFile);

      const userData = {
        username: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: password,
        avatar: avatar || 'https://via.placeholder.com/36'
      };

      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Все поля обязательны для заполнения');
      }

      authInstance.register(userData);
      window.location.href = '/';
    } catch (error) {
      alert(error.message);
      console.error('Ошибка регистрации:', error);
      document.getElementById('reg-password').value = '';
      document.getElementById('reg-password-confirm').value = '';
    }
  });
});
