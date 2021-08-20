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
// var db = require("./db/db"); // Include file db.js để dùng các function truy xuất db (library tự tạo)

var mqtt = require('mqtt');
// npm install mqtt --save

const { base64encode, base64decode } = require('nodejs-base64');

var options = {
    // port: 8883,
    // host: 'mqtt://au1.cloud.thethings.network',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'ce-iot-device@ttn',
    password: 'NNSXS.3GZDUT3U4W74PPCJTKREFKZ75ZCJBVIDGCPFIMI.XUE6N7FCUGKHXJALRCIDW2T4T4V7HMAWHPCFTNGD5MUA3OLSUK3A',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('https://au1.cloud.thethings.network:1883', options);

var globalMQTT = 0;
var canSaveEnergy = true;
// SOCKET
// Hàm để lắng nghe sự kiện từ các CLIENTS
io.on("connection", function(socket)
{
  // Xuất ra terminal id của CLIENTS kết nối tới
  console.log("Client connected: " + socket.id);

  // Xuất ra terminal id của CLIENTS vừa ngắt kết nối
  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected");
  });


  function intervalFunc() {
    socket.emit("DISPLAY_DATA", globalMQTT);
  }
  setInterval(intervalFunc, 2000);


  // DATABASE
  // Lắng nghe route "GET_CHART_DATA" 
  // Hàm này truy xuất database và gửi giá trị lịch sử energy đến CLIENT đã gọi nó
  socket.on("GET_CHART_DATA", function(date) {
    async function getHistory() {
      result = await db.queryGetHistory(date); 
      if(result == "queryGetHistory-ERROR")
      {
        socket.emit("ERROR",result);
        console.log(result);
      }
      else {
        socket.emit("WATER_SENSOR_HISTORY_DATA",result);
      }
    }  
    getHistory(); // Thực thi
  });
});


// function có chức năng subscribe 1 topic nếu đã kết nối thành công đến broker
client.on('connect', function() {
    console.log('Client A connected')
    client.subscribe('v3/ce-iot-device@ttn/devices/eui-70b3d57ed00443b0/up')
});

client.on('error', function(err) {
    console.log(err);
});

client.on('message', function(topic, message) {
    
    var getDataFromTTN = JSON.parse(message);
    console.log(getDataFromTTN.uplink_message.frm_payload);

    var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;

    var afterDecodedBase64 = base64decode(getFrmPayload);
    globalMQTT = afterDecodedBase64;
    console.log("Water level: ", afterDecodedBase64);

    var lastMin = 0;
    async function getLastMinute() {
      result = await db.queryGetLastMinute(); 
      if(result != "EMPTY_DATA")
        lastMin = result;

      var currentTime = new Date(); // for now
      var currentMin = currentTime.getMinutes();
     if(currentMin % 2 == 0)
     {
       //if(lastMin != currentMin)
       //{
          async function saveData() {
            result = await db.querySaveData(globalMQTT); 
            if(result == "querySaveData-ERROR")
              console.log(result);
          }  
          if(canSaveEnergy == true)
          {
            canSaveEnergy = false;
            saveEnergy(); // Thực thi
          }
       //}
     }
     else 
      canSaveEnergy = true;
    }  
    getLastMinute(); // Thực thi

});


// Khi người dùng truy cập vào url với đường link là '/' thì sẽ hiển thị giao diện trong file "dashboard.ejs" lên
app.get('/lora',function(req,res){
   res.render("dashboard");
});