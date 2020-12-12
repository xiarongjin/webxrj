var express = require('express')
var data = require('../data/data')
var router = express.Router();
var parseUrl = require('url');
const { url } = require('inspector')
var querystring = require('querystring')
var mysql = require('mysql');
const { callbackify } = require('util');

var bcrypt = require('bcryptjs');
async function getPass(userPassword) {
  var salt = await bcrypt.genSalt(10);
  var pass = await bcrypt.hash(userPassword, salt);
  return pass;
}
async function comp(password, pass) {
  var res = await bcrypt.compare(password, pass)
  // console.log(res)
  return res;
}
// comp('123456', '$2b$10$gZ3dutlE5aVpWDQpxQec4.pYpSXeUubZ/NXf4fTD7m0TRPd63sQjK').then(res => {
//   console.log(res)
// })
// comp("123456","$2b$2b$10$gZ3dutlE5aVpWDQpxQec4.pYpSXeUubZ/NXf4fTD7m0TRPd63sQjK").then(abc=>{
//     console.log(abc)
// })
var connection = mysql.createConnection({
  host: '101.200.189.33',
  user: "myWeb",
  password: '1web@XRJ',
  database: 'myweb'
});
function connectMysql(sql, callback) {

  connection.query(sql, function (error, data, fields) {
    if (error) {
     console.log(error);
    }
    callback(data);
  });

}

// router.get('/vue',function(req,res){
//     req.querystring
//     res.send({
//     msg: 'hello express!我是post请求的返回值,下面是你请求发送给我的数据'

//   })
    
// })
router.get('/vue',function (req,res) {
 let ranNum = Math.round(Math.random()*10);
 console.log({data:ranNum})
 //返回随机数
  res.send({data:ranNum})
  // console.log(req.url)

})



router.get("/", function (req, res) {
res.redirect("/html/index.html")
})


router.post('/', function (req, res) {
  console.log(req.body)
  // 接受参数
  var name = req.body.name;
  var age = req.body.age;
  res.send({
    msg: 'hello express!我是post请求的返回值,下面是你请求发送给我的数据',
    name: name,
    age: age
  })
})
router.put('/', function (req, res) {
  res.send('hello express!我是put请求的返回值')
})
router.delete('/user', function (req, res) {
  res.send('hello express!我是delete请求的返回值')
})
router.patch('/', function (req, res) {
  res.send(data)
})


// 注册接口
router.post('/register', function (req, res) {
    console.log(req.body);
    var user = req.body;
    console.log(user.password);
    getPass(`${user.password}`).then(res => {
      return res; // console.log(user.password)
    }).then(res => {
      console.log(res);
      connection = mysql.createConnection(connection.config);
      connection.connect();
      var sql = `INSERT INTO t_user(username,password,telnum) VALUES ('${user.name}','${res}','${user.telnum}')`;
      console.log(sql);
      connectMysql(sql, function (err, data) {
        //   console.log(data)
      });

      connection.end();
    }).catch(err => { throw err; });
    res.send({
      msg: '注册成功',
      code: 1
      // name:req.body.name
    });
  })


//登录接口
router.post('/index', function (req, res) {
  connection = mysql.createConnection(connection.config);
  connection.connect();
  var getData = req.body;
  // console.log(getData)
  var getName = getData.username;
  var getPass = getData.password;
  // console.log(getName,getPass)
  var sql = `SELECT* from t_user  where username='${getName}'`;

  connectMysql(sql, function (data) {

    console.log(data)
    if (data =='' || data == undefined) {
      res.send({
        // msg:'登录失败，用户名或密码错误',
        code: 0
      });
      console.log('用户不存在！')
    } else {
      var username = data[0].username;
      var password = data[0].password;
      console.log(password)
      console.log(getPass)
      comp(getPass, password).then(abc => {
        console.log(abc)
        if (abc) {
          res.send({
            // msg:`${username}登录成功`,
            username: username,
            code: 1
          })
          console.log('成功')
        } else {
          res.send({
            // msg:'登录失败，用户名或密码错误',
            code: 2
          })
          console.log('密码错误')
        }
      }).catch(err=> {throw err})

    }





    // if (username==req.body.username&pass) {
    // res.send('成功')
    // }
  })
  connection.end();

})
module.exports = router