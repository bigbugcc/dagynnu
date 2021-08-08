const cards = document.querySelectorAll('.card');
const btns = document.querySelectorAll('.js-btn');
let SlideVerifyPlug;
let slideVerify;

	function onclicksubmit(){
			var flag = true;
			var xh = $("#xh").val();

			var xm = $("#xm").val();
			if(xm==""){
				alert("学生姓名不能为空！");
				flag = false;
        slideVerify.resetVerify();
			}

			if(!(slideVerify.slideFinishState)){
				alert('请拖动滑块验证');
				flag = false;
			}else if(flag&&slideVerify.slideFinishState){
        $.ajax({  
          type: "POST",   
          url:"https://cors.bughero.net/https://dagqxcx.ynnu.edu.cn/daqx/findStu_daqx.do",  
          data:$('#f1').serialize(),// 序列化表单值  
          async: false,  
          error: function(request) {
            console.log("Connection error :"+request);
            slideVerify.resetVerify();
            flag = true;
          },  
          success: function(data) { 
            flag = false;
            slideVerify.resetVerify();
            var doc = document.createElement('div'); 
            doc.innerHTML = data;
            let table =  doc.getElementsByClassName('detailTable')[0];
            bg_change('result');
            view_change(document.getElementById('result'));
          }
        });
      }
			return flag;
	}
		//下载信息
		function onclickprintbys(xm,xh){
			window.location.href="http://dagqxcx.ynnu.edu.cn:443/daqx/printStuInfo.do?groupId=2153501&xm="+encodeURI(encodeURI(xm))+"&xh="+xh;
	}
		
		$(function(){ 
            console.log(parseFloat('1px')) 
            SlideVerifyPlug = window.slideVerifyPlug; 

            slideVerify = new SlideVerifyPlug('#verify-wrap2',{ 
                wrapWidth:'265', 
                initText:'请按住滑块', 
                sucessText:'验证通过', 
                    
            }); 
			//重置滑块
            // $("#resetBtn2").on('click',function(){ 
            //     slideVerify.resetVerify(); 
            // }) 
			//获取滑块状态
            // $("#getState2").on('click',function(){ 
            //     alert(slideVerify.slideFinishState); 
            // }) 
        })


btns.forEach(btn => {
  btn.addEventListener('click', on_btn_click, true);
  btn.addEventListener('touch', on_btn_click, true);
});

function on_btn_click(e) {
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
  cards.forEach(card => {card.classList.remove('is-show');});
  next.classList.add('is-show');
}