	/**
 * @author GuGeyi & Qian Yi
 */

// var _PROFILE = {};

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

var courseEnsure = function{
	var cousreName = $("#courseNameSelect").val();
	$.post('/course',{courseName:courseName},function (data,stu) {
  	if (data === "OK") {
  			
  	}
	});
}

var scoreDone = function(){
	var i = $("#studentList")
	$.post('/course',{courseName:courseName},function (data) {
  	if (data === "OK") {
  			
  	}
	});
}

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
	var path = location.pathname;
	switch (path){
		case '/':{
			updateView();
		  window.setTimeout(function(){location.reload()},7199999);
		  break;
		}
		case '/login':{
			break;
		}
		case '/register':{
			break;
		}
		case '/admin':{
			var CURRENT_ACCOUNT_TYPE = $.cookie('CURRENT_ACCOUNT_TYPE');
		  switch (CURRENT_ACCOUNT_TYPE){
		  	case '1':
  				updateStudentView();
  				break;
		  	case '2':
  				updateFyszView();
  				break;
		  	case '3':
  				updateYszView();
  				break;
		  	default:
		  	  isPaid();
  				updateVisiterView();
  				break;
		  }
		  break;
		}
		default:
			break;
		}
	//isPaid?
	  
});

var isPaid = function(){
	var name = $.cookie('account');
  var token = $.cookie('access_token');
	$.post('/info',{account:name,token:token},function (data) {
		// _PROFILE = _.clone(data);
		if (data.isPaid)
		{
	      $("#payButton").remove();
	      $("#payLabel").remove();
	      $("#payH1").append(payInfo);
	      //return true;
		}
  });
}
var updateVisiterView = function(){
	$("#ico1").remove();
	$("#ico2").remove();
	$("#ico6").remove();
	$("#ico8").remove();
	$("#ico3_s").html("我的信息");
	$("#ico4_s").html("缴费");
	$("#ico5_s").html("报名");
	$("#ico7_s").html("考试相关");
	var welText = $("#welcomeText").html().replace("Welcome","身份： 用户");
	$("#welcomeText").html(welText);
	//$("#welcomeText").find("strong").html("欢迎，" + $.cookie('account'));
	$("#account_name").html($.cookie('account'));
	fillInfo();
};

var updateStudentView = function(){
	$("#ico1").remove();
	$("#ico5").remove();
	$("#ico8").remove();
	$("#ico6").remove();

	$("#ico2_s").html("学籍信息");
	$("#ico7_s").html("课程信息");

	var welText = $("#welcomeText").html().replace("Welcome","身份： 学生");
	$("#welcomeText").html(welText);
	$("#account_name").html($.cookie('account'));
	fillInfo();
};

var updateFyszView = function(){

	var welText = $("#welcomeText").html().replace("Welcome","身份： 分教务");
	$("#welcomeText").html(welText);
	$("#account_name").html($.cookie('account'));
	// admin not have name in v1.0
	// $("#welcomeText").find("strong").html("欢迎，" + $.cookie('account'));
};

var updateYszView = function(){
	$("#ico2").remove();
	$("#ico4").remove();
	//$("#ico6").remove();
	$("#ico8").remove();
	$("#ico7").remove();
	//$("#ico3").remove(); 
	//ico3 是后台初始界面，如果remove掉，会出现错误
	$("#ico1_s").html("审核");
	$("#ico5_s").html("招生");
	//$("#ico7_s").html("成绩录入");
	

	var welText = $("#welcomeText").html().replace("Welcome","身份： 教务");
	$("#welcomeText").html(welText);
	// admin not have name in v1.0
	//$("#welcomeText").find("strong").html("欢迎，" + $.cookie('account'));
	$("#account_name").html($.cookie('account'));
};

var fillInfo = function(){
	var name = $.cookie('account');
	var token = $.cookie('access_token');
	$.post('/info',{account:name,token:token},function (data) {
		if (data.code)
		{
			$("#account_img").attr("src","img/img1.png");
		}
		else{
			// _PROFILE = _.clone(data);
			$("#account_img").attr("src","res/user/"+name+"/"+data.pic_name);
			if (!!parseInt($.cookie('CURRENT_ACCOUNT_TYPE'))){
				$("#welcomeText").find("strong").html("欢迎，" + data.name);
			}
			$("#input_name").val(data.name);
			$("#input_sex").find("option:selected").html(data.sex);
			$("#input_id").val(data.idNum);
			$("#input_birth").val(data.birth);
			$("#input_nation").val(data.nation);
			$("#input_workPlace").val(data.workPlace);
			$("#input_gra_college").val(data.gra_college);
			$("#input_gra_major").val(data.gra_major);
			$("#input_gra_time").val(data.gra_time);
			$("#input_gra_num").val(data.gra_num);
			$("#input_degree_time").val(data.degree_time);
			$("#input_degree_num").val(data.degree_num);
			$("#input_location").val(data.location);

			// _PROFILE = data; 
    }
  });
};

var originDownload = function(){
		if (is_paid){
		    window.location.href = '/res/origin/表1-1.doc';
		}
		else
		{
			alert("未成功报名,无法下载");
		}
};

var modifyDownload = function(){
	  if (isPaid()){
		   var name = $.cookie('account');
		   window.location.href = '/res/user/'+name+'/out.doc';
	  }
	  else{
	  	alert("未成功报名，无法下载");
	  }
};

var updateView = function(){
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

var verifySuccess = function(){
		var account = $("name_{NO}");
		var result = true;
		$.post('/verify', {account: account,result:result}, function (msg) {
		  if (msg === "OK"){
		  	$("#verifySuccess_{NO}").remove();
		  	$("#verifyFail_{NO}").remove();
		  	$("#verifyFunc_{NO}").html("审核已完成");
		  	$("#auditStatus_{NO}").html("通过");
	  	}
		});
}

var verifyFail = function(){
		var account = $("name_{NO}");
		var result = false;
		$.post('/verify', {account: account,result:result}, function (msg) {
		  if (msg === "OK"){
		  	$("#verifySuccess_{NO}").remove();
		  	$("#verifyFail_{NO}").remove();
		  	$("#verifyFunc_{NO}").html("审核已完成");
		  	$("#auditStatus_{NO}").html("不通过");
	  	}
		});
}

// var CheckCourseInfo = function(){
// 	if ( $("#educationStation").val().length == 0) {
// 		alert("请输入教学点名称");
// 		$("#education_station").focus();
// 		return false;
// 	}
// 	if ( $("#termInfo").val().length == 0) {
// 		alert("请输入学期信息");
// 		$("#termInfo").focus();
// 		return false;
// 	}
// 	if ( $("#courseName").val().length == 0) {
// 		alert("请输入课程名称");
// 		$("#courseName").focus();
// 		return false;
// 	}
// 	if ( $("#courseCredit").val().length == 0) { 
// 		alert("请输入学分数");
// 		$("#courseCredit").focus();
// 		return false;
// 	}
// 	if ( $("#courseTecher").val().length == 0) {
// 		alert("请输入任课老师");
// 		$("#courseTecher").focus();
// 		return false;
// 	}
// 	if ( $("#courseNature").val().length == 0) {
// 		alert("请输入课程性质");
// 		$("#courseNature").focus();
// 		return false;
// 	}
// 	if ( $("#studentName").val().length == 0) {
// 		alert("请输入学生姓名");
// 		$("#studentName").focus();
// 		return false;
// 	}	
// 	if ( $("#studentNo").val().length == 0) {
// 		alert("请输入学生学号");
// 		$("#studentNo").focus();
// 		return false;
// 	}	
// 		if ( $("#studentScore").val().length == 0) {
// 		alert("请输入学生成绩");
// 		$("#studentScore").focus();
// 		return false;
// 	}	
// };

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
};

var PayRightNow = function(){
	var account = $.cookie('account');
	var token = $.cookie('access_token');
	$.post('/pay',{account:account,token:token}, function(data) {
		if (data==='OK'){
			alert("支付成功!");
			$("#payButton").remove();
      $("#payLabel").remove();
      $("#payH1").append(payInfo);
		}
	});
  //$("#payButton").remove();
	//isPaid();
};

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

var YszEnterScoresTabStr = '<div class="text-section">'
													+	'<h1>报考资格审核</h1>'
													+	'</div>'
													+ '<div class="col-md-8">'
													+	'<article>'
													+	'<table class="table table-striped">'
													+	'<thead>'
													+	'<tr>'
													+	'<th></th>'
													+	'<th>准考证</th>'
													+	'<th>姓名</th>'
													+	'<th>身份证号</th>'
													+	'<th>基础综合</th>'
													+	'<th>专业基础</th>'
													+	'<th>综合面试</th>'
													+	'<th>总分</th>'
													+	'</tr>'
													+	'</thead>'
													+	'<tbody id="tableContainer">'
													+	'<tr>'
													+	'<td id="count_{NO}">1</td>'
													+	'<td id="name_{NO}">太史慈</td>'
													+	'<td id="id_{NO}">软件工程硕士招生考试</td>'
													+	'<td id="foundation_synthetic_{NO}"><input type="text" size="3"></td></td>'
													+	'<td id="professional_basis_{NO}"><input type="text" size="3"></td>'
													+	'<td id="overall_interview_{NO}"><input type="text" size="3"></td>'
													+	'<td id="total_interview_{NO}"><input type="text" size="3"></td>'
													+	'</tr>'
													+	'</tbody>'
													+	'</table>'
													+	'</article>'
													+	'</div>';

var SchoolRegisterManagementTabStr = '<div class="text-section">'
																	+	'<h1>学籍管理</h1>'
																	+	'</div>'
																	+ '<div class="col-md-8">'
																	+	'<article>'
																	+	'<table class="table table-striped">'
																	+	'<thead>'
																	+	'<tr>'
																	+	'<th></th>'
																	+	'<th>学号</th>'
																	+	'<th>姓名</th>'
																	+	'<th>注册状态</th>'
																	+	'<th>缴费状态</th>'
																	+	'<th>学籍状态</th>'
																	+	'</tr>'
																	+	'</thead>'
																	+	'<tbody id="tableContainer">'
																	+	'<tr>'
																	+	'<td id="count_{NO}">1</td>'
																	+	'<td id="name_{NO}">太史慈</td>'
																	+	'<td id="registration_status_{NO}">已注册</td>'
																	+	'<td id="pay_status_{NO}">已缴费</td></td>'
																	+	'<td id="status_{NO}">在读</td>'
																	+	'</tr>'
																	+	'</tbody>'
																	+	'</table>'
																	+	'</article>'
																	+	'</div>';

var info_tpl = 	'<div class="alert alert-info" align="center" id="alert">'
			+	'<strong>{alterText}</strong>'
			+	'</div>';

var payInfo = "<h1>已缴费成功！</h1>";