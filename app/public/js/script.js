/**
 * @author GuGeyi
 */
var register = function () {

	// get elements
	var account = $("#account").val() 
		, pwd = $("#inputPassword").val()
		, confirmpwd = $("#confirmPassword").val()
		, email = $("#email").val() 
		, phonenumber = $("#tele").val();

	var postObj = {
		account : account,
		password : pwd,
		email : email,
		phonenumber : phonenumber
	};

	$.post('/register',postObj,function (res) {
		if (res === 200) {
			$("#modal-login").val(account);
			$("#modal-register").val("?");
		}
	});

	$(document).ready(function(){
		window.location.href = "./index";
	});
		alert("this is a signUp");
		console.log(res);
};


var login = function () {
	// var attr = document;
	var account = $('#inputAccount').val();
	$('#loginModal').modal('hide');
	$('#register').remove();
	// $('#modal-login').html("你好，" + account);
	$('#modal-login').remove();
	$("#tab").append(helloStr);
};

<<<<<<< Updated upstream
var helloStr = '<li class="dropdown">'
						+	 '<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">Dropdown<strong class="caret"></strong></a>'
						+		'<ul class="dropdown-menu">'
						+		'<li>'
						+		'<a href="{myInfo}">我的信息</a>'
						+		'</li>'
						+		'<li>'
						+		'<a href="{enterMS}">进入后台</a>'
						+		'</li>'
						+		'<li class="divider">'
						+		'</li>'
						+		'<li>'
						+		'<a href="{logout}">退出</a>'
						+		'</li>'
						+		'</ul>'
						+		'</li>';

var temp = helloStr.replace("{myInfo}",'ggy nb');
=======
var relogin = function(){
  $(document).ready(function(){
		window.location.href = "./login";
	});
};
>>>>>>> Stashed changes
