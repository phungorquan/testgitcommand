var express = require("express");
var app = express();
app.use(express.static("public")); // Sử dụng folder public chứa các file của hệ thống 
app.set('view engine', 'ejs'); // Sử dụng view engine là công nghệ để hiển thị web
app.set("views","./views"); // Sử dụng folder views là nơi để chứa giao diện web

// Parse URL-encoded bodies (as sent by HTML forms)
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// Create server
var server = require("http").Server(app); // Khởi tạo server HTTP
var io = require("socket.io")(server); // Khởi tạo socket
server.listen(process.env.PORT || 3000, () => { // Server sẽ chạy trên port 3000 trong hệ thống mạng
   console.log('listening on *:3000');
});

// Hàm để lắng nghe sự kiện từ các CLIENTS
io.on("connection", function(socket)
{
  // Xuất ra terminal id của CLIENTS kết nối tới
  console.log("Client connected: " + socket.id);

  // Xuất ra terminal id của CLIENTS vừa ngắt kết nối
  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected");
  });

  // Lắng nghe route "SEND_DATA_TO_UI"
  // Hàm này gửi data cho tất cả CLIENTS
  socket.on("FROM_ESP_TO_UI", function(data){
    io.sockets.emit("DISPLAY_DATA", data);
  });

  // Lắng nghe route "GET_DATA_FROM_DB"
  // Hàm này gửi data cho CLIENTS đã gọi nó
  socket.on("GET_DATA_FROM_DB", function(){
    var myData = "Hello server";
    socket.emit("RES_DATA_FROM_DB", myData);
  });

});

// Khi người dùng truy cập vào url với đường link là '/' thì sẽ hiển thị giao diện trong file "dashboard.ejs" lên
app.get('/lora',function(req,res){
   res.render("dashboard");
});