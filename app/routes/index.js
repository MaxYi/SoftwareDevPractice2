
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: '<h1>Express</h1>' });
};