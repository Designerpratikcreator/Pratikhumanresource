document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // 1. Check for Saved Theme Preferences
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }

  // 2. Light / Dark Mode Toggle Event
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

  // 3. Simple Form Submission Handle
  const appForm = document.getElementById('jobAppForm');
  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your job application has been submitted successfully.');
      appForm.reset();
    });
  }
});
