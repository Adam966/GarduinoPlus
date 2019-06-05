$(document).ready(() => {
	console.log("test registration");

	const registerBtn = $(".registerBtn");
	const errorBox = $(".errorBox");

	registerBtn.click(() => {
		console.log("test registerBtn");
		let username = $("#username");
		let email = $("#email");
		let password = $("#password");
		let rePassword = $("#rePassword");

		console.log(username+" "+email+" "+password+" "+rePassword);

		if(password.val() != rePassword.val()){

			errorBox.html("Password and re-entered password must be same!");
			password.css('border-style','solid');
			password.css('border-color','#F44336');
			password.css('border-width','2px');

			rePassword.css('border-style','solid');
			rePassword.css('border-color','#F44336');
			rePassword.css('border-width','2px');

		}else if(username.val().trim()==null || username.val().trim()==""|| username ===" "){

			password.css('border','');
			rePassword.css('border','');

			errorBox.html("Error username is empty");
			username.css('border-style','solid');
			username.css('border-color','#F44336');
			username.css('border-width','2px');

		}else if(email.val().trim()==null || email.val().trim()==""|| email ===" "){

			username.css('border','');

			errorBox.html("Error email is empty");
			email.css('border-style','solid');
			email.css('border-color','#F44336');
			email.css('border-width','2px');

		}else if(password.val().trim()==null || password.val().trim()==""|| password ===" "){
			email.css('border','');

			errorBox.html("Error password is empty");
			password.css('border-style','solid');
			password.css('border-color','#F44336');
			password.css('border-width','2px');
		}
		else{

			errorBox.html("");
			username.css('border','');
			email.css('border','');
			rePassword.css('border','');
			password.css('border','');

			$.ajax({
			  type: "POST",
		      contentType: "application/json; charset=utf-8",
		      url: "http://localhost:1205/register",
		      data: "{\"Name\":\""+username+"\",\"Email\":\""+email+"\",\"Password\":\""+password+"\"}",
		      success: function (result,textStatus,xhr) {
		           console.log("it works");
		           console.log(textStatus);
		           console.log(xhr.status);

		           if(xhr.status == 200){
		           	//location.href = "main.html";
		           	console.log("successful registration");
		           	username.val("");
		           	email.val("");
		           	password.val("");
		           	rePassword.val("");
		           	console.log(result);
		           }
		           
			      },
			      error: function (xhr, textStatus, errorThrown) { 
			      	console.log(xhr.status);
			      	console.log(textStatus);
			      	
			      	if(xhr.status == 403){
			      	console.log("bad login");
			      	}

		      }	
		 });
		}
	});	

});