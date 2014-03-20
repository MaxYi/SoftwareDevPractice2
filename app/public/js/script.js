var login = function () {
	var email = $("#inputAccount").val()
		,	pwd = $("#inputPassword").val();
	$.post('/login', {email: email,password:pwd}, function (res) {
		alert("this is a signUp"+res);
	});
};