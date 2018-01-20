//app.js
//const backgroundAudioManager = wx.getBackgroundAudioManager()
App({
  data: {
    loginData: null,
    sign: "",
    mobile: "",
    username: "",
    mid: "",
    sharecode: "",
    authStatic: false,
    loginStatic: false,
    authSuccess: false,
    dataUrl: "",
    music_play: true,
    apiurl:'https://friend-guess.playonwechat.com/v1/',
    apiurl1: 'https://friend-guess.playonwechat.com/',
    apiurl2: 'https://friend-guess.playonwechat.com/v2/',
    apiurl3: 'https://friend-guess.playonwechat.com/v3/',
    otherApiurl:'https://gallery.playonwechat.com/'
  },
  onUnload: function () {
     wx.removeStorageSync('activity');
  },
  onLaunch: function () {
    let that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    that.data.kid = extConfig.kid ? extConfig.kid : '54321';
    //that.data.kid = 123; //123 464
    wx.setStorageSync('kid', that.data.kid); //that.data.kid
    wx.setStorageSync('operator_id', 54321); 
    
    this.getAuth();
  },

  onShow: function () {
    console.log("appshow");
    var that = this;
    var dataUrl = that.data.dataUrl;
    wx.onBackgroundAudioStop(function () {
      console.log("音乐停止，自动循环");
      wx.playBackgroundAudio({
        dataUrl: dataUrl
      })
    });
    wx.setStorageSync('music_play', that.data.music_play);
    if (that.data.music_play==true){
      wx.playBackgroundAudio({
        dataUrl: that.data.dataUrl
      })
    }else{
      wx.pauseBackgroundAudio();
    }

  },
  getAuth(cb) {
    // var that = this;
    const apiurl = 'https://friend-guess.playonwechat.com/';
    let kid = wx.getStorageSync("kid");
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //照片墙发起网络请求
          wx.request({
            url: apiurl + 'api/auth?code=' + res.code + '&operator_id=' + kid,
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res,'授权成功');
              console.log("sign:", res.data.data.sign);
              wx.setStorageSync('sign', res.data.data.sign);
              var sign = res.data.data.sign;
              var openid = res.data.data.openid;
              wx.setStorageSync('openid', openid);
                wx.getUserInfo({
                  success: function (res) {
                    console.log("照片墙保存信息");
                    // console.log(res);
                    let userData = {};
                    let userInfo = res.userInfo
                    let nickName = userInfo.nickName
                    let avatarUrl = userInfo.avatarUrl
                    let gender = userInfo.gender //性别 0：未知、1：男、2：女
                    let province = userInfo.province
                    let city = userInfo.city
                    let country = userInfo.country;
                    wx.setStorageSync('userInfo', userInfo);//缓存存用户信息
                    userData = {
                      nickName: nickName,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };
                    wx.request({
                      url: apiurl + '/api/save-user-info?sign=' + sign + '&operator_id=' + kid,
                      method: 'POST',
                      data: {
                        info: userData
                      },
                      success: function (res) {
                        console.log("保存信息", res);
                        // that.data.authSuccess = true;
                        typeof cb == "function" && cb();
                      }
                    })
                  },
                  fail: function () {
                    console.log("用户拒绝授权");
                    // wx.showModal({
                    //   title: '警告',
                    //   content: '您点击了拒绝授权，将无法正常使用体验。请10分钟后再次点击授权，或者删除小程序重新进入。',
                    //   success: function (res) {
                    //     if (res.confirm) {
                    //       console.log('用户点击确定');
                    //     }
                    //   }
                    // })
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                      }
                    })
                  },
                })
            },
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
    // 1
    setTimeout(function(){
      wx.login({
        success: function (res) {
          console.log(res);
          if (res.code) {
            //共享发起网络请求
            wx.request({
              url: "https://gallery.playonwechat.com/api/auth?code=" + res.code + '&operator_id=' + kid,
              data: {
                code: res.code
              },
              success: function (res) {
                console.log("忆年登录sign", res);

                let otherSign = res.data.data.sign;
                wx.setStorageSync('otherSign', otherSign);
                // wx.setStorageSync("sharecode", sharecode);
                var mid = res.data.data.mid;
                wx.setStorageSync("mid", res.data.data.mid);
                wx.getUserInfo({
                  success: function (res) {
                    //console.log("用户信息",res);
                    var info = {};
                    info.wx_name = res.userInfo.nickName;
                    info.avatarUrl = res.userInfo.avatarUrl;
                    info.gender = res.userInfo.gender;
                    info.province = res.userInfo.province;
                    info.city = res.userInfo.city;
                    info.country = res.userInfo.country;

                    wx.request({
                      url: "https://gallery.playonwechat.com/api/save-user-info?sign=" + otherSign,
                      data: {
                        info: info
                      },
                      method: "POST",
                      success: function (res) {
                        console.log('忆年保存用户信息', res);
                      },
                      fail: function (res) { },
                      complete: function (res) { },
                    })
                    typeof cb == "function" && cb();
                  }
                })


              }
            })

          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
          }
        }
      },3000);
    })
    
  },
  // 
 
  
  //////
  globalData: {
    baseUrl: 'https://friend-guess.playonwechat.com/'
  },
  // 音乐
  bindPlay: function () {
    var that = this;
    let music_play = app.data.music_play;
    console.log('music_play:', music_play);
    if (music_play == true) {
      wx.pauseBackgroundAudio();//暂停
      app.data.music_play = false;
      that.setData({
        music_play: false
      })
    } else {
      wx.playBackgroundAudio({ //播放
        dataUrl: app.data.dataUrl
      })
      app.data.music_play = true;
      that.setData({
        music_play: true
      })
    }
  },
  showLoading: function (title) {
    if (!title) {
      title = '正在加载图片中';
    }
    wx.showLoading({
      title: title
    });
  },
  hideLoading: function () {
    wx.hideLoading();
  },
  onHide: function () {
    wx.stopBackgroundAudio();
    console.log('stop music');
  }
  
})