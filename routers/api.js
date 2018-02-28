/**
 * Created by Administrator on 2017/1/16.
 */
var express = require('express');
var viru = require('../models/viru');

var router = express.Router();
var responseData;

var http=require('http');
var url=require('url');
var qs=require('querystring');//解析参数的库

var mongodb = require('mongodb').MongoClient;


router.use(function (req, res, next) {

    responseData = {
        code: 0,
        message: ''
    }
    next();
});
router.get('/positionlist', function (req, res) {
    responseData.code = 1;
    responseData.message = 'ok';
    responseData.li = viru.city;

    res.json(responseData);
})
router.get('/index', function (req, res) {

    var arg=url.parse(req.url).query;
    var count = qs.parse(arg)['counts'];
    var start = qs.parse(arg)['start'];
    console.log("count:" + count + ", start:" + start);


    var dbUrl = "mongodb://tongda:guoxiaojiang5632@localhost:27017/tongda";
    mongodb.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tongda");
        dbo.collection("goods"). find({}).sort({"publishTime":-1}).limit(parseInt(count)).skip(parseInt(start)).toArray(function(err, result) { // 返回集合中所有数据
            if (err) throw err;
            console.log("result length:" + result.length);
            if (result.length === 0) {
                responseData.code = 2;
            } else {
                responseData.code = 1;
            }
            responseData.message = 'ok';
            responseData.data = {
                swiperImg: ['http://tdtransport.cn:8888/public/img/swiper/4.png', 'http://tdtransport.cn:8888/public/img/swiper/5.png',
                    'http://tdtransport.cn:8888/public/img/swiper/6.png', 'http://tdtransport.cn:8888/public/img/swiper/7.png'],
                goodsList: result
            };
            res.json(responseData);
            db.close();
        });
    });

})
router.get('/truncks/index', function (req, res) {
    responseData.code = 1;
    responseData.message = 'ok';
    responseData.data = {
        swiperImg: ['http://tdtransport.cn:8888/public/img/swiper/1.png', 'http://tdtransport.cn:8888/public/img/swiper/2.png', 'http://tdtransport.cn:8888/public/img/swiper/3.png'],
        trucks: viru.indexTrucks
    };
    res.json(responseData);
})
router.get('/goodsDetail', function (req, res) {
    var reqtitle = req.query.title

    responseData.data = viru.good;
    responseData.code = 1;
    responseData.message = 'ok';
    res.json(responseData);
})
router.get('/truckDetail', function (req, res) {
    responseData.data = viru.truck;
    responseData.code = 1;
    responseData.message = 'ok';
    res.json(responseData);
})

router.get('/verify', function (req, res) {
    var arg=url.parse(req.url).query;
    var phone = qs.parse(arg)['phone'];
    var code="";
    for(var i=0;i<4;i++){
        code+=Math.floor(Math.random()*10)
    }
    console.log("suiji:"+code);
    //给phone发送随机验证码
    responseData.vcode = code;
    responseData.message = 'ok';
    res.json(responseData);
})

router.post('/publish', function (req, res) {
    var body = req.body;
    console.log("publish phone is:" + body.phoneNum)
    var url = "mongodb://tongda:guoxiaojiang5632@localhost:27017/tongda";
    mongodb.connect(url, function (err, db) {
        if (err) throw err;
        console.log("db has connected");

        db.collection("goods").insertOne(body, function (err, res) {
            if (err) throw err;
            console.log("文档插入成功");
            db.close();
        });
    });
    responseData.code = 1;
    responseData.message = 'ok';
    res.json(responseData);
})


module.exports = router;