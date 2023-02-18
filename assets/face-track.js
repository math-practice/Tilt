var vid = document.querySelector('video');
var vid_width = vid.width;
var vid_height = vid.height;

let svg=document.querySelector('#facecam svg');
let svgWrapper=document.querySelector('#facecam .svg-wrapper');

var fontIndex = 1;

let ctrack = new clm.tracker();
ctrack.init();
/*********** Setup of video/webcam and checking for webGL support *********/

let drawFrame;


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

function initFaceCam(){

  requestVideoAccess();


  function requestVideoAccess(){


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
    // keep same height, just change width
    var proportion = vid.videoWidth/vid.videoHeight;
    vid_width = Math.round(vid_height * proportion);
    vid.width = vid_width;
    let svgWidth=400;
    let svgHeight=svgWidth/proportion;
    // svg.setAttribute('height',svgHeight);
    // svg.setAttribute('viewBox',`-${svgWidth/4} -${svgHeight/4} ${svgWidth} ${svgHeight}`);
    svg.setAttribute('viewBox',`0 0 ${svgWidth} ${svgHeight}`);

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






  // ---------------------------------------------

  function initTracking(){
    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    trackingStarted = true;
    // start loop to draw face
    drawFrame=requestAnimFrame(drawLoop);
    // drawLoop();
  }




  /*********** Code for face tracking *********/




  function drawLoop() {
    drawFrame=requestAnimFrame(drawLoop);

    if (ctrack.getCurrentPosition()) {



      var maxRotation = 90; //-45 to +45

      let currentPos=ctrack.getCurrentPosition()

      let pointArray=currentPos.map(a=>a.join(','));




      let face2=pointArray.slice(15,19).join(' ');
      document.querySelector('#face_2').setAttribute('points',face2);
      let face3=pointArray.slice(19,23).join(' ');
      document.querySelector('#face_3').setAttribute('points',face3);
      let face4=pointArray.slice(23,28).join(' ');
      document.querySelector('#face_4').setAttribute('points',face4);
      let face5=pointArray.slice(28,33).join(' ');
      document.querySelector('#face_5').setAttribute('points',face5);
      let face6=[
        pointArray[34],
        pointArray[35],
        pointArray[36],
        pointArray[42],
        pointArray[37],
        pointArray[43],
        pointArray[38],
        pointArray[39],
        pointArray[40]
      ].join(' ');
      let face7=[
        pointArray[33],
        pointArray[62],
      ].join(' ');

      document.querySelector('#face_6').setAttribute('points',face6);
      document.querySelector('#face_7').setAttribute('points',face7);

      let face8=pointArray.slice(44,56)
      face8.push(pointArray[44])
      face8=face8.join(' ');
      document.querySelector('#face_8').setAttribute('points',face8);
      let face9=[
        pointArray[50],
        pointArray[59],
        pointArray[60],
        pointArray[61],
        pointArray[44]
      ].join(' ');
      document.querySelector('#face_9').setAttribute('points',face9);
      let face10=[
        pointArray[44],
        pointArray[56],
        pointArray[57],
        pointArray[58],
        pointArray[50]
      ].join(' ');
      document.querySelector('#face_10').setAttribute('points',face10);



      let rawX=currentPos[33][0];
      let rawY=currentPos[62][1] - (currentPos[62][1]-currentPos[33][1])/2;

      let x=Math.abs(1-(rawX)/vid_width);
      let y=(rawY)/vid_height;





      // svgWrapper.style.transform=`translate(${x*100}vw,${y*facecamHeight}px)`;




      // CONTROL WHOLE PAGE -------------------
      // pos.x=x;
      // pos.y=y;
      // client.x=pos.x*w;
      // client.y=pos.y*h;
      // setAllVisible();
      // --------------------------------------

      // CONTROL TOP ONLY ---------------------
      let hrot=(x - 0.5)*90*2;
      let vrot=(y - 0.5)*90*2;
      tiltHero(hrot,vrot,x*w,y*herotext.clientHeight);
      // --------------------------------------




    }
  }





}
