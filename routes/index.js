
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.monitor = function(req, res){
  res.render('monitor', { title: 'Monitor Connect' });
};
exports.list = function(req, res){
  res.render('list', { title: 'List Client Connect' });
};
