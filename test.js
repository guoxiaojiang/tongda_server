var QcloudSms = require("./qcloudsms_js");
var appid = 1400070292;
var appkey = "d749d35ca6d1964d99827e0bc871c4d2";
var phoneNumber = "15600564330";
var templId = 89987;
var qcloudsms = QcloudSms(appid, appkey);
// 请求回调处理, 这里只是演示，用户需要自定义相应处理回调
function callback(err, res, resData) {
    if (err)
        console.log("err: ", err);
    else
        console.log("response data: ", resData);
}

var ssender = qcloudsms.SmsSingleSender();
var params = ["123456"];
ssender.sendWithParam(86, phoneNumber, templId, params, "", "", "", callback);