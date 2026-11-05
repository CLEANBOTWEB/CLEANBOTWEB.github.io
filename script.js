/**
 * CLEANBOT - SCRIPT DE INTERACTIVIDAD
 * Proyecto de Integración Escolar | 4° Año A
 * Creadoras: Camila Parize, Olivia Andreacchio y Estefanía Pérez
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SISTEMA DE PESTAÑAS INTERACTIVAS (Problemática, Solución, Componentes)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.canva-tabs-nav .tab-btn');
  const tabPanels = document.querySelectorAll('.tabs-content-area .tab-panel');

  function switchTab(targetBtn) {
    if (!targetBtn) return;
    const targetPanelId = targetBtn.getAttribute('aria-controls');

    // Desactivar todos los botones y ocultar paneles
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });

    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.hidden = true;
    });

    // Activar botón y panel seleccionado
    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-selected', 'true');
    targetBtn.setAttribute('tabindex', '0');

    const targetPanel = document.getElementById(targetPanelId);
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.classList.add('active');
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn));

    // Soporte de navegación accesible con teclado (Flechas izq/der)
    btn.addEventListener('keydown', (e) => {
      let index = Array.from(tabButtons).indexOf(btn);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % tabButtons.length;
        tabButtons[nextIndex].focus();
        switchTab(tabButtons[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        tabButtons[prevIndex].focus();
        switchTab(tabButtons[prevIndex]);
      }
    });
  });

  // Enlace desde CTA Hero para abrir la pestaña correspondiente
  const ctaExplore = document.getElementById('cta-explore');
  if (ctaExplore) {
    ctaExplore.addEventListener('click', (e) => {
      e.preventDefault();
      const firstTab = document.getElementById('tab-problematica');
      if (firstTab) switchTab(firstTab);
      document.getElementById('tabs-section').scrollIntoView({ behavior: 'smooth' });
    });
  }


  /* ==========================================================================
     2. SIMULADOR INTERACTIVO DE CLEANBOT (Medición de Basura y Alerta micro:bit)
     ========================================================================== */
  const trashSlider = document.getElementById('trash-slider');
  const trashPctLabel = document.getElementById('trash-pct-label');
  const simTrashFill = document.getElementById('sim-trash-fill');
  const simDistanceVal = document.getElementById('sim-distance-val');
  const simDistanceNote = document.getElementById('sim-distance-note');
  const simStatusBadge = document.getElementById('sim-status-badge');
  const simStatusText = document.getElementById('sim-status-text');
  const vmbLedMatrix = document.getElementById('vmb-led-matrix');
  const vmbRadioStatus = document.getElementById('vmb-radio-status');
  const vmbCaption = document.getElementById('vmb-caption');
  const btnEmptyBin = document.getElementById('btn-empty-bin');
  const btnFillBin = document.getElementById('btn-fill-bin');

  // Crear la matriz 5x5 de LEDs virtuales
  const leds = [];
  if (vmbLedMatrix) {
    vmbLedMatrix.innerHTML = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const led = document.createElement('div');
        led.className = 'vmb-led';
        led.dataset.row = r;
        led.dataset.col = c;
        vmbLedMatrix.appendChild(led);
        leds.push(led);
      }
    }
  }

  // Patrones de matriz LED 5x5:
  // 1. Signo de exclamación (!) para ALERTA
  const patternAlert = [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0]
  ];

  // 2. Tilde / Checkmark (✓) o Carita Feliz para Estado Normal
  const patternCheck = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0]
  ];

  function renderLedPattern(matrixPattern, isAlert) {
    if (!leds.length) return;
    let idx = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const isOn = matrixPattern[r][c] === 1;
        if (isOn) {
          leds[idx].classList.add('on');
          leds[idx].style.background = isAlert ? '#ff1a3c' : '#22c55e';
          leds[idx].style.boxShadow = isAlert ? '0 0 10px #ff2a4a, 0 0 18px #ff1a3c' : '0 0 10px #4ade80';
        } else {
          leds[idx].classList.remove('on');
          leds[idx].style.background = '#251818';
          leds[idx].style.boxShadow = 'none';
        }
        idx++;
      }
    }
  }

  function updateSimulator(percentage) {
    if (!trashSlider) return;

    // Calcular distancia estimada en centímetros:
    // Cesto vacío (0%): 50 cm. Cesto 100% lleno: 4 cm.
    const distanceCm = Math.max(4, Math.round(50 - (percentage / 100) * 44));

    // Umbral estipulado en el documento del grupo: menor a 10 cm = Cesto lleno / Alerta
    const isFullAlert = distanceCm <= 10;

    // Actualizar elementos visuales
    trashPctLabel.textContent = `${percentage}%`;
    if (simTrashFill) {
      simTrashFill.style.height = `${percentage}%`;
    }
    if (simDistanceVal) {
      simDistanceVal.textContent = `${distanceCm} cm`;
    }

    if (isFullAlert) {
      // Estado de ALERTA
      if (simStatusBadge) simStatusBadge.classList.add('alert-active');
      if (simStatusText) simStatusText.textContent = '¡ALERTA: CESTO LLENO!';
      if (simDistanceNote) {
        simDistanceNote.textContent = 'Distancia crítica (< 10 cm). Basura por rebalsar.';
        simDistanceNote.style.color = '#ff8a80';
      }
      if (vmbRadioStatus) {
        vmbRadioStatus.textContent = '🚨 Señal recibida!';
        vmbRadioStatus.style.color = '#ff8a80';
      }
      if (vmbCaption) {
        vmbCaption.textContent = 'Aviso activo: "CESTO LLENO". Despachar recolector.';
        vmbCaption.style.color = '#ff8a80';
      }
      renderLedPattern(patternAlert, true);
    } else {
      // Estado NORMAL
      if (simStatusBadge) simStatusBadge.classList.remove('alert-active');
      if (simStatusText) simStatusText.textContent = 'Cesto Normal (Con Capacidad)';
      if (simDistanceNote) {
        simDistanceNote.textContent = `Nivel seguro. Faltan ${distanceCm - 10} cm para el límite.`;
        simDistanceNote.style.color = '#86efac';
      }
      if (vmbRadioStatus) {
        vmbRadioStatus.textContent = '📡 En espera';
        vmbRadioStatus.style.color = '#94a3b8';
      }
      if (vmbCaption) {
        vmbCaption.textContent = 'Estado: Cesto con capacidad disponible.';
        vmbCaption.style.color = '#a7f3d0';
      }
      renderLedPattern(patternCheck, false);
    }
  }

  if (trashSlider) {
    trashSlider.addEventListener('input', (e) => {
      updateSimulator(parseInt(e.target.value, 10));
    });

    if (btnEmptyBin) {
      btnEmptyBin.addEventListener('click', () => {
        trashSlider.value = 15;
        updateSimulator(15);
      });
    }

    if (btnFillBin) {
      btnFillBin.addEventListener('click', () => {
        trashSlider.value = 92;
        updateSimulator(92);
      });
    }

    // Inicializar simulación al cargar
    updateSimulator(parseInt(trashSlider.value, 10));
  }


  /* ==========================================================================
     3. FILTROS DE COMPONENTES ELECTRÓNICOS
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.components-filter-bar .filter-btn');
  const compCards = document.querySelectorAll('.components-grid .comp-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      compCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ==========================================================================
     4. CARRUSEL DE FOTOS (Carousel Interactivo de CLEANBOT)
     ========================================================================== */
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const counterEl = document.getElementById('carousel-counter');
  const toggleAutoplayBtn = document.getElementById('btn-toggle-autoplay');
  const autoplayIcon = document.getElementById('autoplay-icon');
  const autoplayText = document.getElementById('autoplay-text');
  const btnLightbox = document.getElementById('btn-open-lightbox');

  let currentSlide = 0;
  let autoplayInterval = null;
  let isAutoplayPlaying = true;
  const totalSlides = slides.length;

  // Generar puntos indicadores
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir a foto ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Actualizar diapositivas
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    // Actualizar dots
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // Actualizar contador
    if (counterEl) {
      counterEl.textContent = `${currentSlide + 1} de ${totalSlides}`;
    }
  }

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    updateCarousel();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
    isAutoplayPlaying = true;
    if (autoplayIcon) autoplayIcon.textContent = '⏸️';
    if (autoplayText) autoplayText.textContent = 'Pausar rotación';
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = null;
    isAutoplayPlaying = false;
    if (autoplayIcon) autoplayIcon.textContent = '▶️';
    if (autoplayText) autoplayText.textContent = 'Reanudar rotación';
  }

  if (toggleAutoplayBtn) {
    toggleAutoplayBtn.addEventListener('click', () => {
      if (isAutoplayPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // Pausar en hover sobre el carrusel
  const carouselContainer = document.getElementById('cleanbot-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    });
    carouselContainer.addEventListener('mouseleave', () => {
      if (isAutoplayPlaying) startAutoplay();
    });
  }

  // Soporte táctil / Swipe
  let touchStartX = 0;
  let touchEndX = 0;
  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
      }
    }, { passive: true });
  }

  // Iniciar rotación
  startAutoplay();


  /* ==========================================================================
     5. LIGHTBOX / VISOR MODAL DE FOTOS
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');

  function openLightbox(slideIndex) {
    if (!lightboxModal) return;
    const slide = slides[slideIndex];
    if (!slide) return;
    const img = slide.querySelector('.slide-img');
    const title = slide.querySelector('.slide-title');
    const desc = slide.querySelector('.slide-desc');

    if (img && modalImg) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    }
    if (modalCaption) {
      modalCaption.textContent = `${title ? title.textContent : ''} — ${desc ? desc.textContent : ''}`;
    }

    lightboxModal.hidden = false;
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.hidden = true;
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btnLightbox) {
    btnLightbox.addEventListener('click', () => openLightbox(currentSlide));
  }

  slides.forEach((slide, i) => {
    const img = slide.querySelector('.slide-img');
    if (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(i));
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }


  /* ==========================================================================
     6. GESTIÓN DEL INSTRUCTIVO OFICIAL ("PROBA HACERME!") & MODAL
     ========================================================================== */
  const instructivoModal = document.getElementById('instructivo-modal');
  const btnInstructivoAnchor = document.getElementById('btn-instructivo-anchor');
  const btnOpenInstructivoPreview = document.getElementById('btn-open-instructivo-preview');
  const instructivoClose = document.getElementById('instructivo-close');
  const instructivoOkBtn = document.getElementById('instructivo-ok-btn');
  const btnPrintTop = document.getElementById('btn-print-instructivo-top');
  const btnPrintBottom = document.getElementById('btn-print-instructivo-bottom');
  const btnPrintModal = document.getElementById('btn-print-from-modal');

  function openInstructivoModal(e) {
    if (e) e.preventDefault();
    if (!instructivoModal) return;
    instructivoModal.hidden = false;
    instructivoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeInstructivoModal() {
    if (!instructivoModal) return;
    instructivoModal.hidden = true;
    instructivoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function printInstructivo(e) {
    if (e) e.preventDefault();
    // Si el modal está abierto al momento de imprimir, cerrarlo para imprimir la hoja limpia
    const wasModalOpen = instructivoModal && !instructivoModal.hidden;
    if (wasModalOpen) closeInstructivoModal();
    window.print();
  }

  if (btnOpenInstructivoPreview) btnOpenInstructivoPreview.addEventListener('click', openInstructivoModal);
  if (instructivoClose) instructivoClose.addEventListener('click', closeInstructivoModal);
  if (instructivoOkBtn) instructivoOkBtn.addEventListener('click', closeInstructivoModal);

  // Smooth scroll para el enlace principal del instructivo
  if (btnInstructivoAnchor) {
    btnInstructivoAnchor.addEventListener('click', (e) => {
      const docEl = document.getElementById('instructivo-documento');
      if (docEl) {
        e.preventDefault();
        docEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Manejo de botones de impresión
  if (btnPrintTop) btnPrintTop.addEventListener('click', printInstructivo);
  if (btnPrintBottom) btnPrintBottom.addEventListener('click', printInstructivo);
  if (btnPrintModal) btnPrintModal.addEventListener('click', printInstructivo);

  // Click fuera del modal para cerrar
  if (instructivoModal) {
    instructivoModal.addEventListener('click', (e) => {
      if (e.target === instructivoModal) closeInstructivoModal();
    });
  }

  // Smooth scroll para los links del índice del instructivo
  document.querySelectorAll('.sheet-index-list a').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Tecla Escape para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeInstructivoModal();
    }
  });


  /* ==========================================================================
     7. SECCIÓN DE COMENTARIOS: "¿Qué te pareció CLEANBOT?"
     ========================================================================== */
  const commentForm = document.getElementById('comment-form');
  const commentAuthorInput = document.getElementById('comment-author');
  const commentTextInput = document.getElementById('comment-text');
  const charCount = document.getElementById('char-count');
  const errorAuthor = document.getElementById('error-author');
  const errorText = document.getElementById('error-text');
  const starBtns = document.querySelectorAll('#star-rating .star-btn');
  const ratingText = document.getElementById('rating-text');
  const commentsList = document.getElementById('comments-list');
  const commentsCount = document.getElementById('comments-count');
  const btnResetComments = document.getElementById('btn-reset-comments');

  let selectedRating = 5;

  const ratingLabels = {
    1: '1/5 - Regular',
    2: '2/5 - Bueno',
    3: '3/5 - Muy bueno',
    4: '4/5 - Excelente',
    5: '5/5 - ¡Increíble proyecto!'
  };

  // Selector de estrellas
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.value, 10);
      updateStarDisplay(selectedRating);
    });

    btn.addEventListener('mouseenter', () => {
      const val = parseInt(btn.dataset.value, 10);
      starBtns.forEach((b, i) => {
        b.classList.toggle('hovered', i < val);
      });
      if (ratingText) ratingText.textContent = ratingLabels[val] || '';
    });

    btn.addEventListener('mouseleave', () => {
      starBtns.forEach(b => b.classList.remove('hovered'));
      updateStarDisplay(selectedRating);
    });
  });

  function updateStarDisplay(rating) {
    starBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i < rating);
    });
    if (ratingText) {
      ratingText.textContent = ratingLabels[rating] || `${rating}/5`;
    }
  }

  // Contador de caracteres
  if (commentTextInput && charCount) {
    commentTextInput.addEventListener('input', () => {
      const len = commentTextInput.value.length;
      charCount.textContent = `${len} / 400`;
      if (len > 380) {
        charCount.style.color = '#d9383a';
      } else {
        charCount.style.color = 'var(--text-muted)';
      }
    });
  }

  // Comentarios predefinidos realistas
  const defaultComments = [
    {
      id: 'c1',
      author: 'Prof. Mariana G.',
      role: 'Docente de Tecnologías de la Información',
      date: '24/10/2026',
      rating: 5,
      text: '¡Excelente trabajo grupal! Articularon de forma impecable los lineamientos de ecología integral y salud comunitaria con una propuesta técnica factible en micro:bit y MakeCode. ¡Felicitaciones a Camila, Olivia y Estefanía!',
      likes: 12
    },
    {
      id: 'c2',
      author: 'Lucas Mendoza',
      role: 'Compañero de 4° Año B',
      date: '23/10/2026',
      rating: 5,
      text: 'Me encantó cómo resolvieron la comunicación entre el cesto y el recolector usando las antenas de radio de micro:bit. Evita que la basura termine en los canteros de la plaza.',
      likes: 8
    },
    {
      id: 'c3',
      author: 'Beatriz Romero',
      role: 'Vecina de San Vicente',
      date: '22/10/2026',
      rating: 5,
      text: 'Una iniciativa muy necesaria para nuestro barrio. Cuando los contenedores desbordan es un foco infeccioso para todos los chicos. ¡Ojalá el municipio tome la idea y la ponga en práctica!',
      likes: 15
    }
  ];

  // Cargar comentarios desde localStorage
  function loadComments() {
    try {
      const saved = localStorage.getItem('cleanbot_comments');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error leyendo localStorage', e);
    }
    return defaultComments;
  }

  function saveComments(comments) {
    try {
      localStorage.setItem('cleanbot_comments', JSON.stringify(comments));
    } catch (e) {
      console.warn('Error guardando en localStorage', e);
    }
  }

  let currentComments = loadComments();

  function renderComments() {
    if (!commentsList) return;
    commentsList.innerHTML = '';

    if (commentsCount) {
      commentsCount.textContent = currentComments.length;
    }

    currentComments.forEach(c => {
      const card = document.createElement('article');
      card.className = 'comment-card';

      // Generar estrellas visuales
      let starStr = '';
      for (let i = 0; i < 5; i++) {
        starStr += i < c.rating ? '★' : '☆';
      }

      // Inicial para el avatar
      const initial = c.author ? c.author.charAt(0).toUpperCase() : '?';

      card.innerHTML = `
        <div class="comment-card-top">
          <div class="comment-author-info">
            <div class="comment-avatar">${initial}</div>
            <div>
              <div class="comment-author-name">${escapeHtml(c.author)}</div>
              <div class="comment-date">${escapeHtml(c.role ? `${c.role} • ` : '')}${c.date}</div>
            </div>
          </div>
          <div class="comment-stars" title="${c.rating} estrellas">${starStr}</div>
        </div>
        <p class="comment-body">${escapeHtml(c.text)}</p>
        <div class="comment-footer-actions">
          <button type="button" class="btn-like-comment" data-id="${c.id}">
            <span>❤️ Me gusta</span> <strong>(${c.likes || 0})</strong>
          </button>
        </div>
      `;

      commentsList.appendChild(card);
    });

    // Event listeners para los botones de Me gusta
    document.querySelectorAll('.btn-like-comment').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const targetComment = currentComments.find(item => item.id === id);
        if (targetComment) {
          targetComment.likes = (targetComment.likes || 0) + 1;
          btn.classList.add('liked');
          saveComments(currentComments);
          renderComments();
        }
      });
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Manejar el envío de un nuevo comentario
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const authorVal = commentAuthorInput ? commentAuthorInput.value.trim() : '';
      const textVal = commentTextInput ? commentTextInput.value.trim() : '';

      // Validar autor
      if (!authorVal) {
        if (errorAuthor) errorAuthor.textContent = 'Por favor, ingresá tu nombre o apodo.';
        isValid = false;
      } else {
        if (errorAuthor) errorAuthor.textContent = '';
      }

      // Validar texto
      if (!textVal || textVal.length < 5) {
        if (errorText) errorText.textContent = 'Por favor, ingresá un comentario de al menos 5 letras.';
        isValid = false;
      } else {
        if (errorText) errorText.textContent = '';
      }

      if (!isValid) return;

      // Obtener fecha actual en formato legible (DD/MM/AAAA)
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

      const newComment = {
        id: 'c_' + Date.now(),
        author: authorVal,
        role: 'Visitante de la web',
        date: dateStr,
        rating: selectedRating,
        text: textVal,
        likes: 1
      };

      currentComments.unshift(newComment);
      saveComments(currentComments);
      renderComments();

      // Limpiar formulario y resetear estado
      commentForm.reset();
      selectedRating = 5;
      updateStarDisplay(5);
      if (charCount) charCount.textContent = '0 / 400';

      // Feedback amigable
      alert('¡Muchas gracias por tu comentario! Fue publicado exitosamente en la web de CLEANBOT.');
    });
  }

  // Botón restaurar comentarios iniciales
  if (btnResetComments) {
    btnResetComments.addEventListener('click', () => {
      if (confirm('¿Deseás restaurar los comentarios iniciales del proyecto?')) {
        currentComments = [...defaultComments];
        saveComments(currentComments);
        renderComments();
      }
    });
  }

  // Inicializar comentarios
  renderComments();

});
