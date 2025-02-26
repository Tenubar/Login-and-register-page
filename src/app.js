import express from 'express';
import { Router } from 'express';
import { dbconnect } from './config.js';
import { modelUsers } from './modelUsers.js';
import bodyParser from 'body-parser';
import path from 'path';
const app = express();
const router = Router();
const PORT = 8000;
dbconnect();

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(path.resolve(), 'public')));



app.use(router);

router.post('/register', async(req, res)=>{
    const {username, password} = req.body;
    const user = new modelUsers({username, password});
    try {
        await user.save();
        res.send(`
        <div class = "button" style = "font-size:14px;padding:12px;"><a href = "index.html"> ← Go Back </a></div>
        <h1 style = "color: green; font-size: 18px; padding:8px;">Registration Successful!</h1>
        `);
    } catch (error) {
        res.send('Error at registration');
    }
});


router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    try{
    const user = await modelUsers.findOne({username});
        if(!user){
            return res.status(401).header('error').send(`User not registered <div class = "button" style = "font-size:14px;padding:12px;"><a href = "index.html"> ← Go Back </a></div>`);
        }else{
        await user.isCorrectPassword(password,(err, result)=>{
            if(err){
                res.send('error al autenticar');
            }else if (result) {
            res.status(200).header('authorization').render('home', { username: user.username});

            }else{
                res.status(500).send('usuario y/o contraseña incorrecta');
            }
        });
        }
        }catch{
            res.status(500).send('Internal server error please try again');
    }
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});