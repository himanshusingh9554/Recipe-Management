document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'api';
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view your profile.');
      return window.location.href = 'login.html';
    }

    const profileDetails        = document.getElementById('profileDetails');
    const userRecipesContainer  = document.getElementById('userRecipes');
    const editBtn               = document.getElementById('editProfileBtn');
    const formContainer         = document.getElementById('editProfileFormContainer');
    const form                  = document.getElementById('editProfileForm');
    const usernameInput         = document.getElementById('usernameInput');
    const emailInput            = document.getElementById('emailInput');
    const bioInput              = document.getElementById('bioInput');

    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const { user } = await res.json();
 
        profileDetails.innerHTML = `
          <p><strong>Username:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Bio:</strong> ${user.bio || '—'}</p>
        `;

        usernameInput.value = user.username;
        emailInput.value    = user.email;
        bioInput.value      = user.bio || '';

        userRecipesContainer.innerHTML = '';
        if (!user.recipes.length) {
          userRecipesContainer.innerHTML = '<p class="ml-3">You have no recipes yet.</p>';
        } else {
          user.recipes.forEach(r => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
              <div class="card h-100">
                ${r.image
                  ? `<img src="uploads/${r.image}" class="card-img-top" alt="${r.title}">`
                  : ''
                }
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${r.title}</h5>
                  <p class="card-text mb-4">Time: ${r.cookingTime} mins</p>
                  <a href="recipe.html?id=${r.id}" class="btn btn-primary mt-auto">View</a>
                  <a href="editRecipe.html?id=${r.id}" class="btn btn-secondary mt-2">Edit</a>
                </div>
              </div>
            `;
            userRecipesContainer.appendChild(col);
          });
        }
      } catch (err) {
        profileDetails.innerHTML = '<p class="text-danger">Error loading profile.</p>';
      }
    }
  
    editBtn.addEventListener('click', () => {
      formContainer.style.display =
        formContainer.style.display === 'none' ? 'block' : 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      try {
        const res = await fetch(`${API_BASE}/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            bio: bioInput.value.trim()
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Update failed');

        formContainer.style.display = 'none';
        await loadProfile();
        alert('Profile updated successfully');
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });

    loadProfile();
  });
  