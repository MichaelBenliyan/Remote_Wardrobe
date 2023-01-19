const express = require("express");
const cookieParser = require('cookie-parser');
let formidable = require('express-formidable');
const fs = require('fs-extra');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

const loginRouter = require(path.join(__dirname, './routes/login.js'));
const signupRouter = require(path.join(__dirname, './routes/signup.js'));
const sessionController = require("./controllers/sessionController");
const cookieController = require("./controllers/cookieController");
const wardrobeRouter = require(path.join(__dirname, './routes/wardrobe.js'));
const wardrobeController = require(path.join(__dirname, './controllers/wardrobeController.js'));
const Wardrobe = require(path.join(__dirname, './models/wardrobeModel.js'));
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// let imageFolderNumber = 1;
// app.use(formidable({
//   multiples: false,
//   encoding: 'utf-8',
//   allowEmptyFiles: false,
//   uploadDir: __dirname + "/../src/assets/uploads/" + imageFolderNumber,
//   keepFilenames: true,
//   keepExtensions: true// req.files to be arrays of files
// }));

//DELETE UPLOADS
// let startUp = true;
// if(startUp) {
//   fs.remove(path.join(__dirname, '../src/assets/uploads'), (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(`Successfully deleted src/uploads/`);
//         startUp = false;
//         fs.mkdir(path.join(__dirname, "../src/assets/uploads"), (err) => {
//           if (err) return console.log(err);
//           else {
//             console.log('created /uploads')
//           }
//         })
//     }
//   });
//   Wardrobe.remove({}, function (err, result) {
//     if (err){
//         console.log(err)
//     }else{
//         console.log("Result :", result) 
//     }
// });
// }


//MONGOOSE
const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://username:random@cluster0.ewu3xwh.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  dbName: 'wardrobeDB'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

//STATIC ASSETS
app.use('/src/assets', express.static(path.join(__dirname, '../src/assets')))
app.use('/src/assets/defaults/jacket', express.static(path.join(__dirname, '../src/assets/defaults/jacket')))
//LANDING PAGE
app.get('/', (req, res) => {
    res.redirect('/login')
})

//LOGIN PAGE
app.use('/login',
  formidable({
    multiples: false,
    encoding: 'utf-8',
    allowEmptyFiles: false,
    uploadDir: path.join(__dirname, "../src/assets/uploads/"),
    keepFilenames: true,
    keepExtensions: true// req.files to be arrays of files
  }),
  loginRouter
);

//SIGNUP PAGE 
app.use('/signup',
  formidable({
    multiples: false,
    encoding: 'utf-8',
    allowEmptyFiles: false,
    uploadDir: path.join(__dirname, "../src/assets/uploads/"),
    keepFilenames: true,
    keepExtensions: true// req.files to be arrays of files
  }),
  signupRouter
);

//LOGOUT
app.get('/login/logout',
  (req, res) => {
    res.clearCookie('ssid')
    res.redirect('../login')
  } 
);

//WARDROBE PAGE
app.get('/wardrobe', 
  sessionController.isLoggedIn, 
  (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/wardrobe.html'));
  }
);

app.post('/wardrobe', 
  formidable({
    multiples: false,
    encoding: 'utf-8',
    allowEmptyFiles: false,
    uploadDir: path.join(__dirname, "../src/assets/uploads/"),
    keepFilenames: true,
    keepExtensions: true// req.files to be arrays of files
  }),
  wardrobeController.createClothing, 
  (req, res, next) => {
    const images = fs.readdirSync(path.join(__dirname, "../src/assets/uploads/"));
    for (let i = 0; i < images.length; i++) {
      if (images[i][0] === 'u') {
        let j = 0;
        while (j < images[i].length) {
          if (images[i][j] != '.') j++;
          else break;
        }
        console.log('_id: ', res.locals.fileName)
        let imageFileName = res.locals.fileName + images[i].slice(j);
        Wardrobe.findOneAndUpdate({_id: res.locals.fileName }, {path: imageFileName}, null, function (err, docs) {
          if (err){
              console.log('Did not find clothes' + err)
          }
          else{
              console.log("succesfully added path");
              fs.rename(path.join(__dirname, "../src/assets/uploads/" + images[i]), path.join(__dirname, "../src/assets/uploads/" + imageFileName))
              .then (() => next())
              .catch((err) => {
                return next({
                  log: 'post to /wardrobe: failed to rename',
                  message: {err: 'post to /wardrobe: failed to rename'}
                })
          });
          };
        })
        
      };
    }
  },
        

    //         break
    //       }
    //     // Wardrobe.findOneAndUpdate({_id: res.locals.fileName }, {path: imageFileName}, null, function (err, docs) {
    //     //   if (err){
    //     //       console.log('Did not find clothes' + err)
    //     //   }
    //     //   else{
    //     //       console.log("succesfully added path");
    //     //   };
          
    // }
    // return next()
  (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../src/pages/wardrobe.html'));
  } 
);

let typeArray = [
  [], // 0 => Head Wear
  [], // 1 => Jacket
  [], // 2 => Top
  [], // 3 => Bottom
  []  // 4 => Shoes
];
let typeCurrentIdxArray = [0, 0, 0, 0, 0]
const typeMatch = {
  'headWear': 0, 
  'jacket': 1, 
  'top': 2, 
  'bottom': 3, 
  'shoes': 4
};
app.post('/wardrobe/getImages',
  wardrobeController.getImages, 
  (req, res) => {
    if (res.locals.imgPaths.length > 0) {
      console.log('imgPaths: ', res.locals.imgPaths)
      typeArray[typeMatch[req.body.type]] = res.locals.imgPaths;
      res.status(200).send(JSON.stringify({imageNum: 0, imgPath: 'src/assets/uploads/' + res.locals.imgPaths[0] + '.png'}));
    }
    else {
      const imgFolder = path.join(__dirname, '../src/assets/defaults/' + req.body.type);
      res.status(200).send(JSON.stringify({imageNum: 0, imgPath: `src/assets/defaults/${req.body.type}/` + fs.readdirSync(imgFolder)[0]}))
    }
  }
);
app.post('/wardrobe/getNextImage', (req, res) => {
  // req.body = type num
  const typeIdx = typeMatch[req.body.type]
  typeCurrentIdxArray[typeIdx] += 1;
  const newNum = typeCurrentIdxArray[typeIdx]
  const newPath = typeArray[typeIdx][typeCurrentIdxArray[typeIdx]]
  if (newPath !== undefined) {
    res.status(200).send(JSON.stringify({imageNum: newNum, imgPath: 'src/assets/uploads/' + newPath + '.png'}))
  }
  else { 
    typeCurrentIdxArray[typeIdx] -= 1;
    res.status(404).send('file not found');
  }
});
app.post('/wardrobe/getPrevImage', (req, res) => {
  // req.body = type num
  const typeIdx = typeMatch[req.body.type]
  typeCurrentIdxArray[typeIdx] -= 1;
  const newNum = typeCurrentIdxArray[typeIdx]
  const newPath = typeArray[typeIdx][typeCurrentIdxArray[typeIdx]]
  if (newNum >= 0 && newPath !== undefined) {
    res.status(200).send(JSON.stringify({imageNum: newNum, imgPath: 'src/assets/uploads/' + newPath + '.png'}))
  }
  else { 
    typeCurrentIdxArray[typeIdx] += 1;
    res.status(404).send('file not found');
  }
});

//WARDROBE SCRIPT & CSS
app.get('/scripts/wardrobe.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/scripts/wardrobe.js'))
})
app.get('/stylesheets/wardrobe.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/stylesheets/wardrobe.css'))
})

//OUTFIT PAGE
app.get('/outfit', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/outfit.html'));
})



//GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    if (err.type === 'redirect') {
      res.redirect(err.url)
    } else if (err.type === 'sendToLogin') {
        res.sendFile(path.join(__dirname, '../src/pages/login.html'));
    }
    else {
      res.status(500).send({ error: err });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});