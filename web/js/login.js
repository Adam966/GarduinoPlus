$(document).ready(() => {
	console.log("test login");

    const loginBtn = $(".loginBtn");

	loginBtn.click(() => {
		console.log("test loginBtn");
		let email = $("#email").val();
		let password = $("#password").val();

		console.log(email+"	"+password);
	});

});