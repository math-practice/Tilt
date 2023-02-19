/* ------------------------------------------------------------
  Mouse control > variable axes
------------------------------------------------------------ */

let w = window.innerWidth;
let h = window.innerHeight;
let facecamHeight=document.querySelector('#facecam').offsetHeight;
let hypot=Math.hypot(w/2,h/2);
let prevTime;
let timeElapsed;
let dragging=false;

let client={
  x:w/2,
  y:h/2,
}

let pos={
  x:client.x/w,
  y:client.y/h
}

let touchOffset={
  x:0,
  y:0
}


const control=document.querySelector('#tilt-control');

let updateFrame;

var maxRotation = 45;
var minRotation = -45;
let hrot=0;
let vrot=0;
let transformW=0;
let transformH=0;
const isMobile=window.matchMedia('(hover:none)');
const phoneLayout=window.matchMedia('(max-width:599px)');


let camMode=false;

let trackingStarted = false;

let scrollerHeight=window.matchMedia('(max-width:599px)').matches?129:240;
let scrollerLetters=[];

document.querySelectorAll('.sign').forEach((sign, s) => {
  sign.addEventListener('mousemove',function(){
    var x = event.pageX - sign.offsetLeft;
    var y = event.pageY - sign.offsetTop;
    var w = sign.offsetWidth;
    var h = sign.offsetHeight;
    hrot = (x / w * maxRotation * 2 - maxRotation) * -1;
    vrot = (y / h * maxRotation * 2 - maxRotation) * -1;
    transformW = (100 - Math.abs(hrot)) / 100;
    transformH = (100 - Math.abs(vrot)) / 100;
    tiltSign(sign)
  })

  sign.addEventListener('mouseleave',function(){
    sign.querySelectorAll(".inner p, .arc p").forEach((item) => {
      item.style.fontVariationSettings="'HROT' 0, 'VROT' 0";
      item.style.width='';
      item.style.height='';
    });
    sign.querySelectorAll(".reactive").forEach((item) => {
      item.style.width="100%";
    });

  })
});




function tiltSign(sign){


  sign.querySelectorAll(".inner p").forEach((item) => {
    item.style.fontVariationSettings= "'HROT' " + hrot + ", 'VROT' " + vrot;
  });


  sign.querySelectorAll(".reactive").forEach((item) => {
    item.style.width= 100-Math.abs(hrot) + "%";
  });


  sign.style.fontVariationSettings="'HROT' " + hrot + ", 'VROT' " + vrot;

  sign.querySelectorAll('.box').forEach((box) => {
    box.style.width=33 * transformW + "vw";
  });

}




//toggle glyph tables -----------------------

document.querySelectorAll('.open-glyphs-table').forEach((button) => {
  let table=document.querySelector(`.glyphs-table[data-id="${button.dataset.id}"]`);

  button.addEventListener('click',function(){
    table.classList.toggle('open');
    table.scrollIntoView({behavior:'smooth'});
  })
});




// tester sections -----------------------------

document.querySelectorAll('.tester').forEach((tester) => {

  tester.querySelector('.vrot input').addEventListener('input',updateParam.bind({prop:'v-rot'}));
  tester.querySelector('.hrot input').addEventListener('input',updateParam.bind({prop:'h-rot'}));

  let hovered=false;
  let animationActive=false;
  let mousePos={x:0,y:0};
  let current={x:60,y:119};
  let exactTrack=false;

  let animStartTime=0;


  tester.addEventListener('mouseenter',function(){
    mousePos={
      x:event.pageX,
      y:event.offsetY
    }
    animStartTime=performance.now();
    prevTime=animStartTime;
    startHoverAnimate()
  }
  );

  tester.addEventListener('mouseleave',function(){
    hovered=false;
    exactTrack=false;
    animStartTime=performance.now();
    prevTime=animStartTime;
    tester.classList.remove('exact-track');
  })

  function startHoverAnimate(){
    if(!animationActive){
      window.requestAnimationFrame(moveIbeam);
      animationActive=true;
    }
    hovered=true;
  }

  tester.addEventListener('mousemove',function(){
    if(!event.target.classList.contains('slider')&&!event.target.classList.contains('slider-wrapper')){
      if(!hovered){
        animStartTime=performance.now();
        prevTime=animStartTime;
      }
      startHoverAnimate();
    } else{
      if(hovered){
        animStartTime=performance.now();
        prevTime=animStartTime;
      }
      hovered=false;
      exactTrack=false;
      tester.classList.remove('exact-track');
    }
    mousePos={
      x:event.pageX,
      y:event.offsetY
    };
  })

  function updateParam(event){
    tester.style.setProperty('--'+this.prop,event.srcElement.value);
  }

  let ibeam=tester.querySelector('.moving');


  function moveIbeam(time){

    let incr=40;
    const target=hovered?mousePos:{x:60,y:119};
    const delta={
      x:target.x - current.x,
      y:target.y - current.y
    };

    if(!exactTrack){

      let timeElapsed=time - animStartTime
      let timeBetween=time-prevTime;
      prevTime=time;
      let remainingTime=Math.max(150-(timeElapsed),0);
      let remainingDist=Math.hypot(delta.x,delta.y);

      incr=remainingDist/remainingTime*timeBetween;



      const angle=Math.atan(delta.y/delta.x);
      const shift={
        x:Math.cos(angle) * incr,
        y:Math.sin(angle) * incr
      }

      if(Math.sign(delta.x)!==Math.sign(shift.x)) shift.x *=-1;
      if(Math.sign(delta.y)!==Math.sign(shift.y)) shift.y *=-1;

      current.x+=Math.abs(delta.x)>Math.abs(shift.x)?shift.x:delta.x;
      current.y+=Math.abs(delta.y)>Math.abs(shift.y)?shift.y:delta.y;
      // console.log(time - animStartTime);
    }else{
      current.x=mousePos.x;
      current.y=mousePos.y;

    }


    ibeam.style.left=current.x+'px';
    ibeam.style.top=current.y+'px';



    if((delta.x==0)&&(delta.y==0)&&hovered){
      // to animate in, add this to conditional
      // (delta.x==0)&&(delta.y==0)&&
      exactTrack=true;
      tester.classList.add('exact-track');
    }

    if(!hovered&&(delta.x==0)&&(delta.y==0)){
      animationActive=false;
    }else{
      window.requestAnimationFrame(moveIbeam);
    }


  }


  function frameToTarget(targetX,targetY){
    const currentX=ibeam.style.left;
    const currentY=ibeam.style.top;
    ibeam.style.left=currentX + (targetX>currentX?1:-1)+'px';
    ibeam.style.top=currentY + (targetY>currentY?1:-1)+'px';
  }

});

// animate glyphs ---------------

document.querySelectorAll('.highlight').forEach((highlight) => {
  let box={
    w:highlight.offsetWidth,
    h: highlight.offsetHeight
  }

  let glyph=highlight.querySelector('.glyph');
  highlight.addEventListener('mousemove',function(){
    let coords={
      x:event.offsetX - (box.w/2),
      y:event.offsetY - (box.h/2)
    }

    tiltHighlight(glyph,coords.x/box.w*90,coords.y/box.h*90);

  })

  highlight.addEventListener('mouseleave',function(){
    glyph.style.fontVariationSettings=`"HROT" 0, "VROT" 0`;

  })
});


function tiltHighlight(glyph,hrot,vrot){
  glyph.style.fontVariationSettings=`"HROT" ${hrot}, "VROT" ${vrot}`;
}


// scroller sections ----------------------------

document.querySelectorAll('.scroller').forEach((section,i) => {
  let str=section.innerText;
  section.innerText='';
  section.dataset.scrolled=0;
  section.dataset.ind=i;
  let sectionW=section.offsetWidth


  scrollerLetters.push([])
  let letters=scrollerLetters[i];
  for(let i=0; i<str.length; i++){
    let letter=document.createElement('span');
    letter.innerText=str[i];
    letters.push(letter);
    section.appendChild(letter);
    // if(isMobile.matches) letterObserver.observe(letter);
  }
  // console.log(section.querySelector('span'))
  section.dataset.scrolldist=section.scrollWidth/2;


  section.addEventListener('scroll',function(){
    section.dataset.scrolled=section.scrollLeft;
  })

  if(!isMobile.matches){
    section.addEventListener('mousemove',function(){
      let proportionY=(event.pageY - section.offsetTop)/scrollerHeight
      setScrollerLetters(event.clientX,proportionY,letters,section);

    })

    // section.addEventListener('mouseleave',function(){
    //   setScrollerLetters(undefined,0.5,letters,section);

    // })
  }

});

function setScrollerLetters(clientX,proportionY,letters,section){
  for(let letter of letters){
    const left=letter.offsetLeft + letter.offsetWidth/2;
    const rot=clientX!==undefined?Math.round((clientX - left + parseInt(section.dataset.scrolled)) / Math.min(w,1300) * 90):0;
    letter.style.fontVariationSettings=`"HROT" ${rot}, "VROT" ${(proportionY - 0.5) * 30}`;
  }

}


function setPageSize(){
  w=window.innerWidth;
  h=window.innerHeight;
  facecamHeight=document.querySelector('#facecam').offsetHeight;
  hypot=Math.hypot(w/2,h/2);
}



function trackElementsInView(){
  let options = {
    root:null,
    rootMargin: '0px',
    threshold: [0.0,0.1,0.75,0.9]
  }

  let observer = new IntersectionObserver(callback, options);


  // let query=document.querySelectorAll('.hero, .sign, .highlight .glyph,.scroller');
  let query=document.querySelectorAll('.hero, .sign, .highlight .glyph');

  query.forEach((element) => {
    observer.observe(element);
  });

  function callback(entries){

    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.dataset.visible="true";

        let hero=entry.target.classList.contains('hero');

        let controlRatio=0.1
        // console.log(controlRatio)
        entry.target.dataset.control=entry.intersectionRatio>=controlRatio?"true":"false";
        // if(entry.intersectionRatio==1) entry.target.dataset.control="true";


        if(hero&&camMode&&entry.intersectionRatio>=0.9){
          // console.log('cam on')
          toggleCam(true);
        }else if(hero&&camMode){
          toggleCam(false);
        }

      }else{
        entry.target.dataset.visible="false";
        entry.target.dataset.control="false";

      }

    });

    if(document.querySelectorAll('div[data-control="true"],section[data-control="true"]').length>0){
      control.classList.add('visible');
    }else{
      control.classList.remove('visible');
    }


    if(isMobile.matches){
      window.cancelAnimationFrame(updateFrame);
      updateFrame=window.requestAnimationFrame(setAllVisible);

    }


  }
}


function setAllVisible(){


  if(isMobile.matches){
    //this sets the positions of the eye pupils so they point toward the center
    //we could also make the hrot/vrot of the letters correspond to this angle,
    //rather than mapping it directly to position, which might make it feel more natural
    // let delta={
    //   x:client.x - w/2,
    //   y:client.y - h/2
    // }
    // let dist=Math.hypot(delta.x,delta.y)/hypot*50;

    // let angle=Math.atan2(delta.x,delta.y)+Math.PI/2;
    // let shift={
    //   x:Math.cos(angle) * dist + 50,
    //   y:Math.sin(angle) * dist * -1 + 50
    // }

    // control.style.setProperty("--pupilx",shift.x+'%');
    // control.style.setProperty("--pupily",shift.y+'%');
  }





  let allVisible=Array.from(document.querySelectorAll('div[data-visible="true"],section[data-visible="true"]'));
  hrot=(pos.x - 0.5)*90;
  vrot=(pos.y - 0.5)*90;
  transformW = (80 - Math.abs(hrot)) / 100;
  transformH = (80 - Math.abs(vrot)) / 100;
  for(let el of allVisible){
    if(el.classList.contains('sign')){
      tiltSign(el)
    }else if(el.classList.contains('glyph')){
      tiltHighlight(el,hrot,vrot)
    }else if(el.classList.contains('scroller')){
      setScrollerLetters(client.x,pos.y,scrollerLetters[parseInt(el.dataset.ind)],el)
    }else{
      tiltHero(hrot,vrot,client.x,client.y);
    }
  }
}

function initPage(){
  setPageSize();
  trackElementsInView();

  if(isMobile.matches){

    mobileSetUp();
    
    // window.requestAnimationFrame(spiralAnim);
    // mobileSetUp();
    // ^ now called from within animation frame, when animation finishes
  }




}



function spiralAnim(time){
  if(!prevTime) prevTime=time;
  timeElapsed=time-prevTime;
  prevTime=time;


  let radius=Math.max(70 - prevTime/40,0);
  let angle = prevTime/200 -2;
  // console.log(angle,radius)


  // console.log(radius);
  // control.style.left='50%';
  // control.style.top=50+radius+'%';
  let x=50+Math.cos(angle)*radius;
  let y=50+Math.sin(angle)*radius;

  pos.x=x/100;
  pos.y=y/100;
  client.x=pos.x*w;
  client.y=pos.y*h;
  setAllVisible();



  control.style.left=x+'%';
  control.style.top=y+'%';



  if(radius>0){
    window.requestAnimationFrame(spiralAnim);
  }else{
    mobileSetUp();

    blink();

  }


}

function jiggle(){
  if(!dragging){
    control.classList.remove('jiggle');
    control.offsetHeight;
    control.classList.add('jiggle');
  }

  // let randomT=1000+Math.random() * 5000;
  window.setTimeout(jiggle,4000);
}


function mobileSetUp(){
  const dimensions={
    w:w,
    h:h
  }

  document.querySelector('#tilt-control-wrapper').style.height=dimensions.h;

  control.addEventListener('touchstart',function(){
    touchOffset={
      x:event.touches[0].clientX - control.offsetLeft,
      y:event.touches[0].clientY - control.offsetTop
    }
    dragging=true;
  })
  control.addEventListener('touchend',function(){
    dragging=false;
  })

  document.body.addEventListener('touchmove',function(){

    if(dragging){

      client.x=event.touches[0].clientX - touchOffset.x;
      client.y=event.touches[0].clientY - touchOffset.y;
      pos.x=client.x/w;
      pos.y=client.y/h;

      control.style.left=pos.x*100+'%';
      control.style.top=client.y+'px';



      window.cancelAnimationFrame(updateFrame);
      updateFrame=window.requestAnimationFrame(setAllVisible);
    }

  })

  jiggle();
}


//header mouse tracking-------------------

let herotext = document.querySelector('.hero-text');

document.querySelector('.hero').addEventListener("mousemove", function(){
  if(!trackingStarted){
    updateView(event);
  }
}, false);



herotext.addEventListener('click',function(){
  herotext.innerHTML = randomChar(3);
})

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

function updateView(event) {
  var x = this.leave?w/2:event.pageX;
  var y = this.leave?herotext.clientHeight/2:event.pageY;

  var hrot = (x / w * maxRotation * 2 - maxRotation);
  var vrot = (y / herotext.clientHeight * maxRotation * 2 - maxRotation);
  tiltHero(hrot,vrot,x,y);
}

function tiltHero(hrot,vrot,x,y){
  herotext.style['font-variation-settings'] = "'HROT' " + hrot + ", 'VROT' " + vrot;
  //write values
  document.querySelector('.hrot_val').innerHTML = hrot.toFixed(2) + "°";
  document.querySelector('.vrot_val').innerHTML = vrot.toFixed(2) + "°";

  drawLines(x, y);
}

// document.querySelector('.hero').addEventListener("mouseleave", updateView.bind({leave:true}), false);

function drawLines(x, y){
  var dot = document.querySelector('.circle_1');
  dot.setAttribute('cx',x);
  dot.setAttribute('cy',y);

  var dot2 = document.querySelector('.circle_2');
  if(dot2){
    dot2.setAttribute('cx',w/2);
    dot2.setAttribute('cy',isMobile.matches?h/2:herotext.clientHeight/2);
  }


  var lines = document.querySelectorAll('#needle .line_1');
  for (i = 0; i < lines.length; ++i) {
    lines[i].setAttribute('x1',w/2);
    lines[i].setAttribute('y1',isMobile.matches?h/2:herotext.clientHeight/2);
    lines[i].setAttribute('x2',x);
    lines[i].setAttribute('y2',y);
  }
}

//start facecam----------------------------
let cam=document.querySelector('.camera');

cam.addEventListener('click',function(){

  let turnOn=!cam.classList.contains('on');
  toggleCam(turnOn);
  camMode=turnOn;
  if(turnOn) window.scroll({top:0,left:0,behavior:'smooth'});
  if(!turnOn&&isMobile.matches) tiltHero(hrot,vrot,client.x,client.y);

});





function toggleCam(on){
  if(on){

    document.body.classList.add('facecam');
    cam.classList.add('on') 
    ctrack.reset();
    initFaceCam();

  }else{
    document.body.classList.remove('facecam');
    cam.classList.remove('on');
    ctrack.stop();
    trackingStarted=false;
    vid.srcObject.getTracks()[0].stop();
    vid.src="";
    vid.pause();
    window.cancelAnimationFrame(drawFrame);


  }

}


//start set-up and resize------------------------

window.addEventListener('resize',setPageSize)
window.addEventListener('load',initPage)
