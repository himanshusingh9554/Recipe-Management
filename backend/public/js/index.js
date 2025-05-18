document.addEventListener('DOMContentLoaded', () => {
    const API_BASE       = 'api';
    const token          = localStorage.getItem('token');
    const isAdmin        = localStorage.getItem('isAdmin') === 'true';

    if (token && isAdmin) return window.location.replace('admin.html');

    const navLogin     = document.getElementById('navLogin');
    const navRegister  = document.getElementById('navRegister');
    const navProfile   = document.getElementById('navProfile');
    const navFavorites = document.getElementById('navFavorites');
    const navLogout    = document.getElementById('navLogout');
    const navAdmin     = document.getElementById('navAdmin');
    const createBtn    = document.getElementById('createRecipe');

    const recipesList  = document.getElementById('recipesList');
    const searchForm   = document.getElementById('searchForm');
    const searchInput  = document.getElementById('searchQuery');
    const minTimeInput = document.getElementById('minTime');
    const maxTimeInput = document.getElementById('maxTime');

    function parseJwt(tok) {
      try {
        const base = tok.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base));
      } catch {
        return {};
      }
    }

    function setupNav() {
      if (token) {
        navLogin.style.display     = 'none';
        navRegister.style.display  = 'none';
        navProfile.style.display   = 'block';
        navFavorites.style.display = 'block';
        navLogout.style.display    = 'block';
        createBtn.style.display    = 'inline-block';
        navAdmin.style.display     = 'none';

        navLogout.querySelector('a').addEventListener('click', e => {
          e.preventDefault();
          localStorage.clear();
          window.location.reload();
        });
      } else {
        navLogin.style.display     = 'block';
        navRegister.style.display  = 'block';
        navProfile.style.display   = 'none';
        navFavorites.style.display = 'none';
        navLogout.style.display    = 'none';
        createBtn.style.display    = 'none';
        navAdmin.style.display     = 'none';
      }
    }

    async function fetchRecipes(queryParams = {}) {
      const params = new URLSearchParams(queryParams).toString();
      try {
        const res = await fetch(`${API_BASE}/recipes?${params}`);
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
      if (!recipes.length)
        return recipesList.innerHTML = `<div class="col-12">No recipes found.</div>`;

      const userEmail = token ? parseJwt(token).email : null;

      recipes.forEach(r => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        const card = document.createElement('div');
        card.className = 'card h-100';

        if (r.image) {
          const img = document.createElement('img');
          img.src = `/uploads/${r.image}`;
          img.className = 'card-img-top';
          img.alt = r.title;
          card.appendChild(img);
        }

        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column';
        body.innerHTML = `
          <h5 class="card-title">${r.title}</h5>
          <p class="card-text mb-4">Cooking Time: ${r.cookingTime} mins</p>
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

    function getQueryParamsFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        search: urlParams.get('search') || '',
        minTime: urlParams.get('minTime') || '',
        maxTime: urlParams.get('maxTime') || ''
      };
    }

    function setFiltersFromURL(params) {
      searchInput.value = params.search;
      minTimeInput.value = params.minTime;
      maxTimeInput.value = params.maxTime;
    }

    async function loadAndRenderFromURL() {
      const params = getQueryParamsFromURL();
      setFiltersFromURL(params);
      const recipes = await fetchRecipes(params);
      renderRecipes(recipes);
    }

    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const searchParams = new URLSearchParams({
        search: searchInput.value,
        minTime: minTimeInput.value,
        maxTime: maxTimeInput.value
      });

      window.location.href = `index.html?${searchParams.toString()}`;
    });

    setupNav();
    loadAndRenderFromURL();
});
  