import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { TimelineLite, TweenLite, Back } from 'gsap';

import * as SplitText from '../../greensock-js-business-green/src/SplitText.js';

@Component({
  selector: 'gsap-text',
  templateUrl: './gsap-text.component.html',
  styleUrls: ['./gsap-text.component.scss']
})
export class GsapTextComponent implements OnInit, AfterViewInit {
  @ViewChild('text') textEl: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var tl = new TimelineLite,
      mySplitText = new SplitText(this.textEl.nativeElement, {type:"chars"}),
      chars = mySplitText.chars; //an array of all the divs that wrap each character

    TweenLite.set(this.textEl.nativeElement, {perspective:400});

    tl.staggerFrom(chars.reverse(), 0.6, {opacity:0, x:-100, transformOrigin:"0% 50% -50"}, 0.2, "-=0");
  }

}
