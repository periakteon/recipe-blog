/**
 * 
 * GET / 
 * Homepage
 * 
 */

// aşağıdaki asenkron fonksiyonu "homepage" olarak export ediyoruz, recipeRoutes.js'te kullanmak için
exports.homepage = async (req, res) => {
  console.log(" '/' adresine GET isteği geldi");
  // views'teki "index.ejs" dosyasını göstermesini istiyoruz
  // server.js'te "layout"ı "./layouts/main" olarak belirlemiştik; dolayısıyla, main.ejs'te kullanılmak ve index'te gösterilmek üzere bir "title" nesnesi gönderiyoruz.
  // çünkü main.ejs'te şöyle bir kodumuz var:     <%= typeof title != "undefined" ? title: "" %>
  res.render("index", {title: "Recipe Blog - Home"});
}