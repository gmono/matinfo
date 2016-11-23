//
var seles=[];//0:list 1:info
function active(fnode,rnode,infoobj) {
    if(fnode.hasAttribute('checked')) fnode.removeAttribute('checked');
    rnode.setAttribute('checked','checked');
    var desid=rnode.getAttribute('desid');
    eval("display_{0}({1})".format(desid,infoobj));
}
function loadpage(id){
    var node=document.getElementById(id);
    loader.loadToNode(node,id+'.html',false); //sync load
    eval("init_{0}({1})".format(id,funs));//init fun
}
var funs={};
var hisarr=[];
function hispush(sign) {
    if(hisarr.length>=5) hisarr.remove(0);
    hisarr.push(sign);
    var data=DataInterface.CompetFound(sign);
    //view operate
    var text=document.getElementById('history').innerHTML;
    var html=text.format(data.title);
}
funs.displayInfo=function(sign){
    //from page
    hispush(sign);
    active(seles[0],seles[1],DataInterface.CompetFound(sign));

}
funs.backToList=function(){
    active(seles[1],seles[0],listobj);
}
var listobj=null;
addinit(function () {
    seles.push(document.getElementById('selelist'));
    seles.push(document.getElementById('seleinfo'));
    listobj=DataInterface.GetCompetList();
    loadpage('list');
    loadpage('info');
    var sign=DataInterface.GetPageLSign();
    if(sign=="") {
        active(seles[1],seles[0],listobj);
    }
    else {
        active(seles[0],seles[1],DataInterface.CompetFound(sign));
    }
    document.getElementById('listbtn').onclick=function(){
        active(seles[1],seles[0],listobj);
    }
});
