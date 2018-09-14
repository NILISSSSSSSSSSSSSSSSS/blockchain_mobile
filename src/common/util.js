// 过滤时间，转换成多少分钟之前的这种
export  function dateAgo(str){
    // console.log(str)
    return $vm.$moment(str).startOf('hour').fromNow()
}

//获取url
export function getUrl(){
   
  //判断是pc和html5,还是app
  return $vm.serverIP =="" ? `${window.location.protocol}//${window.location.host}` : $vm.serverIP;
 
}


// 跳转h5页面
export function turnToBrower(url){
    console.log(url)
    if(localStorage.getItem("isApp") && localStorage.getItem("isApp")=="true"){
        console.log("app用cordova跳转")
         var cordovaBrower=cordova.InAppBrowser.open(url, 'random_string', 'location=yes');
      }
      else{
        console.log("h5直接跳转")
        window.location.href=url
      }
}

