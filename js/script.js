console.log("page loaded")

//defining HTML elements
var html_username = document.getElementById("username");
var html_pages = document.getElementById("pages");
var html_offset = document.getElementById("offset");
var html_loadButton = document.getElementById("load");
var html_progress = document.getElementById("progress");
var html_container = document.getElementsByClassName("container")[0];
var html_download_txt = document.getElementById("txt");
var html_download_csv = document.getElementById("csv");
var html_download_json = document.getElementById("json");
var html_downloads = document.getElementById("downloads");
var html_loading = document.getElementById("loading");
var html_infos = document.getElementById("infos");
var html_preview = document.getElementById("preview")

//other variables
var valid_name = /^[\w-]{3,20}$/;
var test = "";
var done = false;
var RESULT = [];
var answer = [];
var count = 0;
var canceled = false;
var recently = {};

//functions
async function get(user,offset){
  var response = await fetch(`https://scratchproxy.deta.dev/users/${user}/followers?limit=40&offset=${offset}`);
  var data = await response.text();
  data = JSON.parse(data);
  answer = [];
  data.forEach(scratcher => {
    answer.push(scratcher.username);
    html_progress.value = (RESULT.length + answer.length)/count*100 
  });

  if(data.length != 40){done = true}
}

async function getCount(user,pages){
    var response = await fetch(`https://scratchdb.lefty.one/v3/user/info/${user}`);
    var status = await response.status;
    if(status == 404){
      alert("It seems like this user doesn't exist or he has been lost in space...");return(false)
    }else{
      var data = await response.text();
      data = JSON.parse(data);
      if(Object.hasOwn(data,"statistics")){count = data.statistics.followers;}
      else{count = 10}
      console.log(count);
      if(pages*40 < count){count=pages*40};
      return(true)
    }
    
    

}

function download(filename, text, element) {
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
}

function reset(){
  html_loadButton.innerText = "load";
  html_container.style.filter = "opacity(1)";
  html_loading.style.display = "none";
  html_downloads.style.display = "none";
  html_infos.style.display = "none"
}

function cancel(){
  reset();
  html_infos.style.display = "inline-block"
};


function ready(user){
  reset();
  html_downloads.style.display = "inline-block";
  html_preview.innerText = RESULT.slice(0,50).join(", ")
  download(`${user}-followers.txt`,RESULT.join("\n"),html_download_txt);
  download(`${user}-followers.csv`,RESULT.join(","),html_download_csv);
  download(`${user}-followers.json`,JSON.stringify(RESULT),html_download_json);
}

async function load(user,pages,offset){
  reset()
  html_progress.value = "0";
  html_loading.style.display = "inline-block";
  done = false;
  RESULT = [];
  html_loadButton.innerText = "cancel";
  canceled = false;
  html_container.style.filter = "opacity(0.5)"
  if(await getCount(user,pages))
  {
  if(Object.keys(recently).includes(user.toLowerCase()) && offset == 0 && pages*40 > count){
    RESULT = recently[user.toLowerCase()]
  }else{
  for (let i = 0; done == false && RESULT.length < pages*40 && canceled == false; i++) {
    await get(user,offset*40+i*40)
    RESULT = RESULT.concat(answer)
  };
  }
  if(canceled){
    cancel()
  }else{
  RESULT.reverse();
  if(offset == 0 && pages*40 > count){
  recently[user.toLowerCase()] = RESULT;}
  ready(user)
  }
  }else{console.log("canceled");cancel();html_infos.style.display = "inline-block"}

};

function isValid(pages,offset){
if(valid_name.test(html_username.value) && pages > 0 && offset > -1){if(html_username.value.toLowerCase() != "griffpatch"){return(true)}else{alert("Please don't do that! xD")}}else{if(pages<1 || offset < 0){alert("Please enter a positive offset/limit.")}else{alert("This is not a valid username.")};return(false)}
}

function click(){if(isValid(html_pages.value,html_offset.value)){load(html_username.value,html_pages.value,html_offset.value)}}
//event listeners
html_loadButton.addEventListener("click", function(){if(this.innerText != "cancel"){click()}else{canceled = true}})
