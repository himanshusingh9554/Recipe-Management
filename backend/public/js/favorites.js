document.addEventListener('DOMContentLoaded', () => {
    const API_BASE     = 'api';
    const token        = localStorage.getItem('token');
    const isAdmin      = localStorage.getItem('isAdmin') === 'true';
    const userEmail    = token ? parseJwt(token).email : null;
  
    // Navbar items
    const navLogin     = document.getElementById('navLogin');
    const navRegister  = document.getElementById('navRegister');
    const navProfile   = document.getElementById('navProfile');
    const navRecipes   = document.getElementById('navRecipes');
    const navFavorites = document.getElementById('navFavorites');
    const navLogout    = document.getElementById('navLogout');
    const navAdmin     = document.getElementById('navAdmin');
    const createBtn    = document.getElementById('createRecipe');
    const favoritesList = document.getElementById('favoritesList');
  
    function parseJwt(tok) {
      try {
        const base = tok.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
        return JSON.parse(atob(base));
      } catch {
        return {};
      }
    }
 
    function setupNav() {
      if (!token) {

        return window.location.replace('login.html');
      }

      navLogin.style.display    = 'none';
      navRegister.style.display = 'none';
      navProfile.style.display  = 'block';
      navRecipes.style.display  = 'block';
      navFavorites.style.display= 'block';
      navLogout.style.display   = 'block';
      createBtn.style.display   = 'inline-block';
      navAdmin.style.display    = isAdmin ? 'block' : 'none';
  
      navLogout.querySelector('a').addEventListener('click', e => {
        e.preventDefault();
        localStorage.clear();
        window.location.replace('login.html');
      });
    }

    async function fetchFavorites() {
      try {
        const res = await fetch(`${API_BASE}/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const { favorites } = await res.json();
        return favorites;
      } catch {
        favoritesList.innerHTML = `<div class="col-12 text-danger">Error loading favorites.</div>`;
        return [];
      }
    }
  
    function renderFavorites(recipes) {
      favoritesList.innerHTML = '';
      if (!recipes.length) {
        favoritesList.innerHTML = `<div class="col-12">You have no favorites yet.</div>`;
        return;
      }
      recipes.forEach(r => {
        const col  = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        const card = document.createElement('div');
        card.className = 'card h-100';
  
        if (r.image) {
          const img = document.createElement('img');
          img.src       = `uploads/${r.image}`;
          img.className = 'card-img-top';
          img.alt       = r.title;
          card.appendChild(img);
        }
  
        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column';
        body.innerHTML = `
          <h5 class="card-title">${r.title}</h5>
          <p class="card-text mb-4">Cooking Time: ${r.cookingTime} mins</p>
        `;
  
        const btnView = document.createElement('a');
        btnView.className   = 'btn btn-primary mt-auto';
        btnView.textContent = 'View Details';
        btnView.href        = `recipe.html?id=${r.id}`;
        body.appendChild(btnView);
  
        const btnRemove = document.createElement('button');
        btnRemove.className   = 'btn btn-danger mt-2';
        btnRemove.textContent = 'Remove Favorite';
        btnRemove.addEventListener('click', () => removeFavorite(r.id));
        body.appendChild(btnRemove);
  
        card.appendChild(body);
        col.appendChild(card);
        favoritesList.appendChild(col);
      });
    }
  
    async function removeFavorite(recipeId) {
      try {
        const res = await fetch(`${API_BASE}/favorites/${recipeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        loadAndRender();
      } catch {
        alert('Failed to remove favorite.');
      }
    }

    async function loadAndRender() {
      const favs = await fetchFavorites();
      renderFavorites(favs);
    }

    setupNav();
    loadAndRender();
  });
  