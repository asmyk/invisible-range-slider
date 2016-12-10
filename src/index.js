export default class InvisibleRangeSlider {
  constructor({selector = "body", min = 0, max = 100, callback, value = 0, target = null, isInvertedDirection = false} = {}) {
    this.selector = selector;
    this.min = min;
    this.max = max;
    this.target = target;
    this.callback = callback;
    this._value = value;
    this.initialValue = value;
    this.isInvertedDirection = isInvertedDirection;
    this.events = { "start": "touchstart mousedown", "move": "touchmove mousemove", "stop": "touchend touchcancel mouseup mouseout" };

    this.reset();
    this.init();
  }

  init() {
    this.container = this.target || document.querySelector(this.selector);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchStop = this.onTouchStop.bind(this);

    this.startListening();
  }

  startListening() {
    (this.events.start.split(" ")).forEach(event => this.container.addEventListener(event, this.onTouchStart));
    (this.events.move.split(" ")).forEach(event => this.container.addEventListener(event, this.onTouchMove));
    (this.events.stop.split(" ")).forEach(event => this.container.addEventListener(event, this.onTouchStop));
  }

  stopListening() {
    (this.events.start.split(" ")).forEach(event => this.container.removeEventListener(event, this.onTouchStart));
    (this.events.move.split(" ")).forEach(event => this.container.removeEventListener(event, this.onTouchMove));
    (this.events.stop.split(" ")).forEach(event => this.container.removeEventListener(event, this.onTouchStop));
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

  getPathDistance(distance, patch) {
    let pathDistance = distance / patch * 100;
    return (this.isInvertedDirection) ? pathDistance : pathDistance * -1;
  }

  onDrag(targetX) {
    let path = this.getPathDistance(this.getDistance(this.startX, targetX), this.container.clientWidth);
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
