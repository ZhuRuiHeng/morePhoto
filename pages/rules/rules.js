const app = getApp();
import tips from '../../utils/tips.js';
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    num: Math.random(),
    win1:false
  },
  onShow: function () {
    let that = this;
    wx.request({
      url: app.data.apiurl3 + "photo/activity-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("活动信息:", res);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            win1: res.data.data.win
          })
          wx.hideLoading()
        } else {
          //tips.alert(res.data.msg);
        }
      }
    })
  },
  chart(){
    if (this.data.win1==false){
      tips.alert('集齐星座才可领取')
    }else{
      wx.navigateToMiniProgram({
          appId: 'wx22c7c27ae08bb935',
          path: 'pages/photoWall/photoWall?scene=1587798624178b412c78a43dd4877ab6&poster=http://ovhvevt35.bkt.clouddn.com/photo/poster.png&photowall=1',
          envVersion: 'release',
          success(res) {
            // 打开成功
            console.log(res);
          }
        })
    }
  },
 // 参与活动
  activeIn(e) {
    wx.setStorageSync('cate_id', 26);
    wx.setStorageSync('nowImage', 1);
    wx.setStorageSync('nowTitle', '节日活动')
    wx.navigateTo({
      url: '../moban/moban?cate_id=26&nowTitle=节日活动&nowImage=1'
    })
  }

})