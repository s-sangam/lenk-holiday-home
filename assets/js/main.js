/* main.js
   Header behaviour, language toggle, lightbox init, gallery badge and "View All Photos" hook.
*/

(function () {
  // Sticky header
  window.addEventListener('scroll', function () {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    header.classList.toggle('sticky', window.scrollY > 20);
  });

  // Language toggle
  const btnDe = document.getElementById('btn-de');
  const btnEn = document.getElementById('btn-en');
  if (btnDe && btnEn) {
    btnDe.addEventListener('click', () => {
      document.querySelectorAll('#title-de,#tagline-de,#about-text-de').forEach(el => el.classList.remove('hidden'));
      document.querySelectorAll('#title-en,#tagline-en,#about-text-en').forEach(el => el.classList.add('hidden'));
    });
    btnEn.addEventListener('click', () => {
      document.querySelectorAll('#title-de,#tagline-de,#about-text-de').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('#title-en,#tagline-en,#about-text-en').forEach(el => el.classList.remove('hidden'));
    });
  }

  // GLightbox init
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof GLightbox === 'function') {
      GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
    }

    const viewAllBtn = document.getElementById('openGallery');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', function () {
        const first = document.querySelector('.glightbox[data-gallery="chalet-gallery"]');
        if (first) first.click();
      });
    }

    // photo count
    const galleryItems = document.querySelectorAll('.glightbox[data-gallery="chalet-gallery"]');
    const badge = document.getElementById('photoCountBadge');
    if (badge) {
      const count = galleryItems.length;
      badge.textContent = `📷 ${count} Photo${count !== 1 ? 's' : ''}`;
    }
  });
})();