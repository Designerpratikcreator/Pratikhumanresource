document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Sync saved preference from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }

  // Theme Switch Event Handler
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

  // Client Application Form Handler
  const appForm = document.getElementById('jobAppForm');
  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your profile has been compiled and submitted successfully.');
      appForm.reset();
    });
  }
});
