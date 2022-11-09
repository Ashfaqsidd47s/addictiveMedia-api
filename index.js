import express from "express";
import mysql from "mysql";
import cors from "cors";
import moment from "moment";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use("/files", express.static(path.join(__dirname,"/files")));

// mysql -hcontainers-us-west-120.railway.app -uroot -pjdMrvhj2auEIxG0JsJPF --port 6746 --protocol=TCP railway
//connection to mysql 
const db = mysql.createConnection({
    host:"sql12.freesqldatabase.com",
    user:"sql12555414",
    password:"szUzTN8L1G",
    database:"sql12555414"
});

//storage setup for files
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"files");
    },filename:(req,file,cb)=>{
        cb(null,req.body.name);
    },
});

const upload = multer({storage:storage});
app.post("/users/upload", upload.single("file"),(req,res)=>{
    res.status(200).json("File has been uploaded successfully ....");
});

//home route
app.get("/", (req,res)=>{
    res.json(" hello this is backend..");
});

//getting all the users without any sorting
app.get("/users", (req,res)=>{
    const q = "SELECT * FROM users";
    db.query(q, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

//route for getting alphabetical sorted list from sql
app.get("/users/sortalpha", (req,res)=>{
    const q = "SELECT * FROM users ORDER BY name ASC";
    db.query(q, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

//getting users sorted by submittion date latest submittion at top
app.get("/users/sortdatedesc", (req,res)=>{
    const q = "SELECT * FROM users ORDER BY createdat DESC";
    db.query(q, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

//getting users sorted by submittion date oldest submittion at top
app.get("/users/sortdateasc", (req,res)=>{
    const q = "SELECT * FROM users ORDER BY createdat ASC";
    db.query(q, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

// post rout for inserting new user details into table
app.post("/users", (req,res)=>{
    const q = "INSERT INTO users (`name`,`dob`,`country`,`resume`,`createdat`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.dob,
        req.body.country,
        req.body.resume,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) =>{
        if(err) return res.json(err);
        return res.json("user data uploaded successfully..");
    })
});


//delete route to delete user data 
app.delete("/users/:id", (req,res)=>{
    const userId = req.params.id;
    const q = "DELETE FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) =>{
        if(err) return res.json(err);
        return res.json("user has been deleted successfully..");
    })
});


// listen code 
app.listen(8800, ()=>{
    console.log("server started at port 8800..");
});