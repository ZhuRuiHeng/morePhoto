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
    big:1,
    show:false,
    newName: '朋友照片墙',
    oldPage: 2,
  },
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      big: options.big
    })
  },
  onShow: function () {
   
    let that = this;
    let sign = wx.getStorageSync('sign');
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      show: false,
      big: 1,
    })
    app.getAuth(function () {
      var otherSign = wx.getStorageSync("otherSign");
      var operator_id = wx.getStorageSync("operator_id");
      wx.request({
        url: "https://gallery.playonwechat.com/api/albums?sign=" + otherSign + "&operator_id=" + operator_id,
        data: {
          page: 1,
          limit: 10
        },
        success: function (res) {
          console.log("列表", res);
          if (res.data.status) {
            var albums = res.data.data.albums;
            that.setData({
              albums,
              showLoading: false
            })
          }
        }
      })
      // 请求 
      wx.request({
        url: app.data.apiurl3 + "photo/photo-wall-list?sign=" + sign + '&operator_id=' + app.data.kid,
        data: {
          type: 'image'
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片墙列表:", res);
          var status = res.data.status;
          if (status == 1) {
            let photosList = res.data.data;
            for (let i = 0; i < photosList.length;i++){
              photosList[i].add_time = photosList[i].add_time.split("-");
            }
            console.log(photosList);
            that.setData({
              photosList
            })
            let _photosList = that.data.photosList;
            console.log("_photosList:", _photosList);
            for (let i = 0; i < _photosList.length; i++) {
              _photosList[i].day = _photosList[i].add_time[2].substring(0, 2);
            }
            that.setData({
              photosList: _photosList
            })
            console.log(that.data.photosList);
            wx.hideLoading()
          } else {
            tips.alert(res.data.msg)
          }
        }
      })
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
    })
  },
  // 更多好玩
  morePlay(){
      wx.navigateTo({
        url: '../more/more',
      })
  },
  // 大导航
  bigBar(e){
    let that = this;
    let form_id = e.detail.formId;
    let type = '';
    that.setData({
      big: e.currentTarget.dataset.big
    })
    if (e.currentTarget.dataset.now == 2) {
      // 请求照片墙
      wx.request({
        url: app.data.apiurl3 + "photo/photo-wall-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          type: 'image'
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          //console.log("照片墙列表:", res);
          var status = res.data.status;
          if (status == 1) {
            let photosList = res.data.data;
            for (let i = 0; i < photosList.length; i++) {
              photosList[i].add_time = photosList[i].add_time.split("-");
            }
            console.log(photosList);
            that.setData({
              photosList
            })
            let _photosList = that.data.photosList;
            console.log("_photosList:", _photosList);
            for (let i = 0; i < _photosList.length; i++) {
              _photosList[i].day = _photosList[i].add_time[2].substring(0, 2);
            }
            that.setData({
              photosList: _photosList
            })
            console.log(that.data.photosList);
            wx.hideLoading()
            wx.hideLoading()
          } else {
            that.setData({
              photosList: false
            })
            tips.alert(res.data.msg)
          }
        }
      })
    }else {
      // 请求共享相册
      
    }
    // 保存formid
    wx.request({
      url: app.data.apiurl1 + "api/save-form?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        form_id: form_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
      }
    })
  },
  

  cancel() {
    this.setData({
      music: false
    })
  },
  navbar(e){
    let that = this;
    let form_id=e.detail.formId;
    let type ='';
    that.setData({
       now:e.currentTarget.dataset.now
    })
    if (e.currentTarget.dataset.now==2){
      type = 'h5'
    }else{
      type = 'image'
    }
    wx.request({
      url: app.data.apiurl3 + "photo/photo-wall-list?sign=" +wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        type: type
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        //console.log("照片墙列表:", res);
        var status = res.data.status;
        if (status == 1) {
          let photosList = res.data.data;
          for (let i = 0; i < photosList.length; i++) {
            photosList[i].add_time = photosList[i].add_time.split("-");
          }
          console.log(photosList);
          that.setData({
            photosList
          })
          let _photosList = that.data.photosList;
          console.log("_photosList:", _photosList);
          for (let i = 0; i < _photosList.length; i++) {
            _photosList[i].day = _photosList[i].add_time[2].substring(0, 2);
          }
          that.setData({
            photosList: _photosList
          })
          console.log(that.data.photosList);
          wx.hideLoading()
          wx.hideLoading()
        } else {
          that.setData({
            photosList: false
          })
          tips.alert(res.data.msg)
        }
      }
    }),
    // 保存formid
    wx.request({
      url: app.data.apiurl1 + "api/save-form?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        form_id: form_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
      }
    })

  },
  // 删除
  dels(e) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    console.log(e.currentTarget.dataset.pw_id);
    let photoIndex = e.currentTarget.dataset.photoindex;
    let photosList = that.data.photosList;
    // 请求 
    wx.request({
      url: app.data.apiurl + "photo/del-photo-wall?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: e.currentTarget.dataset.pw_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("删除照片墙:", res);
        var status = res.data.status;
        if (status == 1) {
          tips.success('照片墙删除成功!');
          photosList.splice(photoIndex, 1)
          that.setData({
            photosList
          })
        } else {
          tips.alert(res.data.msg)
        }
        wx.hideLoading()
      }
    })
  },
  seeTap(e) {
    console.log(e)
    let pw_id = e.currentTarget.dataset.pw_id;
    let bgMusic = e.currentTarget.dataset.musicurl;
    console.log('musicUrl:', e.currentTarget.dataset.musicurl)
    app.data.dataUrl = e.currentTarget.dataset.musicurl;
    wx.playBackgroundAudio({ //播放
      dataUrl: e.currentTarget.dataset.musicurl
    })
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.setStorageSync('pw_id', pw_id);
    wx.setStorageSync('bgMusic', e.currentTarget.dataset.musicurl);
    wx.setStorageSync('nameMusic', e.currentTarget.dataset.nameMusic);
    // temp_id: options.temp_id,pw_id: options.pw_id
    wx.navigateTo({
      url: '../templateInform/templateInform?pw_id=' + e.currentTarget.dataset.pw_id,
    })
  },
  seeTap1(e) {
    console.log(e)
    let pw_id = e.currentTarget.dataset.pw_id;
    let bgMusic = e.currentTarget.dataset.musicurl;
    console.log('musicUrl:', e.currentTarget.dataset.musicurl)
    app.data.dataUrl = e.currentTarget.dataset.musicurl;
    wx.playBackgroundAudio({ //播放
      dataUrl: e.currentTarget.dataset.musicurl
    })
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.setStorageSync('pw_id', pw_id);
    wx.setStorageSync('bgMusic', e.currentTarget.dataset.musicurl);
    wx.setStorageSync('nameMusic', e.currentTarget.dataset.nameMusic);
    // temp_id: options.temp_id,pw_id: options.pw_id
    wx.navigateTo({
      url: '../albumInform/albumInform?pw_id=' + e.currentTarget.dataset.pw_id,
    })
  },
  // 新增相册
  newPhotos(e){
    wx.switchTab({
      url: '../templatePhoto/templatePhoto',
    })
  },
  setName(e) {
    let that = this;
    let sign = wx.getStorageSync('sign');
    let id = e.currentTarget.dataset.pw_id;
    // 请求 
    wx.request({
      url: apiurl + "photo/edit-pname?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: id,
        name: e.detail.value
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("编辑照片墙名称:", res);
        var status = res.data.status;
        if (status == 1) {
          tips.success('编辑成功');

        } else {
          tips.alert(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  },
  onReachBottom: function () {
    var that = this;
    var otherSign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var oldPage = that.data.oldPage;
    if (that.data.big==1){
        wx.request({
          url: "https://gallery.playonwechat.com/api/albums?sign=" + otherSign + "&operator_id=" + operator_id,
          data: {
            page: oldPage,
            limit: 10
          },
          success: function (res) {
            console.log(res);
            if (res.data.status) {
              var oldAlbums = that.data.albums;
              var albums = res.data.data.albums;
              if (albums.length != 0) {
                albums = albums.concat(oldAlbums);
                oldPage++;
                that.setData({
                  albums,
                  oldPage
                })
              } else {
                wx.showToast({
                  title: "没有更多了",
                })
              }
            }
          }
        })
    }
    
  },

})
 