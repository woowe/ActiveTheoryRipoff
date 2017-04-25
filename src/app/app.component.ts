import { Component, NgZone, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('pixiScene') pixiScene: ElementRef;

  app: any;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular( () => this.webgl_stuff() );
  }

  webgl_stuff() {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container.
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true
    });

    // The application will create a canvas element for you that you
    // can then insert into the DOM.
    this.pixiScene.nativeElement.appendChild(this.app.view);

    var container = new PIXI.Container();

    this.app.stage.addChild(container);

    var translateX = window.innerWidth / 2;
    var translateY = window.innerHeight / 2;

    var mouseX = 0;
    var mouseY = 0;
    var pmouseX = 0;
    var pmouseY = 0;

    var number_of_particles = this.app.renderer instanceof PIXI.WebGLRenderer ? 2500 : 100;
    var particlesContainer = new PIXI.particles.ParticleContainer(number_of_particles, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });

    var pixi_filters = [new Filters.RGBSplitFilter()];
    var filter = new PIXI.filters.ColorMatrixFilter();
    var blurFilter1 = new PIXI.filters.BlurFilter();

    particlesContainer.interactive = true;
    particlesContainer.on('mousemove', (event) => {
      pmouseX = mouseX;
      pmouseY = mouseY;
      mouseX = event.data.global.x;
      mouseY = event.data.global.y;
    });

    blurFilter1.blur = 3;
    container.filters = [...pixi_filters, filter, blurFilter1];
    container.filterArea = new PIXI.Rectangle(0, 0, this.app.renderer.width, this.app.renderer.height);
    
    container.addChild(particlesContainer);

    var particles = [];
    var tmp = Array(number_of_particles).fill(0);
    var points = Array(number_of_particles<<1).fill(0);

    for(var i = 0; i < number_of_particles; ++i) {
      var x = Math.random() * this.app.renderer.width;
      var y = Math.random() * this.app.renderer.height;

      var side1 = Math.random() * 20 + 15;
      var side2 = Math.random() * 20 + 15;
      var varX = Math.random() * 25;
      var varY = Math.random() * 25;

      var graphics = new PIXI.Graphics();
      graphics.beginFill(0xffffff, 0.5);
      graphics.moveTo(x, y);
      graphics.lineTo(x - varX, y + side1);
      graphics.lineTo(x + side2 + varX, y + side1 - varY);
      graphics.closePath();
      graphics.endFill();

      let texture = this.app.renderer.generateTexture(graphics, PIXI.settings.SCALE_MODE, 16/9);

      var particle = new PIXI.Sprite(texture);
      // var particle = new PIXI.Sprite.fromImage('../assets/bunny.png');
      points[ i << 1     ] = x;
      points[(i << 1) + 1] = y;
      particle.x = x;
      particle.y = y;
      particle.velX = 0;
      particle.velY = 0;

      particles.push(particle);
      particlesContainer.addChild(particle);
    }

    console.log(points.length, particlesContainer.filters);

    var calcPoints;
    var tick = 0;
    var movingPoint = [this.app.renderer.width / 2, this.app.renderer.height / 2];
    this.app.ticker.add((delta) => {
      movingPoint[0] = Math.cos(tick * 2) * 400 + this.app.renderer.width / 2 - 35;
      movingPoint[1] = Math.sin(tick * 2) * 400 + this.app.renderer.height / 2;

      calcPoints = points.slice(0);

      for(var i = 0; i < number_of_particles; ++i) {
        var x = particles[i].x;
        var y = particles[i].y;

        var posRelativeToMouse = {
          x: x - mouseX,
          y: y - mouseY
        };

        var posRelativeToPoint = {
          x: x - movingPoint[0],
          y: y - movingPoint[1]
        };

        var distance = Math.sqrt(
          posRelativeToMouse.x * posRelativeToMouse.x +
          posRelativeToMouse.y * posRelativeToMouse.y
        );

        var pdistance = Math.sqrt(
          posRelativeToPoint.x * posRelativeToPoint.x +
          posRelativeToPoint.y * posRelativeToPoint.y
        );

        var forceDirection = {
          x: posRelativeToMouse.x / (distance),
          y: posRelativeToMouse.y / (distance),
        };

        var pforceDirection = {
          x: posRelativeToPoint.x / (pdistance),
          y: posRelativeToPoint.y / (pdistance),
        };

        // distance past which the force is zero
        var maxDistance = 35;
        var force = (maxDistance - (distance)) / maxDistance;

        // if we went below zero, set it to zero.
        if (force < 0) force = 0;

        var pforce = (maxDistance - (pdistance)) / maxDistance;

        // if we went below zero, set it to zero.
        if (pforce < 0) pforce = 0;

        // var scale = (Math.max(0, Math.max(0.5, Math.cos(tick * 8)) * 2) * 50) + 25;
        var scale = 1;

        particles[i].velX *= 0.97;
        particles[i].velY *= 0.97;

        particles[i].velX += forceDirection.x * force * scale * delta;
        particles[i].velY += forceDirection.y * force * scale * delta;
        particles[i].velX += pforceDirection.x * pforce * scale * delta;
        particles[i].velY += pforceDirection.y * pforce * scale * delta;


        particles[i].x += particles[i].velX;
        particles[i].y += particles[i].velY;

        var matrix = filter.matrix;

        matrix[1] = Math.sin(tick) * 3;
        matrix[2] = Math.cos(tick);
        matrix[3] = Math.cos(tick) * 1.5;
        matrix[4] = Math.sin(tick / 3) * 2;
        matrix[5] = Math.sin(tick / 2);
        matrix[6] = Math.sin(tick / 4);
      }
      tick += 0.01;
    });

    
  }

  @HostListener('window:resize')
  webgl_scene_resize() {
    let {w_height, w_width} = {w_height: window.innerHeight, w_width: window.innerWidth};
    this.app.renderer.resize(w_width, w_height);
    // this.app.stage.width    = w_width;
    // this.app.stage.height   = w_height;
  }

  dist(x1, y1, x2, y2) {
    return Math.sqrt( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }

  followPath(point: {x: number, y: number}, path: {x: number, y: number}[], duration: number) {
    var time = 0;
    var parts = Array(path.length).fill(duration / (path.length - 1));

    var distances = Array(path.length-1).fill(0);
    var total_distance = 0;

    var p_dist = (path1, path2) => this.dist(path1.x, path1.y, path2.x, path2.y);

    for(var i = 0; i < path.length - 1; ++i) {
      var dist = p_dist(path[i], path[i+1]);
      distances[i] = dist;
      total_distance += dist;
    }

    parts = parts.map((part, index) => part * (distances[index] / total_distance));
    return parts;
    // return (delta) => {

    //   time += delta;
    // };
  }
}
