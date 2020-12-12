var express =require("express")
var router=require('./route/index')
// console.log(express)
var app=express();
var bodyParser = require('body-parser')
var static1 = express.static('static');

app.use(bodyParser.urlencoded({
    extended:true
}))

app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

app.use(static1)
app.use(router)


app.listen(3000,function () { 
     console.log('服务器已启动')
})