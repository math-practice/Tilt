var text = document.querySelector('.text');
var text2 = document.querySelector('.text2');
var container = document.querySelector('.container');
var w = window.innerWidth;
var h = window.innerHeight;
var maxRotation = 45;
var minRotation = -45;
var bg = ["#FF3C3C", "#009D3F", "#00109D"];
var bgCount = 0;

setText();

document.addEventListener("mousemove", updateView, false);

function setText() {
  var string = randomChar(3);
  text.innerHTML = string;
  text2.innerHTML = string;
  document.querySelector('body').style.backgroundColor = bg[bgCount + 1 % bg.length];
  document.querySelector('.rect_1').style.fill = bg[(bgCount + 1) % bg.length];
  bgCount ++;
}

function updateView(event) {
  var x = event.pageX;
  var y = event.pageY;
  var hrot = (x / w * maxRotation * 2 - maxRotation);
  var vrot = (y / text.clientHeight * maxRotation * 2 - maxRotation);
  var yAdj = y;
  if (y > container.clientHeight){
    yAdj = container.clientHeight;
  }
  var vOffsetCenter = text.clientHeight / 2 - yAdj;
  //rotate text
  text.style['font-variation-settings'] = "'HROT' " + hrot + ", 'VROT' " + vrot;
  text.style['margin-top'] = vOffsetCenter / 1.75 + "px";
  text2.style['font-variation-settings'] = "'HROT' " + hrot + ", 'VROT' " + vrot;
  text2.style['margin-top'] = vOffsetCenter / 1.75 + "px";
  //set mask
  var mask = document.querySelector('.rect_1');
  var horizon = container.clientHeight / 2 - vOffsetCenter / 2.5;
  mask.setAttribute('y', horizon + "px");
  mask.setAttribute('height',container.clientHeight / 2 + vOffsetCenter / 2.5 + "px");
  document.querySelector('.cropped').style['clip-path'] = "inset("+ horizon +"px 0 0 0)";
  //draw lines
  var line = document.querySelector('.line_1');
  line.setAttribute('x1', '0');
  line.setAttribute('y1', horizon);
  line.setAttribute('x2', '100vw');
  line.setAttribute('y2', horizon);

  var line2 = document.querySelector('.line_2');
  line2.setAttribute('x1', x);
  line2.setAttribute('y1', '0');
  line2.setAttribute('x2', x);
  line2.setAttribute('y2', container.clientHeight);
  // console.log(container.clientHeight / 2 - vOffsetCenter / 2.5);
  //write values
  // document.querySelector('.hrot_val').innerHTML = hrot.toFixed(2) + "°";
  // document.querySelector('.vrot_val').innerHTML = vrot.toFixed(2) + "°";
  // console.log (hrot + ", " + vrot);
  // changeColor(x, y);
}
function randomChar(num) {
  // var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&/@§©¼½¾¿æ£';
  var glyphs = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789#$%&@©¼½¾æ£';
  var arr = glyphs.split("");
  shuffle(arr);
  var chars = "";
  for (i = 0; i < num; i++) {
    chars += "<span class='char-" + i + "'>" + arr[i] + "</span>";
  }
  return(chars);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}