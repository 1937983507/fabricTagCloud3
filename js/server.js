// let express = require("express");

// //创建服务器
// let app = express();

// //1.引入body-parser模块
// var bp = require('body-parser');
// //2.配置body-parser,让所有的post请求都支持body-parser模块,那么所有的req对象就会多一个body属性,里面存储了post请求过来的数据     如何让所有的路由都支持body-parser模块?--使用中间件实现
// app.use(bp.urlencoded({ extended: false }));

// app.get("/test", function (req, res) {
//     // 读取用户所传输的数据
//     var email_input = req.query.email_input;
//     var issue_type = req.query.issue_type;
//     var issue_title = req.query.issue_title;
//     var issue_description = req.query.issue_description;
//     var error_message = req.query.error_message;
//     var imageData = req.query.imageData;

//     // 将之输出
//     console.log("email_input：", email_input);
//     console.log("issue_type", issue_type);
//     console.log("issue_title", issue_title);
//     console.log("issue_description", issue_description);
//     console.log("error_message", error_message);
//     console.log("imageData", imageData);


//     // 返回数据
//     res.json([{name: "a"}]);
// });

// //监听端口
// app.listen(3333, 'localhost', () => {
//     console.log('Server running on http://localhost:3333/..');
// });






const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3333;


// 连接数据库
let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'tagcloud'
});
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});


// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 解析 application/x-www-form-urlencoded 格式的数据
app.use(bodyParser.urlencoded({ extended: false }));

// 解析 application/json 格式的数据
app.use(bodyParser.json());

// 使用 multer 中间件处理文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // 生成一个随机文件名，包含字母和数字，长度为 8
        const randomFilename = generateRandomFilename(8);
        // 获取文件扩展名
        const ext = path.extname(file.originalname);
        // 生成新的文件名
        cb(null, randomFilename + ext);
    }
});

// 生成随机文件名
function generateRandomFilename(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomFilename = '';
    for (let i = 0; i < length; i++) {
        randomFilename += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomFilename;
}


const upload = multer({ storage: storage });

// 处理表单提交的数据
app.post('/test', upload.single('file_upload'), (req, res) => {
    console.log('Received data:', req.body);
    var email_input = req.body.email_input;
    var issue_type = req.body.issue_type;
    var issue_title = req.body.issue_title;
    var issue_description = req.body.issue_description;
    var error_message = req.body.error_message;

    console.log(email_input);
    console.log(issue_type);
    console.log(issue_title);
    console.log(issue_description);
    console.log(error_message);

    // 如果上传了文件，可以在 req.file 中获取文件信息
    if (req.file) {
        // console.log('Received file:', req.file);
        filePath = req.file.path;
        console.log(filePath);
    }

    // 插入数据到数据库
    const sql = `INSERT INTO feedback (email, issueType, issueTitle, description, errorMessage, filePath) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [email_input, issue_type, issue_title, issue_description, error_message, filePath], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL: ' + err.stack);
            res.status(500).send('Error submitting feedback');
            return;
        }
        console.log('INSERT data successfully');
        // res.status(200).send('Feedback submitted successfully');
    });

    // 假设这里返回一个成功的响应
    // res.send('Data received successfully!');
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});





