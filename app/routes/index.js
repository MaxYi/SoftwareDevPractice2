
/*
 * GET home page.
 */

exports.index = function(req, res){
  //var account=$("#")
  res.render('index', { title: '工程硕士网上报名信息系统' });
};