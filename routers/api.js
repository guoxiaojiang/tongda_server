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
var ObjectId = require('mongodb').ObjectID;  

var QcloudSms = require("../qcloudsms_js");
var appid = 1400070292;
var appkey = "d749d35ca6d1964d99827e0bc871c4d2";
var templId = 91711;
var qcloudsms = QcloudSms(appid, appkey);

var bodyParser =require('body-parser');

exports.__esModule = true;
var multer = require("multer");


router.use(function (req, res, next) {

    responseData = {
        code: 0,
        message: ''
    }
    next();
});
router.use(bodyParser.json)
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
                swiperImg: ['http://211.159.175.56:8888/public/img/swiper/4.png', 'http://211.159.175.56:8888/public/img/swiper/5.png',
                    'http://211.159.175.56:8888/public/img/swiper/6.png', 'http://211.159.175.56:8888/public/img/swiper/7.png'],
                goodsList: result
            };
            res.json(responseData);
            db.close();
        });
    });

})

router.get('/detail', function (req, res) {

    var arg=url.parse(req.url).query;
    var id = qs.parse(arg)['id'];
    console.log("id:" + id );
	
    var dbUrl = "mongodb://tongda:guoxiaojiang5632@localhost:27017/tongda";
    mongodb.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tongda");
        dbo.collection("goods").findOne({"_id":ObjectId(id)} , function(err, result) {
			var code = -1
			if (result) {
				responseData.data=result
				console.log("result is:" + result);
				code = 1
			}
			db.close();
			responseData.code = code;
			responseData.message = 'ok';
			res.json(responseData);
		}); 
    });

})
router.get('/truncks/index', function (req, res) {
    responseData.code = 1;
    responseData.message = 'ok';
    responseData.data = {
        swiperImg: ['http://211.159.175.56:8888/public/img/swiper/1.png', 'http://211.159.175.56:8888/public/img/swiper/2.png', 'http://211.159.175.56:8888/public/img/swiper/3.png'],
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

function callback(err, res, resData) {
    if (err)
        console.log("err: ", err);
    else
        console.log("response data: ", resData);
}


router.get('/verify', function (req, res) {
    var arg=url.parse(req.url).query;
    var phone = qs.parse(arg)['phone'];
    var code="";
    for(var i=0;i<4;i++){
        code+=Math.floor(Math.random()*10)
    }
    console.log("random code:"+code);
    //给phone发送随机验证码
    var ssender = qcloudsms.SmsSingleSender();
    var params = [code];
	//先注掉吧，省短信
    ssender.sendWithParam(86, phone, templId, params, "", "", "", callback);
    responseData.vcode = code;
    responseData.message = 'ok';
    res.json(responseData);
})

router.get('/login', function (req, res) {
    var arg = url.parse(req.url).query;
    var phone = qs.parse(arg)['phone'];
    var pwd = qs.parse(arg)['pwd'];
 
	var code = 0;
	
	var dburl = "mongodb://tongda:guoxiaojiang5632@localhost:27017/tongda";
	
	if (phone) {
		mongodb.connect(dburl, function (err, db) {
        if (err) throw err;
		var whereStr = {"phoneNum":phone}
		console.log("phone is:" + phone)
		
		db.collection("user").findOne(whereStr, function(err, result) {
			if (result) {
				if (pwd === result.pwd) {
					code = 1;	
				}
			}
			db.close();
			responseData.code = code;
			responseData.message = 'ok';
			res.json(responseData);
		});
    });
	}
    
})

router.post('/publish', function (req, res) {
    var body = req.body;
    console.log("publish coverImgs is:" + body.coverImgs + ", type:" + typeof(body.coverImgs))
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

router.post('/register', function (req, res) {
    var body = req.body;
    console.log("register pwd is:" + body.pwd, ", phone is :" + body.phoneNum)
    var url = "mongodb://tongda:guoxiaojiang5632@localhost:27017/tongda";
    mongodb.connect(url, function (err, db) {
        if (err) throw err;
        console.log("db has connected");
		var whereStr = {"phoneNum":body.phoneNum}
		db.collection("user").find(whereStr).toArray(function(err, result) {
			if (result.length !== 0) {
				//已经存在，update操作
				db.collection("user").updateOne(whereStr, {$set:{'pwd':body.pwd}}, function(err, res) {
					if (err) throw err;
					console.log("pwd更新成功");
					db.close();
				});
			} else {
				db.collection("user").insertOne(body, function(err, res) {
					if (err) throw err;
					console.log("user 插入成功");
					db.close();
				});
			}
		});
    });
    responseData.code = 1;
    responseData.message = 'ok';
    res.json(responseData);
})


var storage = multer.diskStorage({ 
    destination: function(req, file, cb) { 
        cb(null, './uploads'); 
    }, 
    filename: function(req, file, cb) { 
        cb(null, `${Date.now()}-${file.originalname}`) 
    } 
}) 

var upload = multer({ storage: storage }); 
//var cpUpload = upload.fields([{ name: 'imgfile', maxCount: 12 }])
 
router.post('/uploadPic', upload.single('file'), function(req, res, next) { 
	responseData.code = 1;
    responseData.message = 'ok';
	responseData.couldPath = "/" + req.file.path.replace("\\", "/")
    res.json(responseData); 
	
}) 


module.exports = router;