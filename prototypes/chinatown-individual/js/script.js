var text = document.querySelector('.text');
var indicator = document.querySelector('.dot');
var fontIndex = 1;
var w = window.innerWidth;
var h = window.innerHeight;
var maxRotation = 45;
var minRotation = -45;

//change string
if (getQueryVariable("string")){
  text.innerHTML = getQueryVariable("string");
}

// document.addEventListener("mousemove", updateView, false);
$(".box").mousemove(function(event){
  var x = event.pageX - $(this).offset().left;
  var y = event.pageY - $(this).offset().top;
  var w = $(this).width();
  var h = $(this).height();
  var hrot = (x / w * maxRotation * 2 - maxRotation) * -1;
  var vrot = (y / h * maxRotation * 2 - maxRotation) * -1;
  console.log (hrot + ", " + vrot);
  $(this).css('font-variation-settings', "'HROT' " + hrot + ", 'VROT' " + vrot);
})
$(".box").mouseleave(function(event){
  $(this).css('font-variation-settings', "'HROT' 0, 'VROT' 0");
});


//calc 

function changeFont(){
  var fonts = ["tilt-neon","tilt-prism","tilt-warp"];
  var font = fontIndex % fonts.length;
  text.style['font-family'] = fonts[font];
  fontIndex++;
}

function getQueryVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function updateView(event) {
  var x = event.pageX;
  var y = event.pageY;
  var hrot = (x / w * maxRotation * 2 - maxRotation) * -1;
  var vrot = (y / h * maxRotation * 2 - maxRotation) * -1;
  console.log (hrot + ", " + vrot);
  text.style['font-variation-settings'] = "'HROT' " + hrot + ", 'VROT' " + vrot;
}

