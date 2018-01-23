const app = getApp()
import tips from '../../utils/tips.js'
const apiurl = 'https://friend-guess.playonwechat.com/';
Page({
  data: {
  },
  //13
  onLoad: function (options) {
    
  },
  onShow: function () {
    
  },
  //设置分享
  onShareAppMessage: function (e) {
    console.log(e);
    let that = this;
    return {
      title: '快来制作我们的照片墙吧！',
      path: '/pages/templatePhoto/templatePhoto',
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  }
  
})