const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const upload=require("./config/multerConfig")
const path=require('path')



const userModel = require("./models/usermodel")
const postModel = require("./models/postModel")
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')


app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")))


app.get('/register', function (req, res) {
    res.render("index")
})


app.get('/', function (req, res) {
    res.render("welcome")
})

app.post('/register', async function (req, res) {
    const { name, username, email, password, age } = req.body;

    const Alredyuser = await userModel.findOne({ email: email })

    if (Alredyuser) return res.status(500).redirect("login")


    const hash = await bcrypt.hash(password, 10)

    let user = await userModel.create({
        name,
        email,
        username,
        age,
        password: hash

    })

    const token = jwt.sign({ email: email, userid: user._id }, "abcd123")
    res.cookie("token", token)
    res.redirect('/profile')
})

// show login
app.get('/login', function (req, res) {
    res.render("login")
})


// handle login
app.post('/login', async function (req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email: email })

    if (!user) return res.status(500).send("Email or password is incorrect")

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.redirect('/login')

    const token = jwt.sign({ email: email, userid: user._id }, "abcd123")
    res.cookie("token", token)
    res.redirect("/profile")

})


app.get('/logout', function (req, res) {
    res.cookie("token", "")
    res.redirect('/login')
})

// post 
app.post('/post', isLogedin, async function (req, res) {

    const user = await userModel.findOne({ email: req.user.email })
    const { content } = req.body;
    let post = await postModel.create({
        user: user._id,
        content,

    })
    user.posts.push(post._id)
    await user.save()

    res.redirect('/profile')

})


app.get('/profile', isLogedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email })
    await user.populate("posts")
    // console.log(user)
    res.render("profile", { user })
})

app.get('/like/:postId', isLogedin, async function (req, res) {
    const postid = req.params.postId;
    const post = await postModel.findOne({ _id: postid })

    if (post.likes.indexOf(req.user.userid) == -1) {

        post.likes.push(req.user.userid)
    }

    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1)
    }

    await post.save()

    res.redirect('/profile')
    console.log(req.user)


})

app.get('/delete/:postId', async function (req, res) {
    const postid = req.params.postId;
    const post = await postModel.findOne({ _id: postid })

    const user = await userModel.findOne({ _id: post.user })

    await postModel.deleteOne({ _id: postid })

    user.posts.splice(user.posts.indexOf(postid), 1)
    await user.save()
    res.redirect('/profile')



})

app.get('/edit/:postId', isLogedin, async function (req, res) {
    const postid = req.params.postId;
    const post = await postModel.findOne({ _id: postid })
    res.render("edit", { post })
})

app.post('/update/:postId', async function (req, res) {
    const postid = req.params.postId;
    const post = await postModel.findOneAndUpdate({ _id: postid },{content:req.body.content},  { new: true })
    res.redirect('/profile')

})

app.get('/profile/update',function(req,res){

    res.render("profileUpdate")
})

app.post('/upload-profile',isLogedin,upload.single('profile'),async function(req,res){
console.log(req.file)
let user =await userModel.findOne({email:req.user.email})
user.profilePic=req.file.filename
await user.save()
res.redirect("/profile")
})


function isLogedin(req, res, next) {
    let token = req.cookies.token;
    if (!token) { return res.redirect('/login') }

    else {
        let data = jwt.verify(token, "abcd123")
        req.user = data
        next()
    }
}

app.listen(3000)