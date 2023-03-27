require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/**
 *
 * GET /
 * Homepage
 *
 */

// aşağıdaki asenkron fonksiyonu "homepage" olarak export ediyoruz, recipeRoutes.js'te kullanmak için
exports.homepage = async (req, res) => {
  try {
    // 5 kategori gösterilmesini istediğimiz için limit koyuyoruz
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);

    // "-1" yazarak aslında descending order yapmış oluyoruz, yani tersten sıralıyoruz
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    // Anasayfadaki "Thai Recipes" kısmı için
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    // Anasayfadaki "American Recipes" kısmı için
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    // Anasayfadaki "Mexican Recipes" kısmı için
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    //"index.ejs"te dot notation ile erişebilmek için "latest", "thai", "american" ve "chinese" değişkenlerini bir nesne olarak "food"da saklıyoruz
    const food = { latest, thai, american, chinese };

    // views'teki "index.ejs" dosyasını göstermesini istiyoruz
    // server.js'te "layout"ı "./layouts/main" olarak belirlemiştik; dolayısıyla, main.ejs'te kullanılmak ve index'te gösterilmek üzere bir "title" nesnesi gönderiyoruz.
    // çünkü main.ejs'te şöyle bir kodumuz var:     <%= typeof title != "undefined" ? title: "" %>
    // veritabanından aldığımız kategorileri ve son eklenenleri de JSON şeklinde göndermek ve anasayfada görüntülemek için (yani, view engine'de kullanmak için) onu da render ediyoruz
    res.render("index", { title: "Recipe Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error || "Homepage'de hata oluştu" });
  }
  console.log(" '/' adresine GET isteği geldi");
};

/**
 *
 * GET /categories
 * Categories
 *
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "Recipe Blog - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error || "Homepage'de hata oluştu" });
  }
  console.log(" '/categories' adresine GET isteği geldi");
};

/**
 *
 * GET /recipe/:id
 * Recipies
 *
 */
exports.exploreRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    // recipe.ejs'te kullanmak üzere "recipe" değişkenini gönderiyoruz
    res.render("recipe", {
      title: `Recipe Blog - Recipies: ${recipe.name}`,
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error || "Homepage'de hata oluştu" });
  }
  console.log(" '/recipe' adresine GET isteği geldi");
};

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const categoryById = await Recipe.find({ category: categoryId });

    if (!categoryById || categoryById.length === 0) {
      // Kategori bulunamadıysa başlığı değiştir
      res.render("categories", {
        title: "HATA: Böyle bir kategori bulunamadı.",
      });
      return; // Fonksiyondan çık
    }

    res.render("categories", {
      title: `Recipe Blog - Category: ${categoryId}`,
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 *
 * POST /search
 * Search
 *
 */
exports.searchRecipe = async (req, res) => {
  try {
    // "main.ejs"te form dosyasındaki arama inputunun name'ini yazıyoruz. Yani şunu dikkate alıyoruz: <input type="search" name="q" class="form-control" placeholder="Search..." aria-label="Search">
    const searchTerm = req.query.q;
    const recipe = await Recipe.find({
      // $text, $search ve $diacriticSensitive anahtar kelimeleri, Mongoose'un Tam Metin Arama özelliğini kullanırken MongoDB sorgularında kullanılan özel anahtar kelimelerdir.
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", {title: `Search - ${searchTerm}`, recipe});
  } catch (error) {
    res.status(500).send({ message: error.message && "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    res.render("explore-latest", {title: `Explore Latest`, recipe});
  } catch (error) {
    res.status(500).send({ message: error.message && "Error Occured" });
  }
}

/**
 * GET /explore-random
 * Show Random
 */
exports.exploreRandomRecipe = async (req, res) => {
  try {
    // rastgele yazı göstermek için tüm recipe'lerin sayısını, yani ne kadar olduğunu sayıyoruz (countDocuments)
    const count = await Recipe.find().countDocuments();
    // rastgele yazı göstermek için sayı oluşturuyoruz
    const random = Math.floor(Math.random() * count);
    // findOne() metodu, veritabanından yalnızca bir tarif döndürür. skip() metoduna rasgele bir sayı geçirildiği için, bu metot seçilen rasgele dizindeki tarifi döndürür ve diğer tarifleri atlar. Yani, skip() metodu burada, veritabanından seçilen rasgele tarifin öncesindeki tüm tarifleri atlar ve sadece seçilen tarifi döndürür.
    const recipe = await Recipe.findOne().skip(random);
    res.render("explore-random", {title: `Explore Random`, recipe});
    // res.render("explore-random", {title: `Show Random`, recipe});
  } catch (error) {
    res.status(500).send({ message: error.message && "Error Occured" });
  }
}