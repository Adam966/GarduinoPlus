// JavaScript Document

$(document).ready(() => {

	//divs for display data from server
	const stat1 = $('#stat1');
	const stat2 = $('#stat2');
	const stat3 = $('#stat3');
	const stat4 = $('#stat4');

	//div for dark mode onoffSwitch
	const onoff = $('#onoffSwitch');
	const colorChange = $('.colorChange');

	//div for settings button
	const settings = $('.settingsBtn');
	const logout = $('.logoutBtn');

	//divs for dark mode
	const heading = $('.heading');
	const nameWrapper = $('#nameWrapper');
	const middleWrapper = $('#middleWrapper');
	const statsBox1 = $('.statsBox1');
	const statsBox2 = $('.statsBox2');
	const statsBox3 = $('.statsBox3');
	const statsBox4 = $('.statsBox4');
	const conditionName = $('.conditionName');
	const today = $('.today');
	const lastWeek = $('.lastWeek');
	const lastMonth = $('.lastMonth');
	const setupWrapper1 = $('.setupWrapperUp');
	const setupWrapper2 = $('.setupWrapperB');
	const submitBtn = $('#submitSettings');
	const setupHeading = $('.setupHeading');
	const rangeText = $('.rangeText');

	//divs for charts
	const divChart1 = $('#chartWrapper1');
	const divChart2 = $('#chartWrapper2');
	const divChart3 = $('#chartWrapper3');
	const divChart4 = $('#chartWrapper4');

	//div for settings
	const middleSettings = $('#middleSettings');

	//settings range sliders
	const slider1 = $('#myRange1')[0];
	const slider2 = $('#myRange2')[0];
	const slider3 = $('#myRange3')[0];
	const slider4 = $('#myRange4')[0];
	const slider5 = $('#myRange5')[0];
	const slider6 = $('#myRange6')[0];
	const slider7 = $('#myRange7')[0];
	//const slider8 = $('#myRange8')[0];
	let output1 = $('#output1')[0];
	let output2 = $('#output2')[0];
	let output3 = $('#output3')[0];
	let output4 = $('#output4')[0];
	let output5 = $('#output5')[0];
	let output6 = $('#output6')[0];
	let output7 = $('#output7')[0];
	//let output8 = $('#output8')[0];

	//div for water plant
	const water = $('#water');

	//progress bars for stats
	let barTemp = $('#barTemp');
	let barAir = $('#barAir');
	let barSoil = $('#barSoil');
	let barWater = $('#barWater');

	//variables for min and max data from http
	let tempMax;
	let tempMin;

	let airhMax;
	let airhMin;

	let soilhMax;
	let soilhMin;

	let waterMin;
	let waterCapacity;

	//variable for socket data (charts)
	let socketTemp = [];
	let socketAirh = [];
	let socketSoilh = [];
	let socketWater = [];
	let socketDate = [];

	let usesValue = $('#usesValue');
	let usesLeft = $('.usesLeft');

	let health = $('.health');

	let plantNameDiv = $('.plantName');

	let conditionWrapper = $('#conditionWrapper');

	let watersurfaceUses;

	let rsltMinus;

	//ArduinoSerial,PlantName
	let plantArduino = JSON.parse(localStorage.getItem('plantArduino'));
	console.log(plantArduino);
	//arduino pole
	let arduinoArr = localStorage.getItem('ArduinoIDarr');
	console.log(arduinoArr);
	//IDUser token
	let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
	console.log(loggedUser);
	//IDUser
	let userID = loggedUser.ID;
	console.log("User ID = "+userID);
	//User's token
	let token = loggedUser.Token;
	console.log(token);
	//ArduinoSerial only 1
	let arduinoID = plantArduino.ArduinoSerial;
	//Plant Name
	let plantName = plantArduino.PlantName;
	//Plant Name to div
	plantNameDiv.html(plantName);

	console.log(arduinoID+plantName);

	const calculateUses = (capacity,watersurface) => {
	  //return Math.round(capacity/70);
	  let waterHalf = (capacity/100) * watersurface;
	  let rslt = Math.round(waterHalf/70);

	  rsltMinus = rslt;

	  if(isNaN(rslt) == true){
	  	usesValue.html("0");
	  	console.log("test");
	  	usesLeft.html("water uses left");
	  }
	  else
	  {

	   usesValue.html(rslt);
	   usesLeft.html("water uses left");
	  }
	}
 
	const calculateCondition = (c1,c2,c3,c4) => {

		//rgb(229, 66, 66) - red
		let c1bool;
		let c2bool;
		let c3bool;
		let c4bool;

		if(c1 == "rgb(229, 66, 66)") { c1bool = false; }
		if(c2 == "rgb(229, 66, 66)") { c2bool = false; }
		if(c3 == "rgb(229, 66, 66)") { c3bool = false; }
		if(c4 == "rgb(229, 66, 66)") { c4bool = false; }

		if(c1 == "rgb(60, 229, 120)") { c1bool = true; }
		if(c2 == "rgb(60, 229, 120)") { c2bool = true; }
		if(c3 == "rgb(60, 229, 120)") { c3bool = true; }
		if(c4 == "rgb(60, 229, 120)") { c4bool = true; }

		let array = [];
		let falseCount=0;
		let trueCount=0;
		array.push(c1bool,c2bool,c3bool,c4bool);

		for(let i=0;i<4;i++){
			if(array[i] == true){
				trueCount++;
			}
			if(array[i] == false){
				falseCount++;
			}
		}

		if(trueCount == 4){	health.html("Perfect").css('color','#35CB6B'); }
		if(trueCount == 2 || trueCount == 3){ health.html("Good").css('color','#E59500'); }
		if(trueCount == 1){ health.html("Bad").css('color','#e54242'); }
		if(falseCount == 4){ health.html("Bad").css('color','#e54242'); }
	}

	const numberValidate = (capacity) => {
		let rslt = /^\d+(\.\d)?\d*$/.test(capacity);
		
		if(rslt == true){
			console.log("ok")
			middleWrapper.css('display','flex');
			middleSettings.css('display','none');
			conditionWrapper.css('display','flex');
			$('.error').html("");
		}
		else
		{
			console.log("not ok");
			$('.error').html("You must enter number");
		}
	}

	$.ajax({
			type: "POST",
			crossDomain: true,
		    contentType: "application/json; charset=utf-8",
		    url: "http://localhost:1205/minmax",
		    //data: "{\"ArduinoSerial\":\""+arduinoID+"\",}",
		    data: JSON.stringify({ ArduinoSerial: arduinoID }),
		   	headers: {
		      'Accept':'application/json',
		      'Access-Control-Allow-Origin': '*',
		      'Access-Control-Allow-Credentials': 'true',
		      "Content-Type": "application/json",
		      'Cache-Control':'no-cache',
		      "Authorization": `Bearer ${token}`
		  	  },
			    success: function (result,textStatus,xhr) {
			           console.log("it works");
			           console.log(textStatus);
			           console.log(xhr.status);

			           if(xhr.status == 200){
			           	   let obj = JSON.parse(result);
					       console.log("data from http");
					       console.log(obj);
					       //console.log(obj[0].TemperatureMax);
					       //console.log(slider1);

						       if(obj == 0){
						       		console.log("cannot get data http request");
						       }
						       else
						       {
						       //Temp Max range input
						       slider1.value = obj[0].TempMax;
						       output1.innerHTML = obj[0].TempMax;
						       //Temp Min range input
						       slider2.value = obj[0].TempMin;
						       output2.innerHTML = obj[0].TempMin;
						       //Air Humidity Max range input
						       slider3.value = obj[0].AirHumMax;
						       output3.innerHTML = obj[0].AirHumMax;
						       //Air Humidity Min range input
						       slider4.value = obj[0].AirHumMin;
						       output4.innerHTML = obj[0].AirHumMin;
						       //Soil Humidity Max range input
						       slider5.value = obj[0].SoilHumMax;
						       output5.innerHTML = obj[0].SoilHumMax;
						       //Soil Humidity Min range input
						       slider6.value = obj[0].SoilHumMin;
						       output6.innerHTML = obj[0].SoilHumMin;
						       //Water level range input
						       slider7.value = obj[0].WaterLevelMin;
						       output7.innerHTML = obj[0].WaterLevelMin;

						       //Water container capacity
						       capacity.value = obj[0].ContainerSize;
						       	//Temp Max to compare
						       tempMax = obj[0].TempMax;
						       //Temp Max to compare
						       tempMin = obj[0].TempsMin;
						       //Air Max to compare
						       airhMax = obj[0].AirHumMax;
						       //Air Min to compare
						       airhMin = obj[0].AirHumMin;
						       //Soil Max to compare
						       soilhMax = obj[0].SoilHumMax;
						       //Soil Min to compare
						       soilhMin = obj[0].SoilHumMin;
						       //Water Min to compare
						      /* waterMin = obj[0].WaterLevelMin;
						       waterCapacity = obj[0].ContainerSize;

						       //calculation for water uses
						       let capacityResult = calculateUses(capacity.value);
						       usesValue.html(capacityResult);
						       console.log(capacityResult);*/
						    }
			           }
			           
				},
				error: function (xhr, textStatus, errorThrown) { 
				      	console.log(xhr.status);
				      	console.log(textStatus);

					    if(xhr.status == 403){
				      		console.log(errorThrown);
				      		console.log("Bad data");
						}
		    }	
	});

	//socket connection
	const socket = io.connect('http://localhost:1205');
    //const socket = io.connect('http://itsovy.sk:1205');

    //socket connection and data emit
	socket.on('connect', (data) => {
	    console.log('check',socket.connected);
	    //socket.emit('weatherData');
	    let arr = "["+arduinoArr+"]";
	    //let json = JSON.stringify({"IDUser":userID,"ArduinoSerial":kokot});
	    let json = "{\"IDUser\":"+userID+",\"ArduinoSerial\":"+arr+"}";

	    console.log("json = "+json);
		socket.emit('setIdentifierW',json);
	    console.log(data);
    });
	
	//when socket is on
	socket.on('plantData', (data) => {
      console.log(data);

      let obj = data;
      console.log(obj);
      obj = Object.values(obj);
      console.log(obj);

      	watersurfaceUses = Math.round(obj[1].watersurface);
      	console.log("test "+watersurfaceUses);

      	//plantName.html(obj[0].plantname);ň

      	/*

		AirHum: 4

		Date: "2019-06-13T00:00:00.000Z"

		SoilHum: 5

		Temp: 25

		WatSurf: 2
		
		*/
		
		stat1.text(Math.round(obj[1].Temp)+"°C");
		stat2.text(Math.round(obj[1].AirHum)+"%");
		stat3.text(Math.round(obj[1].SoilHum)+"%");
		stat4.text(Math.round(obj[1].WatSurf)+"%");

		barTemp.height(obj[1].Temp+'%');
		barAir.height(obj[1].AirHum+'%');
		barSoil.height(obj[1].SoilHum+'%');
		barWater.height(obj[1].WatSurf+'%');

		let tempHeight = barTemp.height() / barTemp.parent().height()*100;
		let airHeight = barAir.height() / barAir.parent().height()*100;
		let soilHeight = barSoil.height() / barSoil.parent().height()*100;
		let waterHeight = barWater.height() / barWater.parent().height()*100;

		if(tempHeight < tempMin) barTemp.css('background-color', '#e54242');
		if(airHeight < airhMin) barAir.css('background-color', '#e54242');
		if(soilHeight < soilhMin) barSoil.css('background-color', '#e54242');
		if(waterHeight < waterMin) barWater.css('background-color', '#e54242');

		if(tempHeight > tempMax) barTemp.css('background-color', '#e54242');
		if(airHeight > airhMax) barAir.css('background-color', '#e54242');
		if(soilHeight > soilhMax) barSoil.css('background-color', '#e54242');

		if(tempHeight < tempMax && tempHeight > tempMin) barTemp.css('background-color', '#3ce578');
		if(airHeight < airhMax && airHeight > airhMin) barAir.css('background-color', '#3ce578');
		if(soilHeight < soilhMax && soilHeight > soilhMin) barSoil.css('background-color', '#3ce578');
		if(waterHeight > waterMin) barWater.css('background-color', '#3ce578');

		let temp = obj[1].Temp;
		let airH = obj[1].AirHum;
		let soilH = obj[1].SoilHum;
		let water = obj[1].WatSurf;
		let date = obj[2].Date;

		date = moment(date).format("hh:mm A");
		console.log(date)

		let c1 = document.getElementById("barTemp").style.backgroundColor;
		let c2 = document.getElementById("barAir").style.backgroundColor;
		let c3 = document.getElementById("barSoil").style.backgroundColor;
		let c4 = document.getElementById("barWater").style.backgroundColor;

		calculateCondition(c1,c2,c3,c4);

		calculateUses(capacity.value,watersurfaceUses);

		//push data to socket variables for Today chart use
		socketTemp.push(temp);
		socketAirh.push(airH);
		socketSoilh.push(soilH);
		socketWater.push(water);
		socketDate.push(date);

		//dataset update with concat function
		Chart1.data.datasets[0].data = Chart1.data.datasets[0].data.concat(temp);
		Chart1.data.labels = Chart1.data.labels.concat(date);
		Chart1.update();

		Chart2.data.datasets[0].data = Chart2.data.datasets[0].data.concat(airH);
		Chart2.data.labels = Chart2.data.labels.concat(date);
		Chart2.update();

		Chart3.data.datasets[0].data = Chart3.data.datasets[0].data.concat(soilH);
		Chart3.data.labels = Chart3.data.labels.concat(date);
		Chart3.update();

		Chart4.data.datasets[0].data = Chart4.data.datasets[0].data.concat(water);
		Chart4.data.labels = Chart4.data.labels.concat(date);
		Chart4.update();

    	});

		//global settings for charts
		Chart.defaults.global.maintainAspectRatio = false;
		Chart.defaults.global.defaultFontColor = '#97AFAD';

		//chart for Temperature data
		let chartTemp = document.getElementById("chartTemp").getContext("2d");
		let Chart1 = new Chart(chartTemp, {
			//maintainAspectRatio : 'false',
			responsive: 'true',
			type: 'line',
			data: {
				labels: [],
				datasets: [{
					label: 'Temperature',
					data: [],
					backgroundColor: [
						'#009E7F'
					],
					borderColor: [
						'#00846B',
					],
					borderWidth: 5
				}]
			},
			options: {
				legend:{
					display: true
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});

    	//chart for Air Humidity data
		let chartAirh = document.getElementById("chartAirh").getContext("2d");
		let Chart2 = new Chart(chartAirh, {
			//maintainAspectRatio : 'false',
			responsive: 'true',
			type: 'line',
			data: {
				labels: [],
				datasets: [{
					label: 'Air Humidity',
					data: [],
					backgroundColor: [
						'#009E7F'
					],
					borderColor: [
						'#00846B',
					],
					borderWidth: 5
				}]
			},
			options: {
				legend:{
					display: true
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
    
   
		//chart for Soil Humidity data
		let chartSoilh = document.getElementById("chartSoilh").getContext("2d");
		let Chart3 = new Chart(chartSoilh, {
			//maintainAspectRatio : 'false',
			responsive: 'true',
			type: 'line',
			data: {
				labels: [],
				datasets: [{
					label: 'Soil Humidity',
					data: [],
					backgroundColor: [
						'#009E7F'
					],
					borderColor: [
						'#00846B',
					],
					borderWidth: 5
				}]
			},
			options: {
				legend:{
					display: true
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
    	

		//chart for Water Surface data
		let chartWater = document.getElementById("chartWater").getContext("2d");
		let Chart4 = new Chart(chartWater, {
			//maintainAspectRatio : 'false',
			responsive: 'true',
			type: 'line',
			data: {
				labels: [],
				datasets: [{
					label: 'Water Level',
					data: [],
					backgroundColor: [
						'#009E7F'
					],
					borderColor: [
						'#00846B',
					],
					borderWidth: 5
				}]
			},
			options: {
				legend:{
					display: true
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});	

	//today data for charts
	today.click(() => {
		
		console.log("testToday");

		$.ajax({
			type: "POST",
			crossDomain: true,
		    contentType: "application/json; charset=utf-8",
		    url: "http://localhost:1205/plantData",
		    //data: "{\"ArduinoSerial\":\""+arduinoID+"\",\"Interval\":\""+"DAY"+"\"}",
		    data: JSON.stringify({ ArduinoSerial: arduinoID , Interval: "DAY" }),
		   	headers: {
		      'Accept':'application/json',
		      'Access-Control-Allow-Origin': '*',
		      'Access-Control-Allow-Credentials': 'true',
		      "Content-Type": "application/json",
		      'Cache-Control':'no-cache',
		      "Authorization": `Bearer ${token}`
		  	  },
			    success: function (result,textStatus,xhr) {
			           console.log("it works");
			           console.log(textStatus);
			           console.log(xhr.status);

			           if(xhr.status == 200){
			           		console.log(result);
			           		if(!$.trim(result)){
			           			console.log("blank data");
			           		}else{
			                let obj =result;
					       	console.log("obj"+obj);

							let tempToChart = obj.map(({ Temp }) => Temp);
							let airhToChart = obj.map(({ AirHum }) => AirHum);
							let soilhToChart = obj.map(({ SoilHum }) => SoilHum);
							let waterToChart = obj.map(({ WatSurf }) => WatSurf);
							let date = obj.map(({ Date }) => moment(Date).format("hh:mm A"));

					    	Chart1.data.datasets[0].data = tempToChart;
					    	Chart1.data.labels = date;
					    	Chart1.update();

					    	Chart2.data.datasets[0].data = airhToChart;
					    	Chart2.data.labels = date;
					    	Chart2.update();

					    	Chart3.data.datasets[0].data = soilhToChart;
					    	Chart3.data.labels = date;
					    	Chart3.update();

					    	Chart4.data.datasets[0].data = waterToChart;
					    	Chart4.data.labels = date;
					    	Chart4.update();
					    	}
			           }
			           
				},
				error: function (xhr, textStatus, errorThrown) { 
				      	console.log(xhr.status);
				      	console.log(textStatus);
				      	
				      	if(xhr.status == 401){
				      		console.log(errorThrown);
				      		console.log("Token expired/bad");
						}

					    if(xhr.status == 403){
				      		console.log(errorThrown);
				      		console.log("Bad data");
						}
		    }	
		 });

	});

	//last week data for charts
	lastWeek.click(() => {
			console.log("test last week");
			$.ajax({
			type: "POST",
			crossDomain: true,
		    contentType: "application/json; charset=utf-8",
		    url: "http://localhost:1205/plantData",
		    data: "{\"ArduinoSerial\":\""+arduinoID+"\",\"Interval\":\""+"WEEK"+"\"}",
		    headers: {
		      'Accept':'application/json',
		      'Access-Control-Allow-Origin': '*',
		      'Access-Control-Allow-Credentials': 'true',
		      "Content-Type": "application/json",
		      'Cache-Control':'no-cache',
		      "Authorization": `Bearer ${token}`
		  	  },
			    success: function (result,textStatus,xhr) {
			           console.log("it works");
			           console.log(textStatus);
			           console.log(xhr.status);

			           if(xhr.status == 200){
			           		console.log(result);
			           		if(!$.trim(result)){
			           			console.log("blank data");
			           		}else{
			                let obj = result;
					       	console.log(obj);

							let tempToChart = obj.map(({ Temp }) => Temp);
							let airhToChart = obj.map(({ AirHum }) => AirHum);
							let soilhToChart = obj.map(({ SoilHum }) => SoilHum);
							let waterToChart = obj.map(({ WatSurf }) => WatSurf);
	   						let date = obj.map(({ Date }) => moment(Date).format('DD-MMM-YYYY'));

					    	Chart1.data.datasets[0].data = tempToChart;
					    	Chart1.data.labels = date;
					    	Chart1.update();

					    	Chart2.data.datasets[0].data = airhToChart;
					    	Chart2.data.labels = date;
					    	Chart2.update();

					    	Chart3.data.datasets[0].data = soilhToChart;
					    	Chart3.data.labels = date;
					    	Chart3.update();

					    	Chart4.data.datasets[0].data = waterToChart;
					    	Chart4.data.labels = date;
					    	Chart4.update();
					    	}
			           }
			           
				},
				error: function (xhr, textStatus, errorThrown) { 
				      	console.log(xhr.status);
				      	console.log(textStatus);
				      	
				      	if(xhr.status == 401){
				      		console.log(errorThrown);
				      		console.log("Token expired/bad");
						}

					    if(xhr.status == 403){
				      		console.log(errorThrown);
				      		console.log("Bad data");
						}
		    }	
		 });
	});

	lastMonth.click(() => {
			console.log("test last month");
			$.ajax({
			type: "POST",
			crossDomain: true,
		    contentType: "application/json; charset=utf-8",
		    url: "http://localhost:1205/plantData",
		    data: "{\"ArduinoSerial\":\""+arduinoID+"\",\"Interval\":\""+"MONTH"+"\"}",
		    headers: {
		      'Accept':'application/json',
		      'Access-Control-Allow-Origin': '*',
		      'Access-Control-Allow-Credentials': 'true',
		      "Content-Type": "application/json",
		      'Cache-Control':'no-cache',
		      "Authorization": `Bearer ${token}`
		  	  },
			    success: function (result,textStatus,xhr) {
			           console.log("it works");
			           console.log(textStatus);
			           console.log(xhr.status);

			           if(xhr.status == 200){
			           		console.log(result);
			           		if(!$.trim(result)){
			           			console.log("blank data");
			           		}else{
			                let obj = result;
					       	console.log(obj);

							let tempToChart = obj.map(({ Temp }) => Temp);
							let airhToChart = obj.map(({ AirHum }) => AirHum);
							let soilhToChart = obj.map(({ SoilHum }) => SoilHum);
							let waterToChart = obj.map(({ WatSurf }) => WatSurf);
	   						let date = obj.map(({ Date }) => moment(Date).format('DD-MMM-YYYY'));

					    	Chart1.data.datasets[0].data = tempToChart;
					    	Chart1.data.labels = date;
					    	Chart1.update();

					    	Chart2.data.datasets[0].data = airhToChart;
					    	Chart2.data.labels = date;
					    	Chart2.update();

					    	Chart3.data.datasets[0].data = soilhToChart;
					    	Chart3.data.labels = date;
					    	Chart3.update();

					    	Chart4.data.datasets[0].data = waterToChart;
					    	Chart4.data.labels = date;
					    	Chart4.update();
					    	}
			           }
			           
				},
				error: function (xhr, textStatus, errorThrown) { 
				      	console.log(xhr.status);
				      	console.log(textStatus);
				      	
				      	if(xhr.status == 401){
				      		console.log(errorThrown);
				      		console.log("Token expired/bad");
						}

					    if(xhr.status == 403){
				      		console.log(errorThrown);
				      		console.log("Bad data");
						}
		    }	
		 });

	});

	onoff.click(() => {

		colorChange.toggleClass('-darkmode');
		heading.toggleClass('-darkmode');
		nameWrapper.toggleClass('-darkmode');
		middleWrapper.toggleClass('-darkmode');
		statsBox1.toggleClass('-darkmode');
		statsBox2.toggleClass('-darkmode');
		statsBox3.toggleClass('-darkmode');
		statsBox4.toggleClass('-darkmode');
		divChart1.toggleClass('-darkmode');
		divChart2.toggleClass('-darkmode');
		divChart3.toggleClass('-darkmode');
		divChart4.toggleClass('-darkmode');
		middleSettings.toggleClass('-darkmode');
		conditionName.toggleClass('-darkmode');
		today.toggleClass('-darkmode');
		lastWeek.toggleClass('-darkmode');
		lastMonth.toggleClass('-darkmode');
		setupWrapper1.toggleClass('-darkmode');
		setupWrapper2.toggleClass('-darkmode');
		submitBtn.toggleClass('-darkmode');
		setupHeading.toggleClass('-darkmode');
		rangeText.toggleClass('-darkmode');
	});
	
	statsBox1.click(() => {
		console.log("test1");
		divChart1.css('display','block');
		divChart2.css('display','none');
		divChart3.css('display','none');
		divChart4.css('display','none');
	});

	statsBox2.click(() => {
		console.log("test2");
		divChart1.css('display','none');
		divChart2.css('display','block');
		divChart3.css('display','none');
		divChart4.css('display','none');
	});

	statsBox3.click(() => {
		console.log("test3");
		divChart1.css('display','none');
		divChart2.css('display','none');
		divChart3.css('display','block');
		divChart4.css('display','none');
	});

	statsBox4.click(() => {
		console.log("test4");
		divChart1.css('display','none');
		divChart2.css('display','none');
		divChart3.css('display','none');
		divChart4.css('display','block');
	});

	settings.click(() => {
		console.log("test settings button");
		middleWrapper.css('display','none');
		middleSettings.css('display','flex');
		conditionWrapper.css('display','none');
	});

	output1.innerHTML = slider1.value;
	output2.innerHTML = slider2.value;
	output3.innerHTML = slider3.value;
	output4.innerHTML = slider4.value;
	output5.innerHTML = slider5.value;
	output6.innerHTML = slider6.value;
	output7.innerHTML = slider7.value;
	/*output8.innerHTML = slider8.value;*/

	slider1.oninput = function() {
	  output1.innerHTML = this.value;
	}

	slider2.oninput = function() {
	  output2.innerHTML = this.value;
	}

	slider3.oninput = function() {
	  output3.innerHTML = this.value;
	}

	slider4.oninput = function() {
	  output4.innerHTML = this.value;
	}

	slider5.oninput = function() {
	  output5.innerHTML = this.value;
	} 

	slider6.oninput = function() {
	  output6.innerHTML = this.value;
	}

	slider7.oninput = function() {
	  output7.innerHTML = this.value;
	}

	submitBtn.click(() => {

		console.log("test");
		console.log(capacity.value);

		let capacityResult = calculateUses(capacity.value);
	    usesValue.html(capacityResult);
	    console.log(capacityResult);

		$.ajax({
	    //url: 'http://itsovy.sk:1205/minmax',
	    url: 'http://localhost:1205/minmax',
	   	contentType: "application/json; charset=utf-8",
	    type: 'PUT',
	    crossDomain: true,
		headers: {
		      'Accept':'application/json',
		      'Access-Control-Allow-Origin': '*',
		      'Access-Control-Allow-Credentials': 'true',
		      "Content-Type": "application/json",
		      'Cache-Control':'no-cache',
		      "Authorization": `Bearer ${token}`
		},
	    data: JSON.stringify({

	    	"identification":{

	    	"ArduinoSerial": arduinoID, 
	    	"PlantName": plantName,

	    	},
	    	
	    	"optimalValues":{
	    	
	    	"TempMin":slider2.value,
	    	"TempMax":slider1.value,
	    	"AirHumMin":slider4.value,
	    	"AirHumMax":slider3.value,
	    	"SoilHumMin":slider6.value, 
	    	"SoilHumMax":slider5.value
	    	/*"WaterLevelMin":slider7.value, 
	    	"ContainerSize":capacity.value*/

	    }}),

	    success: function( result, textStatus, jQxhr ){
			console.log("sent successfully");
			console.log(result);
	       
		   let obj = JSON.parse(result);
		   console.log(obj.optimalValues.TempMin);
	       //console.log(obj[0].TemperatureMax);
	       //console.log(slider1);

	       if(obj == 0){
	       		console.log("cannot get data http request");
	       }
	       else
	       {

	       //Temp Max range input
	       slider1.value = obj.optimalValues.TempMax;
	       output1.innerHTML = obj.optimalValues.TempMax;
	       //Temp Min range input
	       slider2.value = obj.optimalValues.TempMin;
	       output2.innerHTML = obj.optimalValues.TempMin;
	       //Air Humidity Max range input
	       slider3.value = obj.optimalValues.AirHumMax;
	       output3.innerHTML = obj.optimalValues.AirHumMax;
	       //Air Humidity Min range input
	       slider4.value = obj.optimalValues.AirHumyMin;
	       output4.innerHTML = obj.optimalValues.AirHumMin;
	       //Soil Humidity Max range input
	       slider5.value = obj.optimalValues.SoilHumMax;
	       output5.innerHTML = obj.optimalValues.SoilHumMax;
	       //Soil Humidity Min range input
	       slider6.value = obj.optimalValues.SoilHumMin;
	       output6.innerHTML = obj.optimalValues.SoilHumMin;
	       //Water level range input
	       slider7.value = obj.optimalValues.WaterLevelMin;
	       output7.innerHTML = obj.optimalValues.WaterLevelMin;

	       //Water container capacity
	       capacity.value = obj.optimalValues.ContainerSize;
	       	//Temp Max to compare
	       tempMax = obj.optimalValues.TempMax;
	       //Temp Max to compare
	       tempMin = obj.optimalValues.TempMin;
	       //Air Max to compare
	       airhMax = obj.optimalValues.AirHumMax;
	       //Air Min to compare
	       airhMin = obj.optimalValues.AirHumMin;
	       //Soil Max to compare
	       soilhMax = obj.optimalValues.SoilHumMax;
	       //Soil Min to compare
	       soilhMin = obj.optimalValues.SoilHumMin;
	       //Water Min to compare
	       waterMin = obj.optimalValues.WaterLevelMin;
	       waterCapacity = obj.optimalValues.ContainerSize;

	       //calculation for water uses
	       calculateUses(capacity.value,watersurfaceUses);

	        let tempHeight = barTemp.height() / barTemp.parent().height()*100;
			let airHeight = barAir.height() / barAir.parent().height()*100;
			let soilHeight = barSoil.height() / barSoil.parent().height()*100;
			let waterHeight = barWater.height() / barWater.parent().height()*100;

 		    if(tempHeight < tempMin) barTemp.css('background-color', '#e54242');
			if(airHeight < airhMin) barAir.css('background-color', '#e54242');
			if(soilHeight < soilhMin) barSoil.css('background-color', '#e54242');
			if(waterHeight < waterMin) barWater.css('background-color', '#e54242');

			if(tempHeight > tempMax) barTemp.css('background-color', '#e54242');
			if(airHeight > airhMax) barAir.css('background-color', '#e54242');
			if(soilHeight > soilhMax) barSoil.css('background-color', '#e54242');

			if(tempHeight < tempMax && tempHeight > tempMin) barTemp.css('background-color', '#3ce578');
			if(airHeight < airhMax && airHeight > airhMin) barAir.css('background-color', '#3ce578');
			if(soilHeight < soilhMax && soilHeight > soilhMin) barSoil.css('background-color', '#3ce578');
			if(waterHeight > waterMin) barWater.css('background-color', '#3ce578');

			let c1 = document.getElementById("barTemp").style.backgroundColor;
			let c2 = document.getElementById("barAir").style.backgroundColor;
			let c3 = document.getElementById("barSoil").style.backgroundColor;
			let c4 = document.getElementById("barWater").style.backgroundColor;

			calculateCondition(c1,c2,c3,c4);

	       }
	    },
	    error: function( jqXhr, textStatus, errorThrown , xhr){
	        console.log( errorThrown );
	        console.log(xhr.status);
	    }
	    });

		numberValidate(capacity.value);

	});

	water.click(() => {
		console.log("test water");
		if(rsltMinus >0){
			//console.log(usesValue.text());
			//console.log(rsltMinus);
			rsltMinus = rsltMinus-1;
			usesValue.text(rsltMinus);
		}

		if(rsltMinus == 0){
			usesValue.html("");
	   		usesLeft.html("Refill the water");
		}
		let json = "{\"ArduinoSerial\":"+arduinoID+"}";
		console.log(json);
		socket.emit('water', {"ArduinoSerial":arduinoID});

	});


	logout.click(() => {
		console.log("test logout button");
		console.log(localStorage.getItem('loggedUser'));
		localStorage.clear();

		if (localStorage.length == 0) location.href = "login.html";

		/*if (localStorage.getItem("loggedUser") === null) {

		}*/

	});

});