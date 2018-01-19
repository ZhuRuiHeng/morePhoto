// pages/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    nameIdx:0,
    groupIdx:1,   //第几组名称,
    oldIdx:0   //上一次点击的哪个组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    wx.request({
      url: "https://gallery.playonwechat.com/api/album-names?sign=" + sign,
      data:{
        group:1
      },
      success:function(res){
        console.log(res);
        if(res.data.status){
          var albumNames = res.data.data.albumNames;
          var maxGroup = res.data.data.maxGroup;
          for (let i = 0; i < albumNames.length;i++){
            albumNames[i].active = false;
            albumNames[i].album_names = JSON.parse(albumNames[i].album_names);
          }
          that.setData({
            albumNames,
            maxGroup
          })
        }
      }
    })
  },

  // 选名称
  createValue(e){
    var that = this;
    var albumNames = that.data.albumNames;   //所有名称标签
    var idx = e.currentTarget.dataset.idx;  //当前点击组的index
    var oldIdx = that.data.oldIdx;   //上一次点击的index
    var nameIdx = that.data.nameIdx;   //当前组的第几个标签

    for (let i = 0; i < albumNames.length; i++) {
      albumNames[i].active = false;
    }
    albumNames[idx].active = true;

    if (idx != oldIdx) {     
      nameIdx = 0;
    }

    nameIdx++;
    if (nameIdx > albumNames[idx].album_names.length - 1) {
      nameIdx = 0;
    }
    that.setData({
      albumNames,
      inputValue: albumNames[idx].album_names[nameIdx],
      nameIdx,
      oldIdx: idx
    })    
  },

  // 换一批
  changeValue(){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var operator_id = wx.getStorageSync("operator_id");
    var maxGroup = that.data.maxGroup;
    var groupIdx = that.data.groupIdx;
    groupIdx++;
    if (groupIdx > maxGroup){
      groupIdx = 1;
    }

    wx.request({
      url: "https://gallery.playonwechat.com/api/album-names?sign=" + sign,
      data: {
        group: groupIdx
      },
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          var albumNames = res.data.data.albumNames;
          for (let i = 0; i < albumNames.length; i++) {
            albumNames[i].active = false;
            albumNames[i].album_names = JSON.parse(albumNames[i].album_names);
          }
          that.setData({
            albumNames,
            groupIdx
          })
        }
      }
    })
  },


  // 获取输入的值
  getValue(e){
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 提交相册
  submitValue(e){
    var that = this;
    var sign = wx.getStorageSync("otherSign");
    var inputValue = that.data.inputValue;
    var operator_id = wx.getStorageSync("operator_id");

    var form_id = e.detail.formId;
    console.log(e);

    wx.request({
      url: "https://gallery.playonwechat.com/api/save-formid?sign=" + sign,
      data: {
        form_id: form_id
      },
      success:function(res){
        console.log(res);
      }
    })

    wx.request({
      url: "https://gallery.playonwechat.com/api/create-album?sign=" + sign + "&operator_id=" + operator_id,
      data:{
        album_name: inputValue
      },
      method:"POST",
      success:function(res){
        console.log(res);
        if(res.data.status){
          console.log(res.data.status);
          var aid = res.data.aid;
          wx.redirectTo({
            url: '../albumDetail/albumDetail?aid=' + aid,
          })
        }
      }
    })
  },
})