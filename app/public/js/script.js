var register = function () {

	// get elements
	var account = $("#inputaccount").val() 
		, pwd = $("#inputpassworc").val()
		, realname = $("#inputrealame").val() 
		, idnumber = $("#inputidnumber").val()
		, email = $("#inputemail").val() 
		, phonenumber = $("#inputphonenumber").val();

	var postObj = {
		account : account,
		password : pwd,
		realname : realname,
		id : idnumber,
		email : email,
		phonenumber : phonenumber
	};

	$.post('/register',postObj,function (res) {
		if (res === 200) {
			$("#modal-login").val(account);
			$("#modal-register").val("?");
		}
		//alert("this is a signUp");
		console.log(res);
	});
};

var login = function () {
	// var attr = document;
	var account = $('#inputAccount').val();
	$('#loginModal').modal('hide');
	$('#register').remove();
	$('#modal-login').html("你好，" + account);
};
