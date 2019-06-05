$(document).ready(() => {
	console.log("test login");

    const loginBtn = $(".loginBtn");
    const errorBox = $(".errorBox");

	loginBtn.click(() => {
		console.log("test loginBtn");
		let email = $("#email");
		let password = $("#password");

		console.log(email+"	"+password);

		if(email.val().trim()==null || email.val().trim()==""|| email ===" "){
			//console.log("Error email has whitespaces");
			errorBox.html("Error email is empty");
			email.css('border-style','solid');
			email.css('border-color','#F44336');
			email.css('border-width','2px');
		}
		else if(password.val().trim()==null || password.val().trim()==""|| password ===" " ){
			//console.log("Error password has whitespaces");
			email.css('border','');
			errorBox.html("Error password is empty");
			password.css('border-style','solid');
			password.css('border-color','#F44336');
			password.css('border-width','2px');
		}
		else{
			errorBox.html("");
			email.css('border','');
			password.css('border','');
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
		
	});

});