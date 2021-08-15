layui.use(['layer', 'form', 'jquery', 'table'], function () {
  let form = layui.form,
    $ = layui.jquery,
    table = layui.table,
    layer = layui.layer;
  let SlideVerifyPlug, slideVerify;//滑块
  const cards = document.querySelectorAll('.card'),
    btns = document.querySelectorAll('.js-btn');

  $(function () {
    SlideVerifyPlug = window.slideVerifyPlug;
    slideVerify = new SlideVerifyPlug('#verify-wrap2', {
      wrapWidth: '265',
      initText: '请按住滑块',
      sucessText: '验证通过',
    });
    //重置滑块
    // $("#resetBtn").on('click',function(){ 
    //     slideVerify.resetVerify(); 
    // }) 
    //获取滑块状态
    // $("#getState").on('click',function(){ 
    //     alert(slideVerify.slideFinishState); 
    // }) 
  });

  back = function () {
    location.reload();
  }

  btns.forEach(btn => {
    btn.addEventListener('click', on_btn_click, true);
    btn.addEventListener('touch', on_btn_click, true);
  });

  function on_btn_click(e) {
    slideVerify.resetVerify();
    const nextID = e.currentTarget.getAttribute('data-target');
    const next = document.getElementById(nextID);
    if (!next) return;
    bg_change(nextID);
    view_change(next);
    return false;
  }

  /* Add class to the body */
  function bg_change(next) {
    document.body.className = '';
    document.body.classList.add('is-' + next);
  }

  /* Add class to a card */
  function view_change(next) {
    cards.forEach(card => { card.classList.remove('is-show'); });
    next.classList.add('is-show');
  }

  onclicksubmit = function () {
    let xh = $("#xh").val();
    let xm = $("#xm").val();
    let groupId = $("#groupId").val();
    let urls = "https://dagqxcx.ynnu.edu.cn/daqx/findStu_daqx.do?";

    if (xm.trim().length == 0) {
      layer.msg('学生姓名不能为空！', { icon: 5 });
      slideVerify.resetVerify();
      return false;
    }

    if (!(slideVerify.slideFinishState)) {
      layer.msg('请拖动滑块验证！', { icon: 5 });
    } else if (slideVerify.slideFinishState&&xm.trim().length != 0) {
      $.ajax({
        type: "POST",
        url: "https://cors.bughero.net/https://dagqxcx.ynnu.edu.cn/daqx/findStu_daqx.do",
        data: $('#f1').serialize(),
        async: true,
        beforeSend: function () {
          layer.msg('查询中请稍后...', {
            icon: 16
            , shade: 0.01
          });
        },
        error: function (request) {
          layer.closeAll();
          console.log("Connection error :" + request);
          if (xm.trim().length != 0) {
            urls += "xm=" + xm
          }
          if (xh.trim().length != 0) {
            urls += "&xh=" + xh
          }
          if (groupId.trim().length != 0) {
            urls += "&groupId=" + groupId
          }
          window.location.href = urls;
        },
        success: function (data) {
          slideVerify.resetVerify();

          data = data.replace(/<\s?img[^>]*>/gi, ""); //移除img标签
          data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""); //移除script标签
          let doc = document.createElement('html');
          doc.innerHTML = data;

          let dta = doc.getElementsByClassName('detailTable')[0];
          if (dta.rows.length > 0) {

            bg_change('result');
            view_change(document.getElementById('result'));

            let app = new Vue({
              el: '#result',
              data: {
                stu: {
                  name: '',
                  stuid: '',
                  college: '',
                  major: '',
                  daqx: '',
                  zctime: '',
                  postnum: '',
                  gzda: '',
                  zsbda: '',
                  bkda: '',
                  tycl: '',
                  dycl: '',
                  xsdj: '',
                  rxtime: '',
                  danum: ''
                },
                datas: [],//测试数据
                students: []
              },
              created: function () {
                this.students = this.datas.slice(0);
              },
              methods: {
                ref: function () {
                  this.students.splice(0, this.students.length);
                  this.students = this.datas.slice(0);
                },
                detail: function (x) {
                  let usr = app.students;
                  layer.open({
                    type: 1,
                    closeBtn: 1,
                    title: "[ " + usr[x].stuid + " - " + usr[x].name + " ] 详细信息 ",
                    area: ['550px', '600px'],
                    shadeClose: true,
                    content: $('#detail'),
                    success: function () {

                      table.render({
                        elem: '#tb_detail'
                        , cols: [[ //标题栏
                          { field: 'key', title: '', align: 'center', width: 200 }
                          , { field: 'value', title: '', align: 'left', }
                        ]]
                        , data: [
                          {
                            "key": "姓名"
                            , "value": usr[x].name
                          },
                          {
                            "key": "学号"
                            , "value": usr[x].stuid
                          },
                          {
                            "key": "学院"
                            , "value": usr[x].college
                          },
                          {
                            "key": "专业"
                            , "value": usr[x].major
                          },
                          {
                            "key": "档案去向"
                            , "value": usr[x].daqx
                          },
                          {
                            "key": "转出时间"
                            , "value": usr[x].zctime
                          },
                          {
                            "key": "邮寄单号"
                            , "value": usr[x].postnum
                          },
                          {
                            "key": "高中档案是否到达"
                            , "value": usr[x].gzda
                          },
                          {
                            "key": "专升本档是否到达"
                            , "value": usr[x].zsbda
                          },
                          {
                            "key": "本科档案是否到达"
                            , "value": usr[x].bkda
                          },
                          {
                            "key": "团员材料是否到达"
                            , "value": usr[x].tycl
                          },
                          {
                            "key": "党员材料是否到达"
                            , "value": usr[x].dycl
                          },
                          {
                            "key": "云南师范大学学生登记表"
                            , "value": usr[x].xsdj
                          },
                          {
                            "key": "入学年度"
                            , "value": usr[x].rxtime
                          },
                          {
                            "key": "档号"
                            , "value": usr[x].danum
                          },
                        ],
                        page: false
                        , limit: 15
                      });
                    }
                  });
                }
              }
            });

            //学生
            let stu = app.stu;
            for (let i = 0; i < dta.rows.length; i += 16) {
              stu = {
                name: '',
                stuid: '',
                college: '',
                major: '',
                daqx: '',
                zctime: '',
                postnum: '',
                gzda: '',
                zsbda: '',
                bkda: '',
                tycl: '',
                dycl: '',
                xsdj: '',
                rxtime: '',
                xsdj: ''
              }

              stu.name = dta.rows[i].lastElementChild.innerText.replace(/\s*/g, "");
              stu.stuid = dta.rows[i + 1].lastElementChild.innerText.replace(/\s*/g, "");
              stu.college = dta.rows[i + 2].lastElementChild.innerText.replace(/\s*/g, "");
              stu.major = dta.rows[i + 3].lastElementChild.innerText.replace(/\s*/g, "");
              stu.daqx = dta.rows[i + 4].lastElementChild.innerText.replace(/\s*/g, "");
              stu.zctime = dta.rows[i + 5].lastElementChild.innerText.replace(/\s*/g, "");
              stu.postnum = dta.rows[i + 6].lastElementChild.innerText.replace(/\s*/g, "");
              stu.gzda = dta.rows[i + 7].lastElementChild.innerText.replace(/\s*/g, "");
              stu.zsbda = dta.rows[i + 8].lastElementChild.innerText.replace(/\s*/g, "");
              stu.bkda = dta.rows[i + 9].lastElementChild.innerText.replace(/\s*/g, "");
              stu.tycl = dta.rows[i + 10].lastElementChild.innerText.replace(/\s*/g, "");
              stu.dycl = dta.rows[i + 11].lastElementChild.innerText.replace(/\s*/g, "");
              stu.xsdj = dta.rows[i + 12].lastElementChild.innerText.replace(/\s*/g, "");
              stu.rxtime = dta.rows[i + 13].lastElementChild.innerText.replace(/\s*/g, "");
              stu.xsdj = dta.rows[i + 14].lastElementChild.innerText.replace(/\s*/g, "");

              app.students.push(stu);
            }
            layer.closeAll();//关闭加载动画
          } else {
            flag = true;
            layer.msg('暂未找到有关信息！', { icon: 5 });
          }
        }
      });
    }
    return false;
  }
  //下载信息
  onclickprintbys = function (xm, xh) {
    window.location.href = "http://dagqxcx.ynnu.edu.cn:443/daqx/printStuInfo.do?groupId=2153501&xm=" + encodeURI(encodeURI(xm)) + "&xh=" + xh;
  }

});