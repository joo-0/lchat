module.exports = function(app)
{
    app.get('/',function(req,res){
        res.render('index.ejs')
    });
     app.get('/about',function(req,res){
        res.render('about.html');
    });
    
}