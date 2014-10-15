var x = 5;
	  var y = 75;
	  var dx = 2;
	  var dy = 2;
    var ctx;
  	function init(){
  	  var canvas = document.getElementById("canvas");
  	  ctx = canvas.getContext("2d");
  	  return setInterval(draw,10);
  	}
    function draw() {
        

      ctx.clearRect(0, 0, 150, 150);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0,Math.PI*2,true); // Outer circle
      ctx.closePath();
      ctx.fill();
      if (x >= 150 || x <= 0) {
      	dx *= -1;
      } 
      if (y >= 150 || y <= 0) {
        dy *= -1;
      } 
      x += dx;
      y += dy;
    }
    init();