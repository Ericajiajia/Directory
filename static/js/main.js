/**
 * Created by faraway on 17-3-6.
 */
//缩短一下两个选择器
function q(str){
    return(document.querySelector(str));
}
function qAll(str){
    return(document.querySelectorAll(str));
}
var positionEle;//当前选中的目录所对应的元素
var eleInEdit;//在编辑中的目录所对应的元素
var rightEle;//右键弹出菜单时对应的元素
var rightEle2;//右键弹出菜单时对应的元素
var eleInEdit2;//右键弹出菜单时对应的元素
var values = {};
var fileInEdit;
function treeButtonOnClick(event){//打开或关闭文件夹的方法
    var parentNode =event.target.parentNode;
    parentNode.className = parentNode.classList.contains("closed")?"node open":"node closed";
    if(getOffset(positionEle).top === 0){
        positionEle = parentNode.querySelector("span");
        var top = getOffset(positionEle).top - getOffset(q("#tree")).top;
        q("div.highlight-bar").style.transform = "translateY("+top+ "px)";
    }
}
function getOffset(ele){//获取绝对offset的方法
    var x = 0;
    var y = 0;
    while(ele && !isNaN(ele.offsetLeft) && !isNaN(ele.offsetTop)){
        x+=ele.offsetLeft - ele.scrollLeft;
        y+=ele.offsetTop - ele.scrollTop;
        ele=ele.offsetParent;
    }
    return {top:y,left:x};
}
function itemOnClick(event){//文件夹说对应的元素的点击事件
    if(event.target.nodeName == "SPAN"){
        positionEle = event.target;
        var top = getOffset(event.target).top - getOffset(q("#tree")).top;
        q("div.highlight-bar").style.transform = "translateY("+top+ "px)";
        /*下面编写和左2栏交互的代码*/
        var ul = q("ul.files-list-ul");
        ul.innerHTML = "";
        var li = event.target.parentNode;
        var lowerLis = li.querySelector("ul").childNodes;
        if(lowerLis.length>0){
            q("div.files-list>div").classList.remove("empty");
            for(var i = 0;i<lowerLis.length;i++){
                ul.appendChild(left2NewItem(lowerLis[i]));
            }
        }else{
            q("div.files-list>div").classList.add("empty");
        }
    }
}
function treeContextMenu(event){//弹出菜单的拦截事件
    if (document.all)
        window.event.returnValue = false;
    else
        event.preventDefault();
    var menu = q("div.contextMenu");
    rightEle = event.target;
    menu.style.top = event.clientY + "px";
    menu.style.left = event.clientX + "px";
    menu.focus();
}
function treeContextMenuRight(event){//弹出菜单的拦截事件
    if (document.all)
        window.event.returnValue = false;
    else
        event.preventDefault();
    var menu = q("div.contextMenu-right");
    var i = 0;
    while((rightEle2 = event.path[i++]).nodeName!= "LI"){}
    //var li_ = q(".left2>li[data-date='"+li.dataset.date+"']");
    menu.style.top = event.clientY + "px";
    menu.style.left = event.clientX + "px";
    menu.focus();
}
function newNode(title,childList){//新建文件夹
    //动态创建节点的方式来创建
    var li = document.createElement("LI");
    li.classList.add("node");
    if(childList.length<=0)li.classList.add("empty");
    li.classList.add("closed");
    var button = document.createElement("BUTTON");
    button.addEventListener("click",treeButtonOnClick);
    var span = document.createElement("span");
    span.addEventListener("click",itemOnClick);
    span.addEventListener("contextmenu",treeContextMenu);
    span.classList.add("icon-folder");
    span.classList.add("icon");
    span.innerHTML = title;
    var ul = document.createElement("UL");
    ul.classList.add("container");
    for(var i =0; i<childList.length; i++){
        ul.appendChild(childList[i]);
    }
    li.appendChild(button);
    li.appendChild(span);
    li.appendChild(ul);
    li.dataset.date = Date.now();
    return(li);
}
function newFile(title){//新建文件
    var li = document.createElement("LI");
    li.classList.add("file");
    var span = document.createElement("span");
    span.innerHTML = title;
    li.appendChild(span);
    li.dataset.date = Date.now();
    return(li);
}
function left2NewItem(leftLi){
    var li = document.createElement("LI");
    li.addEventListener("contextmenu",treeContextMenuRight);
    li.dataset.date = leftLi.dataset.date;
    var divTitle = document.createElement("DIV");
    var span = document.createElement("SPAN");
    var divDate = document.createElement("DIV");
    li.classList.add("folder");
    divTitle.classList.add("title");
    divTitle.style.display = "block";
    span.classList.add("icon");
    if(leftLi.classList.contains("node")){
        span.classList.add("icon-folder-blue");
        li.addEventListener("click",function(event){
            q("textarea").classList.remove("show");
            var i = 0;
            var li;
            while((li =event.path[i++]).nodeName!= "LI"){}
            var li_ = q("li[data-date='"+li.dataset.date+"']");
            li_.querySelector("span").click();
        });
    }else{
        if(!values.hasOwnProperty(leftLi.dataset.date)){
            values[leftLi.dataset.date] = "";
        }
        span.classList.add("icon-file-blue");
        li.addEventListener("click",function(event){
            q("textarea").classList.add("show");
            var i = 0;
            var li;
            while((li =event.path[i++]).nodeName!= "LI"){}
            q("textarea").value = values[li.dataset.date];
            fileInEdit = li.dataset.date;
        });
    }
    span.innerHTML = leftLi.querySelector("span").innerHTML;
    divTitle.appendChild(span);
    span = document.createElement("SPAN");
    span.classList.add("icon");
    span.classList.add("icon-delete");
    span.addEventListener("click",function(event){
        var liRight = event.target.parentNode.parentNode;
        console.log(liRight);
        var ul = positionEle.parentNode.querySelector("ul");
        var li = ul.querySelector("li[data-date='"+liRight.dataset.date+"']");
        ul.removeChild(li);
        positionEle.click();
    });
    divTitle.appendChild(span);
    divDate.classList.add("date");
    span = document.createElement("SPAN");
    span.innerHTML = (new Date(parseInt(leftLi.dataset.date))).toLocaleDateString();
    divDate.appendChild(span);
    divTitle.style.display = "block";
    li.appendChild(divTitle);
    li.appendChild(divDate);
    return li;

}
function initRoot(){//初始化root文件夹
    var div = document.createElement("DIV");
    div.setAttribute("id","tree");
    div.style.display = "block";
    div.classList.add("node");
    div.classList.add("closed");
    var button = document.createElement("BUTTON");
    button.addEventListener("click",treeButtonOnClick);
    var span = document.createElement("span");
    positionEle = span;
    span.innerHTML = "我的文件夹";
    span.classList.add("icon-folder");
    span.classList.add("icon");
    span.addEventListener("contextmenu",treeContextMenu);
    span.addEventListener("click",itemOnClick);
    var ul = document.createElement("ul");
    ul.classList.add("container");
    div.appendChild(button);
    div.appendChild(span);
    div.appendChild(ul);
    return(div);
}
function initEventListener(){//初始化各种事件
    //为input设置事件
    q("#rename-input").addEventListener("blur",function(event){
        eleInEdit.innerHTML = event.target.value;
        event.target.style.display = "none";
        positionEle.parentNode.querySelector("span").click();
    });
    q("#rename-input").addEventListener("keydown",function(a){
        if(a.keyCode === 13){
            event.target.blur();
        }
    });

    q("#rename-input-2").addEventListener("blur",function(event){
        eleInEdit2.querySelector("span").innerHTML = event.target.value;
        event.target.style.display = "none";
        //positionEle.parentNode.querySelector("span").click();
        var ul = positionEle.parentNode.querySelector("ul");
        var li = ul.querySelector("li[data-date='"+rightEle2.dataset.date+"']");
        li.querySelector("span").innerHTML = event.target.value;
    });
    q("#rename-input-2").addEventListener("keydown",function(a){
        if(a.keyCode === 13){
            event.target.blur();
        }
    });
    //注册两个功能菜单的点击事件
    q("div.new>div>span").addEventListener("click",function(){
        var ul = q("div.new>div>ul");
        ul.focus();
    });
    q("div.upload>div>span").addEventListener("click",function(){
        var ul = q("div.upload>div>ul");
        ul.focus();
    });
    //新建目录功能
    q("#new-folder").addEventListener("click",function(){
        q("div.new>div>ul").blur();
        var ul = positionEle.parentNode.querySelector("ul");
        if(positionEle.parentNode.classList.contains("closed")){
            positionEle.parentNode.classList.remove("closed");
            positionEle.parentNode.classList.add("open");
        }
        var node = newNode("未命名",[]);
        ul.appendChild(node);
        if(ul.parentNode.classList.contains("empty")){
            ul.parentNode.classList.remove("empty");
        }
        eleInEdit = node.querySelector("span");
        var offset = getOffset(eleInEdit);
        q("#rename-input").style.display = "block";
        q("#rename-input").style.top = (offset.top)+ "px";
        q("#rename-input").style.left = offset.left + 20 + "px";
        q("#rename-input").select();
    });
    //新建md文件功能
    q("#new-md").addEventListener("click",function(){
        q("div.new>div>ul").blur();
        var file = newFile("新建Markdown文件");
        var ul = positionEle.parentNode.querySelector("ul");
        ul.appendChild(file);
        positionEle.click();
    });
    //重命名功能
    q("#rename-folder").addEventListener("click",function(){
        q("div.contextMenu").blur();
        eleInEdit = positionEle;
        var offset = getOffset(eleInEdit);
        q("#rename-input").style.display = "block";
        q("#rename-input").style.top = (offset.top)+ "px";
        q("#rename-input").style.left = offset.left + 20 + "px";
        q("#rename-input").select();
    });
    q("#rename-folder-2").addEventListener("click",function(){
        q("div.contextMenu-right").blur();
        eleInEdit2 = rightEle2;
        var offset = getOffset(eleInEdit2);
        q("#rename-input-2").style.display = "block";
        q("#rename-input-2").style.top = offset.top +14 + "px";
        q("#rename-input-2").style.left = offset.left + 30 + "px";
        q("#rename-input-2").select();
    });
    //删除目录，暂时设定为对右键点击的元素删除
    q("#delete-folder").addEventListener("click",function(){
        var li = rightEle.parentNode;
        if(li.nodeName === "LI") {
            var upperLi = positionEle.parentNode.parentNode.parentNode;
            li.parentNode.removeChild(li);
            if (getOffset(rightEle).top === getOffset(positionEle).top) {
                //同一元素
                //setTimeout(function(){upperLi.querySelector("span").click()},100);
                upperLi.querySelector("span").click();
                //上一级
            }
            if(upperLi.querySelector("ul").childNodes.length<=0){
                upperLi.classList.add("empty");
            }
        }
        q("div.contextMenu").blur();
    });
    q("#delete-folder-ex").addEventListener("click",function(){
        var li = rightEle.parentNode;
        if(li.nodeName === "LI") {
            var upperLi;
            var tempUl = li.parentNode;
            tempUl.removeChild(li);
            li = tempUl.parentNode;
            console.log(li.parentNode);
            while(tempUl.querySelectorAll("li").length === 0){
                tempUl = li.parentNode;
                tempUl.removeChild(li);
                li = tempUl.parentNode;
                if(li.nodeName == "DIV"){
                    break;
                }
            }
            upperLi = li;
            if (getOffset(rightEle).top === getOffset(positionEle).top) {
                //同一元素
                //setTimeout(function(){upperLi.querySelector("span").click()},100);
                upperLi.querySelector("span").click();
                //上一级
            }
            if(upperLi.querySelector("ul").childNodes.length<=0){
                upperLi.classList.add("empty");
            }
        }
        q("div.contextMenu").blur();
    });
    q("#delete-folder-2").addEventListener("click",function(){
        var ul = positionEle.parentNode.querySelector("ul");
        var li = ul.querySelector("li[data-date='"+rightEle2.dataset.date+"']");
        ul.removeChild(li);
        positionEle.click();
        q("div.contextMenu-right").blur();
    });
    q("#new-md-right").addEventListener("click",function(){
        q("#new-md").click();
    });
    q("textarea").addEventListener("blur",function(){
        values[fileInEdit] = q("textarea").value;
    });
}
window.onload = function(){
    var root = initRoot();
    q("div.left1").appendChild(root);
    //两个示例文件夹的初始化命令
    root.querySelector("ul").appendChild(newNode("foobar",[]));
    initEventListener();
    positionEle.parentNode.querySelector("button").click();
};