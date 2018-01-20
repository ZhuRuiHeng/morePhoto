// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid;
    var mid = options.mid;
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
    var members = wx.getStorageSync("members");
    var album_name = wx.getStorageSync("album_name");
    var currentMid = wx.getStorageSync("mid");
    that.setData({
      members,
      album_name,
      currentMid
    })
  },


  // 去管理人员
  toDeletePeople(){
    var currentMid = wx.getStorageSync("mid");
    var mid = this.data.mid;
    if (currentMid == mid){
      wx.navigateTo({
        url: '../deletePeople/deletePeople',
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '非相册创建者，无权限管理成员',
        showCancel: false,
        success: function () { }
      })
    }
    
  },

  getName(e){
    var album_name = e.detail.value;
    this.setData({
      album_name
    })
  },

  saveSetting(){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var album_name = that.data.album_name;
    var aid = that.data.aid;
    var operator_id = wx.getStorageSync("operator_id");

    wx.request({
      url: "https://gallery.playonwechat.com/api/mange-album?sign=" + sign + "&operator_id=" + operator_id,
      method:"POST",
      data:{
        aid, 
        album_name
      },
      success:function(res){
        console.log(res);
        if(res.data.status){
          wx.redirectTo({
            url: '../albumDetail/albumDetail?aid=' + aid,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },


  // 修改封面
  changeCover() {
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var currentMid = wx.getStorageSync("mid");
    var mid = that.data.mid;

    if (mid == currentMid){
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
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
        showCancel: false,
        success:function(){}
      })
    }

   
  },


  // 退出相册
  exitAlbum(){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var aid = wx.getStorageSync("aid");
    var mid = wx.getStorageSync("mid");

    wx.request({
      url: "https://gallery.playonwechat.com/api/manage-album-member?sign=" + sign + "&operator_id=" + operator_id,
      data: {
        aid,
        mids: mid,
        type: 1
      },
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          wx.reLaunch({
            url: '../xiangce/xiangce',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },


  // 删除相册
  deleteAlbum(){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var aid = that.data.aid;

    wx.request({
      url: "https://gallery.playonwechat.com/api/remove-album?sign=" + sign + "&operator_id=" + operator_id,
      data: {
        aid
      },
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          wx.showToast({
            title: '删除成功',
          })
          wx.reLaunch({
            url: '../xiangce/xiangce',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var wx_name = wx.getStorageSync("wx_name");
    var album_name = wx.getStorageSync("album_name");

    return {
      title: wx_name + "邀请你加入“" + album_name + "”相册",
      path: "/pages/albumDetail/albumDetail?aid=" + this.data.aid + "&mid=" + wx.getStorageSync("mid")
    }
  }
})