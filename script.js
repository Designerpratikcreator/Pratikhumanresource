document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Local storage setup for theme configuration
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️';
    } else {
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = '🌙';
    }
  });

  // Application Submit Handling
  const appForm = document.getElementById('jobAppForm');
  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Application sent successfully!');
      appForm.reset();
    });
  }

  // --- Payment Gateway Functionalities --- //

  // Tab switching handler
  const tabBtns = document.querySelectorAll('.payment-tabs .tab-btn');
  const tabContents = document.querySelectorAll('.payment-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.querySelector(`.payment-tab-content[id-tab="${targetTab}"]`).classList.add('active');
    });
  });

  // Inputs Masking & Validation
  const cardNumInput = document.getElementById('card-number');
  const cardExpiryInput = document.getElementById('card-expiry');
  const cardCvvInput = document.getElementById('card-cvv');
  const cardNameInput = document.getElementById('cardholder-name');
  const paymentForm = document.getElementById('paymentForm');

  if (cardNumInput) {
    // Format Card Number (Spacing every 4 digits)
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      val = val.substring(0, 16);
      e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
    });

    // Expiry Mask (MM/YY)
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
      } else {
        e.target.value = val;
      }
    });

    // CVV input enforcement (Numbers only)
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Form Submission & Luhn / Field Validations
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Cardholder Name
      if (cardNameInput.value.trim().length < 3) {
        setError(cardNameInput);
        isValid = false;
      } else {
        clearError(cardNameInput);
      }

      // Validate Card Number (Length & Luhn check)
      const rawNum = cardNumInput.value.replace(/\s+/g, '');
      if (rawNum.length < 13 || !luhnCheck(rawNum)) {
        setError(cardNumInput);
        isValid = false;
      } else {
        clearError(cardNumInput);
      }

      // Validate Expiry
      const expVal = cardExpiryInput.value;
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expVal)) {
        setError(cardExpiryInput);
        isValid = false;
      } else {
        clearError(cardExpiryInput);
      }

      // Validate CVV
      if (cardCvvInput.value.length < 3) {
        setError(cardCvvInput);
        isValid = false;
      } else {
        clearError(cardCvvInput);
      }

      if (isValid) {
        alert('Payment processed successfully! Confirmation code: ' + Math.floor(100000 + Math.random() * 900000));
        paymentForm.reset();
      }
    });
  }

  // Helper validation styling functions
  function setError(inputElement) {
    inputElement.parentElement.classList.add('invalid');
  }

  function clearError(inputElement) {
    inputElement.parentElement.classList.remove('invalid');
  }

  // Luhn Algorithm Implementation
  function luhnCheck(val) {
    let checksum = 0;
    let j = 1;

    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      calc = Number(val.charAt(i)) * j;
      if (calc > 9) {
        checksum += 1;
        calc -= 10;
      }
      checksum += calc;

      if (j === 1) {
        j = 2;
      } else {
        j = 1;
      }
    }
    return (checksum % 10) === 0;
  }

  // Express Checkout External Actions mock
  const externalBtns = [
    document.getElementById('paypalPayBtn'),
    document.getElementById('applePayBtn'),
    document.getElementById('gPayBtn')
  ];

  externalBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        alert('Redirecting to secure express checkout partner provider...');
      });
    }
  });
});
