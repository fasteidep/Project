import { authInstance } from './auth.js';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const imageInput = document.getElementById('image');

  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let imgPreview = document.getElementById('image-preview');
      if (!imgPreview) {
        imgPreview = document.createElement('img');
        imgPreview.id = 'image-preview';
        imgPreview.style.maxWidth = '200px';
        imgPreview.style.marginTop = '0.5rem';
        imageInput.parentNode.appendChild(imgPreview);
      }
      imgPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = authInstance.currentUser || JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      alert('Пожалуйста, войдите в аккаунт, чтобы создать объявление.');
      window.location.href = 'login.html';
      return;
    }

    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const condition = form.condition.value;
    const city = form.location.value.trim();
    const file = imageInput.files[0];

    const readImage = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    let imageUrl = '';
    if (file) {
      imageUrl = await readImage(file);
    }

    const stored = JSON.parse(localStorage.getItem('ads')) || [];

    const newAd = {
      id: Date.now(),
      title,
      description,
      category,
      price,
      condition,
      city,
      image: imageUrl,
      sellerId: user.id,
      date: new Date().toISOString(),
      isActive: true,
      views: 0
    };

    stored.push(newAd);
    localStorage.setItem('ads', JSON.stringify(stored));

    window.location.href = 'index.html';
  });
});
