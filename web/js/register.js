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

	});	

});