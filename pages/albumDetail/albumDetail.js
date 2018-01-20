// pages/albumDetail/albumDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,
    showImg: false,
    showAction: false,
    oldPage:2,
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid;
    var mid = options.mid;   //分享进来，获取mid
    console.log(mid);
    this.setData({
      aid,
      mid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var aid = that.data.aid;
    var operator_id = wx.getStorageSync("operator_id");

    var localMid = wx.getStorageSync("mid");   //当前用户mid

    that.setData({
      localMid
    })
    
    var mid = that.data.mid;    

    if(mid != undefined){
      wx.request({
        url: "https://gallery.playonwechat.com/api/manage-album-member?sign=" + sign + "&operator_id=" + operator_id,
        data: {
          aid,
          mids: wx.getStorageSync("mid"),
          type: 0
        },
        success: function (res) {
          console.log(res);
          if (res.data.status) {
            
          } 
        }
      })
    }

    wx.request({
      url: "https://gallery.playonwechat.com/api/album-detail?sign=" + sign,
      data:{
        aid: aid
      },
      success:function(res){
        console.log("详情",res);
        if(res.data.status){
          var album = res.data.data.album;
          wx.setStorageSync("members", album.members);
          wx.setStorageSync("album_name", album.album_name);
          // wx.setStorageSync("albumMid", album.mid);
          wx.setStorageSync("aid", album.aid);
          that.setData({
            album
          })
        }
      }
    })

    wx.request({
      url: "https://gallery.playonwechat.com/api/timeline?sign=" + sign + "&operator_id=" + operator_id,
      data:{
        aid: aid,
        page: 1,
        limit: 10
      },
      success:function(res){
        console.log(res);
        if(res.data.status){
          var timeLine = res.data.data.timeLine;
          that.setData({
            timeLine
          })
        }
      }
    })
  },


  refresh(that){
    var sign = wx.getStorageSync("otherSign");
    var aid = that.data.aid;
    var operator_id = wx.getStorageSync("operator_id");
    wx.request({
      url: "https://gallery.playonwechat.com/api/timeline?sign=" + sign + "&operator_id=" + operator_id,
      data: {
        aid: aid,
        page: 1,
        limit: 10
      },
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          var timeLine = res.data.data.timeLine;
          that.setData({
            timeLine
          })
        }
      }
    })
  },

  // 返回首页
  goHome(){
    wx.switchTab({
      url: '../square/square',
    })
  },

  // 切换导航
  changeTab(e){
    var that = this;
    var tab = e.currentTarget.dataset.tab;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var aid = that.data.aid;
    
    if(tab==1){
      var timeLine = that.data.timeLine;
      that.setData({
        timeLine,
        tab:1,
        oldPage: 2
      })
    }else if(tab==2){
      wx.request({
        url: 'https://gallery.playonwechat.com/api/photo-wall?sign=' + sign + "&operator_id=" + operator_id,
        data:{
          aid,
          page: 1,
          limit: 10
        },
        success:function(res){
          console.log(res);
          if(res.data.status){
            var pictureList = res.data.data.pictureList;
            that.setData({
              pictureList,
              tab:2,
              oldPage: 2,
              type:0
            })
          }
        }
      })
    }
  },


  // 打开上传图片按钮
  showImg(){
    this.setData({
      showImg: true
    })
  },

  // 关闭上传图片弹窗
  closeImg(){
    this.setData({
      showImg: false,
      showAction: false
    })
  },

  showAction(e){
    var timeLine = this.data.timeLine;
    var idx = e.currentTarget.dataset.idx;
    var mid = wx.getStorageSync("mid");

    this.setData({
      dynamicMid: timeLine[idx].mid,
      currentDynamic:timeLine[idx],
      idx:idx,
      mid,
      showAction: true
    })
  },

  // 置顶动态
  setTop(){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var currentDynamic = that.data.currentDynamic;
    var timeLine = that.data.timeLine;
    var idx = that.data.idx;

    wx.showModal({
      title: '温馨提示',
      content: '是否确定置顶此动态',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: 'https://gallery.playonwechat.com/api/dynamic-stick?sign=' + sign + "&operator_id=" + operator_id,
            data: {
              did: currentDynamic.did
            },
            success: function (res) {
              console.log(res);
              if(res.data.status){
                timeLine[idx].stick_time = 1;
                that.setData({
                  timeLine,
                  showAction: false
                })

                that.refresh(that);
                wx.showToast({
                  title: '置顶成功',
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                })
              }
            }
          })
        }
      }
    })
    
  },

  // 取消置顶动态
  cancelTop(){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var currentDynamic = that.data.currentDynamic;
    var timeLine = that.data.timeLine;
    var idx = that.data.idx;

    wx.request({
      url: 'https://gallery.playonwechat.com/api/remove-dynamic-stick?sign=' + sign + "&operator_id=" + operator_id,
      data: {
        did: currentDynamic.did
      },
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          timeLine[idx].stick_time = -1;
          that.setData({
            timeLine,
            showAction: false
          })
          wx.showToast({
            title: '取消置顶成功',
          })
          that.refresh(that);
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },


  // 删除动态
  deleteDynamic(){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var currentDynamic = that.data.currentDynamic;
    var timeLine = this.data.timeLine;
    var idx = that.data.idx;

    wx.showModal({
      title: '温馨提示',
      content: '是否确定删除此动态',
      success:function(res){
        wx.request({
          url: 'https://gallery.playonwechat.com/api/delete-dynamic?sign=' + sign + "&operator_id=" + operator_id,
          data: {
            did: currentDynamic.did
          },
          success: function (res) {
            console.log(res);
            if (res.data.status) {
              timeLine.splice(idx, 1);
              wx.showToast({
                title: '删除成功',
              })
              that.setData({
                showAction: false,
                timeLine
              })
            }else{
              wx.showToast({
                title: res.data.msg,
              })
            }
          }
        })
      }
    })

    
  },


  // 修改封面图
  changeCover(e){
    var that = this;
    var sign = wx.getStorageSync("otherSign");  
    var currentMid = wx.getStorageSync("mid");
    var mid = that.data.album.mid;

    if(mid == currentMid){
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', "camera"],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          var length = tempFilePaths.length;
          wx.uploadFile({
            url: 'https://gallery.playonwechat.com/api/upload-picture?sign=' + sign + "&aid=" + wx.getStorageSync("aid"),
            filePath: tempFilePaths[0],
            name: 'file',
            success: function (res) {
              console.log(res);
              var data = JSON.parse(res.data).url;
              var status = JSON.parse(res.data).status;
              var msg = JSON.parse(res.data).msg;
              if (status) {
                wx.showToast({
                  title: "修改成功",
                })
              } else {
                wx.showToast({
                  title: msg,
                })
              }
            }
          })
        }
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '非相册创建者，无权限修改封面',
        showCancel:false,
        success:function(){}
      })
    }


    
  },

  // 添加照片或拍照
  addImg(e){
    var that = this;
    var pic = e.currentTarget.dataset.pic;
    var aid = that.data.aid;
    var sign = wx.getStorageSync("otherSign");
    var arr = [];

    // if (pic == 'pai'){
    //   wx.chooseImage({
    //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //     sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
    //     success: function (res) {
    //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //       var tempFilePaths = res.tempFilePaths
    //     }
    //   })
    // }else if(pic == 'phone'){
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          var length = tempFilePaths.length;
          console.log(tempFilePaths);
          wx.setStorageSync("imgArr", tempFilePaths);
          // for (var i = 0; i < length; i++) {
          //   (function (i) {
          //     wx.uploadFile({
          //       url: 'https://gallery.playonwechat.com/api/upload-picture?sign=' + sign,
          //       filePath: tempFilePaths[i],
          //       name: 'file',
          //       success: function (res) {
          //         console.log(res);
          //         var data = JSON.parse(res.data).url;
          //         var status = JSON.parse(res.data).status; 
          //         if (status) {
          //           arr.push(data);
          //           that.setData({
          //             img_arr: arr
          //           })
          //           console.log(arr);
          //           wx.setStorageSync("imgArr", arr);
          //         }
          //       }
          //     })
          //   })(i)
          // }
          
          wx.navigateTo({
            url: '../uploadImg/uploadImg?aid=' + aid,
          })
        }
      })
    // }
  },


  // 点赞
  saveThumb(e){
    var that = this;
    var did = e.currentTarget.dataset.did;
    var idx = e.currentTarget.dataset.idx;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");

    wx.request({
      url: "https://gallery.playonwechat.com/api/save-thumb?sign=" + sign + "&operator_id=" + operator_id,
      data:{
        did: did
      },
      success:function(res){
        console.log(res);
        if(res.data.status){
          var timeLine = that.data.timeLine;
          var avatarUrl = wx.getStorageSync("avatarUrl");
          var obj = {};
          obj.avatarurl = avatarUrl;
          timeLine[idx].avatarurls.push(obj);
          timeLine[idx].is_thumb = 1;
          that.setData({
            timeLine
          })
          wx.showToast({
            title: '点赞成功',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },

  // 改变照片墙排序
  changeType(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var type = that.data.type;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var aid = that.data.aid;

    if(type == 0){
      type = 1;
    }else{
      type = 0
    }

    wx.request({
      url: 'https://gallery.playonwechat.com/api/photo-wall?sign=' + sign + "&operator_id=" + operator_id,
      data: {
        aid,
        page: 1,
        limit: 10,
        type
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.status) {
          var pictureList = res.data.data.pictureList;
          that.setData({
            pictureList,
            tab: 2,
            oldPage: 2,
            type
          })
        }
      }
    })
  },


  // 预览图片
  previewImg(e){
    var pictures = e.currentTarget.dataset.pictures;
    var picture = e.currentTarget.dataset.picture;
    wx.previewImage({
      current:picture,
      urls: pictures,
    })
  },

  toDetail(e){
    var did = e.currentTarget.dataset.did;
    wx.navigateTo({
      url: '../dynamicDetail/dynamicDetail?did=' + did,
    })
  },

  toText(e){
    var did = e.currentTarget.dataset.did;
    var album = this.data.album;
    wx.navigateTo({
      url: '../comment1/comment1?did='+ did + '&aid=' + album.aid,
    })
  },
  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var oldPage = that.data.oldPage;
    var aid = that.data.aid;

    wx.request({
      url: "https://gallery.playonwechat.com/api/timeline?sign=" + sign + "&operator_id=" + operator_id,
      data: {
        aid: aid,
        page: oldPage,
        limit: 10
      },
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          var oldTimeLine = that.data.timeLine;
          var timeLine = res.data.data.timeLine;
          timeLine = timeLine.concat(oldTimeLine);
          oldPage++;
          that.setData({
            timeLine,
            oldPage
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var wx_name = wx.getStorageSync("wx_name");
    var album = this.data.album;
    var album_name = album.album_name;
    
    return{
      title: wx_name + "邀请你加入“" + album_name + "”相册",
      imageUrl: album.cover,
      path: "/pages/albumDetail/albumDetail?aid=" + this.data.aid + "&mid=" + album.mid
    }
  }
})