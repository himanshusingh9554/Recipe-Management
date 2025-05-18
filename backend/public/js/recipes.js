document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'api';
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userEmail = token ? parseJwt(token).email : null;
  
 
    const navLogin = document.getElementById('navLogin');
    const navRegister = document.getElementById('navRegister');
    const navProfile = document.getElementById('navProfile');
    const navFavorites = document.getElementById('navFavorites');
    const navLogout = document.getElementById('navLogout');
    const navAdmin = document.getElementById('navAdmin');
    const createBtn = document.getElementById('createRecipe');
 
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    const minTimeInput = document.getElementById('minTime');
    const maxTimeInput = document.getElementById('maxTime');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const recipesList = document.getElementById('recipesList');
  
    function parseJwt(tok) {
      try {
        const payload = tok.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(payload));
      } catch {
        return {};
      }
    }
  
    function setupNav() {
      if (token) {
        navLogin.style.display = 'none';
        navRegister.style.display = 'none';
        navProfile.style.display = 'block';
        navFavorites.style.display = 'block';
        navLogout.style.display = 'block';
        createBtn.style.display = 'inline-block';
        navAdmin.style.display = isAdmin ? 'block' : 'none';
  
        navLogout.querySelector('a').addEventListener('click', e => {
          e.preventDefault();
          localStorage.clear();
          location.reload();
        });
      } else {
        navLogin.style.display = 'block';
        navRegister.style.display = 'block';
        navProfile.style.display = 'none';
        navFavorites.style.display = 'none';
        navLogout.style.display = 'none';
        createBtn.style.display = 'none';
        navAdmin.style.display = 'none';
      }
    }
  
    function loadFiltersFromURL() {
      const params = new URLSearchParams(window.location.search);
      searchInput.value = params.get('search') || '';
      filterCategory.value = params.get('category') || '';
      minTimeInput.value = params.get('minTime') || '';
      maxTimeInput.value = params.get('maxTime') || '';
    }
  
    function updateURLFromFilters() {
      const params = new URLSearchParams();
  
      if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
      if (filterCategory.value) params.set('category', filterCategory.value);
      if (minTimeInput.value) params.set('minTime', minTimeInput.value);
      if (maxTimeInput.value) params.set('maxTime', maxTimeInput.value);
  
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      history.replaceState(null, '', newUrl);
    }
 
    async function fetchRecipes() {
      const params = new URLSearchParams(window.location.search);
      try {
        const res = await fetch(`${API_BASE}/recipes?${params.toString()}`);
        if (!res.ok) throw new Error();
        const { recipes } = await res.json();
        return recipes;
      } catch {
        recipesList.innerHTML = `<div class="col-12 text-danger">Error loading recipes.</div>`;
        return [];
      }
    }
  
    function renderRecipes(recipes) {
      recipesList.innerHTML = '';
      if (!recipes.length) {
        recipesList.innerHTML = `<div class="col-12">No recipes found.</div>`;
        return;
      }
  
      recipes.forEach(r => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
  
        const card = document.createElement('div');
        card.className = 'card h-100';
  
        if (r.image) {
          const img = document.createElement('img');
          img.src = `uploads/${r.image}`;
          img.className = 'card-img-top';
          card.appendChild(img);
        }
  
        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column';
        body.innerHTML = `
          <h5 class="card-title">${r.title}</h5>
          <p class="card-text mb-2">Category: ${r.category}</p>
          <p class="card-text mb-4">Time: ${r.cookingTime} mins</p>
        `;
  
        const btnView = document.createElement('a');
        btnView.className = 'btn btn-primary mt-auto';
        btnView.textContent = 'View Details';
        btnView.href = `recipe.html?id=${r.id}`;
        body.appendChild(btnView);
  
        if (token && r.author?.email === userEmail) {
          const btnEdit = document.createElement('a');
          btnEdit.className = 'btn btn-secondary mt-2';
          btnEdit.textContent = 'Edit';
          btnEdit.href = `editRecipe.html?id=${r.id}`;
          body.appendChild(btnEdit);
        }
  
        card.appendChild(body);
        col.appendChild(card);
        recipesList.appendChild(col);
      });
    }

    async function loadAndRender() {
      updateURLFromFilters();
      const recipes = await fetchRecipes();
      renderRecipes(recipes);
    }

    [searchInput, filterCategory, minTimeInput, maxTimeInput].forEach(el => {
      el.addEventListener('input', loadAndRender);
      el.addEventListener('change', loadAndRender);
    });
  
    clearFiltersBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterCategory.value = '';
      minTimeInput.value = '';
      maxTimeInput.value = '';
      loadAndRender();
    });

    setupNav();
    loadFiltersFromURL();
    loadAndRender();
  });
  