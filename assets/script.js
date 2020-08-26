var w = window.innerWidth;
var h = window.innerHeight;
var maxRotation = 45;
var minRotation = -45;
var hrot, vrot, transformW, transformH;

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
  $(this).find(".inner p").css({
    fontVariationSettings: "'HROT' " + hrot + ", 'VROT' " + vrot,
    // lineHeight: 105 * transformH + "%"
  });

  //if box
  svgTransform($(this).find(".box"), 33); //width in vw;
  // svgTransform($(this).find(".bowery"), 40); //width in vw;
});

$(".sign").mouseleave(function(event){
  $(this).find(".inner p, svg").css({
    fontVariationSettings: "'HROT' 0, 'VROT' 0",
    width: "",
    height: ""
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