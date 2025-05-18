
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
   
      const username = document.getElementById('username').value.trim();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
        let errEl = document.querySelector('.error-message');
      if (errEl) errEl.remove();
  
      try {
        const res = await fetch('api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        
        const body = await res.json();
        
        if (!res.ok) {
          const msg = body.message || 'Registration failed';
          showError(msg);
          return;
        }
       
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
        
      } catch (err) {
        showError('Network error. Please try again.');
        console.error(err);
      }
    });
    
    function showError(message) {
      const div = document.createElement('div');
      div.className = 'error-message text-danger mt-2';
      div.textContent = message;
      form.appendChild(div);
    }
  });
  