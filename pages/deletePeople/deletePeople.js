// pages/deletePeople/deletePeople.js
const app = getApp();
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    str:[]
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    var that = this;
    var members = wx.getStorageSync("members");
    
    for(let i=0;i<members.length;i++){
      members[i].active = false;
    } 
    that.setData({
      members
    })
  },


  selected(e){
    var that = this;
    var mid = wx.getStorageSync("mid");
    var currentMid = e.currentTarget.dataset.mid;
    var members = that.data.members;
    var str = that.data.str;
    if(mid == currentMid){
      wx.showModal({
        title: '温馨提示',
        content: '不要剔除自己哦！',
        showCancel:false,
        success:function(res){}
      })
    }else{
      var idx = e.currentTarget.dataset.idx;
      members[idx].active = true;
      str.push(members[idx].mid);
      that.setData({
        members,
        str
      })  
    }
  },

  delete(){
    var that = this;
    var operator_id = wx.getStorageSync("operator_id");
    var sign = wx.getStorageSync("otherSign");
    var aid = wx.getStorageSync("aid");
    var str = that.data.str;
    wx.request({
      url: "https://gallery.playonwechat.com/api/manage-album-member?sign=" + sign + "&operator_id=" + operator_id,
      data: {
        aid,
        mids: str.join(","),
        type: -1
      },
      success: function (res) {
        console.log(res);
        if(res.data.status){
          wx.redirectTo({
            url: '../setting/setting?aid=' + aid,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },

})