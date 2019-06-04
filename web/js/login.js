$(document).ready(() => {
	console.log("test login");

    const loginBtn = $(".loginBtn");
    const errorBox = $(".errorBox");

	loginBtn.click(() => {
		console.log("test loginBtn");
		let email = $("#email").val();
		let password = $("#password").val();

		console.log(email+"	"+password);

		if(email.trim()==null || email.trim()==""|| email ===" "){
			//console.log("Error email has whitespaces");
			errorBox.html("Error email is empty");
		}
		else if(password.trim()==null || password.trim()==""|| password ===" " ){
			//console.log("Error password has whitespaces");
			errorBox.html("Error password is empty");
		}
		else{

		$.ajax({
			  type: "POST",
		      contentType: "application/json; charset=utf-8",
		      url: "http://localhost:1205/login",
		      data: "{\"Email\":\""+email+"\",\"Password\":\""+password+"\"}",
		      success: function (result,textStatus,xhr) {
		           console.log("it works");
		           console.log(textStatus);
		           console.log(xhr.status);

		           if(xhr.status == 200){
		           	//location.href = "main.html";
		           	console.log("successful login");
		           	email.val("");
			      	password.val("");
		           	console.log(result);
		           	location.href = "index.html";
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
		
	});

});