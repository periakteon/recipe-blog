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


    // views'teki "index.ejs" dosyasını göstermesini istiyoruz
    // server.js'te "layout"ı "./layouts/main" olarak belirlemiştik; dolayısıyla, main.ejs'te kullanılmak ve index'te gösterilmek üzere bir "title" nesnesi gönderiyoruz.
    // çünkü main.ejs'te şöyle bir kodumuz var:     <%= typeof title != "undefined" ? title: "" %>
    // veritabanından aldığımız kategorileri de JSON şeklinde göndermek ve anasayfada görüntülemek için (yani, view engine'de kullanmak için) onu da render ediyoruz
    res.render("index", { title: "Recipe Blog - Home", categories });
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

// DUMMY RECIPE EKLEMEK İÇİN
// async function dummyRecipe() {
//   try {
//     await Recipe.insertMany([
//     {
//       "name": "Pilav üstü kuru",
//       "description": "Klasik türk yemeği",
//       "email": "masumgokyuz@gmail.com",
//       "ingredients": [
//         "pilav",
//         "tuz",
//         "soda",
//         "ekmek",
//         "fasulye"
//       ],
//       "category": "Thai",
//       "image": "stir-fried-vegetables.jpg",
//     },
//     {
//       "name": "Pilav üstü qwefqwefqw",
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
//       "name": "Pilav üstü33333 qwefqwefqw",
//       "description": "Klasik t3ürk 124",
//       "email": "masumgokyuz@gmail.com",
//       "ingredients": [
//         "pqefwqilav",
//         "tuz",
//         "soda333",
//         "ekmek",
//         "fasulye"
//       ],
//       "category": "Mexican",
//       "image": "stir-fried-vegetables.jpg",
//     }
//     ])
//   } catch (error) {
//     console.error({ message: error || "Tarif eklenirken hata oluştu" });
//   }
// }
//
// dummyRecipe();