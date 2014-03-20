var register = function () {

	// get elements
	var account = $("#inputaccount").val() 
		, pwd = $("#inputpassworc").val()
		ï¼Œrealname = $("#inputrealame").val() 
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
			$("#modal-register").val("ï¼?);

		}
		//alert("this is a signUp");
		console.log(res);
	});
};
