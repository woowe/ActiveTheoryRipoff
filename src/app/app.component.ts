import { Component, NgZone, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as PIXI from 'pixi.js';

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

    var blurFilter1 = new PIXI.filters.BlurFilter();
    blurFilter1.blur = 0;
    var colorFilter = new PIXI.filters.ColorMatrixFilter();
    var colorFilter2 = new PIXI.filters.ColorMatrixFilter();
    colorFilter.blackAndWhite();
    colorFilter2.brightness(0.5);

    var graphics = new PIXI.Graphics();
    // set a fill and a line style again and draw a rectangle
    // graphics.lineStyle(10, 0xff0000, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(this.app.renderer.width / 2 - 260, this.app.renderer.height / 2 + 70, 520, 220);

    // graphics.filters = [blurFilter1];

    graphics.zOrder = 1;


    PIXI.loader.add('candeo_bg', '../assets/candeo_vid.mp4').load( (loader, resources) => {

        console.log('loaded');

        let texture = PIXI.Texture.fromVideo('../assets/WhyCandeo_OACF.mp4');

        let candeo_bg = new PIXI.Sprite(texture);

        candeo_bg.width = this.app.renderer.width;
        candeo_bg.height = this.app.renderer.height;

        this.app.stage.addChild(candeo_bg);

        let blurred = new PIXI.Sprite(texture);

        blurred.width = this.app.renderer.width;
        blurred.height = this.app.renderer.height;

        blurred.mask = graphics;
        blurred.filters = [blurFilter1, colorFilter, colorFilter2];
        this.app.stage.addChild(blurred);
        this.app.stage.addChild(graphics);
    });


    // var count = 0;
    // // listen for frame updates
    // this.app.ticker.add( () => {
    //   count += 0.005;
    //   blurFilter1.blur = 20 * (Math.cos(count));
    // });
  }

  @HostListener('window:resize')
  webgl_scene_resize() {
    let {w_height, w_width} = {w_height: window.innerHeight, w_width: window.innerWidth};
    this.app.renderer.resize(w_width, w_height);
    // this.app.stage.width    = w_width;
    // this.app.stage.height   = w_height;
  }
}
