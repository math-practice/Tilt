var vid = document.querySelector('video');
var vid_width = vid.width;
var vid_height = vid.height;
var overlay = document.querySelector('canvas');
var overlayCC = overlay.getContext('2d');
overlayCC.willReadFrequently=true;
// var text = document.querySelector('.text');
var fontIndex = 1;

/*********** Setup of video/webcam and checking for webGL support *********/

function initFaceCam(){
  let ctrack;
  requestVideoAccess();


  function requestVideoAccess(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

    // set up video
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia({video : true}, gumSuccess, gumFail);
    } else {
      gumFail();
    }
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


    initTracking();

  }

  function gumFail(){
    alert("Enable facecam access to use this feature");
  }








  // vid.addEventListener('canplay', function(){
  //
  // });


  // ---------------------------------------------

  function initTracking(){
    ctrack = new clm.tracker();
    ctrack.init();
    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    trackingStarted = true;
    // start loop to draw face
    drawLoop();
  }




  /*********** Code for face tracking *********/




  function drawLoop() {
    requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, vid_width, vid_height);
    //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
    if (ctrack.getCurrentPosition()) {
      ctrack.draw(overlay);
      //get eye position
      // var eyeX = Math.round(ctrack.getCurrentPosition()[33][0] * 100) / 100;
      // var eyeY = Math.round(ctrack.getCurrentPosition()[33][1] * 100) / 100;

      var canvasX = 400;
      var canvasY = 300;
      var maxRotation = 90; //-45 to +45

      let x=Math.abs(1-(ctrack.getCurrentPosition()[33][0])/canvasX);
      let y=(ctrack.getCurrentPosition()[33][1])/canvasY;
      // console.log(eyeX,eyeY);



      // console.log(ctrack.getCurrentPosition()[33][0])
      // console.log("HROT: " + vrot + " VROT: " + hrot + " (eyeX:" + eyeX + ", eyeY:" + eyeY +")");


      // drawLines(eyeX * w, eyeY * herotext.clientHeight);

      let hrot=(x - 0.5)*90*2;
      let vrot=(y - 0.5)*90*2;
      tiltHero(hrot,vrot,x*w,y*herotext.clientHeight);

      // console.log(client);
      // setElementPositions();


    }
  }





}
