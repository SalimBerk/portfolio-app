const express=require('express');
const { path } = require('express/lib/application');
const res = require('express/lib/response');
const mongoose=require('mongoose')
const multer  = require('multer')
const methodOverride = require('method-override');

const User=require('./models/User');
const { use } = require('express/lib/router');

const app=express();
mongoose.connect('mongodb+srv://Sberk:Ssberk123@cluster0.hygby.mongodb.net/portfolio-db?retryWrites=true&w=majority').then(()=>{
    console.log('DB connected succesfully')
}).catch((err)=>{
    console.log(err)
});


app.set('view engine','ejs')
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))




app.get('/', async (req,res)=>{
   
    const users= await User.find({})
    res.status(200).render('index',{
        users
    })
    
})

app.get('/add', async (req,res)=>{
    res.status(200).render('addportfolio')
    
})



app.get('/users/delete/:id',async(req,res)=>{
    await User.findByIdAndDelete(req.params.id)
    res.redirect('/')
})
app.get('/users/edit/:id',async(req,res)=>{
   const users=await User.findById(req.params.id)
    res.status(200).render('edit',{
        users,
    })

})


const filestorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})


const upload=multer({storage:filestorage})


app.post('/users',upload.single('profile-file'),async (req,res)=>{
    let uploadedImage=req.file
    await User.create({
        ...req.body,
        image:'/uploads/'+uploadedImage.originalname
    })
    res.redirect('/')

})
app.put('/users/:id',async(req,res)=>{
    try{
    const user=await User.findOne({_id:req.params.id});
    user.name=req.body.name
    user.description=req.body.description
    user.save();  
    res.redirect('/')
    }
    catch(err){
        console.log(err)

    }


})





const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`App started on ${port} da çalıştı`)
})