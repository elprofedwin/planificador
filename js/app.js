/* ============================================================
   PLANIFICADOR DE ACTIVIDADES INSTITUCIONALES — IE 51006
   app.js  |  Lógica principal de la aplicación
   ============================================================ */

'use strict';

/* ── Año automático en el footer ────────────────────────────── */
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ── Selector de semanas → navegar ─────────────────────────── */
const semanaSelect = document.getElementById('semanaSelector');
if (semanaSelect) {
  semanaSelect.addEventListener('change', function () {
    const valor = this.value;
    if (valor) {
      window.location.href = valor;
    }
  });
}

/* ── Acordeón: solo uno abierto por tarjeta de día ─────────── */
document.addEventListener('show.bs.collapse', function (e) {
  // Obtener el accordion contenedor del ítem que se abre
  const target   = e.target;
  const parentId = target.getAttribute('data-bs-parent');
  if (!parentId) return;

  const parent = document.querySelector(parentId);
  if (!parent) return;

  // Cerrar los demás collapses del mismo acordeón
  parent.querySelectorAll('.actividad-collapse.show').forEach(open => {
    if (open !== target) {
      bootstrap.Collapse.getOrCreateInstance(open, { toggle: false }).hide();
    }
  });
});

/* ── Accesibilidad: anunciar día activo a lectores de pantalla  */
document.querySelectorAll('.card-dia').forEach(card => {
  const header = card.querySelector('.card-dia-header');
  if (header) {
    header.setAttribute('role', 'heading');
    header.setAttribute('aria-level', '2');
  }
});

/* ── Marcar el día actual ───────────────────────────────────── */
(function marcarHoy() {
  const hoy = new Date();
  const diaSemana = hoy.getDay(); // 0=dom, 1=lun…5=vie, 6=sab
  const fecha = hoy.getDate();

  const nombres = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  document.querySelectorAll('[data-dia-fecha]').forEach(el => {
    if (parseInt(el.dataset.diaFecha, 10) === fecha) {
      const diaCard = el.closest('.card-dia');
      if (diaCard) {
        // Agregar indicador "Hoy"
        const badge = document.createElement('span');
        badge.className = 'badge rounded-pill ms-2';
        badge.style.cssText = 'background:rgba(255,255,255,.25);font-size:.65rem;';
        badge.textContent = 'Hoy';
        el.appendChild(badge);
      }
    }
  });
})();

/* ── Smooth scroll al contenido principal desde navbar ──────── */
document.querySelectorAll('a[href="#contenido"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.getElementById('contenido');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Lazy loading de imágenes ───────────────────────────────── */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        obs.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}
