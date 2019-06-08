// JavaScript Document

$(document).ready(() => {

	//div for dark mode onoffSwitch
	const onoff = $('#onoffSwitch');
	const colorChange = $('.colorChange');

	//divs for dark mode
	const heading = $('.heading');
	const nameWrapper = $('#nameWrapper');
	const middleWrapper = $('#middleWrapper');

    const logout = $('.logoutBtn');

	let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
	let userID = loggedUser.ID;
	let token = loggedUser.Token;
	console.log(token);
	console.log(loggedUser);
	console.log("ID usera = "+userID);

	let plants =[];
	
	$.ajax({
			  type: "POST",
			  crossDomain: true,
		      url: "http://localhost:1205/plants",  
		      data: JSON.stringify({ IDUser: userID }),
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
		           	console.log("it's working");
		           	console.log(result);
		           	rslt = JSON.parse(result);
		           	//localStorage.setItem('arduinoID',JSON.stringify(rslt[0].ArduinoSerial));
					generatePlants(rslt);
					//location.href="index.html";
		           }
		           
			      },
			   error: function (xhr, textStatus, errorThrown) { 
			   	   	console.log(errorThrown);
			   		console.log(textStatus);
			      	console.log("xhr status= "+xhr.status);
			      	console.log("Status = "+textStatus);
			      	
			      	if(xhr.status == 403){
			      	console.log("bad request");
			    }

		      }	
	});

	const generatePlants = (arr) => {
		for(let i=0;i<arr.length;i++){
			plants.push(arr[i]);
			middleWrapper.append("<div class='addedPlant'><div class='heading'>"+arr[i].PlantName+"</div><span class='arduinoHeading'>ArduinoID:<span class='arduinoID'>"+arr[i].ArduinoSerial+"</span></span></div>");
		}
	}

	onoff.click(() => {
		colorChange.toggleClass('-darkmode');
		heading.toggleClass('-darkmode');
		nameWrapper.toggleClass('-darkmode');
		middleWrapper.toggleClass('-darkmode');
	});

	$('#middleWrapper').delegate('div.addedPlant', 'click', function() {
	if("plantArduino" in localStorage){
		localStorage.removeItem("plantArduino");
	}

    let text = $(this).text();
    console.log(text);
    console.log(plants);

    let id = getArduinoID(text);
    let plantArduinoObj = (compareID(plants,id));
    //console.log(plantArduinoObj);

    localStorage.setItem('plantArduino',plantArduinoObj);
    console.log(localStorage.getItem('plantArduino'));
    if("plantArduino" in localStorage) location.href = "index.html";

	});

	logout.click(() => {
		console.log("test logout button");
		localStorage.removeItem('loggedUser');
		localStorage.removeItem('arduinoID');

		if (localStorage.length == 0) location.href = "login.html";

	});

	const getArduinoID = (text) => {
		let index = text.indexOf(':');
	    let rslt = text.substr(index);
	    rslt = rslt.replace(':','');
	    return rslt;
	}


	const makeObj = (plantName,arduinoID) => {
		console.log(plantName+arduinoID);
		let obj = {
		  PlantName: plantName,
		  ArduinoSerial: arduinoID
		};
		obj = JSON.stringify(obj);
		return obj;
	}

	const compareID = (arr,arduinoID) => {
		for(let i=0;i<arr.length;i++){
    		if(arr[i].ArduinoSerial === arduinoID ){
    			console.log("found");
    			return makeObj(arr[i].PlantName,arr[i].ArduinoSerial);
    			break;
    		}
    	}
	}


});