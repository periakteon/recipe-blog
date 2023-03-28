let addIngredientsBtn = document.getElementById("addIngredientsBtn");
let ingredientList = document.querySelector(".ingredientList");
// "ingredeintDiv" olan form elemanının ilk örneğini seçiyoruz
let ingredientDiv = document.querySelectorAll(".ingredeintDiv")[0];

addIngredientsBtn.addEventListener("click", () => {

  // ingredientDiv form elemanının kopyasını oluşturuyoruz
  let newIngredients = ingredientDiv.cloneNode(true);

  // newIngredients içindeki ilk input alanını seçmek için kullanılır (yani, yeni oluşturulan input alanını seçiyoruz)
  let input = newIngredients.getElementsByTagName("input")[0];
  // yeni oluşturulan input alanının değerini temizliyoruz
  input.value = "";

  // yeni oluşturulan alandaki ".deleteIngredientBtn" sınıfına sahip olan butonu seçiyoruz
  let deleteIngredientBtn = newIngredients.querySelector(".deleteIngredientBtn");
  deleteIngredientBtn.addEventListener("click", () => {
    
    // butona tıklandığında yeni eklenen alanı siliyoruz
    newIngredients.remove();
  });

  ingredientList.appendChild(newIngredients);
}); 