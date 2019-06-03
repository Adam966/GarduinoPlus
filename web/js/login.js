$(document).ready(() => {
	console.log("test login");

    const loginBtn = $(".loginBtn");

	loginBtn.click(() => {
		console.log("test loginBtn");
		let email = $("#email").val();
		let password = $("#password").val();

		console.log(email+"	"+password);

		if(email.trim()==null || email.trim()==""|| email ===" "){
			console.log("error email whitespaces");
		}
		else if(password.trim()==null || password.trim()==""|| password ===" " ){
			console.log("error password whitespaces");
		}
		else{

		$.ajax({

			  type: "POST",
		      contentType: "application/json; charset=utf-8",
		      url: "http://localhost:5432/login",
		      data: "{\"Email\":\""+email+"\",\"Password\":\""+password+"\"}",
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