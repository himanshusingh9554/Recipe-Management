document.addEventListener('DOMContentLoaded', () => {
    const API_BASE        = 'api';
    const token           = localStorage.getItem('token');
    const collectionsList = document.getElementById('collectionsList');
    const favoritesList   = document.getElementById('favoritesList');
    const createForm      = document.getElementById('createCollectionForm');
    const nameInput       = document.getElementById('collectionName');
  
    if (!token) {
      collectionsList.innerHTML = '<div class="col-12 text-danger">Please login to view collections.</div>';
      favoritesList.innerHTML   = '<div class="col-12 text-danger">Please login to view favorites.</div>';
      createForm.style.display   = 'none';
      return;
    }

    async function loadCollections() {
      try {
        const res = await fetch(`${API_BASE}/collections`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const cols = await res.json();
  
        collectionsList.innerHTML = '';
        if (!cols.length) {
          collectionsList.innerHTML = '<div class="col-12">You have no collections.</div>';
          return;
        }
  
        cols.forEach(col => {
          const colDiv = document.createElement('div');
          colDiv.className = 'col-md-6 mb-4';

          const card = document.createElement('div');
          card.className = 'card';
  
          const body = document.createElement('div');
          body.className = 'card-body';

          body.innerHTML = `<h5 class="card-title">${col.title}</h5>`;
          if (col.description) {
            body.innerHTML += `<p class="card-text">${col.description}</p>`;
          }

          if (col.recipes && col.recipes.length) {
            const list = document.createElement('ul');
            list.className = 'list-group list-group-flush';
            col.recipes.forEach(r => {
              const item = document.createElement('li');
              item.className = 'list-group-item p-1';
              item.innerHTML = `<a href="recipe.html?id=${r.id}">${r.title}</a>`;
              list.appendChild(item);
            });
            card.appendChild(list);
          } else {
            body.innerHTML += `<p class="text-muted">No recipes in this collection.</p>`;
          }

          const footer = document.createElement('div');
          footer.className = 'card-body';
          footer.innerHTML = `
            <a href="collection.html?id=${col.id}" class="btn btn-sm btn-outline-primary mr-2">View Collection</a>
          `;
  
          card.appendChild(body);
          card.appendChild(footer);
          colDiv.appendChild(card);
          collectionsList.appendChild(colDiv);
        });
      } catch {
        collectionsList.innerHTML = '<div class="col-12 text-danger">Error loading collections.</div>';
      }
    }

    async function loadFavorites() {
      try {
        const res = await fetch(`${API_BASE}/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const { favorites } = await res.json();
  
        favoritesList.innerHTML = '';
        if (!favorites.length) {
          favoritesList.innerHTML = '<div class="col-12">You have no favorites.</div>';
          return;
        }
  
        favorites.forEach(r => {
          const colDiv = document.createElement('div');
          colDiv.className = 'col-md-4 mb-4';
  
          const card = document.createElement('div');
          card.className = 'card h-100';
  
          if (r.image) {
            const img = document.createElement('img');
            img.src = `uploads/${r.image}`;
            img.className = 'card-img-top';
            img.alt = r.title;
            card.appendChild(img);
          }
  
          const body = document.createElement('div');
          body.className = 'card-body d-flex flex-column';
          body.innerHTML = `
            <h5 class="card-title">${r.title}</h5>
            <p class="card-text mb-2">Time: ${r.cookingTime} mins</p>
          `;
  
          const btnView = document.createElement('a');
          btnView.className   = 'btn btn-primary mt-auto';
          btnView.textContent = 'View Details';
          btnView.href        = `recipe.html?id=${r.id}`;
          body.appendChild(btnView);
  
          card.appendChild(body);
          colDiv.appendChild(card);
          favoritesList.appendChild(colDiv);
        });
      } catch {
        favoritesList.innerHTML = '<div class="col-12 text-danger">Error loading favorites.</div>';
      }
    }

    createForm.addEventListener('submit', async e => {
      e.preventDefault();
      const title = nameInput.value.trim();
      if (!title) return alert('Collection name cannot be empty.');
  
      try {
        const res = await fetch(`${API_BASE}/collections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title })
        });
        if (!res.ok) throw new Error();
        nameInput.value = '';
        await loadCollections();
      } catch {
        alert('Failed to create collection.');
      }
    });

    loadCollections();
    loadFavorites();
  });
  