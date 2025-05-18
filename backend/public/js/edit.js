
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async () => {
  try {
 
    const response = await fetch(`api/recipes/${recipeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
      }
    });

    const data = await response.json();
    if (data.recipe) {
      document.getElementById('title').value = data.recipe.title;
      document.getElementById('description').value = data.recipe.description;
      document.getElementById('ingredients').value = data.recipe.ingredients;
      document.getElementById('instructions').value = data.recipe.instructions;
      document.getElementById('cookingTime').value = data.recipe.cookingTime;
      document.getElementById('servings').value = data.recipe.servings;
      document.getElementById('category').value = data.recipe.category;
    } else {
      alert('Recipe not found');
    }
  } catch (error) {
    console.error('Error fetching recipe data:', error);
  }
});

document.getElementById('editRecipeForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('ingredients', document.getElementById('ingredients').value);
  formData.append('instructions', document.getElementById('instructions').value);
  formData.append('cookingTime', document.getElementById('cookingTime').value);
  formData.append('servings', document.getElementById('servings').value);
  formData.append('category', document.getElementById('category').value);

  const imageInput = document.getElementById('image');
  if (imageInput.files.length > 0) {
    formData.append('image', imageInput.files[0]);
  }

  try {

    const response = await fetch(`api/recipes/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert('Recipe updated successfully');
      window.location.href = 'index.html';
    } else {
      alert('Error updating recipe: ' + data.message);
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    alert('Error updating recipe');
  }
});
