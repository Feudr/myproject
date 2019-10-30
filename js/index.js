function getId(id){
    return document.getElementById(id);
}

// 监听导航栏滚动固定事件
window.onscroll = function(){
    // 滚动时当前位置距离顶部的距离
    var topScroll = document.documentElement.scrollTop;
    console.log(topScroll);
    // 获取导航id
    var navFix = getId("navFix");
    // 滚动距离大于100时执行下面事件
    if(topScroll > 300){
        navFix.style.position = "fixed";
        navFix.style.left = "50%";
        navFix.style.marginLeft = "-595px";
        navFix.style.top = '0';
        navFix.style.zIndex ='99';
        // navFix.style.backgroundColor = "#fff";
    }else{
        //小于某个距离恢复原状
        navFix.style= "";
    }

}

// 获取所有的img标签
var Img = document.querySelectorAll("img");
var len = Img.length;
// 存储图片加载到的位置，避免每次都要从第一张图片开始遍历加载
var n =0;
// 监听浏览器的滚动事件,实现图片懒加载
var oldMethod = window.onscroll;
if(typeof oldMethod == "function"){
    window.onscroll = function() {
        oldMethod.call(this);
        var seeHeight = document.documentElement.clientHeight;
        var scrollTop = document.body.scrollTop || this.document.documentElement.scrollTop;
        for(var i = n; i < len; i++){
            if(Img[i].offsetTop < seeHeight + scrollTop){
                if(Img[i].getAttribute("src") == " "){
                    Img[i].src = Img[i].getAttribute("data-src");
                }
                n = i + 1;
                // console.log("n  = " +n);
            }
        }
    }
}


// 中间轮播图
/** 
分析：
1、鼠标放到小按钮上，可以切换图片
2、左右焦点按钮点击切换图片
3、自动播放图片
4、鼠标移入相框，焦点按钮出现，同时图片停止自动播放
5、鼠标移出相框…
6、小按钮和焦点按钮的同步：如果点击焦点图，此时切换到第三张图，
那么对应的小按钮也会自动切换到第三个（具备current属性样式）- - -和切换到哪一张图是对应的
*/

//封装动画函数
//函数参数:要移动的元素element和元素移动的目标位置target
function animate(element,target){
    //每次启动定时器前，先清理之前的定时器
    clearInterval(timeId);
    var timeId = setInterval(function(){
        //获取div的当前位置
        var current = element.offsetLeft;
        // 假设div每次移动10像素
        var step = 10;
        //判断移动方向是正是负                       
        step = current < target ? step : -step;
        //每次移动后的位置是
        current +=step;
        //判断移动后的位置是否到达目标位置
        if(Math.abs(target - current) > Math.abs(step)){
            //没有到达目标位置时
            element.style.left = current + "px";
        }else{
            clearInterval(timeId);
            element.style.left = target + "px";
        }
    },10);
}


//获取最外面的div
var box = getId("box");
//获取相框
var screen = box.children[0];
//获取相框的宽度
var imgWidth = screen.offsetWidth;
//获取ul
var ulObj = screen.children[0];
//获取ul中的所有li
var list = ulObj.children;
//获取存储左右按钮的div
var arr = screen.children[1];
//获取存储小圆点的div
var circle = screen.children[2];
//获取div中的所有小圆点
var dot = circle.children;
// 当前索引
var pic = 0;

// 注册鼠标进入小圆点的事件
dot.onmouseover = function() {
    // 先清除所有小圆点的类样式
    for(var j = 0;j < circle.children.length;j++){
        dot.className = "";
    }
    // 添加当前小圆点样式
    this.className = "active";
    // 获取当前鼠标进入小圆点的索引值
    pic = this.index;
    animate(ulObj,-pic*imgWidth);
}

//点击右边焦点
getId("right").onclick = clickHandle;
function clickHandle() {
//判断图片位置是否在克隆的最后一张图片
if (pic === list.length - 1) {
//如何从第6个图,跳转到第一个图
pic = 0;// 1 让pic为0
// 2 让ul回到起始位置
ulObj.style.left = 0 + "px";
}
pic++;
animate(ulObj, -pic * imgWidth);

//当pic为5，图片位于第六张时，用户看到的是第一张，此时circle中第一个按钮有颜色，最后一个没颜色
if (pic === 5) {
circle.children[0].className = "active";
circle.children[circle.children.length - 1].className = "";
}
else {
//先清除所有小圆点的类属性
for (var j = 0; j < circle.children.length; j++) {
circle.children[j].className = "";
}
//添加当前样式
circle.children[pic].className = "active";
}
}

//点击左边焦点
getId("left").onclick = function () {
//判断图片是否在起始位置
if (pic === 0) {
ulObj.style.left = -pic * imgWidth + "px";
}
pic--;
animate(ulObj, -pic * imgWidth);
//先清除所有的li类属性
for (var j = 0; j < circle.children.length; j++) {
circle.children[j].className = "";
}
//添加当前的li样式
circle.children[pic].className = "active";
};

// 自动播放(也是定时播放点击左右按钮的状态)
var timeId = setInterval(clickHandle,2000);
box.onmouseover = function() {
    // 鼠标进入时废除定时器
    clearInterval(timeId);
}
box.onmouseout = function() {
    // 鼠标离开开启定时器
    timeId = setInterval(clickHandle,2000);
}

















 




