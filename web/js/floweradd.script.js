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
    var text = $(this).text();
    // do something with the text
    console.log(text);
	});

	logout.click(() => {
		console.log("test logout button");
		localStorage.removeItem('loggedUser');
		localStorage.removeItem('arduinoID');

		if (localStorage.length == 0) location.href = "login.html";

	});

	/*addPlant.click(() => {
		console.log("test addPlant");
		middleWrapper.append("<div id='addedPlant'></div>");
	});*/

});