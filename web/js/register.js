$(document).ready(() => {
	console.log("test registration");

	const registerBtn = $(".registerBtn");
	const errorBox = $(".errorBox");

	registerBtn.click(() => {
		console.log("test registerBtn");
		let username = $("#username").val();
		let email = $("#email").val();
		let password = $("#password").val();
		let rePassword = $("#rePassword").val();

		console.log(username+" "+email+" "+password+" "+rePassword);

		if(password != rePassword){
			//console.log("Password and re-entered password must be same!");
			errorBox.html("Password and re-entered password must be same!");
		}else if(username.trim()==null || username.trim()==""|| username ===" "){
			//console.log("Error username has whitespaces");
			errorBox.html("Error username is empty");
		}else if(email.trim()==null || email.trim()==""|| email ===" "){
			//console.log("Error email has whitespaces");
			errorBox.html("Error email is empty");
		}else if(password.trim()==null || password.trim()==""|| password ===" "){
			//console.log("Error password has whitespaces");
			errorBox.html("Error password is empty");
		}
		else{
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