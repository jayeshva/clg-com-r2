var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const session = require('express-session');
var mongoose = require('mongoose');
var port = 3000;
var cors = require('cors');
var User = require('./models/user');
var Problem = require('./models/problem');
var Hiring = require('./models/hireme');
var Bookmark = require('./models/bookmark');
var Bugs = require('./models/bugs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');
const socketIo = require('socket.io');
var server = require('http').Server(app);

// Attach Socket.IO to the server
var io = socketIo(server);

let userCount = 0;

io.on('connection', (socket) => {

    userCount++;
    console.log('A user connected');
    console.log("sid : " ,socket.id)

    // Send the updated user count to all clients
    io.emit('userCountUpdate', userCount);

    // Listen for code changes from clients
    socket.on('codeChange', async (newCode) => {
        // console.log('changed to:', newCode);
        // Broadcast the updated code to all clients

        try{
            var {session_id, problem_id, code} = newCode;
           
            var session = await Hiring.findOne({session_uuid: session_id, problem_id: problem_id});
          
                session.code = code;
                console.log("session updated", session);
                await session.save();
        } 
        catch (error) {
            console.error('Error in code saving:', error);
            // res.status(500).json({ error: 'Error in code saving' });
        }
        socket.broadcast.emit('codeChange', code);
    });

    socket.on('changeSelect', async (selectedOptionValue) => {
        // Broadcast the selected option to all connected clients
        try{
            var {session_id, problem_id, lang} = selectedOptionValue;
            var session = await Hiring.findOne({session_uuid: session_id, problem_id: problem_id});
            session.lang = lang;
            await session.save();
        } 
        catch (error) {
            console.error('Error in lang changing:', error);
            // res.status(500).json({ error: 'Error in code saving' });
        }
      
        console.log('changed to:', selectedOptionValue.lang);
        socket.broadcast.emit('updateSelect', selectedOptionValue.lang);
    });

    socket.on('updateCursorPosition', (data) => {
        console.log("update cursor position ",data.cursor)
        const { cursor } = data;
        socket.broadcast.emit('cursorPosition', { userId: socket.id, cursor });
      });
    

    // Handle disconnection
    socket.on('disconnect', () => {
        userCount--;
    console.log('A user disconnected');
    socket.broadcast.emit('disconnected');

    // Send the updated user count to all clients
    io.emit('userCountUpdate', userCount);
    });
}); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: '*',
    })
); 
mongoose.connect('mongodb+srv://jayeshcs20:jayesh2003@cluster0.a1t4np4.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("Connected to MongoDB"); 
}); 

app.use("/codemirror", express.static(__dirname+"/codemirror"))
app.use("/public", express.static(__dirname+"/public"))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'pages'))) 
app.use("/home", express.static(__dirname)) 
app.set('view engine', 'ejs');
app.use(session({
    secret: '1234567890abcdefghijklmnopqrstuvwxyz',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Session lasts for 1 hour
}));

// Middleware to check if a user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next(); // User is logged in, proceed to the next middleware/route handler
    } else {
        res.redirect('/'); // User is not logged in, redirect to login page
    }
};


app.get('/', (req, res) => {
    if (req.session.user) {
        console.log("session is on home route moving dashboard",req.session.user);
        res.redirect('/dashboard'); // Redirect to dashboard if already logged in
    } else {
        console.log("session is on home route not logged in ",req.session.user);
        res.sendFile(__dirname + '/pages/login.html');
    }
});

app.get('/findTestcases/:id', async function(req, res){
    var problem;
    await Problem.findOne({_id: req.params.id })
    .then(problems => {
        problem = problems;
        var nonHiddenTestCases = [];
        for(var i=0;i<problem.test_cases.length;i++){
            
            if(!problem.test_cases[i].hidden){
                nonHiddenTestCases.push(problem.test_cases[i]);
            }
        }
        problem.test_cases = nonHiddenTestCases;
        res.json(problem);  
    })
    .catch(error => {
        console.error('Error getting problems:', error);
        res.status(500).json({ error: 'Error getting problems' });
    });
});

app.get('/dashboard', async function(req, res){
    // Check if the user is authenticated, e.g., by checking req.session.user
    var problem;
    const randomUuid = uuidv4();


    if (req.session.user) {
        var user =  await User.findOne({email: req.session.user.email});
        // console.log("session is ",req.session.user); 
        await Problem.find({},'_id problem_title problem_category').then(problems => {
            problem = problems;
            // console.log(user.problemsSolved.length);
       
            // console.log(problem);
            res.render('dashboard', { timestamp: Date.now() , user: user , problems: problem, uuid: randomUuid});
        })     
    } else {
        res.redirect('/login'); // Redirect to login if user is not authenticated
    }
});

app.get('/summary', async function(req, res){
    // Check if the user is authenticated, e.g., by checking req.session.user
    var problem;


   
    
    if (req.session.user) {
            var user =  await User.findOne({email: req.session.user.email});
            // console.log("session is ",req.session.user.problemsSolved);
            res.render('solvedproblems', { timestamp: Date.now(), problem: user.problemsSolved });
        
    } else {
        res.redirect('/login'); // Redirect to login if user is not authenticated
    } 
});  

app.get('/codespace',isLoggedIn,function(req, res){ 
    // res.sendFile(__dirname + '/index.html');
res.render('index');
});

app.get('/solve/:id/:uuid', async function(req, res){ 
    var problem;
    await Problem.findOne({_id: req.params.id })
    .then(async problems => {
        problem = problems;
        var nonHiddenTestCases = [];
        for(var i=0;i<problem.test_cases.length;i++){
            if(!problem.test_cases[i].hidden){
                nonHiddenTestCases.push(problem.test_cases[i]);
            }
        }
       
        problem.test_cases = nonHiddenTestCases;
        
        // console.log(problem);

        try{

            var session = req.params.uuid;
            var problem_id = req.params.id;
            var user = req.session.user;
            var code = "";
            var sess = await Hiring.findOne({session_uuid: session, problem_id: problem_id});
            if(sess){
                res.render('solveHire', {problem: problem, code: sess.code});
                // res.send(sess.code)
            }
            else{
                if(user){
                var newSession = new Hiring({
                    session_uuid: session,
                    problem_id: problem_id,
                    lang: "C",
                });
                await newSession.save();
                res.render('solveHire', {problem: problem});
            }
            else{
                res.render('404');
                // res.send("This Session is not valid");
            }
            }

        }
        catch (error){
            console.error('Error in code saving:', error);
            // res.status(500).json({ error: 'Error in code saving' });
        }
       
        
    })
    .catch(error => {
        console.error('Error getting problems:', error);
        res.status(500).json({ error: 'Error getting problems' });
    });
   
    // console.log(req.params.id);
    
});

// Assuming you have a route for loading the initial code
app.get('/initialCode/:uuid/:id', async (req, res) => {
    try {
        const session_uuid = req.params.uuid;
        const problem_id = req.params.id;

        const session = await Hiring.findOne({ session_uuid, problem_id });

        if (session) {
            res.send(session.code);
        } else {
            // Handle the case where the session does not exist (e.g., send default code)
            res.send(defaultCode); // You should define defaultCode based on your requirements
        }
    } catch (error) {
        console.error('Error loading initial code:', error);
        res.status(500).json({ error: 'Error loading initial code' });
    }
});

app.get('/initiallang/:uuid/:id', async (req, res) => {
    try {
        const session_uuid = req.params.uuid;
        const problem_id = req.params.id;

        const session = await Hiring.findOne({ session_uuid, problem_id });

        if (session) {
            res.send(session.lang);
        } else {
            // Handle the case where the session does not exist (e.g., send default code)
            res.send("choose lang"); // You should define defaultCode based on your requirements
        }
    } catch (error) {
        console.error('Error loading initial code:', error);
        res.status(500).json({ error: 'Error loading initial code' });
    }
});

 

app.get('/solve/:id', isLoggedIn, async function(req, res){ 
    var problem;
    await Problem.findOne({_id: req.params.id })
    .then(problems => {
        problem = problems;
        var nonHiddenTestCases = [];
        for(var i=0;i<problem.test_cases.length;i++){
            if(!problem.test_cases[i].hidden){
                nonHiddenTestCases.push(problem.test_cases[i]);
            }
        }
       
        problem.test_cases = nonHiddenTestCases;
        
        // console.log(problem);
        
        res.render('solve', {problem: problem, user: req.session.user});
        
    })
    .catch(error => {
        console.error('Error getting problems:', error);
        res.status(500).json({ error: 'Error getting problems' });
    });
   
    // console.log(req.params.id);
    
});


// app.get('/solve/:id/:', async function(req, res){ 
//     var problem;
//     await Problem.findOne({_id: req.params.id })
//     .then(problems => {
//         problem = problems;
//         var nonHiddenTestCases = [];
//         for(var i=0;i<problem.test_cases.length;i++){
//             if(!problem.test_cases[i].hidden){
//                 nonHiddenTestCases.push(problem.test_cases[i]);
//             }
//         }
       
//         problem.test_cases = nonHiddenTestCases;
        
//         // console.log(problem);
//         res.render('solve', {problem: problem, user: req.session.user});
        
//     })
//     .catch(error => {
//         console.error('Error getting problems:', error);
//         res.status(500).json({ error: 'Error getting problems' });
//     });
   
//     // console.log(req.params.id);
    
// });

app.get('/viewBookmarks', isLoggedIn, async function(req, res) {
    var problem;
    var bookmarkedProblems = [];
    var books = await Bookmark.find({ user_id: req.session.user.email });
    console.log("Bookmarks : ", books);
    try {
        // Use a for...of loop instead of forEach to handle asynchronous operations properly
        for (const book of books) {
            console.log("Book : ", book);
            var problem = await Problem.find({ _id: book.problem_id });
            //send only problem title and problem id and problem category
            var bookpro = {
                problem_id: problem[0]._id,
                problem_title: problem[0].problem_title,
                problem_category: problem[0].problem_category
            }
            console.log("Problem : ", bookpro);
            bookmarkedProblems.push(bookpro);
        }

        console.log("Bookmarked Problems : ", bookmarkedProblems);
        res.render('bookmarks', { timestamp: Date.now(), problem: bookmarkedProblems });
    } catch (error) {
        console.error('Error getting problems:', error);
        // Render an error page in case of an error
        res.status(500).render('error', { message: 'Error getting problems' });
    }
});

app.get('/findBookmarks/:userid/:problemid', async function(req, res){
    const problem_id = req.params.problemid;
     const user_id = req.params.userid;
    // console.log("problem id : ", problem_id);
    // console.log("user id : ", user_id);
    const existingBookmark = await Bookmark.findOne({ problem_id, user_id });
    if (existingBookmark) {
        // console.log("Bookmark exists", existingBookmark);
        return res.json({ out: '1' });
    }
    else{
        return res.json({ out: '0' });
    }
})

app.get('/findBugs/:userid/:problemid', async function(req, res){
    const problem_id = req.params.problemid;
     const user_id = req.params.userid;
    // console.log("problem id : ", problem_id);
    // console.log("user id : ", user_id);
    const existingBug = await Bugs.findOne({ problem_id, user_id });
    if (existingBug) {
        // console.log("Bookmark exists", existingBookmark);
        return res.json({ out: '1' });
    }
    else{
        return res.json({ out: '0' });
    } 
})


app.post('/bugs', async function(req, res){
    const { problem_id, user_id,bugs } = req.body;
    const existingBug = await Bugs.findOne({ problem_id, user_id });
    if (existingBug) {
        return res.status(409).json({ error: 'Bug already exists' });
    }
    else{
        const newBug = new Bugs({
            problem_id,
            user_id,
            bugs
        });

        await newBug.save()
            .then(savedBug => {
                console.log('Bug saved:', savedBug);
                res.status(201).json({ message: 'Bug Reported successfully' });
            }
            )
            .catch(error => {
                console.error('Error saving bug:', error);
                res.status(500).json({ error: 'Error saving bug' });
            });
    }


})

app.get('/viewBugs', async function(req, res) {
    var buggedProblems = [];
    var temp = await Bugs.find();
    try {
        // Use a for...of loop instead of forEach to handle asynchronous operations properly
        for (const bug of temp) {
            // console.log("Bug : ", bug);
            var problem = await Problem.find({ _id: bug.problem_id });
            //send only problem title and problem id and problem category
            var temp = await Bugs.findOne({problem_id :bug.problem_id})
            console.log("temp ", temp)
            var bugpro = {
                problem_id: problem[0]._id,
                problem_title: problem[0].problem_title,
                problem_category: problem[0].problem_category,
                bugs: temp.bugs

            }
            console.log("Problem : ", bugpro);
            buggedProblems.push(bugpro);
        }

        console.log("Bugged Problems : ", buggedProblems);
        res.render('reportedbugs', { timestamp: Date.now(), bugs: buggedProblems });
    } catch (error) {
        console.error('Error getting problems:', error);
        // Render an error page in case of an error
        res.status(500).render('error', { message: 'Error getting problems' });
    }

    // console.log("Bugs : ", temp);
    // res.render('reportedbugs', { timestamp: Date.now(), bugs: temp });
})

app.get('/deleteBug/:problemid', async (req, res) => {
    const  problem_id  = req.params.problemid;
    console.log("problem id : ", problem_id);
    await Bugs.deleteMany({ problem_id })
    .then(() => {
        res.redirect('/viewBugs');
    }
    )
    .catch(error => {
        console.error('Error deleting bug:', error);
        res.status(500).json({ error: 'Error deleting bug' });
    }
    );                                                                                                              
})


app.post('/bookmark', async function(req, res){
    const { problem_id, user_id } = req.body;
    const existingBookmark = await Bookmark.findOne({ problem_id, user_id });
    if (existingBookmark) {
        return res.status(409).json({ error: 'Bookmark already exists' });
    }
    else{
        const newBookmark = new Bookmark({
            problem_id,
            user_id
        });
    
        await newBookmark.save()
            .then(savedBookmark => {
                // console.log('Bookmark saved:', savedBookmark);
                res.status(201).json({ message: 'Bookmark saved successfully' });
            })
            .catch(error => {
                console.error('Error saving bookmark:', error);
                res.status(500).json({ error: 'Error saving bookmark' });
            });
    }

});

app.delete('/bookmark', async function(req, res){
    const { problem_id, user_id } = req.body;
    await Bookmark.deleteOne({ problem_id, user_id })

        .then(() => {
            res.json({ message: 'Bookmark deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting bookmark:', error);
            res.status(500).json({ error: 'Error deleting bookmark' });
        });
});

app.get('/signup', function(req, res){
    res.sendFile(__dirname + '/pages/signup.html');
});
app.get('/login',isLoggedIn, function(req, res){
    if (req.session.user) {
        return res.render('dashboard', { timestamp: Date.now() , user: req.session.user });
    }
    res.sendFile(__dirname + '/pages/login.html');
});

app.get('/addproblem',isLoggedIn, function(req, res){

    res.sendFile(__dirname + '/pages/problemSetter.html');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            console.log('Invalid credentials');
            return res.status(401).send('Invalid credentials');
        } 

        req.session.user = user; // Store user info in session
        res.redirect('/dashboard', { user: req.session.user }, { timestamp: Date.now() });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/signup', async (req, res) => {

    const { name, email, password, mobile } = req.body;

    const newUser = new User({
        name,
        email,
        password,
        mobile
    });

    await newUser.save()
        .then(savedUser => {
            console.log('User saved:', savedUser);
            // Redirect or send a response to the client
            res.redirect('/login'); // Example
        })
        .catch(error => {
            console.error('Error saving user:', error);
            // Handle the error and send a response to the client
            res.status(500).send('Error saving user'); // Example
        });
}); 

app.post('/addproblem', (req, res) => {
    const {problem_id, problem_category, problem_title, problem_description, test_cases } = req.body;

    const newProblem = new Problem({
        problem_id,
        problem_category,
        problem_title,
        problem_description,
        test_cases
    });

    newProblem.save()
        .then(savedProblem => {
            console.log('Problem added:', savedProblem);
            res.status(201).json({ message: 'Problem added successfully' });
        })
        .catch(error => {
            console.error('Error adding problem:', error);
            res.status(500).json({ error: 'Error adding problem' });
        });
});

app.post('/deleteProblem', async (req, res) => {
    await Problem.deleteOne({ problem_id: req.body.problem_id })
        .then(() => {
            res.status(200).json({ message: 'Problem deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting problem:', error);
            res.status(500).json({ error: 'Error deleting problem' });
        });
});

app.get('/getProblems',isLoggedIn, async (req, res) => {
    await Problem.find()
        .then(problems => {
            res.json(problems);
            console.log(problems);
        })
        .catch(error => {
            console.error('Error getting problems:', error);
            res.status(500).json({ error: 'Error getting problems' });
        });
});

app.get('/getProblems/:id',isLoggedIn, async (req, res) => {
    await Problem.findOne({_id: req.params.id })
        .then(problems => {
            res.json(problems);
            console.log(problems);
        }) 
        .catch(error => {
            console.error('Error getting problems:', error);
            res.status(500).json({ error: 'Error getting problems' });
        });
});

app.post('/addTestCase', async (req, res) => {
    const { problem_id, testCase } = req.body;

    try {
        const problem = await Problem.findOne({ problem_id });

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        problem.test_cases.push(testCase);

        await problem.save();

        res.status(201).json({ message: 'Additional test case added successfully' });
    } catch (error) {
        console.error('Error adding additional test case:', error);
        res.status(500).json({ error: 'Error adding additional test case' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('*', function(req, res){
    res.render('404');
});
 
server.listen(port, function() {
    console.log('Server is running on port ' + port);
});