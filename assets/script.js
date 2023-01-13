/* ------------------------------------------------------------
  Mouse control > variable axes
------------------------------------------------------------ */

let w = window.innerWidth;
var h = window.innerHeight;
var maxRotation = 45;
var minRotation = -45;
var hrot, vrot, transformW, transformH;
const isMobile=window.matchMedia('(hover:none)');


let scrollerHeight=window.matchMedia('(max-width:599px)').matches?129:240;
let scrollerLetters=[];



$(".sign").mousemove(function(event){
  var x = event.pageX - $(this).offset().left;
  var y = event.pageY - $(this).offset().top;
  var w = $(this).width();
  var h = $(this).height();
  hrot = (x / w * maxRotation * 2 - maxRotation) * -1;
  vrot = (y / h * maxRotation * 2 - maxRotation) * -1;
  transformW = (100 - Math.abs(hrot)) / 100;
  transformH = (100 - Math.abs(vrot)) / 100;
  // console.log (hrot + ", " + vrot);

  tiltSign(this)


});


function tiltSign(sign){

  $(sign).find(".inner p").css({
    fontVariationSettings: "'HROT' " + hrot + ", 'VROT' " + vrot,
    // lineHeight: 105 * transformH + "%"
  });

  $(sign).find(".reactive").css({
    width: 100-Math.abs(hrot) + "%",
    // height: 100-Math.abs(vrot) + "%",
  })

  $(sign).find(".arc p span").each(function(){
    // rotation angle of this letter
    var r = getRotationDegrees($(sign));

    //r * pi / 180 to return sine wave, then shift the r 90 degrees to get the wave to start from 1 (not 0)
    //https://docs.google.com/spreadsheets/d/1L3u8t-3eQaisRTdMZ-T2UWpbDCKLc8AIePK4wCZYsFE/edit#gid=0

    var sinShift = Math.sin( r * Math.PI / 180);
    var sin = Math.sin( (r + 90) % 360 * Math.PI / 180);

    //calc initial rotations
    var newHrot = sin * hrot + sinShift * vrot;
    var newVrot = sin * vrot + sinShift * hrot;

    if ($(sign).attr('class') == 'arc-1') {
      console.log ("HROT: " + hrot + " VROT: " + vrot + " NEW HROT:" + newHrot);
    }

    $(sign).css({
      fontVariationSettings: "'HROT' " + hrot + ", 'VROT' " + vrot,
    });
  });

  //if box
  svgTransform($(sign).find(".box"), 33);
}


$(".sign").mouseleave(function(event){
  $(this).find(".inner p, .arc p").css({
    fontVariationSettings: "'HROT' 0, 'VROT' 0",
    width: "",
    height: ""
  });
  $(this).find(".reactive").css({
    width: "100%",
    // height: "100%"
  });

});

function svgTransform(svg, svgWidth){
  if (svg.length) {
    svg.css ({
      width: svgWidth * transformW + "vw"
    });
  }
  // console.log ("[" + svgWidth + ", " + svgHeight + "] " + transformW + ", " + transformH);
}

function getRotationDegrees(obj) {
  //https://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery
  var matrix = obj.css("-webkit-transform") ||
  obj.css("-moz-transform")    ||
  obj.css("-ms-transform")     ||
  obj.css("-o-transform")      ||
  obj.css("transform");
  if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  } else { var angle = 0; }
  return (angle < 0) ? angle + 360 : angle;
}

/* ------------------------------------------------------------
  Other stuff
------------------------------------------------------------ */
$('.open-glyphs-table').click(function(event){
  event.preventDefault();
  $(this).closest('section').next(".glyphs-table").slideToggle();
});




// 2022 ----------------------------------------


document.querySelectorAll('.tester').forEach((tester) => {

  tester.querySelector('.vrot input').addEventListener('input',updateParam.bind({prop:'v-rot'}));
  tester.querySelector('.hrot input').addEventListener('input',updateParam.bind({prop:'h-rot'}));

  let hovered=false;
  let animationActive=false;
  let mousePos={x:0,y:0};
  let current={x:60,y:119};
  let exactTrack=false;


  tester.addEventListener('mouseenter',function(){
    mousePos={
      x:event.pageX,
      y:event.offsetY
    }
    startHoverAnimate()
  }
  );

  tester.addEventListener('mouseleave',function(){
    hovered=false;
    exactTrack=false;
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
    if(!event.target.classList.contains('slider')){
      startHoverAnimate();
    } else{
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


  function moveIbeam(){
    const incr=40;
    const target=hovered?mousePos:{x:60,y:119};
    const delta={
      x:target.x - current.x,
      y:target.y - current.y
    };

    if(!exactTrack){
      const angle=Math.atan(delta.y/delta.x);
      const shift={
        x:Math.cos(angle) * incr,
        y:Math.sin(angle) * incr
      }

      if(Math.sign(delta.x)!==Math.sign(shift.x)) shift.x *=-1;
      if(Math.sign(delta.y)!==Math.sign(shift.y)) shift.y *=-1;

      current.x+=Math.abs(delta.x)>Math.abs(shift.x)?shift.x:delta.x;
      current.y+=Math.abs(delta.y)>Math.abs(shift.y)?shift.y:delta.y;
    }else{
      current.x=mousePos.x;
      current.y=mousePos.y;
    }


    ibeam.style.left=current.x+'px';
    ibeam.style.top=current.y+'px';
    // (delta.x==0)&&(delta.y==0)&&
    if(hovered){
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
    console.log(box,coords);

    tiltHighlight(glyph,coords.x/box.w*90,coords.y/box.h*90);
  })

  highlight.addEventListener('mouseleave',function(){
    glyph.style.fontVariationSettings=`"HROT" 0, "VROT" 0`;
  })
});


function tiltHighlight(glyph,hrot,vrot){
  glyph.style.fontVariationSettings=`"HROT" ${hrot}, "VROT" ${vrot}`;
}



document.querySelectorAll('.scroller').forEach((section,i) => {
  let str=section.innerText;
  section.innerText='';
  section.dataset.scrolled=0;
  section.dataset.ind=i;

  scrollerLetters.push([])
  let letters=scrollerLetters[i];
  for(let i=0; i<str.length; i++){
    let letter=document.createElement('span');
    letter.innerText=str[i];
    letters.push(letter);
    section.appendChild(letter);
  }


  section.addEventListener('scroll',function(){
    section.dataset.scrolled=section.scrollLeft;
  })

  section.addEventListener('mousemove',function(){
    let proportionY=(event.pageY - section.offsetTop)/scrollerHeight
    setScrollerLetters(event.clientX,proportionY,letters,section);
    //mobile issue: 120 is half the height of the scroller on desktop


  })

  section.addEventListener('mouseleave',function(){
    setScrollerLetters(undefined,0.5,letters,section);
  })

});


function setScrollerLetters(clientX,proportionY,letters,section){
  for(let letter of letters){
    const left=letter.offsetLeft + letter.offsetWidth/2;
    const rot=clientX!==undefined?Math.round((clientX - left + parseInt(section.dataset.scrolled)) / Math.min(w,1300) * 90):0;
    letter.style.fontVariationSettings=`"HROT" ${rot}, "VROT" var(--vrot)`;
  }

  section.style.setProperty('--vrot',(proportionY - 0.5) * 30);
}


function setPageWidth(){
  w=window.innerWidth;
}

function initPage(){
  setPageWidth();

  let dragging=false;

  if(isMobile.matches){


    let options = {
      rootMargin: '0px',
      threshold: 1.0
    }


    let observer = new IntersectionObserver(callback, {root:null,rootMargin: '0px'});

    let query=document.querySelectorAll('.hero, .sign, .highlight .glyph, .scroller');

    query.forEach((element) => {
      observer.observe(element);
    });

    function callback(entries){
      entries.forEach((entry) => {
        entry.target.dataset.visible=entry.intersectionRatio>0?"true":"false";
      });
      setElementPositions();

    }


    // console.log(query);


    const dimensions={
      w:window.innerWidth,
      h:window.innerHeight
    }

    let client={
      x:dimensions.w/2,
      y:dimensions.h/2,
    }


    document.querySelector('#tilt-control-wrapper').style.height=dimensions.h;

    const control=document.querySelector('#tilt-control')




    control.addEventListener('touchstart',function(){
      dragging=true;
    })
    control.addEventListener('touchend',function(){
      dragging=false;
    })

    function setElementPositions(){
      let pos={
        x:client.x/dimensions.w,
        y:client.y/dimensions.h
      }

      control.style.left=pos.x*100+'%';
      control.style.top=client.y+'px';

      hrot=(pos.x - 0.5)*90;
      vrot=(pos.y - 0.5)*90;

      document.querySelectorAll('.sign[data-visible="true"]').forEach((sign) => {
        tiltSign(sign);

      });

      document.querySelectorAll('.highlight .glyph[data-visible="true"]').forEach((glyph) => {
        tiltHighlight(glyph,hrot,vrot);
      });

      document.querySelectorAll('.scroller[data-visible="true"]').forEach((section) => {
        setScrollerLetters(client.x,pos.y,scrollerLetters[parseInt(section.dataset.ind)],section);
        // tiltHighlight(glyph,hrot,vrot);
      });

      
      tiltHero(hrot,vrot,0,0);
    }


    document.body.addEventListener('touchmove',function(){

      if(dragging){
        client.x=event.touches[0].clientX;
        client.y=event.touches[0].clientY;
        setElementPositions();
      }

    })


  }
}


//from header protototype-------------------

let herotext = document.querySelector('.hero-text');

document.querySelector('.hero').addEventListener("mousemove", updateView, false);



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

document.querySelector('.hero').addEventListener("mouseleave", updateView.bind({leave:true}), false);


function drawLines(x, y){
  var dot = document.querySelector('.circle_1');
  dot.setAttribute('cx',x);
  dot.setAttribute('cy',y);

  var lines = document.querySelectorAll('.line_1');
  for (i = 0; i < lines.length; ++i) {
    lines[i].setAttribute('x1',w/2);
    lines[i].setAttribute('y1',herotext.clientHeight/2);
    lines[i].setAttribute('x2',x);
    lines[i].setAttribute('y2',y);
  }
}












window.addEventListener('resize',setPageWidth)
window.addEventListener('load',initPage)
