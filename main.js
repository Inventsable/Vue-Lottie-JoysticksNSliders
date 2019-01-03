// // NOTE:
// This line is required with joystick components
window.Event = new Vue();

Vue.component('sandbox', {
  template: `
    <div class="site-wrap">
      <card v-if="hasTop">
        <lottie-simple classname="bmv-simple" file="logo" />
      </card>
      <card>
        <joystick
          name="tell"
          :bounds="adjustBounds(300)" 
          :controller="adjustBounds(50)" 
          :color="'#2b3137'" 
          :border="'#24292e'"
        />
        <div class="card-preview">
          <lottie 
            classname="lottie-container"
            :width="checkDim()" :height="checkDim()" 
            file="omo1" 
            joystick="tell"
            layer="masterJoy"
          />
        </div>
      </card>
    </div>
  `,
  data() {
    return {
      hasTop: false,
    }
  },
  methods: {
    adjustBounds(num) {
      if ((this.$root.isMobile) && (this.$root.isPortrait)) {
        console.log('Caught portrait')
        return num*2;
      } else {
        return num;
      }
    },
    checkDim() {
      let dim = 400;
      if (this.$root.isMobile) {
        if (this.$root.isPortrait) {
          dim = 800;
          console.log('Caught it')
          // style += ``
        } else {
          dim = 400;
          // style += 
        }
      } else {
        dim = 400;
        // style += 
      }
      return dim;  
    }
  }
})


Vue.component('card', {
  template: `
    <div 
      class="content-body" :style="getCardStyle()">
      <slot></slot>
    </div>
  `,
  methods: {
    getCardStyle() {
      console.log(`${this.$root.isMobile} : ${this.$root.isLandscape} : ${this.$root.isPortrait}`)
      let style = ``
      if (this.$root.isMobile) {
        if (this.$root.isPortrait) {
          style += `display:flex;flex-direction:column;align-items:center;`
        } else {
          style += `display:flex;justify-content:space-around;flex-direction:row;align-items:baseline;`
          // style += `display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 0fr 0fr`
        }
      } else {
        style += `display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 0fr 0fr`
      }
      return style;
    }
  }
})

Vue.component('lottie-simple', {
  props: {
    classname: String,
    file: String,
  },
  template: `
    <div :class="classname"></div>
  `,
  data() {
    return {
      animData: {},
    }
  },
  mounted() {
    this.animData = this.buildAnimation();
  },
  methods: {
    buildAnimation() {
      const elt = this.$el;
      const animData = {
        wrapper: elt,
        animType: 'svg',
        loop: true,
        prerender: true,
        autoplay: true,
        path: `./${this.file}.json`,
      };
      return lottie.loadAnimation(animData);
    },
  }
})


Vue.component('lottie', {
  props: {
    width: Number,
    height: Number,
    file: String,
    joystick: String,
    event: String,
    layer: String,
    classname: String,
  },
  template: `
    <div :class="classname" :style="getLottieStyle()"></div>
  `,
  data() {
    return {
      animData: {},
      animAPI: {},
      aePos: [],
      elt: {},
      project: {},
      joyX: 0,
      joyY: 0,
    }
  },
  mounted() {
    const self = this;
    this.elt = this.$el;
    this.animData = this.buildAnimation();
    this.animData.addEventListener('DOMLoaded', self.registerLottieAPI);
    Event.$on(`setJoystick${this.joystick}`, this.setJoystick);
  },
  computed: {
    hasJoystick: function() {
      let state = true;
      try { state = (this.joystick.length > 2) ? true : false; } catch(e) { state = false  } finally { return state; } 
    }
  },
  methods: {
    getLottieStyle() {
      console.log(`${this.$root.isMobile} : ${this.$root.isLandscape} : ${this.$root.isPortrait}`)
      let style = ``
      if (this.$root.isMobile) {
        if (this.$root.isPortrait) {
          style += `margin-bottom:5rem;width:100%;`
        } else {
          // style += 
        }
      } else {
        // style += 
      }
      return style;    
    },
    setJoystick(msg) {
      let coords = msg.split(';');
      this.joyX = Number(coords[0]), this.joyY = Number(coords[1]);
    },
    registerLottieAPI() {
      if (this.hasJoystick) {
        const self = this;
        this.animAPI = lottie_api.createAnimationApi(this.animData);
        this.aePosition = this.animAPI.getKeyPath(`${this.layer},Transform,Position`);
        console.log(this.animData.frames);
        this.animAPI.addValueCallback(self.aePosition, function(currentValue) {
          return [self.joyX, self.joyY];
        });
      }
    },
    buildAnimation() {
      const self = this;
      const animData = {
        wrapper: self.elt,
        animType: 'svg',
        loop: true,
        prerender: true,
        autoplay: true,
        path: `./${this.file}.json`,
      };
      return lottie.loadAnimation(animData);
    },
  }
})


Vue.component('joystick-anno', {
  props: {
    xPos: Number,
    yPos: Number,
  },
  template: `
    <div class="joystick-anno">
        <span class="anno-neutral">[</span>
        <span class="anno-coords">{{xPos}}</span>
        <span class="anno-neutral">,</span>
        <span class="anno-coords">{{yPos}}</span>
        <span class="anno-neutral">]</span>
      </div>
  `
})

Vue.component('joystick-grid', {
  props: {
    bounds: Number,
    cols: Number,
  },
  template: `
    <div :style="getGridStyle()" class="joystick-grid">
      <div v-for="item in gridList" :style="getGridLineStyle()" class="joystick-grid-cell"></div>
    </div>
  `,
  data() {
    return {
      gridList: [],
    }
  },
  mounted() {
    this.buildGridList();
  },
  methods: {
    getGridStyle() {
      return `
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(10, 1fr);
        box-sizing: border-box;
        z-index: 4;
        position: absolute;
        top: 0px;
        width: ${this.bounds}px;
        left: 0px;
        height: ${this.bounds}px;
      `
    },
    getGridLineStyle() {
      return `border:1px solid rgba(255,255,255,0.05);`
    },
    buildGridList() {
      let mirror = [];
      this.gridList = [];
      for (let i = 0; i < this.cols * this.cols; i++)
        mirror.push({key: i})
      this.gridList = mirror;
    },
  }
})

Vue.component('joystick', {
  props: {
    bounds: Number,
    controller: Number,
    color: String,
    border: String,
    name: String,
  },
  template: `
    <div class="joystick-wrap" :style="checkMobileSize()">
      <div 
        class="joystick-bounds" 
        :style="getBoundsStyle()"
        @mouseenter="inBounds()"
        @mouseleave="outBounds()">
        <div 
          class="joystick-control" 
          v-show="!isShift"
          @mousedown="dragStart($event, $el)"
          @mouseup="dragEnd($event, $el)"
          @mousemove="drag($event, $el)"
          @touchstart="dragStart($event, $el)"
          @touchend="dragEnd($event, $el)"
          @touchmove="drag($event, $el)"
          v-mousemove-outside="mouseMove"
          :style="getControllerStyle()">
        </div>
        <div v-show="isShift" class="joystick-control-ghost" :style="getControllerStyle()"></div>
        <joystick-grid :bounds="bounds" :cols="10" />
      </div>
      <joystick-anno :xPos="joyX" :yPos="joyY" />
    </div>
  `,
  computed: {
    centerPoint: function() {
      return [this.bounds / 2 - this.controller / 2, this.bounds / 2 - this.controller / 2];
    },
    controlPos: function() {
      return {
        // this is a mess
        template: {
          center: [0,0],
          north: [0,-200],
          west: [200,0],
          south: [0,200],
          east: [-200,0],
        },
        objective: {
          center: [0,0],
          north: [0, (this.bounds / 2) * (-1)],
          east: [this.bounds / 2, 0],
          south: [0, this.bounds / 2],
          west: [this.bounds / 2, 0],
          northwest: [(this.bounds / 2) * (-1), (this.bounds / 2) * (-1)],
          northeast: [(this.bounds / 2), (this.bounds / 2) * (-1)],
          southwest: [(this.bounds / 2) * (-1), (this.bounds / 2)],
          southeast: [(this.bounds / 2), (this.bounds / 2)],
        },
        relative: {
          center: [(this.bounds / 2) - (this.controller / 2), (this.bounds / 2) - (this.controller / 2)],
          north: [(this.bounds / 2) - (this.controller / 2), (this.controller / 2) * (-1)],
          east: [(this.bounds) - (this.controller / 2), (this.bounds / 2) - (this.controller / 2)],
          south: [(this.bounds / 2) - (this.controller / 2), (this.bounds) - (this.controller / 2)],
          west: [(this.controller / 2)*(-1), (this.bounds / 2) - (this.controller / 2)]
        }
      }
    },
    ratio: function() {
      if ((this.$root.isMobile) && (this.$root.isPortrait)) {
        return this.bounds / 200 / 4;
      } else {
        return this.bounds / 200;
      }
    },
  },
  data() {
    return {
      joyX: 0,
      joyY: 0,
      initialX: 0,
      initialY: 0,
      currentX: 0,
      currentY: 0,
      xOffset: 0,
      yOffset: 0,
      ghostX: 0,
      ghostY: 0,
      isActive: false,
      isHover: false,
      isShift: false,
      elt: {},
      ghost: {},
      origin: {},
      parent: {},
    }
  },
  mounted() {
    const self = this;
    this.parent = this.$el;
    this.origin = this.$el.children[0];
    this.elt = this.$el.children[0].children[0];
    this.ghost = this.$el.children[0].children[1];
    console.log(this.ghost);
    this.sendTo('center');
    window.addEventListener('keydown', function(e){
      self.handleKey(e, true);
    });
    window.addEventListener('keyup', function (e) {
      self.handleKey(e, false);
    });
  },
  methods: {
    checkMobileSize() {
      let style = 'width:'
      if (this.$root.isMobile) {
        if (this.$root.isPortrait) {
          style += `100%;order:1;`
        } else {
          style += 'auto;'
        }
      } else {
        style += 'auto;'
      }
      return style;
    },
    getPos(el) {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
      };
    },
    mouseMove(evt, el) {
      if ((this.isHover) && (this.isShift)) {
        let newX = evt.clientX, newY = evt.clientY;
        let xOffset = this.getPos(this.origin).left, yOffset = this.getPos(this.origin).top;
        newX -= xOffset, newY -= yOffset;
        newX -= (this.bounds / 2), newY -= (this.bounds / 2);
        // console.log(`${newX}, ${newY}`)
        this.updateJoystickMirror(newX, newY);
        this.setTranslate(newX, newY, this.ghost);
        this.setTranslate(newX, newY, this.elt);
        this.xOffset = newX, this.yOffset = newY;
        // console.log(offset)
      }
      // console.log(evt)
    },
    handleKey(evt, state) {
      if (evt.shiftKey == state) {
        if ((this.isShift !== evt.shiftKey) && (this.isHover)) {
          this.isShift = evt.shiftKey;
          if ((this.isHover) && (!this.isShift)) {
            // this.resetController();
            // this.setTranslate(this.ghostX, this.ghostY, this.elt);
          }
        }
      }
    },
    inBounds() {
      this.isHover = true;
      console.log(this.isHover);
    },
    outBounds() {
      if (this.isShift) {
        // console.log('Handle dragging to end');

      }
      this.isHover = false;
      this.isShift = false;
      // console.log(this.isHover);
    },
    sendTo(...args) {
      this.resetController();
      const typecheck = Array.isArray(args[0]);
      let xPos, yPos, xOff, yOff;
      if ((args.length > 1) || (typecheck)) {
        xPos = args[0][0], yPos = args[0][1];
      } else if (/\w/.test(args[0][0])) {
        let label = args[0];
        xPos = this.controlPos.relative[label][0], yPos = this.controlPos.relative[label][1];
        console.log(`${args[0]} is a word.`);
      }
      this.elt.style.left = `${xPos}px`;
      this.elt.style.top = `${yPos}px`;
      
    },
    getBoundsStyle() {
      let style = `
        width:${this.bounds}px;
        height:${this.bounds}px;
        background-color: ${this.color};
      `;
      style += (this.isShift) ? `border-color:red;` : `border-color:${this.color};`;
      return style;
    },
    getControllerStyle() {
      return `
        width:${this.controller}px;
        height:${this.controller}px;
        top:${this.centerPoint[1]}px;
        left:${this.centerPoint[0]}px;
      `;
    },
    resetController() {
      this.setTranslate(0,0,this.elt);
    },
    dragStart(e, el) {
      if (e.type === "touchstart") {
        this.initialX = e.touches[0].clientX - this.xOffset;
        this.initialY = e.touches[0].clientY - this.yOffset;
        console.log('Touch started')
      } else {
        this.initialX = e.clientX - this.xOffset;
        this.initialY = e.clientY - this.yOffset;
      }
      if (e.target === this.elt) {
        this.isActive = true;
        // Event.$emit('joystickOn');
      }

    },
    dragEnd(e, el) {
      this.initialX = this.currentX;
      this.initialY = this.currentY;
      this.isActive = false;
      console.log('Move ended')
      // Event.$emit('joystickOff');
    },
    drag(e, el) {
      if (this.isActive) {
        e.preventDefault();
        if (e.type === "touchmove") {
          this.currentX = e.touches[0].clientX - this.initialX;
          this.currentY = e.touches[0].clientY - this.initialY;
          console.log('Touch moving...')
        } else {
          this.currentX = e.clientX - this.initialX;
          this.currentY = e.clientY - this.initialY;
        }
        this.xOffset = this.currentX;
        this.yOffset = this.currentY;

        this.updateJoystickMirror(this.xOffset, this.yOffset);
        this.setTranslate(this.currentX, this.currentY, this.elt);
      }
    },
    updateJoystickMirror(xPos, yPos) {
      this.joyX = Math.round(xPos * this.ratio), this.joyY = Math.round(yPos * this.ratio);
      if (this.joyX > 200)
        this.joyX = 200;
      else if (this.joyX < (-200))
        this.joyX = (-200);
      if (this.joyY > 200)
        this.joyY = 200;
      else if (this.joyY < (-200))
        this.joyY = (-200);
      Event.$emit(`setJoystick${this.name}`, `${this.joyX};${this.joyY}`);
    },
    setTranslate(xPos, yPos, el) {
      if (el !== this.ghost) {
        if (xPos > this.bounds/2)
          xPos = this.bounds/2;
        else if (xPos < this.bounds/2*-1)
          xPos = this.bounds/2*-1;
        if (yPos > this.bounds / 2)
          yPos = this.bounds / 2;
        else if (yPos < this.bounds / 2 * -1)
          yPos = this.bounds / 2 * -1;
      }
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    },
  }
})


var app = new Vue({
  el: '#app',
  data: {
    w: 0,
    h: 0,
    isMobile: false,
    isDesktop: false,
    isLandscape: false,
    isPortrait: false,
  },
  mounted() {
    this.handleResize(null);
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.w = document.documentElement.clientWidth;
      this.h = document.documentElement.clientHeight;
      this.findDevice();
    },
    findDevice() {
      if (this.w <= 980) {
        this.isMobile = true;
        this.isDesktop = false;
        console.log(`Mobile at ${this.w}`)
        if (this.h > this.w) {
          console.log('Portrait')
          this.isLandscape = false;
          this.isPortrait = true;
        } else {
          console.log('Landscape')
          this.isLandscape = true;
          this.isPortrait = false;      
        }
      } else {
        console.log(`Desktop at ${this.w}`)
        this.isDesktop = true;
        this.isMobile = false;
      }
    },
    getCSS(prop) { return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop); },
    setCSS(prop, data) { document.documentElement.style.setProperty('--' + prop, data); },
  }
})