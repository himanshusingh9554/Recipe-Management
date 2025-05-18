document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const oldErr   = document.querySelector('.error-message');
    if (oldErr) oldErr.remove();

    try {
      const res  = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const body = await res.json();

      if (!res.ok) {
        const msg = body.message || 'Login failed';
        return showError(msg);
      }
      localStorage.setItem('token', body.token);
      localStorage.setItem('isAdmin', body.isAdmin);
      if (body.isAdmin) {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } catch (err) {
      console.error(err);
      showError('Network error. Please try again.');
    }
  });

  function showError(message) {
    const div = document.createElement('div');
    div.className = 'error-message text-danger mt-2';
    div.textContent = message;
    form.appendChild(div);
  }
});
