$(document).ready(() => {
	console.log("test login");

    const loginBtn = $(".loginBtn");
    const errorBox = $(".errorBox");
    
    let email = $("#email");
	let password = $("#password");

	loginBtn.click(() => {
		console.log("test loginBtn");
		validate(email,password);
	});

	const validate = (email,password) => {
		if(email.val().trim()==null || email.val().trim()==""|| email ===" "){
			//console.log("Error email has whitespaces");
			errorBox.html("Error email is empty");
			errorBorder(email);
		}
		else if(password.val().trim()==null || password.val().trim()==""|| password ===" " ){
			//console.log("Error password has whitespaces");
			removeBorder(email);
			errorBox.html("Error password is empty");
			errorBorder(password);
		}
		else{
			errorBox.html("");
			removeBorder(password);
			removeBorder(email);
		$.ajax({
			  type: "POST",
		      contentType: "application/json; charset=utf-8",
		      url: "http://localhost:1205/login",
		      data: "{\"Email\":\""+email.val()+"\",\"Password\":\""+password.val()+"\"}",
		      success: function (result,textStatus,xhr) {
		           console.log("it works");
		           console.log(textStatus);
		           console.log(xhr.status);

		           if(xhr.status == 200){
		           	//location.href = "main.html";
		            console.log(result);
		            localStorage.setItem('loggedUser',result);
		           	console.log("successful login");
		           	email.val("");
			      	password.val("");
		           	location.href = "flowerAdd.html";
		           }
		           
			      },
			   error: function (xhr, textStatus, errorThrown) { 
			      	console.log(xhr.status);
			      	console.log(textStatus);
			      	
			      	if(xhr.status == 403){
			      	console.log("bad login");
			      	email.val("");
			      	password.val("");
			    }

		      }	
		 });
		
		}
	}

	const errorBorder = (label) => {
		label.css('border-style','solid');
		label.css('border-color','#F44336');
		label.css('border-width','2px');
	}

	const removeBorder = (label) => {
		label.css('border','');
	}

});