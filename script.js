document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check and implement saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }

  // Smooth Toggle Event Handler
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

  // Client Application Form submission logic
  const appForm = document.getElementById('jobAppForm');
  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your job application has been successfully captured.');
      appForm.reset();
    });
  }
});
