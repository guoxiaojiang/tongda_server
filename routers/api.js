/**
 * Created by Administrator on 2017/1/16.
 */
var express = require('express');
var viru=require('../models/viru');
var theater=require('../models/theater')


var router = express.Router();
var responseData;


router.use( function(req, res, next) {

    responseData = {
        code: 0,
        message: ''
    }
    next();
} );
router.get('/positionlist',function (req,res) {
    responseData.code = 1;
    responseData.message='ok';
    responseData.li= viru.city;

    res.json(responseData);
})
router.get('/index',function (req,res) {
    responseData.code = 1;
    responseData.message='ok';
    responseData.data={
        swiperImg:['http://192.168.1.102:8888/public/img/swiper/4.png','http://192.168.1.102:8888/public/img/swiper/5.png',
            'http://192.168.1.102:8888/public/img/swiper/6.png','http://192.168.1.102:8888/public/img/swiper/7.png'],
        goodsList:viru.indexGoods
    };
    res.json(responseData);
})
router.get('/truncks/index',function (req,res) {
    responseData.code = 1;
    responseData.message='ok';
    responseData.data={
        swiperImg:['http://192.168.1.102:8888/public/img/swiper/1.png','http://192.168.1.102:8888/public/img/swiper/2.png','http://192.168.1.102:8888/public/img/swiper/3.png'],
        trucks:viru.indexTrucks
    };
    res.json(responseData);
})
router.get('/goodsDetail',function (req,res) {
    var reqtitle=req.query.title


    responseData.data=viru.good;
    responseData.code = 1;
    responseData.message = 'ok';
    res.json(responseData);
})
router.post('/search',function (req,res) {
var key =req.body.key
    if(key.length>4||key==''){
        responseData.code=2;
        responseData.message='没有找到相关';
        res.json(responseData);
    }
    else {
        responseData.code=200;
        responseData.message='获取到相关';
        responseData.data=theater.wanda
        res.json(responseData)
    }



})


module.exports = router;