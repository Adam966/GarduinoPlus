// JavaScript Document

$(document).ready(() => {

	//div for dark mode onoffSwitch
	const onoff = $('#onoffSwitch');
	const colorChange = $('.colorChange');

	//divs for dark mode
	const heading = $('.heading');
	const nameWrapper = $('#nameWrapper');
	const middleWrapper = $('#middleWrapper');

	let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
	let userID = loggedUser.ID;
	let token = loggedUser.Token;
	console.log(token);
	console.log(loggedUser)
	console.log("ID usera = "+userID);

	$.ajax({
			  contentType: "application/json; charset=utf-8",
			  type: "POST",
			  crossDomain: true,
		      url: "http://localhost:1205/plants",
		      data: "{\"IDUser\":\""+userID+"\"}",
		      headers: {
		      'Access-Control-Allow-Origin': '*',
		      'Access-Control-Allow-Methods:':'POST',
		      "Content-Type": "application/json",
		      "Authorization": "Bearer "+token
		  	  },
		      success: function (result,textStatus,xhr) {
		           console.log("it works");
		           console.log(textStatus);
		           console.log(xhr.status);

		           if(xhr.status == 200){
		           	console.log("it's working");
		           	console.log(result);
					//generatePlants(result);
		           }
		           
			      },
			   error: function (xhr, textStatus, errorThrown) { 
			      	console.log(xhr.status);
			      	console.log("Status = "+textStatus);
			      	
			      	if(xhr.status == 403){
			      	console.log("bad request");
			    }

		      }	
	});

	const generatePlants = (arr) => {
		for(let i=0;i<arr.length;i++){
			middleWrapper.append("<div id='addedPlant'><div class='heading'>"+arr[i].PlantName+"</div></div>");
		}
	}

	onoff.click(() => {
		colorChange.toggleClass('-darkmode');
		heading.toggleClass('-darkmode');
		nameWrapper.toggleClass('-darkmode');
		middleWrapper.toggleClass('-darkmode');
	});

	/*addPlant.click(() => {
		console.log("test addPlant");
		middleWrapper.append("<div id='addedPlant'></div>");
	});*/

});