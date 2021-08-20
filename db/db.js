var mysql = require('mysql'); // Khá»Ÿi táº¡o cÃ¢u lá»‡nh DB
var pool = mysql.createConnection({
    connectionLimit: 20,
    host: "localhost", // Host máº·c Ä‘á»‹nh
  	user: "root", // User máº·c Ä‘á»‹nh
  	password: "", // Password máº·c Ä‘á»‹nh
  	dateStrings: true, 
  	database: "celora" // TÃªn database
});

pool.connect(function(error){
	if(error)
		console.log(error);
	else
		console.log("Connected to db");
});


// Các hàm bên dưới sẽ được gọi từ file "server.js"
// Hàm này sẽ lưu giá trị đo được 
exports.querySaveData = function (data) {
	var now = new Date(); // for now
    var currentHour = now.getHours(); // Lấy giờ
    var currentMin = now.getMinutes(); // Lấy phút
    var combineTime = currentHour + ":" + currentMin + ":00"; // Kết hợp thời gian thành hh:mm:ss

  	var dd = now.getDate();    // Lấy ngày
  	var mm = now.getMonth() + 1; // Lấy tháng nhưng phải +1 
  	var yyyy = now.getFullYear();// Lấy năm 4 chữ số  
  	
  	if (dd <  10)  // Thêm số 0 cho ngày < 10
  	 dd = '0' + dd
  	if (mm <  10)  // Thêm số 0 cho tháng < 10
  	 mm = '0' + mm  

  	var combineDate = yyyy + '-' + mm + '-' + dd; // Kết hợp ngày theo định dạng

	return new Promise (function (resolve, reject) {
		pool.query("INSERT INTO watersensor (VALUE,TIME,DATE) VALUES ('"+ data + "','" + combineTime + "','" + combineDate +"');", function(err, rows, fields) { // Truy vấn
			if (err){
				console.log(err);
				resolve("querySaveData-ERROR");
				return;
			} 
			else resolve("querySaveData-OK");
		});
	});
}


// Hàm này sẽ truy vấn và trả về các giá trị cảm biến 
exports.queryGetHistory = function (date) {
	return new Promise (function (resolve, reject) {
		pool.query("SELECT VALUE,TIME FROM watersensor where DATA = '" + date +"';", function(err, res, fields) { // Truy vấn
			if (err){
				resolve("queryGetHistory-ERROR");
				return;
			} 
			if(res.rows.length>0){
				resolve(res.rows);
			}
			else resolve("EMPTY_DATA");
		});
	});
}

// Hàm này sẽ lấy giá trị phút cuối cùng ra so sánh
exports.queryGetLastMinute = function () {
	return new Promise (function (resolve, reject) {
		pool.query("SELECT MINUTE(time) AS time FROM history WHERE id=(SELECT MAX(id) FROM history);", function(err, res, fields) { // Truy vấn
			if (err){
				resolve("queryGetLastMinute-ERROR");
				return;
			} 
			if(res.rows.length>0){
				resolve(res.rows[0].time);
			}
			else resolve("EMPTY_DATA");
		});
	});
}

