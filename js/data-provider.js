var compet = "http://kc.kffuck.com/compet/"; //数据获取基路径
var rawlink="http://kc.kffuck.com/";//基路径
//说明：目标网址格式 http://....../competview.html?sign
//总的来说 DataInterface有几个功能函数 GetPageLSign为获取页面的标记文本
//                                   GetSignFromUrl 从url得到sign
//                                  CompetFound为使用一个标记文本获取比赛信息对象的函数
//                                 AddCompet为添加一个比赛项目 返回这个比赛的标记文本，用于合成链接
//                                  isok为检测服务端是否可用 返回bool值
//                                  SignToLink 把sign转换为链接 为GetSignFromUrl 的反向函数
var DataInterface={};
DataInterface.GetPageLSign=function() {
    //取数据标志
    var pagelink = window.location.href;
    return DataInterface.GetSignFromUrl(pagelink);
}
DataInterface.GetSignFromUrl=function(url){
    var arr = url.split("?");
    if(arr.length<2) return "";//这是不带后缀的
    var sign = arr[arr.length - 1];
    return sign;
}
DataInterface.competlist=null;
DataInterface.GetCompetList=function() {
    if(DataInterface.competlist==null) DataInterface.competlist=DataInterface.UpdateCompetList();
    return DataInterface.competlist;
};
DataInterface.UpdateCompetList=function () {
    var obj=loader.GetObjectFromUrl(compet,'GET');
    if(obj.code=="200") return obj.compets;
    return null;
}
DataInterface.SignToLink=function (baseurl,sign) {
    //合成sign链接
    //由于发布时指定的发布信息页面的地址不明 因此提供baseurl参数
    return "{0}?{1}".format(baseurl,sign);
    //以上 合成形如 http://..../xxxx.html?sign的链接地址
}

DataInterface.AddCompetOfData=function(cdata) {
    //添加一个比赛 失败返回null 成果返回link
    var ret = null;
    ret=loader.GetObjectFromUrl(compet,'POST',data);
    if(ret.code==200) return ret.link;
    else return null;
    //暂时采用同步加载
}
DataInterface.AddCompet=function(title,begin,signend,signbegin,profile,link,file,seen,entered) {
    //便利函数
    var data={
        "title": title,
        "signTimeBegin": signbegin.toUTCString(),
        "singTimeEnd": signend.toUTCString(),
        "beginTime": begin.toUTCString(),
        "profile": profile,
        "link": link,
        "file": file,
        "seen": seen,
        "entered": entered
    };
    return DataInterface.AddCompetOfData(data);
}
DataInterface.infolist={};
DataInterface.CompetFound=function(sign) {
    if(sign in infolist){
        return DataInterface.infolist[sign];
    }
    infolist[sign]=DataInterface.ReGCompetFound(sign);
    return infolist[sign];
}
DataInterface.ReGCompetFound=function (sign) {
    var link=compet+sign;//获得链接地址
    var text=loader.getTextFromUrl(link);
    var obj=JSON.parse(text);
    if(obj.code!=200) return null;
    return obj.compet;//返回的是一个对象数组
}
DataInterface.ClearInfoList=function () {
    DataInterface.infolist={};
}
DataInterface.isok=function() {
    //是否可用
    var obj=JSON.parse(loader.getTextFromUrl(rawlink));
    if(obj!=null&&obj!=undefined&&obj.name=="CLFStudio") return true;
    return false;
}