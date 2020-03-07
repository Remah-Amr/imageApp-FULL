const express = require('express')
const app = express()
const expressHbs = require('express-handlebars')
const mongoose = require('mongoose')
const multer = require('multer');
const path = require('path')
const handlebars = require('handlebars');
const indexRouter = require('./routes/index')

const fileStorage = multer.diskStorage({ // to pass to multer middleware to determine distination and filename 
    destination: 'images',
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname); // if you log imageurl you see fields like originalname and filename , mimetype , encoding from file object
    }
  });

  const fileFilter = (req, file, cb) => { // pass to multer to determine any type i save
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true); // save if type of image one of these
    } else {
      cb(null, false); // not save if else
    }
  };

app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname: 'hbs'})); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine','hbs'); 
app.set('views','views'); 

app.use(multer({storage: fileStorage,fileFilter: fileFilter}).single('myImage')); // name of field in hbs

app.use(express.static('./public'));
app.use('/images',express.static('images'))

app.use(indexRouter)

mongoose.connect("mongodb://remah amr:remah654312@ds159856.mlab.com:59856/learning",
{ useNewUrlParser: true , useUnifiedTopology: true  }).then(()=>{ console.log('mongodb connected!');})


app.listen(4000,()=>{
    console.log('server started successfully ! ')
})

