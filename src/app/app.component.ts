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
      height: window.innerHeight
    });

    // The application will create a canvas element for you that you
    // can then insert into the DOM.
    this.pixiScene.nativeElement.appendChild(this.app.view);

    // load the texture we need
    // PIXI.loader.add('bunny', '../assets/bunnys.png').load( (loader, resources) => {

    //     // This creates a texture from a 'bunny.png' image.
    //     let bunny = new PIXI.Sprite(resources.bunny.texture);

    //     // Setup the position of the bunny
    //     bunny.x = this.app.renderer.width / 2;
    //     bunny.y = this.app.renderer.height / 2;

    //     // Rotate around the center
    //     bunny.anchor.x = 0.5;
    //     bunny.anchor.y = 0.5;

    //     // Add the bunny to the scene we are building.
    //     this.app.stage.addChild(bunny);

    //     // Listen for frame updates
    //     this.app.ticker.add(() => {
    //         // each frame we spin the bunny around a bit
    //         bunny.rotation += 0.01;
    //     });
    // });

    PIXI.loader.add('candeo_bg', '../assets/candeo-bg.jpg').load( (loader, resources) => {

        let candeo_bg = new PIXI.Sprite(resources.candeo_bg.texture);

        // Setup the position of the bunny
        candeo_bg.x = this.app.renderer.width / 2;
        candeo_bg.y = this.app.renderer.height / 2;

        // Rotate around the center
        candeo_bg.anchor.x = 0.5;
        candeo_bg.anchor.y = 0.5;

        this.app.stage.addChild(candeo_bg);
    });
  }

  @HostListener('window:resize')
  webgl_scene_resize() {
    let {w_height, w_width} = {w_height: window.innerHeight, w_width: window.innerWidth};
    this.app.renderer.resize(w_width, w_height);
    // this.app.stage.width    = w_width;
    // this.app.stage.height   = w_height;
  }
}
