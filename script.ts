// Ensure modal elements exist before using them
const modalOverlay = document.getElementById('modal-overlay');
const acceptButton = document.getElementById('accept-button');

if (modalOverlay && acceptButton) {
  acceptButton.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  setTimeout(function() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 500);
} else {
  console.error('Modal elements not found.');
}

// Check for IntersectionObserver support
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.problem-card, .solution-text, .solution-image, .step, .case, .pricing-card').forEach(el => {
    observer.observe(el);
  });
} else {
  console.warn('IntersectionObserver is not supported in this browser.');
}

// Ensure valid data-price attributes and handle invalid cases
document.querySelectorAll('.config-option').forEach(option => {
  const priceAttr = option.getAttribute('data-price');
  const price = priceAttr ? parseInt(priceAttr) : 0;

  if (isNaN(price)) {
    console.error('Invalid price attribute:', priceAttr);
    return;
  }

  const quantityInput = option.querySelector('.quantity-input') as HTMLInputElement;
  if (!quantityInput) {
    console.error('Quantity input not found in configuration option.');
    return;
  }

  // ...existing code for handling quantity changes...
});

// Ensure panel content exists before updating
function changePanel(panelType: string) {
  const panelContents = {
    // ...existing panel contents...
  };

  const content = panelContents[panelType as keyof typeof panelContents];
  if (!content) {
    console.error(`Panel not found: ${panelType}`);
    return;
  }

  // ...existing code for updating panel content...
}
