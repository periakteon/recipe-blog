const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

/**
 * App Routes
 * "/" adresine istek geldiğinde recipeController'ın içindeki "homepage" fonksiyonuyla istekleri yönetiyoruz
 */

router.get("/", recipeController.homepage);

router.get("/categories", recipeController.exploreCategories);

router.get("/recipe/:id", recipeController.exploreRecipe);

router.get("/categories/:id", recipeController.exploreCategoriesById);

router.get("/search", recipeController.searchRecipe);
router.post("/search", recipeController.searchRecipe);

router.get("/explore-latest", recipeController.exploreLatest);


module.exports = router;