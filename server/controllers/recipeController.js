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
    res.render("search", { title: `Search - ${searchTerm}`, recipe });
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
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", { title: `Explore Latest`, recipe });
  } catch (error) {
    res.status(500).send({ message: error.message && "Error Occured" });
  }
};

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
    res.render("explore-random", { title: `Explore Random`, recipe });
    // res.render("explore-random", {title: `Show Random`, recipe});
  } catch (error) {
    res.status(500).send({ message: error.message && "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: `Submit Recipe`,
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-recipe
 * Submit Recipe
 */

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    
    // eğer dosya mevcut değilse veya yüklenen dosya stringi 0'sa, yani nesne yoksa (In this line, Object.keys() is used to get an array of all the property names [yani, key'leri] of the req.files object. Object.keys() is a built-in JavaScript method that returns an array of a given object's own enumerable property names. In this case, the req.files object is being passed as an argument to Object.keys(), which will return an array of property names of the object. The length property is then used to check if the array is empty, which means no files were uploaded. If req.files is empty or there are no files uploaded, the code will log "No files uploaded" to the console. Otherwise, the code will continue with the file upload process.)
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files uploaded");
    } else {
      imageUploadFile = req.files.image;
      newImageName = new Date().toLocaleString().replace(/[/:\s]/g, '-') + '-' + imageUploadFile.name;

      // absolute path'i "./" olarak belirlioyoruz. "/public/uploads/" ise relative path oluyor
      uploadPath = require("path").resolve("./") + "/public/uploads/" + newImageName;

      // the mv method is called on the imageUploadFile object to move the uploaded file to the specified uploadPath. The uploadPath variable contains the full path where the uploaded file will be saved, as we discussed earlier. The mv method takes two arguments: the first argument is the destination path where the uploaded file should be moved to, and the second argument is a callback function that will be called when the move operation is completed. If there is an error during the move operation, the callback function will receive an error object, and the code will return a 500 status code with the error message as the response. So, in summary, the mv method is used to move the uploaded file to the desired location on the server, and the callback function is used to handle any errors that may occur during the move operation.
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) res.status(500).send(err);
      });
    }
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();
    // to add a new flash message to the infoSubmit category. The first argument, "infoSubmit", is the name of the category where the flash message will be stored. The second argument, "Recipe has been added.", is the actual message that will be displayed to the user. After calling req.flash, the flash message will be stored in the session, and it can be retrieved on subsequent requests using the req.flash method with the same category name.
    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};
