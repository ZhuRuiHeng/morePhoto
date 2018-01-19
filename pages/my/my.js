const app = getApp()
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
const common = require('../../common.js');
Page({
  data: {
    music: false,
    num: Math.random(),
    userInfo: wx.getStorageSync('userInfo'),
    now:1,
    show:false,
    newName: '朋友照片墙',
    dataUrl: wx.getStorageSync('dataUrl'),
    music_play: wx.getStorageSync('music_play'),
    zindex: false
  },
  onLoad: function (options) {
    this.setData({
        userInfo: wx.getStorageSync('userInfo')
    })
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      show: false,
      music_play: wx.getStorageSync('music_play'),
      now: 1,
      zindex: false
    })
    app.getAuth(function () {
      //获取用户信息
      wx.request({
        url: app.data.apiurl + "photo/user-info?sign=" + sign + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("用户信息:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              member_number: res.data.data.member_number,
              photo_fans_count: res.data.data.photo_fans_count
            })
            //wx.hideLoading()
          } else {
            tips.alert(res.data.msg)
          }
        }
      })
      //背景图  
      wx.request({
        url: app.data.apiurl2 + "photo/get-user-bg?sign=" + sign + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("背景图:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              bgImg: res.data.data.bg
            })
          } else {
            console.log(res.data.msg)
          }
        }
      })
      wx.hideLoading()
    })
  },
  // 更多好玩
  morePlay(){
      wx.navigateTo({
        url: '../more/more',
      })
  },
  openRed(){
    this.setData({
      zindex: true
    })
  },
  // 关闭
  close(){
    this.setData({
      zindex:false
    })
  },
  // 领红包
  jump(e) {
    wx.showLoading({
      title: '加载中',
    });
    //console.log(appId);
    wx.navigateToMiniProgram({
      appId: 'wx22c7c27ae08bb935',
      path: 'pages/index/index',
      envVersion: 'release',
      success(res) {
        // 打开成功
        this.setData({
          zindex:false
        })
        console.log(res);
      }
    })
    wx.hideLoading()
  },
  //编辑背景
  editTap(e) {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        tips.loading('上传中');
        tips.loaded(); //消失
        that.setData({
          dialog: true
        })
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: apiurl + "api/upload-image?sign=" + wx.getStorageSync('sign') + ' & operator_id=' + app.data.kid,
            filePath: tempFilePaths[i],
            name: 'image',
            formData: {
              'user': 'test'
            },
            success: function (res) {
              console.log('上传图片成功', res);
              let data = JSON.parse(res.data);
              if (data.status == 1) {
                that.setData({
                  url: data.data
                })
                //更换背景图  
                wx.request({
                  url: app.data.apiurl2 + "photo/change-user-bg?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
                  data: {
                    picture: that.data.url
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET",
                  success: function (res) {
                    console.log("改变背景图:", res);
                    var status = res.data.status;
                    if (status == 1) {
                      that.setData({
                        bgImg: that.data.picture
                      })
                      tips.success('上传成功！')
                    } else {
                      tips.alert(res.data.msg)
                    }
                  }
                })
              } else {
                tips.alert(res.data.msg)
              }
            }
          })
        }
      }
    })
  },
  bindPlay() {
    var that = this;
    let music_play = that.data.music_play;
    if (music_play == true) {
      console.log(1);
      wx.pauseBackgroundAudio();//暂停
      app.data.music_play = false;
      wx.setStorageSync('music_play', false)
      that.setData({
        music_play: false
      })
    } else {
      console.log(2);
      wx.playBackgroundAudio({ //播放
        dataUrl: app.data.dataUrl
      })
      app.data.music_play = true;
      wx.setStorageSync('music_play', true)
      that.setData({
        music_play: true
      })
    }
  },
  // 领红包
  redUrl() {
    wx.navigateToMiniProgram({
      appId: 'wx22c7c27ae08bb935',
      path: 'pages/index/index',
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log(res);
      }
    })
  },
})
 