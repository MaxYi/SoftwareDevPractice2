	/**
 * @author GuGeyi & Qian Yi
 */

var _PROFILE = {};

var ACCOUNT_TYPE = {
		visitor : 0
	,	student : 1
	,	fysz : 2
	,	ysz : 3
};

var CURRENT_ACCOUNT_TYPE;

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
		$.post('/check', {account: account}, function (msg) {
		  if (msg === "OK"){
			  $.post('/register',postObj,function (data) {
				  if (data === 'OK') {
					  jumpto('/');
					  login();
				  }
				  else {
				  }
			  });
	  	}
	  	else alert('该用户名已被注册');
		});
  }
		//alert("this is a signUp");
		//console.log(res);
};

var jumpto = function(url){
  $(document).ready(function(){
		window.location.href = url;
  });
};

// var StudentUpdate = function(){	
// 	//$('#MyInfo').remove();
// };

var EnsureAccountType = function(){
	var account = $.cookie('account');
  //var b = account.replace(reg,"");
  var accountSub = account.substring(0,2);
  switch(accountSub)
  {
		case "63":
		  CURRENT_ACCOUNT_TYPE = ACCOUNT_TYPE.student;
		  break;
		case "21":
		  CURRENT_ACCOUNT_TYPE = ACCOUNT_TYPE.fysz;
		  break;
		case "20":
		  CURRENT_ACCOUNT_TYPE = ACCOUNT_TYPE.ysz;
		  break;
		default:
		  CURRENT_ACCOUNT_TYPE = ACCOUNT_TYPE.visitor;
	};
  $.cookie('CURRENT_ACCOUNT_TYPE',CURRENT_ACCOUNT_TYPE);
};

var login = function () {
// var attr = document;
  var account = $('#inputAccount').val();
  var pwd = $('#inputPassword').val();
  var accountType = CURRENT_ACCOUNT_TYPE;

  if ( $('#inputAccount').val().length == 0) {
	  alert("请输入您的用户名");
	  $('#inputAccount').focus();
  }
  if ($('#inputPassword').val().length == 0) {
	alert("请输入您的密码");
	$('#inputPassword').focus();
  }

  $.post('/login',{account:account,password:pwd,accountType:accountType},function (data) {
  	if (data === "OK") {
  		//set the CURRENT_ACCOUNT_TYPE
  		jumpto('/');
  		EnsureAccountType();
  	}
  	else{
  		alert("用户名或密码错误");
  	}
	});
};

var upload = function () {
	if (uploadCheck())
	{
		var alert = info_tpl.replace("{alterText}", "上传成功");
		$('#div-upload').append(alert);
		window.setTimeout(fade(),1000);
		$('#form_info').submit();
  };
};

var uploadCheck = function() {
	if ( $('#input_name').val().length == 0) {
	  alert("请输入真实姓名");
	  $('#input_name').focus();
	  return false;
  };
  if ( $('#input_id').val().length == 0) {
	  alert("请输入身份证号码");
	  $('#input_id').focus();
	  return false;
  };
  if ( !$('#input_birth').val()) {
	  alert("请输入出生年月");
	  $('#input_birth').focus();
	  return false;
  };
  if ( $('#input_nation').val().length == 0) {
	  alert("请输入民族");
	  $('#input_nation').focus();
	  return false;
  };
  if ( $('#input_workPlace').val().length == 0) {
	  alert("请输入工作单位");
	  $('#input_workPlace').focus();
	  return false;
  };
  if ( $('#input_gra_college').val().length == 0) {
	  alert("请输入毕业院校");
	  $('#input_gra_college').focus();
	  return false;
  };
  if ( $('#input_gra_major').val().length == 0) {
	  alert("请输入毕业专业");
	  $('#input_gra_major').focus();
	  return false;
  };
  if ( !$('#input_gra_time').val()) {
	  alert("请输入毕业时间");
	  $('#input_gra_time').focus();
	  return false;
  };
  if ( $('#input_gra_num').val().length == 0) {
	  alert("请输入毕业编号");
	  $('#input_gra_num').focus();
	  return false;
  };
  if ( !$('#input_degree_time').val()) {
	  alert("请输入学位时间");
	  $('#input_degree_time').focus();
	  return false;
  };
  if ( $('#input_degree_num').val().length == 0) {
	  alert("请输入学位编号");
	  $('#input_degree_num').focus();
	  return false;
  };
  if ( $('#input_location').val().length == 0) {
	  alert("请输入所在地区");
	  $('#input_location').focus();
	  return false;
  };
  if ( $('#input_pic').val().length == 0) {
	  alert("请上传照片");
	  $('#input_pic').focus();
	  return false;
  };
  if ( $('#input_pic').val().length == 0) {
	  alert("请上传照片");
	  $('#input_pic').focus();
	  return false;
  };
  var filepath = $('#input_pic').val();
  //为了避免转义反斜杠出问题，这里将对其进行转换
   var re = /(\\+)/g; 
	var filename=filepath.replace(re,"#");
	//对路径字符串进行剪切截取
	var one=filename.split("#");
	//获取数组中最后一个，即文件名
	var two=one[one.length-1];
	//再对文件名进行截取，以取得后缀名
	var three=two.split(".");
	 //获取截取的最后一个字符串，即为后缀名
	var last=three[three.length-1];
	//添加需要判断的后缀名类型
	var tp ="jpg,jpeg,JPEG,bmp,JPG,BMP";
	//返回符合条件的后缀名在字符串中的位置
	var rs=tp.indexOf(last);
	//如果返回的结果大于或等于0，说明包含允许上传的文件类型
	if(rs>=0){
	 return true;
	}
	else{
	 alert("您选择的上传文件不是有效的图片文件！");
	 return false;
	 }
};

var fade = function () {
	return function () {
		$("#alert").toggle("slow");
	}
};

var logout = function ()
{
	if($.cookie('access_token')){
		$.removeCookie('account');
		$.removeCookie('access_token');
		location.reload();
	}
};

$(document).ready(function(){
	var CURRENT_ACCOUNT_TYPE = $.cookie('CURRENT_ACCOUNT_TYPE');
  switch (CURRENT_ACCOUNT_TYPE){
  	case '1':
  				updateStudentView();
  				break;
  	case '3':
  				updateYszView();
  				break;
  	case '2':
  				updateFyszView();
  				break;
  	default:
  				updateVisiterView();
  };
  updateView();
  window.setTimeout(function(){location.reload()},7199999);
});

var updateStudentView = function(){
};

var updateVisiterView = function(){
	$("#ico1").remove();
	$("#ico2").remove();
	$("#ico6").remove();
	$("#ico8").remove();
	$("#ico3_s").html("我的信息");
	$("#ico5_s").html("报名");
	$("#ico4_s").html("缴费");
	$("#ico7_s").html("考试相关");
};

var updateFyszView = function(){
};

var updateYszView = function(){
	$("#ico2").remove();
	$("#ico3").remove();
	$("#ico4").remove();	
	$("#ico6").remove();
	$("#ico8").remove();
	$("#ico5_s").html("招生");
	$("#ico1_s").html("审核");
	$("#ico7_s").html("录入");
};

var fillInfo
var updateView =function(){
	var name = $.cookie('account');

	var dropDown = helloStr.replace("{account}",name);

  if ($.cookie('access_token'))
  {
  	// deal data
		var token = $.cookie('access_token')
			,	url = "account=" + name + "&" + "token=" + token;
		dropDown = dropDown.replace("{getStr}", url);

  	// delete login and register tab
  	$("#modal-login").remove();
		$("#modal-register").remove();
		$("#tab").append(dropDown);
  }
};

var CheckForm = function(){
  if ( $("#account").val().length == 0) {
		alert("请输入您的用户名");
		$("#account").focus();
		return false;
	}
	if (($("#account").val().length > 14) || ($("#account").val().length < 5)) {
		alert("用户名长度不符合要求");
		$("#account").focus();
		return false;
	}
	if ($("#account").val().indexOf("<")!=-1 || $("#account").val().indexOf(">")!=-1){
		alert("用户名中只能是英文字母或者数字，不能是中文");
		$("#account").focus();
		return false;
	}
	if ($("#account").val().indexOf("'")!=-1){
		alert("用户名中不能包含 (') ");
		$("#account").focus();
		return false;
	}
	if ($("#inputPassword").val().length == 0) {
		alert("请输入您的密码");
		$("#inputPassword").focus();
		return false;
	}
	if (($("#inputPassword").val().length < 6) || ($("#inputPassword").val().length > 14)) {
		alert("密码长度不合适");
		$("#inputPassword").focus();
		return false;
	}
		if ($("#confirmPassword").val().length == 0) {
		alert("请确认您的密码");
		$("#confirmPassword").focus();
		return false;
	}
	if ($("#inputPassword").val() != $("#confirmPassword").val()) {
		alert("您两次输入的密码不一样！请重新输入");
		$("#inputPassword").focus();
		return false;
	}
	// if (document.registeForm.checkNum.value == "") {
	// 	alert("请输入验证码");
	// 	document.registeForm.checkNum.focus();
	// 	return false;
	// }
	if ($("#tele").val().length == 0) {
		alert("请输入您的手机号码");
		$("#tele").focus();
		return false;
	}
	if (($("#tele").val().length !=11) || (isNaN($("#tele").val()))){
		alert("手机号码格式不正确");
		$("#tele").focus();
		return false;
	}
	if ($("#email").val() .length == 0) {
		alert("请输入您的Email");
		$("#email").focus();
		return false;
	}
		if ($("#email").val() .length > 0 && !$("#email").val() .match( /^.+@.+$/ ) ) {
		alert("Email 错误！请重新输入");
		$("#email").focus();
		return false;
	}
	return true;
};

var checkname = function(){
	var account = $("#account").val();
	$.post('/check', {account: account}, function(data) {
	  if (data === "OK"){
	  	alert("此用户名可用");
  	}
  	else alert('该用户名已被注册');
	});
}

var helloStr = '<li class="dropdown">'
						+	 '<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">你好，{account}<strong class="caret"></strong></a>'
						+		'<ul class="dropdown-menu">'
						+		'<li>'
						+		'<a href="/admin">我的信息</a>'
						+		'</li>'
						+		'<li>'
						+		'<a href="/admin?{getStr}">进入后台</a>'
						+		'</li>'
						+		'<li class="divider">'
						+		'</li>'
						+		'<li>'
						+		'<a href="javascript:void(0);" onclick="logout()">注销</a>'
						+		'</li>'
						+		'</ul>'
						+		'</li>';

var info_tpl = 	'<div class="alert alert-info" align="center" id="alert">'
			+	'<strong>{alterText}</strong>'
			+	'</div>';