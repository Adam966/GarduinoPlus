// JavaScript Document

$(document).ready(() => {

	//div for dark mode onoffSwitch
	const onoff = $('#onoffSwitch');
	const colorChange = $('.colorChange');

	//divs for dark mode
	const heading = $('.heading');
	const nameWrapper = $('#nameWrapper');
	const middleWrapper = $('#middleWrapper');

	let loggedUser = localStorage.getItem('loggedUser');
	let userID = loggedUser.ID;
	console.log(loggedUser);
    console.log(userID);

	$.ajax({
			  type: "POST",
		      contentType: "application/json; charset=utf-8",
		      url: "http://localhost:1205/plants",
		      data: "{\"IDUser\":\""+userID+"\"}",
		      success: function (result,textStatus,xhr) {
		           console.log("it works");
		           console.log(textStatus);
		           console.log(xhr.status);

		           if(xhr.status == 200){

		           }
		           
			      },
			   error: function (xhr, textStatus, errorThrown) { 
			      	console.log(xhr.status);
			      	console.log(textStatus);
			      	
			      	if(xhr.status == 403){
			      	console.log("bad request");
			    }

		      }	
	});

	const generatePlants = (arr) => {
		for(let i=0;i<arr.length;i++){
			middleWrapper.append("<div id='addedPlant'><div class='heading'>"+arr.[i].PlantName+"</div></div>");
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