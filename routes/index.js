const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Image = require('../models/Image')
const imageModel = require('../models/imageModel')
const cloud = require('./cloudinaryConfig')
const fs = require('fs')

 
router.get('/',(req,res)=>{
    res.render('index')
})

router.get('/images',async (req,res)=>{
  const images = await imageModel.find().lean()
  res.render('images',{
    images : images
  })
})

router.post('/upload',(req,res) => {
  try{
    // Check if same name exist in DB
    imageModel.find({imageName: req.body.imageName}, (err,images) => {
      if(err) { 
          res.render('index',{
            msg : err
          })
      } else if(images.length == 1) {
          res.render('index',{
            msg: "File already exist"
          })
      } else {
          // IF ALL THING GO WELL, POST THE IMAGE TO CLOUDINARY
          cloud.uploads(req.file.path).then((result) => {
              var imageDetails = {
                imageName: req.body.imageName,
                cloudImage: result.url,
                imageId: result.id
              }
              //THEN CREATE THE FILE IN THE DATABASE
              imageModel.create(imageDetails, (err, created)=> {
                  if(err){
                    res.render('index',{
                      msg : err
                    })
                  } 
                  else {
                    res.render('index',{
                      msg: 'image uploaded successfully',
                      file : created.cloudImage
                    })
                    // remove image from server after store it in DB
                    fs.unlinkSync(req.file.path)
                  }
              })
          })
      }
    });
  } 
  catch(execptions){
      console.log(execptions)
  }
})

module.exports = router
            
            

// router.get('/images',async (req,res)=>{
//   const images = await Image.find().lean()
//   res.render('images',{
//       images: images
//   })

// })
// router.post('/upload',(req,res)=>{
//   // console.log(req.file);
    
//   if(req.file == undefined){
//     res.render('index', {
//       msg: 'Error: No File Selected!'
//     });
//       } else {
//         const image = new Image({url:`images/${req.file.filename}`})
//         image.save()
//         res.render('index', {
//           msg: 'File Uploaded!',
//           file: `images/${req.file.filename}`
//         });
//       }
//     })
    
    