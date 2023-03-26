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
  res.render("index");
}