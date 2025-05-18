document.getElementById("createRecipeForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); 
  
    if (!token) {
      alert("You must be logged in to create a recipe.");
      return;
    }
  
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const ingredients = document.getElementById("ingredients").value;
    const instructions = document.getElementById("instructions").value;
    const cookingTime = document.getElementById("cookingTime").value;
    const servings = document.getElementById("servings").value;
    const category = document.getElementById("category").value;
    const imageInput = document.getElementById("image");
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    formData.append("cookingTime", cookingTime);
    formData.append("servings", servings);
    formData.append("category", category);
  
    if (imageInput.files.length > 0) {
      formData.append("image", imageInput.files[0]);
    }
  
    try {
      const response = await fetch("api/recipes", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to create recipe");
      }
  
      alert("Recipe created successfully!");
      window.location.href = "recipes.html";
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  