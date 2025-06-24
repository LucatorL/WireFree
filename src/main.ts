import './styles.css';
import './sections.css';
import './sections2.css';
import './config-pricing.css';
import './development-modal.css';
import './components.css';
import './unique-features.css';

document.addEventListener('DOMContentLoaded', function() {
  // Manejo del nuevo aviso de desarrollo
  const modalOverlay = document.getElementById('modal-overlay');
  const acceptButton = document.getElementById('accept-button');

  if (acceptButton && modalOverlay) {
    document.body.style.overflow = 'hidden';
    acceptButton.addEventListener('click', function() {
      modalOverlay.style.animation = 'fadeOut 0.5s forwards';
      setTimeout(function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 500);
    });
  }

  // Observer para animaciones de entrada
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.problem-card, .solution-text, .solution-image, .step, .case, .pricing-card').forEach(el => {
    fadeInObserver.observe(el);
  });

  // --- Inicio: Lógica para cambio de tema del Header ---
  const header = document.querySelector('header');
  const darkSections = document.querySelectorAll('.dark-section');

  if (header && darkSections.length > 0) {
    const headerHeight = header.offsetHeight;

    const observerOptions = {
      root: null,
      // Margen superior negativo > altura del header. Activa 1px DESPUÉS de que la sección pase bajo el header.
      rootMargin: `-${headerHeight + 1}px 0px -50% 0px`, // AJUSTADO AQUÍ
      threshold: 0 // Se activa tan pronto como 1 pixel cruza la línea de margen
    };

    const headerThemeObserver = new IntersectionObserver((entries) => {
      let isOverDarkSection = false;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isOverDarkSection = true;
        }
      });

      if (isOverDarkSection) {
        header.classList.add('header-dark');
      } else {
        const anyIntersecting = entries.some(entry => entry.isIntersecting);
         // Comprobación extra: Asegurarse de que realmente ninguna sección oscura esté visible
         // en el área de trigger antes de quitar la clase.
         document.querySelectorAll('.dark-section').forEach(section => {
             const rect = section.getBoundingClientRect();
             // Comprueba si la sección está visible y su parte superior está por encima del punto de activación inferior
             if (rect.bottom > (headerHeight + 1) && rect.top < window.innerHeight * 0.5) { // Usa el 50% del rootMargin inferior
                // Podríamos necesitar re-evaluar si alguna sección *sigue* intersecando
                // Esta lógica puede volverse compleja. Mantenemos la simple por ahora.
             }
         });

         // Si ninguna de las entradas actuales está intersecando, quitamos la clase
         if (!anyIntersecting) {
              header.classList.remove('header-dark');
         }
      }

    }, observerOptions);

    darkSections.forEach(section => {
      headerThemeObserver.observe(section);
    });

    // Recalcular altura del header si la ventana cambia de tamaño (por si acaso)
    window.addEventListener('resize', () => {
      // Podríamos necesitar desconectar y reconectar el observer si la altura cambia mucho
      // Por simplicidad, no lo hacemos ahora.
    });

  }
  // --- Fin: Lógica para cambio de tema del Header ---

  // Video Carousel Functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll('.video-slide');
  const indicators = document.querySelectorAll('.indicator');
  const slideInterval = 10000; // 10 segundos por video
  let progressTimer: number | null = null;

  function showSlide(index: number) {
    if (!slides.length || !indicators.length) return;

    console.log('Changing to slide:', index); // Debug

    // Limpiar timer existente
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }

    // Remover clases activas de todos los slides
    slides.forEach((slide) => {
      slide.classList.remove('active', 'prev');
    });

    // Remover clases activas de todos los indicadores
    indicators.forEach((indicator) => {
      indicator.classList.remove('active');
      const progressBar = indicator.querySelector('.progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.width = '0%';
      }
    });

    // Activar nuevo slide e indicador
    const newSlide = slides[index];
    const newIndicator = indicators[index];
    
    if (newSlide) newSlide.classList.add('active');
    if (newIndicator) newIndicator.classList.add('active');

    currentSlide = index;
    
    // Iniciar la barra de progreso
    startProgressBar();
  }

  function startProgressBar() {
    const activeIndicator = indicators[currentSlide];
    const progressBar = activeIndicator?.querySelector('.progress-bar') as HTMLElement;
    
    if (!progressBar) return;

    // Reset progress bar
    progressBar.style.width = '0%';
    
    // Start progress animation
    let progress = 0;
    const increment = 100 / (slideInterval / 100); // Update every 100ms

    progressTimer = window.setInterval(() => {
      progress += increment;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
      
      if (progress >= 100) {
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
        // Cambiar al siguiente slide cuando la barra se complete
        nextSlide();
      }
    }, 100);
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    console.log('Next slide:', nextIndex); // Debug
    showSlide(nextIndex);
  }

  function stopAutoSlide() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    console.log('Auto slide stopped');
  }

  function resumeAutoSlide() {
    console.log('Auto slide resumed');
    startProgressBar();
  }

  // Initialize carousel if elements exist
  if (slides.length > 0 && indicators.length > 0) {
    console.log('Initializing carousel with', slides.length, 'slides'); // Debug
    
    // Add click listeners to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Indicator clicked:', index); // Debug
        stopAutoSlide();
        showSlide(index);
      });
    });

    // Pause on hover
    const carousel = document.querySelector('.video-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        console.log('Mouse enter - stopping auto slide'); // Debug
        stopAutoSlide();
      });
      carousel.addEventListener('mouseleave', () => {
        console.log('Mouse leave - resuming auto slide'); // Debug
        resumeAutoSlide();
      });
    }

    // Initialize first slide
    showSlide(0);
  } else {
    console.log('No slides or indicators found'); // Debug
  }

  // Elementos del diagrama de Solución
  const emisorBox = document.getElementById('emisor-box');
  const receptorBox = document.getElementById('receptor-box');
  const appBox = document.getElementById('app-box');
  const featurePanel = document.getElementById('feature-panel');
  const technicalDetailsButton = document.getElementById('technical-details-button');
  const technicalDetailsContent = document.getElementById('technical-details-content');

  // Contenido para cada panel
  const panelContents = {
    'emisor': {
      'title': 'Emisor - Componente Principal',
      'description': 'El Emisor es el corazón del sistema WireFree, conectándose a tu equipo principal para transmitir su contenido:',
      'features': [
        'Se conecta al puerto HDMI de cualquier dispositivo',
        'Captura señales de video/audio en alta calidad',
        'Permite control remoto completo',
        'No consume recursos del equipo principal',
        'Configuración Plug-and-Play sin instalaciones complejas'
      ],
      'note': '<strong>Obligatorio para usar WireFree</strong> - Disponible en versiones 720p, 1080p y 4K',
      'image': '[Imagen: Esquema detallado del emisor WireFree conectado a una consola/PC, con flechas y líneas que muestran cómo captura la señal HDMI y la procesa para transmitirla a través de internet. Estilo minimalista Apple con líneas azules sobre fondo blanco.]'
    },
    'receptor': {
      'title': 'Receptor - Visualización en cualquier pantalla',
      'description': 'El Receptor te permite conectarte a cualquier pantalla con HDMI para visualizar y controlar tu equipo principal:',
      'features': [
        'Conecta a cualquier pantalla con entrada HDMI',
        'Tamaño ultracompacto, fácil de transportar',
        'Recibe señal del Emisor a través de internet',
        'Control remoto mediante botones físicos o dispositivo móvil',
        'Disponible en versiones 720p, 1080p y 4K'
      ],
      'note': '<strong>Una opción para controlar tu equipo</strong> - Elige entre Receptor o APP/WEB según tus necesidades',
      'image': '[Imagen: Esquema detallado del receptor WireFree conectado a una TV en una ubicación remota, con visualización de cómo recibe la señal y la convierte de nuevo en video/audio. Incluye iconos de control remoto y mínima latencia.]'
    },
    'app': {
      'title': 'APP/WEB - Control desde cualquier dispositivo',
      'description': 'La aplicación o versión web te permite acceder a tu equipo principal desde cualquier dispositivo:',
      'features': [
        'Compatible con smartphones, tablets y ordenadores',
        'No requiere hardware adicional (solo el Emisor)',
        'Interfaz intuitiva adaptada a cada dispositivo',
        'Control táctil o mediante teclado/ratón',
        'Disponible para iOS, Android y navegadores web'
      ],
      'note': '<strong>Una opción para controlar tu equipo</strong> - Elige entre APP/WEB o Receptor según tus necesidades',
      'image': '[Imagen: Visualización de la aplicación WireFree en un smartphone y tablet, mostrando cómo se conecta directamente sin hardware adicional. Interface limpia y moderna con la pantalla mostrando un escritorio/juego en funcionamiento.]'
    }
  };

  // Función para cambiar el panel de características
  function changePanel(panelType: string) {
    if (!emisorBox || !receptorBox || !appBox || !featurePanel) return;

    emisorBox.classList.remove('active');
    receptorBox.classList.remove('active');
    appBox.classList.remove('active');

    let targetBox: HTMLElement | null = null;
    if (panelType === 'emisor') targetBox = emisorBox;
    else if (panelType === 'receptor') targetBox = receptorBox;
    else if (panelType === 'app') targetBox = appBox;

    if (targetBox) targetBox.classList.add('active');


    const content = panelContents[panelType as keyof typeof panelContents];
    if (!content) return;

    featurePanel.style.opacity = '0';
    featurePanel.style.transform = 'translateY(20px)';

    setTimeout(() => {
      let featuresHTML = '';
      for (const feature of content.features) {
        featuresHTML += `<li>${feature}</li>`;
      }

      featurePanel.innerHTML = `
        <h3>${content.title}</h3>
        <div class="subtext">${content.description}</div>
        <ul class="feature-list">
          ${featuresHTML}
        </ul>
        <div class="feature-note">
          ${content.note}
        </div>
        <div class="feature-image-container">
          ${content.image}
        </div>
      `;
      featurePanel.style.opacity = '1';
      featurePanel.style.transform = 'translateY(0)';
    }, 300);
  }

  // Event listeners para los paneles de características
  if (emisorBox) emisorBox.addEventListener('click', () => changePanel('emisor'));
  if (receptorBox) receptorBox.addEventListener('click', () => changePanel('receptor'));
  if (appBox) appBox.addEventListener('click', () => changePanel('app'));

  // Event listener para el botón de detalles técnicos
  if (technicalDetailsButton && technicalDetailsContent) {
    technicalDetailsButton.addEventListener('click', function() {
      this.classList.toggle('active');
      technicalDetailsContent.classList.toggle('active');
    });
  }

  // Inicializar con el panel del emisor
  if (featurePanel) {
      changePanel('emisor');
  }


  // Comparison tabs
  const comparisonTabs = document.querySelectorAll('.comparison-tab');
  const comparisonPanels = document.querySelectorAll('.comparison-panel');

  comparisonTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      comparisonTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const tabType = this.getAttribute('data-tab');
      comparisonPanels.forEach(panel => {
         if (panel.getAttribute('data-panel') === tabType) {
             panel.classList.add('active');
         } else {
             panel.classList.remove('active');
         }
      });
    });
  });

  // Toggle for comparison detail items
  document.querySelectorAll('.comparison-detail-item .detail-header').forEach(item => {
    item.addEventListener('click', function() {
      const parent = this.closest('.comparison-detail-item');
      if (parent) {
         parent.parentElement?.querySelectorAll('.comparison-detail-item.active').forEach((activeSibling: Element) => {
             if (activeSibling !== parent) {
                 activeSibling.classList.remove('active');
             }
         });
        parent.classList.toggle('active');
      }
    });
  });

  // Product configurator price update
  function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.config-option').forEach(option => {
      const quantityInput = option.querySelector('.quantity-input') as HTMLInputElement;
      const priceAttr = (option as HTMLElement).dataset.price;
      const price = priceAttr ? parseInt(priceAttr) : 0;

      if (quantityInput && !isNaN(price)) {
        const quantity = parseInt(quantityInput.value);
        if (!isNaN(quantity) && quantity > 0) {
          total += quantity * price;
        }
      }
    });

    const totalPriceElement = document.querySelector('.config-total-price');
    if (totalPriceElement) {
      totalPriceElement.textContent = total + '€';
    }
  }

  updateTotalPrice();

  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = this.closest('.quantity-control');
      const input = parent?.querySelector('.quantity-input') as HTMLInputElement;
      if (!input) return;

      let value = parseInt(input.value);
      if (this.classList.contains('minus')) {
        value = Math.max(0, value - 1);
      } else {
        value = Math.min(10, value + 1);
      }

      input.value = value.toString();
      updateTotalPrice();

      const configOption = this.closest('.config-option');
      if (configOption) {
        if (value > 0) {
          configOption.classList.add('selected');
        } else {
          configOption.classList.remove('selected');
        }
      }
    });
  });

  document.querySelectorAll('.quantity-input').forEach(inputElement => {
    const input = inputElement as HTMLInputElement;
    input.addEventListener('change', function() {
      let value = parseInt(this.value);
      if (isNaN(value) || value < 0) value = 0;
      if (value > 10) value = 10;

      this.value = value.toString();
      updateTotalPrice();

      const configOption = this.closest('.config-option');
      if (configOption) {
        if (value > 0) {
          configOption.classList.add('selected');
        } else {
          configOption.classList.remove('selected');
        }
      }
    });
  });

});