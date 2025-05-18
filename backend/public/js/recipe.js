document.addEventListener('DOMContentLoaded', async () => {
  const API_BASE    = 'api';
  const token       = localStorage.getItem('token');
  const recipeDetails       = document.getElementById('recipeDetails');
  const likeBtn             = document.getElementById('likeRecipe');
  const favBtn              = document.getElementById('favBtn');
  const followSection       = document.getElementById('followSection');
  const followBtn           = document.getElementById('followBtn');
  const select              = document.getElementById('collectionSelect');
  const addToColBtn         = document.getElementById('addToCollectionBtn');
  const reviewsList         = document.getElementById('reviewsList');
  const reviewFormContainer = document.getElementById('reviewFormContainer');
  const reviewForm          = document.getElementById('reviewForm');

  const params    = new URLSearchParams(window.location.search);
  const recipeId  = params.get('id');

  let isAuthor      = false;
  let authorId      = null;
  let hasReviewed   = false;

  function parseJwt(tok) {
    try {
      const base = tok.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
      return JSON.parse(atob(base));
    } catch {
      return {};
    }
  }

  async function loadRecipe() {
    try {
      const res = await fetch(`${API_BASE}/recipes/${recipeId}`);
      if (!res.ok) throw new Error();
      const { recipe } = await res.json();

     
      recipeDetails.innerHTML = `
        <h2>${recipe.title}</h2>
        ${recipe.image ? `<img src="/uploads/${recipe.image}" class="img-fluid mb-3">` : ''}
        <p><strong>Description:</strong> ${recipe.description}</p>
        <p><strong>Ingredients:</strong><br>${recipe.ingredients.replace(/\n/g,'<br>')}</p>
        <p><strong>Instructions:</strong><br>${recipe.instructions.replace(/\n/g,'<br>')}</p>
        <p><strong>Cooking Time:</strong> ${recipe.cookingTime} mins</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Category:</strong> ${recipe.category}</p>
        <p><strong>Author:</strong> ${recipe.author.username}</p>
      `;

      authorId = recipe.author.id;
      const me = token && parseJwt(token).id;
      isAuthor = me === authorId;

      if (token && !isAuthor) {
        followSection.style.display = 'block';
        await refreshFollowButton();
      }
    } catch {
      recipeDetails.innerHTML = `<p class="text-danger">Failed to load recipe.</p>`;
    }
  }

  async function refreshFollowButton() {
    const res = await fetch(`${API_BASE}/following`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const { following } = await res.json();
    const isFollowing = following.some(u => u.id === authorId);

    followBtn.textContent = isFollowing ? 'Unfollow' : 'Follow';
    followBtn.className   = isFollowing ? 'btn btn-danger' : 'btn btn-info';
    followBtn.onclick     = async () => {
      await fetch(`${API_BASE}/follow/${authorId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await refreshFollowButton();
    };
  }


  favBtn.addEventListener('click', async () => {
    if (!token) return alert('Please login to add to favorites.');
    const res = await fetch(`${API_BASE}/favorites/${recipeId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Added to favorites!');
    } else {
      alert('Already in favorites or error occurred.');
    }
  });

  likeBtn.addEventListener('click', () => {
    alert('👍 Thanks for liking the recipe! (Coming soon)');
  });

  async function loadUserCollections() {
    try {
      const res = await fetch(`${API_BASE}/collections`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const cols = await res.json();
      select.innerHTML = '<option value="">-- Choose a Collection --</option>';
      cols.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.title;
        select.appendChild(opt);
      });
    } catch {
      select.innerHTML = '<option>Error loading collections</option>';
      select.disabled = true;
      addToColBtn.disabled = true;
    }
  }

  addToColBtn.addEventListener('click', async () => {
    const colId = select.value;
    if (!colId) return alert('Please select a collection first.');
    const res = await fetch(`${API_BASE}/collections/${colId}/recipes/${recipeId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Recipe added to collection!');
      select.value = '';
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to add to collection.');
    }
  });

  async function loadReviews() {
    try {
      const res = await fetch(`${API_BASE}/reviews/${recipeId}`);
      if (!res.ok) throw new Error();
      const { reviews } = await res.json();

      reviewsList.innerHTML = '';
      hasReviewed = false;
      reviews.forEach(r => {
        const div = document.createElement('div');
        div.className = 'border p-2 mb-2';
        div.innerHTML = `
          <strong>${r.user.username}</strong> - Rating: ${r.rating}/5
          <p>${r.comment}</p>
        `;
        reviewsList.appendChild(div);

        if (token && r.user.username === parseJwt(token).username) {
          hasReviewed = true;
        }
      });
      if (!reviews.length) {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
      }
      if (token && !hasReviewed && !isAuthor) {
        reviewFormContainer.style.display = 'block';
      }
    } catch {
      reviewsList.innerHTML = '<p class="text-danger">Error loading reviews.</p>';
    }
  }

  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('reviewText').value;
    try {
      const res = await fetch(`${API_BASE}/reviews/${recipeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      if (!res.ok) throw new Error();
      reviewForm.reset();
      reviewFormContainer.style.display = 'none';
      await loadReviews();
    } catch {
      alert('You may have already reviewed or an error occurred.');
    }
  });


  await loadRecipe();
  if (token) {
    await loadUserCollections();
  }
  await loadReviews();
});
