var signUp = function () {
	$.post('/users',function (res) {
		alert("this is a signUp");
		console.log(res);
	});
	console.log(123);
};