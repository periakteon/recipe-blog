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
    const thai = await Recipe.find({"category": "Thai"}).limit(limitNumber);
    // Anasayfadaki "American Recipes" kısmı için
    const american = await Recipe.find({"category": "American"}).limit(limitNumber);
    // Anasayfadaki "Mexican Recipes" kısmı için
    const chinese = await Recipe.find({"category": "Chinese"}).limit(limitNumber);

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

// async function dummyRecipe() {
//   try {
//     await Recipe.insertMany([
//     {
//       "name": "Çince",
//       "description": "Klasik türk yemeği",
//       "email": "masumgokyuz@gmail.com",
//       "ingredients": [
//         "pilav",
//         "tuz",
//         "soda",
//         "ekmek",
//         "fasulye"
//       ],
//       "category": "Chinese",
//       "image": "stir-fried-vegetables.jpg",
//     },
//     {
//       "name": "Pamerikan",
//       "description": "Klasik türk 124",
//       "email": "masumgokyuz@gmail.com",
//       "ingredients": [
//         "pqefwqilav",
//         "tuz",
//         "soda",
//         "ekmek",
//         "fasulye"
//       ],
//       "category": "American",
//       "image": "stir-fried-vegetables.jpg",
//     },
//     {
//       "name": "Thaii",
//       "description": "Klasik t3ürk 124",
//       "email": "masumgokyuz@gmail.com",
//       "ingredients": [
//         "pqefwqilav",
//         "tuz",
//         "soda333",
//         "ekmek",
//         "fasulye"
//       ],
//       "category": "Thai",
//       "image": "stir-fried-vegetables.jpg",
//     }
//     ])
//   } catch (error) {
//     console.error({ message: error || "Tarif eklenirken hata oluştu" });
//   }
// }

// dummyRecipe();