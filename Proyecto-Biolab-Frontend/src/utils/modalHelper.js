/**
 * Utilidad global de BioLab para garantizar que ningún modal, backdrop o alerta
 * quede pegado o bloquee la interfaz de usuario.
 *
 * ENFOQUE: Usar la API nativa de Bootstrap 5 (Modal.getInstance().hide())
 * en lugar de simular clicks en botones de cierre, lo que causaba:
 *   - Múltiples eventos de cierre disparándose simultáneamente
 *   - Corrupción del estado interno de Bootstrap
 *   - Race conditions entre animaciones y re-renders de React
 */

/**
 * Limpieza pasiva: Detecta y elimina residuos de modales que ya no están visibles.
 * Se ejecuta periódicamente y al navegar entre páginas.
 * NUNCA fuerza el cierre de un modal que aún está visible.
 */
export const forceCleanupModals = () => {
  try {
    const openModals = document.querySelectorAll('.modal.show');
    const openSwal = document.querySelector('.swal2-container .swal2-popup:not(.swal2-hide)');
    const stuckHidingSwal = document.querySelector('.swal2-container .swal2-popup.swal2-hide');

    // Salvavidas: si un popup de SweetAlert se quedó estancado en estado de cierre (swal2-hide)
    if (stuckHidingSwal) {
      document.querySelectorAll('.swal2-container').forEach(c => c.remove());
      document.body.classList.remove('swal2-shown', 'swal2-height-auto', 'swal2-toast-shown');
      document.documentElement.classList.remove('swal2-shown', 'swal2-height-auto');
    }

    // SOLO limpiar si NO hay modales de Bootstrap NI alertas SweetAlert activas
    if (openModals.length === 0 && !openSwal) {
      // Eliminar backdrops huérfanos
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

      // Restaurar el body y html
      document.body.classList.remove('modal-open');
      document.body.classList.remove('swal2-toast-shown', 'swal2-shown', 'swal2-height-auto');
      document.documentElement.classList.remove('swal2-shown', 'swal2-height-auto');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }
  } catch (err) {
    // Silencioso: esto es limpieza preventiva, no crítica
  }
};

/**
 * Cierra un modal de Bootstrap de forma segura usando su API nativa.
 * Pasos:
 *   1. Obtener la instancia del modal via Bootstrap API
 *   2. Llamar modal.hide() (esto maneja animaciones y limpieza internamente)
 *   3. Programar una limpieza de seguridad post-animación
 *
 * @param {string} modalId - El id del elemento HTML del modal (ej: "exampleModal")
 */
export const safeCloseModal = (modalId) => {
  try {
    if (modalId) {
      const el = document.getElementById(modalId);
      if (el) {
        if (window.bootstrap?.Modal) {
          try {
            const bsModal = window.bootstrap.Modal.getOrCreateInstance(el);
            if (bsModal) bsModal.hide();
          } catch (_) {}
        }
        const closeBtn = el.querySelector('[data-bs-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
      }
    }

    // Si aún hay algún modal con la clase .show abierto
    const activeModals = document.querySelectorAll('.modal.show');
    activeModals.forEach(m => {
      if (window.bootstrap?.Modal) {
        try {
          const inst = window.bootstrap.Modal.getInstance(m);
          if (inst) inst.hide();
        } catch (_) {}
      }
      const btn = m.querySelector('[data-bs-dismiss="modal"]');
      if (btn) btn.click();
    });
  } catch (err) {
    console.warn("Error cerrando modal:", err);
  }

  // Limpieza de seguridad post-animación
  setTimeout(forceCleanupModals, 150);
  setTimeout(forceCleanupModals, 350);
};
