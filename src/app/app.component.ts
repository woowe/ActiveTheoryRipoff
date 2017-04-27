import { Component, NgZone, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';

interface PathPointOpts {
  stroke?: number;
  lerp?: boolean;
  strokeLerp?: boolean;
}

interface PathPoint {
  x: number;
  y: number;
  opts?: PathPointOpts;
}

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

    var number_of_particles = this.app.renderer instanceof PIXI.WebGLRenderer ? 12000 : 100;
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

    blurFilter1.blur = 1;
    container.filters = [...pixi_filters, filter, blurFilter1];
    container.filterArea = new PIXI.Rectangle(0, 0, this.app.renderer.width, this.app.renderer.height);
    
    container.addChild(particlesContainer);

    var particles = [];

    var side1 = 7;
    var side2 = 10.5;
    var varX = 5;
    var varY = -5;

    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff, 0.4);
    graphics.moveTo(0, 0);
    graphics.lineTo(-varX, side1);
    graphics.lineTo(side2 + varX, side1 - varY);
    graphics.closePath();
    graphics.endFill();

    let texture = this.app.renderer.generateTexture(graphics, PIXI.settings.SCALE_MODE, 16/9);

    for(var i = 0; i < number_of_particles; ++i) {
      var x = Math.random() * this.app.renderer.width;
      var y = Math.random() * this.app.renderer.height;

      // var side1 = Math.max(10, Math.random() * 20);
      // var side2 = Math.max(10, Math.random() * 20);
      // var varX = Math.random() * 15;
      // var varY = Math.random() * 15;

      var particle = new PIXI.Sprite(texture);
      // var particle = new PIXI.Sprite.fromImage('../assets/bunny.png');
      particle.x = x;
      particle.y = y;
      particle.velX = 0;
      particle.velY = 0;

      particles.push(particle);
      particlesContainer.addChild(particle);
    }

    // C
    var path_c: PathPoint[] = [
      {x: 105, y: -107.5, opts: {stroke: 32.5}},
      {x: 62.5, y: -175, opts: {stroke: 32.5}},
      {x: -82.5, y: -175, opts: {stroke: 32.5}},
      {x: -125, y: -87.5, opts: {stroke: 32.5}},
      {x: -125, y: 87.5, opts: {stroke: 32.5}},
      {x: -82.5, y: 175, opts: {stroke: 32.5}},
      {x: 62.5, y: 175, opts: {stroke: 32.5}},
      {x: 105, y: 107.5, opts: {stroke: 32.5}}
    ];

    // A
    var path_a: PathPoint[] = [
      // top
      {x: -20, y: -100, opts: {stroke: 32.5}},
      // to bottom leg
      {x: -75, y: 100, opts: {stroke: 32.5}},
      // to top
      {x: -20, y: -100, opts: {stroke: 32.5}},
      {x: 20, y: -100, opts: {stroke: 32.5}},
      //to mid
      {x: 47.5, y: 0, opts: {stroke: 32.5}},
      // across mid
      {x: -47.5, y: 0, opts: {stroke: 32.5}},
      {x: 47.5, y: 0, opts: {stroke: 32.5}},
      // to bottom leg
      {x: 75, y: 100, opts: {stroke: 32.5}},
    ];

    // N
    var path_n: PathPoint[] = [
      // bottom right side
      {x: -50, y: 100, opts: {stroke: 32.5}},
      // to top right side
      {x: -50, y: -100, opts: {stroke: 32.5}},
      // to bottom left side
      {x: 50, y: 100, opts: {stroke: 32.5}},
      // top top left side
      {x: 50, y: -100, opts: {stroke: 32.5}}
    ];

    // D
    var path_d: PathPoint[] = [
      {x: -125, y: -175, opts: {stroke: 32.5}},
      {x: -125, y: 175, opts: {stroke: 32.5}},
      {x: 62.5, y: 175, opts: {stroke: 32.5}},
      {x: 125, y: 87.5, opts: {stroke: 32.5}},
      {x: 125, y: -87.5, opts: {stroke: 32.5}},
      {x: 62.5, y: -175, opts: {stroke: 32.5}},
      {x: -125, y: -175, opts: {stroke: 32.5}}
    ];

    // E
    var path_e: PathPoint[] = [
      // top rung
      {x: 50, y: -100, opts: {stroke: 32.5}},
      // to left
      {x: -50, y: -100, opts: {stroke: 32.5}},
      // to mid
      {x: -50, y: 0, opts: {stroke: 32.5}},
      // second rung
      {x: 50, y: 0, opts: {stroke: 32.5}},
      // to mid
      {x: -50, y: 0, opts: {stroke: 32.5}},
      // to bottom
      {x: -50, y: 100, opts: {stroke: 32.5}},
      // third (bottom) rung
      {x: 50, y: 100, opts: {stroke: 32.5}}
    ];

    // O
    var path_o: PathPoint[] = [
      // top rung
      {x: 50, y: -100, opts: {stroke: 32.5}},
      // to left
      {x: -50, y: -100, opts: {stroke: 32.5}},
      // to bottom
      {x: -50, y: 100, opts: {stroke: 32.5}},
      // third (bottom) rung
      {x: 50, y: 100, opts: {stroke: 32.5}},
      // to top rung
      {x: 50, y: -100, opts: {stroke: 32.5}}
    ];

    var candeo_map = [
      path_c,
      this.scalePath(path_a, 1.75, 1.75),
      this.scalePath(path_n, 1.75, 1.75),
      this.scalePath(path_d, 0.95, 1),
      this.scalePath(path_e, 1.55, 1.75),
      this.scalePath(path_o, 1.75, 1.75)
    ];

    var candeo_idx = 0;
    var candeo_tick = 0;
    var candeoProgress = 0;

    var calcPoints;
    var tick = 0;
    var movingPoint = {
      x: this.app.renderer.width / 2,
      y: this.app.renderer.height / 2,
      stroke: 0
    };

    var followDuration = 5000;

    var updateFollow = this.followPath(movingPoint, candeo_map[candeo_idx], followDuration);

    var pathUpdate = updateFollow(0);

    this.app.ticker.add((delta) => {
      console.log("DELTA", delta);
      candeo_tick += delta;
      tick += 0.01;
      // movingPoint.x = Math.cos(tick * 2) * 400 + this.app.renderer.width / 2 - 35;
      // movingPoint.y = Math.sin(tick * 2) * 400 + this.app.renderer.height / 2;

      if(pathUpdate) {
        movingPoint.x = pathUpdate.x + candeo_idx * 320 + 175;
        movingPoint.y = pathUpdate.y + this.app.renderer.height / 2;
        movingPoint.stroke = pathUpdate.stroke;
        candeoProgress = pathUpdate.progress;
        if(candeoProgress >= 1 && candeo_idx < candeo_map.length - 1) {
          candeo_idx++;
          updateFollow = this.followPath(movingPoint, candeo_map[candeo_idx], followDuration);
          candeo_tick = 0;
        }
        pathUpdate = updateFollow(candeo_tick/2);
      }

      for(var i = 0; i < number_of_particles; ++i) {
        var x = particles[i].x;
        var y = particles[i].y;

        var posRelativeToMouse = {
          x: x - mouseX,
          y: y - mouseY
        };

        var posRelativeToPoint = {
          x: x - movingPoint.x,
          y: y - movingPoint.y
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
        var maxDistance = 40;
        var force = (maxDistance - (distance)) / maxDistance;

        // if we went below zero, set it to zero.
        if (force < 0) force = 0;

        var maxDistance = movingPoint.stroke;

        var pforce = (maxDistance - (pdistance)) / maxDistance;

        // if we went below zero, set it to zero.
        if (pforce < 0) pforce = 0;

        // var scale = (Math.max(0, Math.max(0.5, Math.cos(tick * 8)) * 2) * 50) + 25;
        var scale = 1;

        particles[i].velX *= 0.95;
        particles[i].velY *= 0.95;

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

  lerp(a, b, f) {
    if(a === b) {
      return a;
    }
    return (a * (1.0 - f)) + (b * f);
  }

  scalePath(path: PathPoint[], scaleX: number = 1, scaleY: number = 1) {
    for(var i = 0; i < path.length; ++i) {
      path[i].x *= scaleX;
      path[i].y *= scaleY;
    }

    return path;
  }

  pointEq(p1: {x: number, y: number}, p2: {x: number, y: number}) {
    return p1.x === p2.x && p1.y === p2.y;
  }

  followPath(point, path: PathPoint[], duration: number, close: boolean = false) {
    var default_ops: PathPointOpts = {
      stroke: 20,
      lerp: true,
      strokeLerp: false
    };

    path = path.map(point => {
      if(point.opts) {
        point.opts = { ...default_ops, ...point.opts }
      } else {
        point.opts = default_ops
      }
      return point;
    });

    var lengthSub = close || path.length === 1 ? 0 : 1;
    var time = 0;
    var parts = Array(path.length - lengthSub).fill(0);

    var distances = Array(path.length - lengthSub).fill(0);
    var total_distance = 0;

    var p_dist = (path1, path2) => this.dist(path1.x, path1.y, path2.x, path2.y);

    for(var i = 0; i < path.length - lengthSub; ++i) {
      var nidx = i + 1;
      if(i === path.length - 1) {
        nidx = 0;
      }

      var dist = p_dist(path[i], path[nidx]);
      distances[i] = dist;
      total_distance += dist;
    }

    parts = distances.map((distance, index) => ({
      duration: duration / total_distance * distance,
      when: distances.slice(0, index).map((distance) => duration / total_distance * distance).reduce((a, b) => a + b, 0)
    }));

    console.log("DISTANCES", distances);
    console.log("PARTS", parts);
    return (delta) => {
      
      if(time > duration) {
        console.log('Done following path...');
        var idx = close || path.length === 1  ? 0 : path.length-1;
        return {x: path[idx].x, y: path[idx].y, stroke: path[idx].opts.stroke, progress: 1};
      }

      time += delta;

      var idx = -1;

      for(var i = 0; i < parts.length; ++i) {
        if(time >= parts[i].when) {
          idx = i;
        }
      }

      if(idx === -1) {
        console.log("couldn't find index");
        return;
      }

      var relTime = time - parts[idx].when;
      var percentDur = relTime / parts[idx].duration;

      var nidx = idx + 1;
      if(idx === path.length - 1) {
        nidx = 0;
      }

      var dx = path[idx].x;
      var dy = path[idx].y;
      if(path[idx].opts.lerp) {
        dx = this.lerp(path[idx].x, path[nidx].x, percentDur);
        dy = this.lerp(path[idx].y, path[nidx].y, percentDur);
      }

      var stroke = path[idx].opts.stroke;
      if(path[idx].opts.strokeLerp){
        stroke = this.lerp(path[idx].opts.stroke, path[nidx].opts.stroke, percentDur);
      }

      return { 
        x: dx,
        y: dy,
        stroke,
        progress: time / duration
      };
    };
  }
}
