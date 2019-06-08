$(document).ready(() => {
	console.log("test registration");

	const registerBtn = $(".registerBtn");
	const errorBox = $(".errorBox");

	let username = $("#username");
	let email = $("#email");
	let password = $("#password");
	let rePassword = $("#rePassword");

	registerBtn.click(() => {
		console.log("test registerBtn");
		console.log(username+" "+email+" "+password+" "+rePassword);

		if(password.val() != rePassword.val()){

			errorBorder(password);
			errorBorder(rePassword);

		}else if(username.val().trim()==null || username.val().trim()==""|| username ===" "){

			removeBorder(password);
			removeBorder(rePassword);

			errorMessage("Error username is empty");
			errorBorder(username);

		}else if(email.val().trim()==null || email.val().trim()==""|| email ===" "){

			removeBorder(username);

			errorMessage("Error email is empty");
			errorBorder(email);

		}else if(password.val().trim()==null || password.val().trim()==""|| password ===" "){
			
			removeBorder(email);

		    errorMessage("Error password is empty");
			errorBorder(password);
		}
		else{

			$.ajax({
			  type: "POST",
		      contentType: "application/json; charset=utf-8",
		      url: "http://localhost:1205/register",
		      data: "{\"Name\":\""+username.val()+"\",\"Email\":\""+email.val()+"\",\"Password\":\""+password.val()+"\"}",
		      success: function (result,textStatus,xhr) {
		           console.log("it works");
		           console.log(textStatus);
		           console.log(xhr.status);

		           if(xhr.status == 200){
		           	errorBox.css('display','none');
					removeBorder(username);
					removeBorder(email);
					removeBorder(rePassword);
					removeBorder(password);
		           	//location.href = "main.html";
		           	console.log("successful registration");
		           	username.val("");
		           	email.val("");
		           	password.val("");
		           	rePassword.val("");
		           	console.log(result);
		           	location.href = "login.html";
		           }
		           
			      },
			      error: function (xhr, textStatus, errorThrown) { 
			      	console.log(xhr.status);
			      	console.log(textStatus);
			      	
			      	if(xhr.status == 403){
			      	console.log("bad login");
			      	
			      	errorMessage("Email is already in usage");
			      	errorBorder(email);
			      	}

		      }	
		 });
		}
	});	

	const errorBorder = (label) => {
		label.css('border-style','solid');
		label.css('border-color','#F44336');
		label.css('border-width','2px');
	}

	const removeBorder = (label) => {
		label.css('border','');
	}

		const errorMessage = (message) => {
		console.log(message);
		errorBox.css('display','block');
		errorBox.html(message);
	}

});