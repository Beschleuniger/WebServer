addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('canvasNodes');
  
    var ctx = canvas.getContext('2d');
  
    //get DPI
    let dpi = window.devicePixelRatio;
  
  
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.height = style_height * dpi;
    canvas.width =  style_width * dpi;
    
    resizeCanvas();
  
    const MAXPOINTS = 75;
  
    const LINELENGTH = 250;
  
    var points = [];
  
    class point {
      constructor(x, y, x_speed, y_speed) {
        this.x = x;
        this.y = y;
        this.x_speed = x_speed;
        this.y_speed = y_speed;
      } 
    };

    function createPoints() {
      points = [];
      while (points.length < MAXPOINTS) {
        points.push(
          new point(
            ((canvas.width / MAXPOINTS) * points.length) + Math.floor(Math.random() * 6) - 3,
            Math.floor(Math.random() * canvas.height),
            (Math.random() * 0.2) - 0.1,
            (Math.random() * 0.2) - 0.1));
      }
    }

    createPoints();

    function dist(p1, p2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    }

    function drawPixel(p) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(p.x, p.y, 3, 3);
    }

    function updatePositions(points) {

      points.forEach((p) => {
        p.x = Math.min(canvas.width, Math.max(0, p.x + p.x_speed));
        p.y = Math.min(canvas.height, Math.max(0, p.y + p.y_speed));
      
        if (p.x <= 0 || p.x >= canvas.width) {
          p.x_speed *= -1;
        } 
        if (p.y <= 0 || p.y >= canvas.height) {
          p.y_speed *= -1;
        } 

      });
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      
      updatePositions(points);

      points.forEach(drawPixel);
      points.forEach((p1) => {
        points.forEach((p2) => {
            ctx.beginPath();
            const dis = dist(p1, p2);
            const alpha = 1 - Math.min(dis / LINELENGTH, 1);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.stroke();
          });
        });
      
      requestAnimationFrame(update);
    }

    update();
  
    window.addEventListener("resize", resizeCanvas);
  
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      updateSpikes();
    }
  
    function updateSpikes() {
      const spikeWidth = 80;
      let numberOfSpikes = Math.floor(canvas.width / spikeWidth);
  
      if (numberOfSpikes % 2 === 0) {
        numberOfSpikes++;
      } 
  
      let points = [];
  
      points.push(`${0}% ${0}%`);
      
      for (let i = 0; i < numberOfSpikes; i++) {
        
        const x  = (i / (numberOfSpikes - 1)) * 100;
        const y  = (i % 2 === 0) ? 90 : 100;
  
        points.push(`${x}% ${y}%`);
      }
  
      points.push(`${100}% ${90}%`);
      points.push(`${100}% ${0}%`);
      
  
      const clipPathPolygon = `polygon(${points.join(', ')})`;
  
      document.getElementById("canvasNodes").style.clipPath = clipPathPolygon;
    }
  
  
  
  });