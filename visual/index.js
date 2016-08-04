"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Circle {
  constructor(x, y, text) {
    this.pos = [x, y];
    this.radius = 50;
    this.text =  text;
  }

  drawCircle(context) {
    context.moveTo(this.pos[0], this.pos[1]);
    context.beginPath();
    context.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
    context.fillStyle = "rgb(0,255,255)";
    context.fill();
    context.strokeStyle="rgb(0,0,0)";
    context.stroke();
    context.closePath();
  }

  drawText(context) {
    context.moveTo(this.pos[0], this.pos[1]);
    context.beginPath();
    context.font = "15px Georgia";
    context.textAlign = "center";
    context.fillStyle = "rgb(0,0,0)";
    context.fillText(this.text, this.pos[0], this.pos[1]);
    context.closePath();
  }

  draw(context) {
    this.drawCircle(context);
    this.drawText(context);
  }
}

let circle1 = new Circle(100,100,"a0");
let circle2 = new Circle(200,200,"a1");
 circle1.draw(ctx);
 circle2.draw(ctx);
// let idx = 1;
// let increment = 1;
// // setInterval(function() {
// //   ctx.clearRect(0, 0, 1000, 400);
// //   ctx.strokeStyle = `rgb(${idx}, 0, 0)`;
// //   ctx.lineWidth = 10;
// //   ctx.beginPath();
// //   ctx.moveTo(0,0);
// //   ctx.lineTo(1000,400);
// //   ctx.stroke();
// //   if (idx === 255) {
// //     increment *= -1;
// //   }
// //
// //   if (idx === 0) {
// //     increment *= -1;
// //   }
// //
// //   idx += increment;
// //   console.log(idx);
// // }, 15);
