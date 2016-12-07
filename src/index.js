export default class InvisibleRangeSlider {
  constructor({selector = "body", min = 0, max = 100, callback, value = 0, target = null} = {}) {
    this.selector = selector;
    this.min = min;
    this.max = max;
    this.target = target;
    this.callback = callback;
    this._value = value;
    this.initialValue = value;

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
    this.initialValue = this.value;
  }

  get value() {
    return (parseFloat(this._value).toFixed(2)) / 1;
  }

  set value(newValue) {
    newValue = this.initialValue + newValue;

    if (newValue > this.max) {
      this._value = this.max;
    }
    if (newValue < this.min) {
      this._value = this.min;
    } else if (newValue >= this.min && newValue <= this.max) {
      this._value = newValue;
    }
  }

  getPosition(event) {
    return {
      x: event.pageX || event.touches[0].pageX || event.screenX || 0,
      y: event.pageY || event.touches[0].pageY || event.screenY || 0
    };
  }

  getDistance(x1, x2) {
    return x1 - x2;
  }

  onDrag(targetX) {
    let path = this.getDistance(this.startX, targetX) / this.container.clientWidth * 100;
    this.value = path / 100 * (this.max - this.min);
    this.callback.call(this.callback, this.value);
  }

  onTouchStart(e) {
    let pos = this.getPosition(e);
    this.isDragging = true;
    this.startX = pos.x;
  }

  onTouchMove(e) {
    if (this.isDragging) {
      let pos = this.getPosition(e);
      this.onDrag.apply(this, Object.keys(pos).map(function (key) {
        return pos[key]
      }));
    }
  }

  onTouchStop() {
    this.reset();
  }
}
