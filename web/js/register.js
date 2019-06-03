$(document).ready(() => {
	console.log("test registration");

	const registerBtn = $(".registerBtn");

	registerBtn.click(() => {
		console.log("test registerBtn");
		let username = $("#username").val();
		let email = $("#email").val();
		let password = $("#password").val();
		let rePassword = $("#rePassword").val();

		console.log(username+" "+email+" "+password+" "+rePassword);

		if(password != rePassword){
			console.log("password and re-entered password must be same!");
		}else if(username.trim()==null || username.trim()==""|| username ===" "){
			console.log("error username whitespaces");
		}else if(email.trim()==null || email.trim()==""|| email ===" "){
			console.log("error email whitespaces");
		}else if(password.trim()==null || password.trim()==""|| password ===" "){
			console.log("error password whitespaces");
		}
		else{
			$.ajax({
			  type: "POST",
		      contentType: "application/json; charset=utf-8",
		      url: "http://localhost:5432/login",
		      data: "{\"Name\":\""+username+"\",\"Email\":\""+email+"\",\"Password\":\""+password+"\"}",
		      success: function (result,textStatus,xhr) {
		           console.log("it works");
		           console.log(textStatus);
		           console.log(xhr.status);

		           if(xhr.status == 200){
		           	//location.href = "main.html";
		           	console.log("successful login");
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