/**
 * @author GuGeyi
 */
var IS_NAME_SAME = true; 

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
  if (CheckForm())
  {
  	if (!IS_NAME_SAME){
		  $.post('/register',postObj,function (dataw) {
			  if (data.state) {
				  jumpto('index');
			  }
			  else {
			  }
		  });
		}
		else{
			alert("该用户名已被注册");
		}
  }
		//alert("this is a signUp");
		//console.log(res);
  };

  var jumpto = function(url){
    $(document).ready(function(){
			window.location.href = "./"+url;
	  });
  };


  var login = function () {
	// var attr = document;
	  var account = $('#inputAccount').val();
	  var pwd = $('#inputPassword').val();

	  $.post('/login',{account:account,password:pwd},function (data) {
	  	if (data.state) {
         $(document).ready(function(){
			   window.location.href = "./index";
		  });
	  	};
	});
	// $.post('/index',{account:account,password:pwd},function (res) {
	// 	if (res === 200) {
	// 		$("#modal-login").val(account);
	// 	  $("#modal-register").val("?");
	// }
	// });
	// $('#loginModal').modal('hide');
	// $('#register').remove();
	// $('#modal-login').html("你好，" + account);
	// $('#modal-login').remove();
	// $("#tab").append(helloStr);
};

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

var temp1 = helloStr.replace("{myInfo}",'/myInfo');
var temp2 = helloStr.replace("{enterMS}",'/adminPanel');
var temp3 = helloStr.replace("{logout}",'/index');

 $(document).ready(function(){
    updateView();
 });

var updateView =function(){
  if ($.cookie('access_token'))
  {
  	$("#modal-login").val($.cookie('account'));
		$("#modal-register").val("myInfo");
  }
};

var CheckForm = function(){
  if ( $("#account").val().length == 0) {
		alert("请输入您的用户名");
		//document.registeForm.userName.focus();
		return false;
	}
	if (($("#account").val().length > 14) || ($("#account").val().length < 5)) {
		alert("用户名长度不符合要求");
		//document.registeForm.userName.focus();
		return false;
	}
	if ($("#account").val().indexOf("<")!=-1 || $("#account").val().indexOf(">")!=-1){
		alert("用户名中只能是英文字母或者数字，不能是中文");
		//document.registeForm.userName.focus();
		return false;
	}
	if ($("#account").val().indexOf("'")!=-1){
		alert("用户名中不能包含 (') ");
		//document.registeForm.userName.focus();
		return false;
	}
	if ($("#inputPassword").val().length == 0) {
		alert("请输入您的密码");
		//document.registeForm.userPassword.focus();
		return false;
	}
	if (($("#inputPassword").val().length < 6) || ($("#inputPassword").val().length > 14)) {
		alert("密码长度不合适");
		//document.registeForm.userPassword.focus();
		return false;
	}
		if ($("#confirmPassword").val().length == 0) {
		alert("请确认您的密码");
		//document.registeForm.repassword.focus();
		return false;
	}
	if ($("#inputPassword").val() != $("#confirmPassword").val()) {
		alert("您两次输入的密码不一样！请重新输入");
		//document.registeForm.userPassword.focus();
		return false;
	}
	// if (document.registeForm.checkNum.value == "") {
	// 	alert("请输入验证码");
	// 	document.registeForm.checkNum.focus();
	// 	return false;
	// }
	if ($("#tele").val().length == 0) {
		alert("请输入您的手机号码");
		//document.registeForm.userEmail.focus();
		return false;
	}
	if (($("#tele").val().length !=11) || (isNaN($("#tele").val()))){
		alert("手机号码格式不正确");
		//document.registeForm.userEmail.focus();
		return false;
	}
	if ($("#email").val() .length == 0) {
		alert("请输入您的Email");
		//document.registeForm.userEmail.focus();
		return false;
	}
		if ($("#email").val() .length > 0 && !$("#email").val() .match( /^.+@.+$/ ) ) {
		alert("Email 错误！请重新输入");
		//document.registeForm.userEmail.focus();
		return false;
	}
	return true;
};

var checkname = function(){
	var account = $("#account").val();
	$.post('/check', {account: account}, function(data) {
	  if (data === "OK"){
	  	IS_NAME_SAME = false;
	  	alert("此用户名可用");
  	}
	  else
	  	IS_NAME_SAME = true;
	});
}