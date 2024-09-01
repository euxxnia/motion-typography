// // JavaScript에서 타이머를 이용해 요소의 상태 변경
// function toggleLayer() {
//   const layer = document.querySelector('.layer');
//   const main = document.querySelectorAll('.main-elements');

//   // 초기 설정: Layer는 보이고, Main은 블러 처리
//   layer.style.display = 'block';
//   main.forEach(element => {
//     element.style.filter = 'blur(2px)';
//     // element.style.opacity = 0;
//   });

//   // 10초 후에 Layer는 숨기고, Main은 보이도록 변경
//   setTimeout(() => {
//     layer.style.display = 'none';
//     main.forEach(element => {
//       element.style.filter = 'none';
//       element.style.opacity = 1;
//     });

//     // 10초 후에 toggleLayer 함수 재호출 (반복)
//     setTimeout(toggleLayer, 10400);
//   }, 10400); // 10초 후에 실행
// }
// toggleLayer();
setTimeout(() => {
  const layer = document.querySelector('.layer');
  const main = document.querySelectorAll('.main-elements');

  layer.style.display = 'none'; // Container를 숨김
  main.forEach(element => {
    element.style.filter = 'none'; // blur 효과 제거
    element.style.opacity = 1; // 보이도록 설정
  });
}, 10000); // 시간 지연 후 변경 (3초 예시)



// https://codepen.io/Gthibaud/pen/pyeNKj

var utils = {
  norm: function(value, min, max) {
    return (value - min) / (max - min);
  },

  lerp: function(norm, min, max) {
    return (max - min) * norm + min;
  },

  map: function(value, sourceMin, sourceMax, destMin, destMax) {
    return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
  },

  clamp: function(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  },

  distance: function(p0, p1) {
    var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceXY: function(x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  circleCollision: function(c0, c1) {
    return utils.distance(c0, c1) <= c0.radius + c1.radius;
  },

  circlePointCollision: function(x, y, circle) {
    return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
  },

  pointInRect: function(x, y, rect) {
    return utils.inRange(x, rect.x, rect.x + rect.radius) &&
      utils.inRange(y, rect.y, rect.y + rect.radius);
  },

  inRange: function(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  },

  rangeIntersect: function(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1);
  },

  rectIntersect: function(r0, r1) {
    return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
      utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
  },

  degreesToRads: function(degrees) {
    return degrees / 180 * Math.PI;
  },

  radsToDegrees: function(radians) {
    return radians * 180 / Math.PI;
  },

  randomRange: function(min, max) {
    return min + Math.random() * (max - min);
  },

  randomInt: function(min, max) {
    return min + Math.random() * (max - min + 1);
  },

  getmiddle: function(p0, p1) {
    var x = p0.x,
      x2 = p1.x;
    var middlex = (x + x2) / 2;
    var y = p0.y,
      y2 = p1.y;
    var middley = (y + y2) / 2;
    var pos = [middlex, middley];

    return pos;
  },

  getAngle: function(p0, p1) {
    var deltaX = p1.x - p0.x;
    var deltaY = p1.y - p0.y;
    var rad = Math.atan2(deltaY, deltaX);
    return rad;
  },
  inpercentW: function(size) {
    return (size * W) / 100;
  },

  inpercentH: function(size) {
    return (size * H) / 100;
  },

}

// basic setup  :) 

var hovering = false;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
    
var W = canvas.width = window.innerWidth;
var H = canvas.height = window.innerHeight;
window.addEventListener('resize', function() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

var gridX = 3;
var gridY = 3;

function shape(x, y, texte) {
  this.x = x;
  this.y = y;
  // this.size = 40;

  this.text = texte;
  this.placement = [];
  this.vectors = [];

}

shape.prototype.getValue = function() {
  console.log("get black pixels position");

  // Draw the shape :^)

  ctx.textAlign = "left";
  ctx.size = W/20;
  ctx.font = "bold " + ctx.size + "px arial";
  ctx.fillText(this.text, this.x, this.y);


  var idata = ctx.getImageData(0, 0, W, H);

  var buffer32 = new Uint32Array(idata.data.buffer);

  for (var y = 0; y < H; y += gridY) {
    for (var x = 0; x < W; x += gridX) {

      if (buffer32[y * W + x]) {
        this.placement.push(new particle(x, y));
      }
    }
  } 
  ctx.clearRect(0, 0, W, H);

}

var colors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
];

function particle(x, y, type) {
  this.radius = 0.00001*W;
  this.futurRadius = radius+ utils.randomInt(radius, radius+10);
  if (hovering) this.futurRadius = radius;
  
  this.rebond = utils.randomInt(1, 5);
  this.x = x;
  this.y = y;
  
  this.dying = false;
  
  this.base = [x, y]

  this.vx = 0;
  this.vy = 0;
  this.type = type;
  this.friction = .99;
  this.gravity = gravity;
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.getSpeed = function() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };

  this.setSpeed = function(speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed/10;
    this.vy = Math.sin(heading) * speed/10;
  };

  this.getHeading = function() {
    return Math.atan2(this.vy, this.vx);
  };

  this.setHeading = function(heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.angleTo = function(p2) {
    return Math.atan2(p2.y - this.y, p2.x - this.x);

  };

  this.update = function(heading) {
    if (!hovering){
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;

    this.vx *= this.friction;
    this.vy *= this.friction;
    
    if(this.radius < this.futurRadius && this.dying === false){
      this.radius += duration/2.5;
    }else{
      this.dying = true;
    }
      
    if(this.dying === true){
      this.radius -= duration;
    }
    }
    else{
      // 입자가 움직이지 않고 radius도 고정
      this.x = this.base[0];
      this.y = this.base[1];
      this.vx = 0;
      this.vy = 0;
      this.radius = 1.3;
    }
  
    ctx.beginPath();

    ctx.fillStyle = this.color;

    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.dying = false;
      this.y = this.base[1];
      this.radius = 1.1;
      this.setSpeed(speed);
  this.futurRadius = utils.randomInt(radius, radius+5);
      this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
    }

  };

  this.setSpeed(utils.randomInt(.1, .5));
  this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));

}

var gravity = -0.15;
var duration = 0.2;
var resolution = 0.0000001*W;
var speed = 0.1;
var radius = 0.00001*W; 

var message = new shape(W/5, H/2.2, "나는 우리들이 떠오르는 태양이라고 생각해");

message.getValue();


var originalBackgroundColor = window.getComputedStyle(canvas).backgroundColor;
canvas.addEventListener("mousemove", function(event) {
  var rect = canvas.getBoundingClientRect(); // Canvas 요소의 크기 및 위치 정보를 가져옴
  var mouseX = event.clientX; // 마우스의 X 좌표
  var mouseY = event.clientY; // 마우스의 Y 좌표
  
  // Canvas 내부에 있는지 여부를 판단
  if (mouseX >= W/3.8 && mouseY >= H/4 && mouseX <= W && mouseY <= H/2.5) {
    hovering = true;
    canvas.style.cursor = "url('https://cdn.glitch.global/84436500-7f27-4a74-bf05-f924b835d970/Ellipse%201.png?v=1702745758182'), auto";
    canvas.style.zIndex = "6";
    canvas.style.backgroundColor = "black";
    duration = 0.01;
    gridX = 3;
 gridY = 3;
    speed=0;
    radius = 0.00001 * W; 
    gravity = 0; // 마우스가 Canvas에 들어왔을 때 gravity 변경
  } else {
    hovering = false;
    canvas.style.cursor = "url('https://cdn.glitch.global/84436500-7f27-4a74-bf05-f924b835d970/image%207.png?v=1702878758331'), auto";
    canvas.style.zIndex = "1";
    canvas.style.backgroundColor = originalBackgroundColor;
    var duration = 0.3;
    gravity = -0.15; // 마우스가 Canvas를 벗어날 때 gravity 변경
  }
});


var fps = 7;
function update() {
  setTimeout(function() {
    ctx.clearRect(0, 0, W, H);


    for (var i = 0; i < message.placement.length; i++) {
      message.placement[i].update();
    }
    
    requestAnimationFrame(update);
  }, 1000 / fps);
}

update();
// hover action


                    





/*
	This pen cleverly utilizes SVG filters to create a "Morphing Text" effect. Essentially, it layers 2 text elements on top of each other, and blurs them depending on which text element should be more visible. Once the blurring is applied, both texts are fed through a threshold filter together, which produces the "gooey" effect. Check the CSS - Comment the #container rule's filter out to see how the blurring works!
*/

const elts = {
	text1: document.getElementById("text1"),
	text2: document.getElementById("text2")
};

// The strings to morph between. You can change these to anything you want!
const texts = [
	"여러분!",
	"신나는 소식입니다.",
	"지금부터",
	"우리들의",
	"어린이날 잔치를",
	"열겠습니다"
];

// Controls the speed of morphing.
const morphTime = 1.5;
const cooldownTime = 0.3;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
	morph -= cooldown;
	cooldown = 0;
	
	let fraction = morph / morphTime;
	
	if (fraction > 1) {
		cooldown = cooldownTime;
		fraction = 1;
	}
	
	setMorph(fraction);
}

// A lot of the magic happens here, this is what applies the blur filter to the text.
function setMorph(fraction) {
	// fraction = Math.cos(fraction * Math.PI) / -2 + .5;
	
	elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
	
	fraction = 1 - fraction;
	elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
	
	elts.text1.textContent = texts[textIndex % texts.length];
	elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
	morph = 0;
	
	elts.text2.style.filter = "";
	elts.text2.style.opacity = "100%";
	
	elts.text1.style.filter = "";
	elts.text1.style.opacity = "0%";
}

// Animation loop, which is called every frame.
function animate() {
	requestAnimationFrame(animate);
	
	let newTime = new Date();
	let shouldIncrementIndex = cooldown > 0;
	let dt = (newTime - time) / 1000;
	time = newTime;
	
	cooldown -= dt;
	
	if (cooldown <= 0) {
		if (shouldIncrementIndex) {
			textIndex++;
		}
		
		doMorph();
	} else {
		doCooldown();
	}
}

// Start the animation.
animate();


Splitting({
	whitespace: true
})