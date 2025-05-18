document.addEventListener('DOMContentLoaded', () => {
  const API_BASE       = '/api';           
  const token          = localStorage.getItem('token');
  const isAdmin        = localStorage.getItem('isAdmin') === 'true';
  const loggedInUserId = Number(localStorage.getItem('userId'));

  if (!token || !isAdmin) {
    return window.location.replace('index.html');
  }

  const logoutBtn        = document.getElementById('logoutBtn');
  const usersTableBody   = document.querySelector('#usersTable tbody');
  const allRecipesBody   = document.querySelector('#allRecipesTable tbody');
  const userRecipesSec   = document.getElementById('userRecipesSection');
  const userRecipesTitle = document.getElementById('userRecipesTitle');
  const userRecipesBody  = document.querySelector('#userRecipesTable tbody');
  const confirmModal     = $('#confirmModal');
  let pendingAction      = { type: null, id: null };

  logoutBtn?.addEventListener('click', () => {
    localStorage.clear();
    window.location.replace('login.html');
  });

  async function apiFetch(path, opts = {}) {
    opts.headers = {
      ...(opts.headers || {}),
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (!res.ok) throw new Error('API error');
    return res.json();
  }

  async function loadUsers() {
    try {
      const { users } = await apiFetch('/admin/users');
      usersTableBody.innerHTML = '';

      users.forEach(u => {
        const isSelf = u.id === loggedInUserId;
        // Only allow ban/unban for non-admin users
        const canToggleBan = !isSelf && !u.isAdmin;
        const banText = u.isBanned ? 'Unban' : 'Ban';
        const banClass = u.isBanned ? 'btn-success' : 'btn-warning';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.id}</td>
          <td>${u.username}${u.isAdmin ? ' <span class="badge badge-info">Admin</span>' : ''}</td>
          <td>${u.email}</td>
          <td>
            <button class="btn btn-sm btn-info btn-view" data-id="${u.id}" data-username="${u.username}">
              View Recipes
            </button>
            ${canToggleBan
              ? `<button class="btn btn-sm ${banClass} btn-ban-toggle" data-id="${u.id}">
                   ${banText}
                 </button>`
              : u.isAdmin
                ? '<span class="text-muted">(admin)</span>'
                : '<span class="text-muted">(you)</span>'
            }
          </td>`;
        usersTableBody.appendChild(tr);
      });

      document.querySelectorAll('.btn-view').forEach(btn =>
        btn.addEventListener('click', () =>
          loadUserRecipes(btn.dataset.id, btn.dataset.username)
        )
      );

      document.querySelectorAll('.btn-ban-toggle').forEach(btn =>
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const action = btn.textContent.trim().toLowerCase(); 
          confirmAction('user', id, action);
        })
      );

    } catch (err) {
      alert('Failed to load users');
      console.error(err);
    }
  }

  async function loadAllRecipes() {
    try {
      const { recipes } = await apiFetch('/admin/recipes');
      allRecipesBody.innerHTML = '';
      recipes.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.id}</td>
          <td>${r.title}</td>
          <td>${r.author?.username || '-'}</td>
          <td>
            <button class="btn btn-sm btn-danger btn-delete-recipe" data-id="${r.id}">
              Delete
            </button>
          </td>`;
        allRecipesBody.appendChild(tr);
      });

      document.querySelectorAll('.btn-delete-recipe').forEach(btn =>
        btn.addEventListener('click', () =>
          confirmAction('recipe', btn.dataset.id)
        )
      );
    } catch (err) {
      alert('Failed to load recipes');
      console.error(err);
    }
  }

  async function loadUserRecipes(userId, username) {
    try {
      const { recipes } = await apiFetch(`/admin/users/${userId}/recipes`);
      userRecipesSec.style.display = 'block';
      userRecipesTitle.textContent = username;
      userRecipesBody.innerHTML = '';

      recipes.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.id}</td>
          <td>${r.title}</td>
          <td>${new Date(r.createdAt).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-danger btn-delete-recipe" data-id="${r.id}">
              Delete
            </button>
          </td>`;
        userRecipesBody.appendChild(tr);
      });

      document.querySelectorAll('#userRecipesTable .btn-delete-recipe').forEach(btn =>
        btn.addEventListener('click', () =>
          confirmAction('recipe', btn.dataset.id)
        )
      );
    } catch (err) {
      alert('Failed to load user recipes');
      console.error(err);
    }
  }

  function confirmAction(type, id, action = null) {
    pendingAction = { type, id, action };
    let msg;
    if (type === 'user') {
      msg = action === 'ban'
        ? 'Are you sure you want to BAN this user?'
        : 'Are you sure you want to UNBAN this user?';
    } else {
      msg = 'Are you sure you want to delete this recipe?';
    }
    document.getElementById('confirmMessage').textContent = msg;
    confirmModal.modal('show');
  }

  document.getElementById('confirmYes').addEventListener('click', async () => {
    confirmModal.modal('hide');
    const { type, id, action } = pendingAction;

    try {
      if (type === 'user') {
        const path = action === 'ban'
          ? `/admin/users/${id}/ban`
          : `/admin/users/${id}/unban`;
        await apiFetch(path, { method: 'POST' });
        loadUsers();
      } else {
        await apiFetch(`/admin/recipes/${id}`, { method: 'DELETE' });
        loadAllRecipes();
        if (userRecipesSec.style.display === 'block') {
          const btn = [...document.querySelectorAll('.btn-view')]
            .find(b => b.dataset.username === userRecipesTitle.textContent);
          if (btn) loadUserRecipes(btn.dataset.id, btn.dataset.username);
        }
      }
    } catch (err) {
      alert('Action failed');
      console.error(err);
    }
  });

  loadUsers();
  loadAllRecipes();
});
