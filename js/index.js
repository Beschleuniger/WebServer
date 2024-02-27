addEventListener("DOMContentLoaded", function() {
  var canvas = document.getElementById('canvasObject');

  var ctx = canvas.getContext('2d');

  //get DPI
  let dpi = window.devicePixelRatio;


  let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  canvas.height = style_height * dpi;
  canvas.width =  style_width * dpi;
  

  const YSPEED = 2.0;
  const MAXCIRCLES = 25;
  const SPAWNSPEED = 500;
  const LINEWIDTH = 3;

  const MAXCIRCLERADIUS = 80;
  const MINCIRCLERADIUS = 20;


  var circles = [];

  function createCircle() {
    if (circles.length > MAXCIRCLES) {
      return;
    } 
    
    circles.push({
      x: Math.random() * canvas.width,
      y: canvas.height - Math.random() * 5,
      radius: Math.random() * (MAXCIRCLERADIUS - MINCIRCLERADIUS) + MINCIRCLERADIUS,
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    circles.forEach(circle => {
      circle.y -= YSPEED;
      const opacity = 0.9 * (circle.y / canvas.height);
      const fillOpacity = 0.20 * (circle.y / canvas.height);
      ctx.strokeStyle = 'rgba(0,0,0, ' + opacity + ')';
      ctx.fillStyle = 'rgba(200,200,200, ' + fillOpacity + ')';
      ctx.lineWidth = LINEWIDTH;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    circles = circles.filter(circle => circle.y + circle.radius > 0);

    requestAnimationFrame(update);

  }


  setInterval(createCircle, SPAWNSPEED);

  update();
});