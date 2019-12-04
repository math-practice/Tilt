var vid = document.getElementById('videoel');
var vid_width = vid.width;
var vid_height = vid.height;
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var fontIndex = 1;

/*********** Setup of video/webcam and checking for webGL support *********/

function enablestart() {
  var startbutton = document.getElementById('startbutton');
  startbutton.value = "start";
  startbutton.disabled = null;
}

var insertAltVideo = function(video) {
  // insert alternate video if getUserMedia not available
  if (supports_video()) {
    if (supports_webm_video()) {
      video.src = "./media/cap12_edit.webm";
    } else if (supports_h264_baseline_video()) {
      video.src = "./media/cap12_edit.mp4";
    } else {
      return false;
    }
    return true;
  } else return false;
}

function adjustVideoProportions() {
  // resize overlay and video if proportions of video are not 4:3
  // keep same height, just change width
  var proportion = vid.videoWidth/vid.videoHeight;
  vid_width = Math.round(vid_height * proportion);
  vid.width = vid_width;
  overlay.width = vid_width;
}

function gumSuccess( stream ) {
  // add camera stream if getUserMedia succeeded
  if ("srcObject" in vid) {
    vid.srcObject = stream;
  } else {
    vid.src = (window.URL && window.URL.createObjectURL(stream));
  }
  vid.onloadedmetadata = function() {
    adjustVideoProportions();
    vid.play();
  }
  vid.onresize = function() {
    adjustVideoProportions();
    if (trackingStarted) {
      ctrack.stop();
      ctrack.reset();
      ctrack.start(vid);
    }
  }
}

function gumFail() {
  // fall back to video if getUserMedia failed
  insertAltVideo(vid);
  document.getElementById('gum').className = "hide";
  document.getElementById('nogum').className = "nohide";
  alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// set up video
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
} else if (navigator.getUserMedia) {
  navigator.getUserMedia({video : true}, gumSuccess, gumFail);
} else {
  insertAltVideo(vid);
  document.getElementById('gum').className = "hide";
  document.getElementById('nogum').className = "nohide";
  alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}

vid.addEventListener('canplay', enablestart, false);

/*********** Code for face tracking *********/

var ctrack = new clm.tracker();
ctrack.init();
var trackingStarted = false;

function drawLoop() {
  requestAnimFrame(drawLoop);
  overlayCC.clearRect(0, 0, vid_width, vid_height);
  //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
  if (ctrack.getCurrentPosition()) {
    ctrack.draw(overlay);
    //get eye position
    var eyeX = Math.round(ctrack.getCurrentPosition()[33][0] * 100) / 100;
    var eyeY = Math.round(ctrack.getCurrentPosition()[33][1] * 100) / 100;
    var canvasX = 400;
    var canvasY = 300;
    var maxRotation = 90; //-45 to +45
    var hrot = Math.round((eyeX / canvasX * maxRotation - maxRotation / 2) * 100) / 100;
    var vrot = Math.round((eyeY / canvasY * maxRotation - maxRotation / 2) * 100) / 100 * - 1;
    console.log("HROT: " + vrot + " VROT: " + hrot + " (eyeX:" + eyeX + ", eyeY:" + eyeY +")");
    //move the dot indicator
    var indicator = document.querySelector('.dot');
    indicator.style['left'] = eyeX / canvasX * 100 + "vw";
    indicator.style['top'] = eyeY / canvasY * 100 + "vh";
    //update the text vars
    var text = document.querySelector('.text');
    text.style['font-variation-settings'] = "'HROT' " + hrot + ", 'VROT' " + vrot;
  }
}

function changeFont(){
  var fonts = ["tilt-neon","tilt-prism","tilt-warp"];
  var font = fontIndex % fonts.length;
  var text = document.querySelector('.text');
  text.style['font-family'] = fonts[font];
  fontIndex++;
}

// start video
vid.play();
// start tracking
ctrack.start(vid);
trackingStarted = true;
// start loop to draw face
drawLoop();
