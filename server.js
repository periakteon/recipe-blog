const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const recipeRouter = require("./server/routes/recipeRoutes")

// urlencoded adındaki middleware'i çalıştırıyoruz; bu middleware, form isteklerini ayrıştırmaya yarar
app.use(express.urlencoded({ extended: true }));

// bir middleware daha.
app.use(expressLayouts);

app.use(cookieParser("CookingBlogSecure"));
app.use(session({
  secret: "CookingBlogSecretSession",
  saveUninitialized: true,
  resave: true,
}))

app.use(flash());

app.use(fileUpload());

// public klasörünü static yapıyoruz. içerisinde resimler, scriptler, css'ler vb. tutabiliriz
app.use(express.static("public"));


app.set("view engine", "ejs");

app.set('views', 'views'); // set custom root for view engine

// "layout"u "layouts/main" klasörü olarak belirliyoruz
app.set("layout", "./layouts/main");

// "/" adresine gelen istekleri recipeRouter ile yönetmek istiyoruz yani recipeRouter'ı middleware olarak kullanıyoruz
app.use("/", recipeRouter);

app.listen(PORT, () => {
  console.log(`Uygulama ${PORT} numaralı portta çalışıyor.`);
});