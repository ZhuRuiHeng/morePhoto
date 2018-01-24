const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show:false, 
      checkboxs: 1, //0不展示  1展示
      finish:false, //是否拼完
      num: Math.random(),
      music_play: app.data.music_play,
      dataUrl: wx.getStorageSync('dataUrl'),
      button:true, //生成照片墙为false，回调中为true
      self:true,
      consList:[1,2,3,4,5,6,7,8,9,10,11,12]
  },
  onLoad: function (options) {
    console.log(options);
    let that = this;
    that.setData({
      temp_id: options.temp_id,
      pw_id: options.pw_id
    })
    wx.setStorageSync('temp_id', options.temp_id);
    if (app.AppMusic.src.length<2){
      console.log(app.AppMusic.src.length,'length');
      wx.request({
        url: app.data.apiurl3 + "photo/get-music?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("music:", res);
          var status = res.data.status;
          if (status == 1) {
            app.AppMusic.src = res.data.data.url;
            app.AppMusic.onPlay(() => {
              console.log('开始播放')
            })
            console.log('app.AppMusic')

            wx.setStorageSync('dataUrl', res.data.data.url);
            that.setData({
              dataUrl: res.data.data.url
            })
          } else {
            console.log(res.data.msg);
          }
          wx.hideLoading()
        }
      })
    }
  },
  onShow: function () {
    console.log('music_play', app.data.music_play);
    if (app.data.music_play == false) {
      app.AppMusic.onPause(() => {
        console.log('暂停播放');
        wx.setStorageSync('music_play', false);
        app.data.music_play = false;
        that.setData({
          music_play: false
        })
      })
    } else if(app.data.music_play == true){
      console.log(app.AppMusic.src,'src');
      app.AppMusic.play();
      app.AppMusic.onPlay(() => {
        console.log('开始播放');
        app.data.music_play = true;
        wx.setStorageSync('music_play', true)
        that.setData({
          music_play: true
        })
      })
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    that.setData({
      music_play: app.data.music_play
    })
    wx.request({
      url: app.data.apiurl + "photo/template-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data:{
        temp_id: that.data.temp_id,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        //console.log("模板详情:", res);
        var status = res.data.status;
        //console.log(JSON.parse(res.data.status));
        if (status == 1) {
          that.setData({
            photoInform: res.data.data,
            source_effect: res.data.data.source_effect,
          })
        }else {
          //tips.alert(res.data.msg);
        }
      },
    })
    //照片墙信息temp_id
    wx.request({
      url: app.data.apiurl3 + "photo/photo-wall-detail?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        pw_id: that.data.pw_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("照片墙信息:", res);
        var status = res.data.status;
        if (status == 1) {
          console.log(res.data.data.pic + '?' + that.data.num,111)
          that.setData({
            thumb: res.data.data.pic +'?'+ that.data.num,
            temp_id: res.data.data.temp_id,
            self: res.data.data.self
          })
          // 模板详情
          wx.request({
            url: app.data.apiurl + "photo/template-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
            data: {
              temp_id: that.data.temp_id
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              //console.log("模板详情:", res);
              var status = res.data.status;
              //console.log(JSON.parse(res.data.status));
              if (status == 1) {
                that.setData({
                  photoInform: res.data.data,
                  source_effect: res.data.data.source_effect
                })
              }else {
                tips.alert(res.data.msg);
              }
            },
          })
          // 请求位置
          if (res.data.data.temp_id==253){
              wx.request({
                url: app.data.apiurl + "photo/can-up-position-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
                data: {
                  pw_id: that.data.pw_id
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  //console.log("照片可上传位置253:", res);
                  //console.log("照片可上传位置253:", res.data.data);
                  let consList = that.data.consList;
                  function sortNumber(a, b) {
                    return a - b
                  }
                 // consList.sort(sortNumber);
                  console.log(consList,"consList");
                  var status = res.data.status;
                  if (status == 1) {
                    let allPosition = res.data.data;
                    let arr = [];
                    allPosition.sort(sortNumber);
                    //console.log(allPosition, "allPosition");
                    for (let i = 0; i < consList.length; i++) {
                      if (allPosition[i] != consList[i]) {
                        // console.log(i);
                        allPosition.splice(i, 0, 0);
                      }
                    }
                   // console.log('_allPosition:', allPosition);
                   // console.log('arr:', arr);
                    that.setData({
                      allPosition: allPosition,
                      _allPosition: res.data.data
                    })
                  }
                }
              })
          }
        }else{
          tips.alert(res.data.msg);
          setTimeout(function(){
            wx.switchTab({
              url: '../square/square',
            })
          }, 3000)
        }
      }
    })
    
    // 判断照片墙是否已满
    wx.request({
        url: app.data.apiurl + "photo/is-full?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片墙是否已满:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              finish: res.data.data.flag
            })
          } else {
            //console.log(res.data.msg);
          }
          
        }
    })
  },
  management() {
    wx.navigateTo({
      url: '../setting/setting?pw_id=' + this.data.pw_id
    })
  },
  //我也要玩
  myplay() {
    wx.switchTab({
      url: '../templatePhoto/templatePhoto',
    })
  },
  // 分享好友
  friends() {
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading'
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: app.data.apiurl3 + "photo/share?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: that.data.pw_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        //console.log("好友拼图照片:", res);
        var status = res.data.status;
        // if (status == 1) {
          that.setData({
            friendsImg: res.data
          })
          let friendsImg = res.data.data;
          //console.log("friendsImg:", res.data.data);
          let friendsImgs = friendsImg.split();
          // console.log(friendsImg)
          // console.log(friendsImgs)
          wx.previewImage({
            current: friendsImg, // 当前显示图片的http链接
            urls: friendsImgs // 需要预览的图片http链接列表
          })

        // } else {
        //   console.log(res.data.msg);
        // }
        
      }
    })
  },
  // 音乐
  bindPlay() {
    console.log('bindPlay', app.AppMusic.src)
    var that = this;
    let music_play = that.data.music_play;
    if (music_play == true) {
      app.AppMusic.pause();
      app.AppMusic.onPause(() => {
        console.log('暂停播放');
        wx.setStorageSync('music_play', false);
        app.data.music_play = false;
        that.setData({
          music_play: false
        })
      })
    } else {
      app.AppMusic.play();
      app.AppMusic.onPlay(() => {
        console.log('开始播放');
        app.data.music_play = true;
        wx.setStorageSync('music_play', true)
        that.setData({
          music_play: true
        })
      })
    }

  },
  // 是否同意展示
  Change: function (e) {
    console.log(e);
    let that = this;
    console.log('checkbox发生change事件，携带value值为：', e.currentTarget.dataset.check);
    if (e.currentTarget.dataset.check == 1) {
      that.setData({
        checkboxs: 1
      })
    } else {
      that.setData({
        checkboxs: 0
      })
    }
  },
  // 传过来可以上传几张照片
  upPhoto: function (e) {
    let that = this;
    console.log(e, that.data.temp_id);
    let form_id = e.detail.formId;
    wx.setStorageSync('form_id', e.detail.formId)
    let sign = wx.getStorageSync('sign');
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
    if (that.data.temp_id==1){
      wx.showLoading({
        title: '加载中'
      });
      // 请求位置
      wx.request({
        url: app.data.apiurl + "photo/can-up-position-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片可上传位置:", res);
          console.log(res.data.data, 111);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              position: res.data.data[0]
            })
            let position = res.data.data[0];
            let source_effect = that.data.source_effect;
            console.log(position);
            console.log(source_effect);
            var arr = []
            for (var i in source_effect) {
              arr.push(source_effect[i]); //属性
              //arr.push(object[i]); //值
            }
            // for (let i = 0; i < arr.length; i++) {
            let weizhi = source_effect[position][0];
            console.log('weizhi', weizhi);
            weizhi.split('x');
            let shuju = weizhi.split('x');
            console.log('shuju:', shuju);
            that.setData({
              width: shuju[0],
              height: shuju[1]
            })
            wx.setStorageSync('weizhi', weizhi);
            wx.setStorageSync('width', shuju[0]);
            wx.setStorageSync('height', shuju[1]);
            wx.setStorageSync('position', position);
            // }
            // that

            // 占位置给后台start - up - picture
            wx.request({
              url: app.data.apiurl + "photo/start-up-picture?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
              data: {
                pw_id: that.data.pw_id,
                position: that.data.position,
                form_id: form_id
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("位置后台:", res);
                var status = res.data.status;
                if (status == 1) {
                  console.log('传递成功')
                } else {
                  console.log(res.data.msg);
                }
                
              }
            })
            // 上传 
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                console.log("选择相册", res);
                const src = res.tempFilePaths[0]
                console.log('src', src);
                wx.setStorageSync('temp_id', that.data.temp_id);
                wx.setStorageSync('pw_id', that.data.pw_id);
                wx.redirectTo({
                  url: `../avatarUpload/upload/upload?src=${src}`
                })
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                tips.loading('上传中');
                tips.loaded(); //消失
                console.log(app.data.apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid);

              }
            })

          }else {
            console.log(res.data.msg);
          }
          wx.hideLoading()
        }
      })
    }else if (that.data.temp_id == 253) {
      console.log('temp_id')
      wx.showLoading({
        title: '加载中'
      });
        // 选择位置
      if (!that.data.position1){
            tips.alert('请选择星座！');
            return;
        }
      let position = that.data.position1;
      // 请求位置
      wx.request({
        url: app.data.apiurl + "photo/can-up-position-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id,
          form_id: form_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片可上传位置:", res);
          console.log(res.data.data, 111);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              allPosition: res.data.data
            })
            let source_effect = that.data.source_effect;
            console.log(position);
            console.log(source_effect);
            var arr = []
            for (var i in source_effect) {
              arr.push(source_effect[i]); //属性
              //arr.push(object[i]); //值
            }
            // for (let i = 0; i < arr.length; i++) {
            let weizhi = source_effect[position][0];
            console.log('weizhi', weizhi);
            weizhi.split('x');
            let shuju = weizhi.split('x');
            that.setData({
              width: shuju[0],
              height: shuju[1]
            })
            wx.setStorageSync('weizhi', weizhi);
            wx.setStorageSync('width', shuju[0]);
            wx.setStorageSync('height', shuju[1]);
            wx.setStorageSync('position', position);
            // }
            // that

            // 占位置给后台start - up - picture
            wx.request({
              url: app.data.apiurl + "photo/start-up-picture?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
              data: {
                pw_id: that.data.pw_id,
                position: that.data.position,
                form_id: form_id
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("位置后台:", res);
                var status = res.data.status;
                if (status == 1) {
                  console.log('传递成功')
                } else {
                  console.log(res.data.msg);
                }

              }
            })
            // 上传 
            wx.chooseImage({
              count: 1, // 默认9that.data.photoInform.counts.length
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                console.log("选择相册", res);
                const src = res.tempFilePaths[0]
                console.log('src', src);
                wx.setStorageSync('pw_id', that.data.pw_id);
                wx.setStorageSync('temp_id', that.data.temp_id);
                // wx.redirectTo({
                //   url: `../wx-cropper1/wx-cropper1?src=${src}&width=${that.data.width}&height=${that.data.height}`
                // })
                wx.redirectTo({
                  url: `../avatarUpload/upload2/upload2?src=${src}&position=${that.data.position}&width=${that.data.width}&height=${that.data.height}`
                })
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                tips.loading('上传中');
                tips.loaded(); //消失
              }
            })
          } else {
            console.log(res.data.msg);
          }
          wx.hideLoading()
        }
      })
    }else{
      wx.setStorageSync('temp_id', that.data.temp_id);
      wx.setStorageSync('pw_id', that.data.pw_id);
      // 请求位置
      wx.request({
        url: app.data.apiurl + "photo/can-up-position-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id,
          form_id: form_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片可上传位置:", res);
          console.log(res.data.data,111);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              position: res.data.data[0]
            })
            let position = res.data.data[0];
            let source_effect = that.data.source_effect;
            console.log(position);
            console.log(source_effect);
            var arr = []
            for (var i in source_effect) {
              arr.push(source_effect[i]); //属性
              //arr.push(object[i]); //值
            }
            // for (let i = 0; i < arr.length; i++) {
              let weizhi = source_effect[position][0];
              console.log('weizhi', weizhi);
              weizhi.split('x');
              let shuju = weizhi.split('x');
              that.setData({
                width: shuju[0],
                height: shuju[1]
              })
              wx.setStorageSync('weizhi', weizhi);
              wx.setStorageSync('width', shuju[0]);
              wx.setStorageSync('height', shuju[1]);
              wx.setStorageSync('position', position);
            // }
          // that
            
            // 占位置给后台start - up - picture
            wx.request({
              url: app.data.apiurl + "photo/start-up-picture?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
              data: {
                pw_id: that.data.pw_id,
                position: that.data.position,
                form_id: form_id
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("位置后台:", res);
                var status = res.data.status;
                if (status == 1) {
                  console.log('传递成功')
                } else {
                  console.log(res.data.msg);
                }
                
              }
            })
          // 上传 
            wx.chooseImage({
              count: 1, // 默认9that.data.photoInform.counts.length
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                console.log("选择相册", res);
                const src = res.tempFilePaths[0]
                console.log('src', src);
                wx.setStorageSync('pw_id', that.data.pw_id);
                wx.setStorageSync('temp_id', that.data.temp_id);
                // wx.redirectTo({
                //   url: `../wx-cropper1/wx-cropper1?src=${src}&width=${that.data.width}&height=${that.data.height}`
                // })
                wx.redirectTo({
                  url: `../avatarUpload/upload2/upload2?src=${src}&position=${that.data.position}&width=${that.data.width}&height=${that.data.height}`
                })
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                tips.loading('上传中');
                tips.loaded(); //消失
              }
            })
          } else {
            console.log(res.data.msg);
          }
          wx.hideLoading()
        }
      })
    }
  },
  // 星座
  xingzuo(e){
    let that = this;
    let position1 = e.currentTarget.dataset.position;
    let rol = e.currentTarget.dataset.rol;
    let index = e.currentTarget.dataset.index;
    let allPosition = that.data.allPosition;
    console.log(position1, rol, index, allPosition);
    for (let i = 1; i < allPosition.length; i++) {
      if (allPosition[i] == -1) {
        console.log(i);
        allPosition[i] = i;
      }
    }
    console.log('position1:', position1);
    wx.setStorageSync('position1', position1);
    wx.setStorageSync('position', position1);
    let rols = ['水瓶座', '双鱼座', '白羊座', '双子座', '金牛座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座','摩羯座'];
    let name = rols[index];
    if (rol==0){
      tips.alert('此星座有人上传！');
    }else{
      tips.success(name)
    }
    allPosition[index]= '-1' ;
    console.log(allPosition[index]);
    that.setData({
      position1: position1,
      allPosition: allPosition
    })
  },
  checked(e){
    let that = this;

  },
  savePhoto(e){
      let that = this;
      wx.showToast({
        title: '照片墙生成中...',
        icon: 'loading'
      })
      that.setData({
        button:false
      })
      wx.request({
        url: app.data.apiurl2 + "photo/create-image?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id,
          is_show: that.data.checkboxs
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("图片照片墙:", res);
          var status = res.data.status;
          if (status == 1) {
            let url = res.data.data;
            console.log(url);
            wx.previewImage({
              current: url, // 当前显示图片的http链接
              urls: [url] // 需要预览的图片http链接列表
            })
            
          } else {
            console.log(res.data.msg);
            tips.alert(res.data.msg)
          }
          that.setData({
            button: true
          })
          wx.hideLoading()
        }
      })
  },
  onShareAppMessage: function () {
    let that = this;
    console.log(that.data.pw_id);
    // 获取照片墙pwid
    return {
      title: "制作我们的照片墙",
      path: '/pages/templateInform/templateInform?pw_id=' + that.data.pw_id,
      success: function (res) {
        console.log(res);
        console.log('/pages/templateInform/templateInform?pw_id=' + that.data.pw_id);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  }
  
})