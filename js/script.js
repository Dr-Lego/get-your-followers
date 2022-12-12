console.log("page loaded")
//defining HTML elements
var html_username = document.getElementById("username");
var html_pages = document.getElementById("pages");
var html_offset = document.getElementById("offset");
var html_loadButton = document.getElementById("load");
var html_progress = document.getElementById("progress");

//other variables
var valid_name = /^[\w-]{3,20}$/

//functions
async function get(user,offset){
  var response = await fetch(`https://api.scratch.mit.edu/users/${user}/followers`,{method: 'GET',withCredentials: true,crossorigin: true,mode: 'no-cors',})
  var data = await response.json()
  console.log(data)
}

function load(user,pages,offset){
  progress.value = "0";
  progress.style.display = "inline-block"
  get(user,0)
};

//event listeners
html_loadButton.addEventListener("click", function() { if(valid_name.test(html_username.value)){load(html_username.value,html_pages.value,html_offset.value)}else{alert("This is not a valid username.")} })
