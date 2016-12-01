export default class InvisibleRangeSlider {
  constructor({target = false, selector = "body", min = 0, max = 100, callback} = {}) {
    this.selector = selector;
    this.min = min;
    this.max = max;
    this.callback = callback;


    this.reset();
    this.init();
  }

  init() {
    this.container = this.target || document.querySelector(this.selector);

    ("touchstart mousedown".split(" ")).forEach(event => this.container.addEventListener(event, this.onTouchStart.bind(this)));
    ("touchmove mousemove".split(" ")).forEach(event => this.container.addEventListener(event, this.onTouchMove.bind(this)));
    ("touchend touchcancel mouseup mouseout".split(" ")).forEach(event => this.container.addEventListener(event, this.onTouchStop.bind(this)));
  }

  reset() {
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
  }

  getPosition(event) {
    return { x: event.pageX || event.touches[0].pageX || event.screenX || 0, y: event.pageY || event.touches[0].pageY || event.screenY || 0 };
  }

  onDrag(targetX, targetY) {
    let path = Math.abs(this.startX - targetX) / this.container.clientWidth * 100,
      value = path / 100 * (this.max - this.min);

    this.callback.call(this.callback, value.toFixed(2));
  }

  onTouchStart(e) {
    let pos = this.getPosition(e);
    this.isDragging = true;
    this.startX = pos.x;
    this.startY = pos.x;
  }

  onTouchMove(e) {
    if (this.isDragging) {
      let pos = this.getPosition(e);
      this.onDrag.apply(this, Object.keys(pos).map(function (key) { return pos[key] }));
    }
  }

  onTouchStop() {
    this.reset();
  }
}
