var xhr = new XMLHttpRequest();
xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',false);
xhr.send(null);
// xhr.onload = function(){
    const data = JSON.parse(xhr.response).result.records    
// }

var selector = document.getElementById('area');
var btn = document.querySelectorAll('.btnArea-inner li .btn');
var list = document.querySelector('.list');
var title = document.querySelector('.areaTitle');
var btnLen = btn.length;

//渲染下拉
function renderOptions() {
  len = data.length;
  let zoneList = [];
  for (let i=0; i<len; i++) {
    zoneList.push(data[i].Zone);
  }
  
  let ZoneClean = [];
  zoneList.forEach(function(value) {
    if (ZoneClean.indexOf(value) == -1) {
      ZoneClean.push(value);
    }
  })
  
  const ZClen = ZoneClean.length;
  for (let i=0; i<ZClen; i++) {
    const el = document.createElement('option');
    el.textContent = ZoneClean[i];
    el.setAttribute('value', ZoneClean[i]);
    selector.appendChild(el);
  }
}
//下拉選單change
function selectorChange(e) {

    if (e.target.value == '收藏') {
        getFavo();
      
    } else {
        len = data.length;
        var str = '';

        title.textContent = e.target.value;

        for (var i = 0; i < len; i++) {
            if (data[i].Zone == e.target.value) {
                str += '<li class="listCard"><div class="cardTop" data-url="' + data[i].Picture1 + '" style="background-image:url(' + data[i].Picture1 + ')"><h3>' + data[i].Name + '</h3><p>' + data[i].Zone + '</p></div><div class="cardBottom"><div class="favorite" style="width:20px;height:20px"></div><p class="time">' + data[i].Opentime + '</p><p class="add">' + data[i].Add + '</p><p class="tel">' + data[i].Tel + '</p><p class="type">' + data[i].Ticketinfo + '</p></div></li>';
            }
        }
        list.innerHTML = str;
    }
}
//熱門行政區click
function btnClick(e) {

    e.preventDefault();
    len = data.length;

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    title.textContent = e.target.value;

    for (var i = 0; i < len; i++) {
        if (data[i].Zone == e.target.value) {
            var ele = document.createElement('li');
            ele.setAttribute('class', 'listCard');
            ele.innerHTML = '<div class="cardTop" data-url="' + data[i].Picture1 + '" style="background-image:url(' + data[i].Picture1 + ')"><h3>' + data[i].Name + '</h3><p>' + data[i].Zone + '</p></div><div class="cardBottom"><div class="favorite" style="width:20px;height:20px"></div><p class="time">' + data[i].Opentime + '</p><p class="add">' + data[i].Add + '</p><p class="tel">' + data[i].Tel + '</p><p class="type">' + data[i].Ticketinfo + '</p></div>';
            list.appendChild(ele);
        }
    }
}

//事件綁定
selector.addEventListener('change', selectorChange, false);

for (var i = 0; i < btnLen; i++) {
    btn[i].addEventListener('click', btnClick, false);
}

/*-------------------收藏-------------------*/
var favoData = JSON.parse(localStorage.getItem('favorite')) || [];

function setFavo(e) {
    var favoLen = favoData.length;
    var picture1 = e.target.parentElement.parentElement.children[0].dataset.url;
    var name = e.target.parentElement.parentElement.children[0].children[0].innerHTML;
    var zone = e.target.parentElement.parentElement.children[0].children[1].innerHTML;
    var opentime = e.target.parentElement.children[1].innerHTML;
    var add = e.target.parentElement.children[2].innerHTML;
    var tel = e.target.parentElement.children[3].innerHTML;
    var ticketinfo = e.target.parentElement.children[4].innerHTML;
    //判斷點擊目標
    if (e.target.className !== 'favorite' && e.target.className !== 'del') {
        return;
    }
    //加入收藏
    else if (e.target.className == 'favorite') {
        
        // 判斷是否重複
        if (favoLen > 0) {
            for (var i = 0; i < favoLen; i++) {
                if (name == favoData[i].Name) {
                    alert('已在收藏當中')
                    return;
                }
            }
        }
        var favoItem = {
            Picture1: picture1,
            Name: name,
            Zone: zone,
            Opentime: opentime,
            Add: add,
            Tel: tel,
            Ticketinfo: ticketinfo,
        }

        favoData.push(favoItem);

    }
    // 刪除收藏
    else if (e.target.className == 'del') {
        var index = e.target.dataset.index;
        favoData.splice(index, 1);
        getFavo();
    }

    localStorage.setItem('favorite', JSON.stringify(favoData));
}

//撈資料渲染收藏畫面
function getFavo() {
    favoLen = favoData.length;
    var str = '';
    for (var i = 0; i < favoLen; i++) {
        str += '<li class="listCard"><div class="cardTop" data-url="' + favoData[i].Picture1 + '" style="background-image:url(' + favoData[i].Picture1 + ')"><h3>' + favoData[i].Name + '</h3><p>' + favoData[i].Zone + '</p></div><div class="cardBottom"><div class="del" data-index="' + i + '" style="width:20px;height:20px"></div><p class="time">' + favoData[i].Opentime + '</p><p class="add">' + favoData[i].Add + '</p><p class="tel">' + favoData[i].Tel + '</p><p class="type">' + favoData[i].Ticketinfo + '</p></div></li>';

    }
    title.textContent = '收藏';
    list.innerHTML = str;
}

list.addEventListener('click', setFavo, false);
//執行渲染下拉選單
renderOptions();
//渲染收藏
getFavo();

/*----------- goTop------------*/
$(function () {

    var $goTop = $('#goTopBtn');

    $goTop.click(function () {
        $('body,html').animate({
            'scrollTop': 0
        }, 600);
    })

    $goTop.css({'top': $(window).height() + $(window).scrollTop() - $goTop.height() * 2})

    $(window).scroll(function () {

        if ($(window).scrollTop() < 50) {

            $goTop.fadeOut(500);

        }else if ($(window).scrollTop() > 50) {

            $goTop.fadeIn(500);

            $goTop.stop().animate({'top': $(window).height() + $(window).scrollTop() - $goTop.height() * 4
            }, $(window).scrollTop() / 2)
        }
    })
})