// APP CONFIG

var bodyParser      = require("body-parser"), 
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    
mongoose.connect('mongodb://localhost/restful_blog_app', {useMongoClient: true});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));


//MONGOOSE MODEL CONFIG

var blogSchema = new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

    // title
    // image
    // body
    // created
    
// Blog.create({
//     title: 'Test Blog',
//     image: 'https://cdn.pixabay.com/photo/2017/11/03/20/11/fire-2915539__340.jpg',
//     body: 'We had a great weekend program in Kisoroszi, Hungary, we went there to enjoy the fresh air next to the bonfire.'
// });
    
    
 //RESTFUL ROUTES  
 
 //INDEX ROUTE
 
 app.get('/', function(req, res) {
     res.redirect('/blogs');
 });
 
 app.get('/blogs', function(req, res){
     Blog.find({}, function(err, result) {
         if(err) {
             console.log(err);
         } else {
            res.render('index',{blogs: result}); 
         }
     });
 });
 
 //NEW ROUTE
 app.get('/blogs/new', function(req,res) {
     res.render('new');
 });
 
 //CREATE ROUTE
 app.post('/blogs/', function(req, res) {
     
     req.body.blog.body = req.sanitize(req.body.blog.body)
      Blog.create(req.body.blog, function(err,newBlog) {
          if(err) {
              console.log(err);
              res.render('new');
          } else {
              res.redirect('/blogs/');
          }
          
      });
 });
    
//SHOW ROUTE

app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err){
            res. redirect('/blogs');
        } else {
           res.render('show', {blog: foundBlog}); 
        }
    });
    
   // res.render('show', {blog: blog});
});

//EDIT ROUTE

app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});


//UPDATE ROUTE

app.put('/blogs/:id', function (req, res) {
   // Blog.findByIdAndUpdate(id, newData, callback) 
   
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
       if(err) {
           res.redirect('/blogs');
       } else {
           res.redirect('/blogs/' + req.params.id);
       }
   });
});


//DELETE ROUTE
app.delete('/blogs/:id/', function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog) {
        if(err) {
            res.send(err);
        } else {
            res.redirect('/blogs');
        }
    });
    
});
    
    
    
    
    
    
    
    
    
    
    
    
    app.listen(process.env.PORT, process.env.IP, function() {
        console.log('Server has started.');
    })