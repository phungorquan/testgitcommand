var socket = io(); // Khởi tạo socket

socket.on("DISPLAY_DATA",function(data) // Listen data from route "DISPLAY_DATA"
{ 
	document.getElementById('displayTTNData').innerHTML = data; // Display at tag has id 'displayTTNData' with content = data
});

// Nhận giá trị cảm biến từ SERVER thông qua route "WATER_SENSOR_HISTORY_DATA"
socket.on("WATER_SENSOR_HISTORY_DATA",function(data)
{ 
	// Kiểm tra xem có giá trị hay k
	if(data != "EMPTY_DATA")
	{
	  var getValueField = Array();
	  var getTimeField = Array();

	  // Ghép data
	  for(var i = 0; i < data.length; i++)
	  {
	    getValueField.push(data[i].VALUE);
	    getTimeField.push(data[i].TIME.substr(0, 5));
	  }
	  // Vẽ biểu đồ
	  drawChart(getValueField,getTimeField,getDate);
	}
	else {
	  // Vẽ biểu đồ
	  drawChart(0,0,getDate);
	}
});

// Đóng biểu đồ khi nhấn bất cứ đâu ngoài form 
window.onclick = function(event) {
    if (event.target == document.getElementById('idHistoryChart')) 
      closeChart();
}