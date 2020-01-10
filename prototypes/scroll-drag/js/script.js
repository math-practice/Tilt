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
  var x = $(".dot").css("left").replace(/[^-\d\.]/g, '');
  var y = $(".dot").css("top").replace(/[^-\d\.]/g, '');
  var hrot = (x / w * maxRotation * 2 - maxRotation) * -1;
  var vrot = (y / h * maxRotation * 2 - maxRotation) * -1;
  $(".line line").attr({
    x2: x,
    y2: y
  })
  console.log (hrot + ", " + vrot);
  text.style['font-variation-settings'] = "'HROT' " + hrot + ", 'VROT' " + vrot;
}

$( function() {
  $( ".dot" ).draggable({
    drag: function( event, ui ) {
      updateView();
    }
  });
} );