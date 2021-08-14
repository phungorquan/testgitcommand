var socket = io(); // Khởi tạo socket

socket.emit("GET_DATA_FROM_DB");

socket.on("RES_DATA_FROM_DB",function(data)
{ 
	document.getElementById('displayData').innerHTML = data;
	console.log(data);
});