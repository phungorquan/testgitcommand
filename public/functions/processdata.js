var socket = io(); // Khởi tạo socket

// socket.emit("GET_DATA_FROM_DB"); // Emit to get data when access /lora

socket.on("RES_DATA_FROM_DB",function(data) // Listen data from route "RES_DATA_FROM_DB"
{ 
	document.getElementById('displayData').innerHTML = data; // Display at tag has id 'displayData' with content = data
	console.log(data);
});

socket.on("DISPLAY_DATA",function(data) // Listen data from route "DISPLAY_DATA"
{ 
	document.getElementById('displayESPData').innerHTML = data; // Display at tag has id 'displayESPData' with content = data
	console.log(data);
});

// a function invoked from frontend
function changeText(arg)
{
	console.log(arg);
	document.getElementById('displayData').style.color = "green"; // Change color
	socket.emit("GET_DATA_FROM_DB"); // Emit to server to get data
	socket.emit("FROM_ESP_TO_UI","FROM ESP NE HIHI"); // Emit to server to get data
}