const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// "on" methodu, db nesnesinde (yani veritabanı bağlantısında) belirli bir olayın gerçekleştiğinde tetiklenecek bir işlevi tanımlamak için kullanılır. Bu kodda "error" olayı belirlenmiştir, yani bir hata oluştuğunda bu işlev tetiklenecektir.  
db.on(
  "error",
  // "bind()" fonksiyonu belirli bir bağlamda başka fonksiyonu da çağırmak için kullanılır
  console.error.bind(console, "Veritabanına bağlanırken bir hata oluştu.")
);

// db'ye bir kez (once) bağlanma işlemi gerçekleşince
db.once("open", function () {
  console.log("Veritabanı bağlantısı başarılı!");
});

require("/Category");