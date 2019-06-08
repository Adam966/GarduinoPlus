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
			//errorBox.html();
			errorBorder(email);
			errorMessage("Error email is empty");
		}
		else if(password.val().trim()==null || password.val().trim()==""|| password ===" " ){
			//console.log("Error password has whitespaces");
			removeBorder(email);
		    errorMessage("Password email is empty");
			errorBorder(password);
		}
		else{
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

		           	errorBox.css('display','none');
					removeBorder(password);
					removeBorder(email);

		            console.log(result);
		            let rslt = result;
		            localStorage.setItem('loggedUser',rslt);
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

			      	errorMessage("User not found");
			      	errorBorder(email);
			      	errorBorder(password);
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

	const errorMessage = (message) => {
		console.log(message);
		errorBox.css('display','block');
		errorBox.html(message);
	}

});