// pages/uploadImg/uploadImg.js
Page({
  data: {
    desc:''
  },
  onLoad: function (options) {
    var aid = options.aid;
    this.setData({
      aid
    })
  },
  onShow: function () {
    var that = this;
    var imgArr = wx.getStorageSync("imgArr");
    that.setData({
      imgArr
    })
  },
  continueAdd(){
    var that = this;
    var imgArr = that.data.imgArr;
    var sign = wx.getStorageSync("otherSign");
    var imgArr = that.data.imgArr; 
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        imgArr = imgArr.concat(tempFilePaths);
        that.setData({
          imgArr
        })
      }
    })
  },
  // 删除上传图片
  deleteImg(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var imgArr = that.data.imgArr;
    wx.showModal({
      title: '温馨提示',
      content: '是否确定删除此图片',
      success:function(res){
        if(res.confirm){
          imgArr.splice(idx, 1);
          that.setData({
            imgArr
          })
        }
      }
    })
  },
  // 获取描述内容
  getDesc(e){
    var that = this;
    var desc = e.detail.value;
    that.setData({
      desc
    })
  },
  startUpload() {
      wx.showLoading({
        title: '上传中',
      })
      var that = this;
      var sign = wx.getStorageSync("otherSign");
      var operator_id = wx.getStorageSync("operator_id");
      var aid = that.data.aid;
      var description = that.data.desc;
      var imgArr = that.data.imgArr;
      var pictures = imgArr.join(";");
      var arr = [];
      var length = imgArr.length
      console.log(length);
      if (imgArr.length != 0) {
          for (var i = 0; i < length; i++) {
            (function (i) {
              wx.uploadFile({
                url: 'https://gallery.playonwechat.com/api/upload-picture?sign=' + sign,
                filePath: imgArr[i],
                name: 'file',
                success: function (res) {
                  console.log(res);
                  var data = JSON.parse(res.data).url;
                  var status = JSON.parse(res.data).status;
                  if (status) {
                    console.log(data);
                    arr.push(data);
                    if (arr.length == length){
                      wx.request({
                        url: "https://gallery.playonwechat.com/api/publish-dynamic?sign=" + sign + "&operator_id=" + operator_id,
                        method: "POST",
                        data: {
                          aid: aid,
                          description: description,
                          pictures: arr.join(";")
                        },
                        success: function (res) {
                          wx.hideLoading();
                          console.log(res);
                          if (res.data.status) {
                            wx.navigateBack({
                              delta: 1,
                            })
                            // wx.redirectTo({
                            //   url: '../albumDetail/albumDetail?aid=' + res.data.aid,
                            // })
                          }
                        }
                      })
                    }
                    // that.setData({
                    //   img_arr: arr
                    // })
                  }
                }
              })
            })(i)
          }  
      }
  },

})