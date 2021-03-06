(function() {
  var slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Slider = (function() {
    var Component, Debug, Fill, Knob, Label, Track, Vector, _, ref;

    _ = Slider._ = {
      extend: function() {
        var args, first, i, j, k, len, o, ref, v;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (!args.length) {
          return;
        }
        if (args.length === 1) {
          return args[0];
        }
        first = (ref = args.splice(0, 1)) != null ? ref[0] : void 0;
        for (i = j = 0, len = args.length; j < len; i = ++j) {
          o = args[i];
          for (k in o) {
            v = o[k];
            first[k] = v;
          }
        }
        return first;
      },
      map: function(o, f) {
        var j, k, len, results, results1, v;
        if (_.isArray(o)) {
          results = [];
          for (k = j = 0, len = o.length; j < len; k = ++j) {
            v = o[k];
            results.push(typeof f === "function" ? f(v, k) : void 0);
          }
          return results;
        } else {
          results1 = [];
          for (k in o) {
            v = o[k];
            results1.push(typeof f === "function" ? f(v, k) : void 0);
          }
          return results1;
        }
      },
      find: function(o, f) {
        var j, k, len, v;
        if (_.isArray(o)) {
          for (k = j = 0, len = o.length; j < len; k = ++j) {
            v = o[k];
            if (typeof f === "function" ? f(v, k) : void 0) {
              return v;
            }
          }
        } else {
          for (k in o) {
            v = o[k];
            if (typeof f === "function" ? f(v, k) : void 0) {
              return v;
            }
          }
        }
      },
      isObject: function(o) {
        return "[object Object]" === Object.prototype.toString.call(o);
      },
      isArray: function(o) {
        return "[object Array]" === Object.prototype.toString.call(o);
      },
      isMobile: 'ontouchstart' in window,
      delay: function(d, f) {
        return setTimeout(f, d);
      },
      throttle: function(d, fun, ctx) {
        var tmout;
        tmout = null;
        return function() {
          var args, k;
          if (tmout) {
            clearTimeout(tmout);
          }
          args = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = arguments.length; j < len; j++) {
              k = arguments[j];
              results.push(k);
            }
            return results;
          }).apply(this, arguments);
          return tmout = setTimeout(function() {
            return fun != null ? typeof fun.apply === "function" ? fun.apply(ctx != null ? ctx : this, args) : void 0 : void 0;
          }, d);
        };
      },
      addClass: function(e, c) {
        var ref;
        return e != null ? (ref = e.classList) != null ? ref.add(c) : void 0 : void 0;
      },
      removeClass: function(e, c) {
        var ref;
        return e != null ? (ref = e.classList) != null ? ref.remove(c) : void 0 : void 0;
      },
      toggleClass: function(e, c, t) {
        var name1, ref;
        return e != null ? (ref = e.classList) != null ? typeof ref[name1 = t ? 'add' : 'remove'] === "function" ? ref[name1](c) : void 0 : void 0 : void 0;
      },
      offset: function(e) {
        var offset, parent;
        if (!(e instanceof Element)) {
          return;
        }
        offset = {
          x: e.offsetLeft,
          y: e.offsetTop
        };
        parent = e.offsetParent;
        while (parent != null) {
          offset.x += parent.offsetLeft;
          offset.y += parent.offsetTop;
          parent = parent.offsetParent;
        }
        return offset;
      },
      transform: function(el, x, y) {
        var ref, style;
        style = el != null ? el.style : void 0;
        if (x instanceof Vector) {
          ref = x, x = ref.x, y = ref.y;
        }
        return style.transform = style.WebkitTransform = style.msTransform = "translate3d(" + (x.toFixed(3)) + "px, " + (y.toFixed(3)) + "px, 0)";
      },
      clamp: function(v, min, max) {
        if ((min != null) && v < min) {
          v = min;
        }
        if ((max != null) && v > max) {
          v = max;
        }
        return v;
      },
      roundTo: function(n, d) {
        return d * Math.round(n / d);
      },
      sign: function(n) {
        if (typeof n !== 'number' || isNaN(n) || !isFinite(n)) {
          return 0;
        }
        if (n >= 0) {
          return 1;
        } else {
          return -1;
        }
      },
      fixFPError: function(n) {
        var p, r, str;
        str = String(n);
        if (/\..*00000\d$/i.test(str)) {
          return Number(str.substring(0, str.length - 1));
        } else if (/\..*99999\d$/i.test(str)) {
          r = Number(str[str.length - 1]);
          p = str.indexOf('.');
          p = p - str.length + 1;
          return n + (_.sign(n)) * (10 - r) * Math.pow(10, p);
        } else {
          return n;
        }
      },
      formatObject: function(v, indent) {
        if (indent == null) {
          indent = 0;
        }
        return _.map(v, function(val, key) {
          var t;
          if (typeof val === 'string') {
            val = "\"" + val + "\"";
          }
          if ('[object Object]' === Object.prototype.toString.call(val)) {
            val = "\n" + _.formatObject(val, indent + 1);
          }
          return "" + (indent ? ((function() {
            var j, ref, results;
            results = [];
            for (t = j = 0, ref = indent; 0 <= ref ? j <= ref : j >= ref; t = 0 <= ref ? ++j : --j) {
              results.push('  ');
            }
            return results;
          })()).join('') : '') + key + ": " + val;
        }).join('\n');
      },
      formatNumber: function(n, options) {
        var defaults, macro, micro, order, unit;
        defaults = {
          inf: "&#8734;",
          nan: "?",
          decimalPlaces: 2,
          separator: ''
        };
        options = _.extend({}, defaults, options != null ? options : {});
        if (typeof n !== 'number') {
          return n;
        }
        if (isNaN(n)) {
          return "?";
        }
        if (!isFinite(n)) {
          return "&#8734;";
        }
        order = n !== 0 ? Math.floor(Math.log10(Math.abs(n))) : 0;
        unit = function(order, suffix) {
          return function(x) {
            var number;
            number = _.sign(x) * Math.round(Math.abs(x) / Math.pow(10, order - options.decimalPlaces)) / Math.pow(10, options.decimalPlaces);
            return number + options.separator + suffix;
          };
        };
        macro = [unit(0, ''), unit(3, 'k'), unit(6, 'M'), unit(9, 'G'), unit(12, 'T'), unit(15, 'P'), unit(18, 'E'), unit(21, 'Z'), unit(24, 'Y')];
        micro = [unit(0, ''), unit(-3, 'm'), unit(-6, 'μ'), unit(-9, 'n'), unit(-12, 'p'), unit(-15, 'f'), unit(-18, 'a'), unit(-21, 'z'), unit(-24, 'y')];
        order = _.sign(order) * Math.floor(Math.abs(order) / 3);
        if (order >= 0) {
          order = _.clamp(order, 0, macro.length - 1);
          return "" + macro[order](n);
        } else {
          order = _.clamp(order, -micro.length + 1, 0);
          return "" + micro[-order](n);
        }
      },
      log: function(e) {
        console.log(e);
        return e;
      },
      tag: function(name) {
        return function() {
          var a, arg, args, attr, content, el, j, key, last, len, ref, val;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          attr = {};
          last = args[args.length - 1];
          if (last instanceof Element || _.isArray(last)) {
            content = (ref = args.splice(args.length - 1, 1)) != null ? ref[0] : void 0;
          }
          for (j = 0, len = args.length; j < len; j++) {
            arg = args[j];
            for (key in arg) {
              val = arg[key];
              attr[key] = val;
            }
          }
          el = document.createElement(name);
          for (a in attr) {
            val = attr[a];
            el.setAttribute(a, val);
          }
          if (!_.isArray(content)) {
            content = [content];
          }
          content.map(function(c) {
            if (c instanceof Element) {
              return el.appendChild(c);
            }
          });
          return el;
        };
      },
      event: function(name, data) {
        var evt;
        evt = document.createEvent('Event');
        evt.initEvent(name, true, true);
        return _.extend(evt, data != null ? data : {});
      },
      listenOnce: function(element, name, listener) {
        var harness;
        harness = function(e) {
          element.removeEventListener(name, harness);
          return typeof listener === "function" ? listener(e) : void 0;
        };
        return element.addEventListener(name, harness);
      }
    };

    _.div = _.tag('div');

    _.pre = _.tag('pre');

    ref = _.isMobile ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'], _.startEvent = ref[0], _.moveEvent = ref[1], _.endEvent = ref[2];

    Vector = Slider.Vector = (function() {
      function Vector(x, y) {
        var touches;
        if (x instanceof Event) {
          if (_.isMobile) {
            touches = x.type === 'touchend' ? x.changedTouches : x.touches;
          }
          this.x = _.isMobile ? touches[0].pageX : x.pageX;
          this.y = _.isMobile ? touches[0].pageY : x.pageY;
        } else {
          this.set({
            x: x,
            y: y
          });
        }
      }

      Vector.prototype.set = function(v) {
        if ((v != null ? v.x : void 0) != null) {
          this.x = v.x;
        }
        if ((v != null ? v.y : void 0) != null) {
          return this.y = v.y;
        }
      };

      Vector.prototype.clone = function() {
        return new Vector(this.x, this.y);
      };

      Vector.prototype.subtract = function(v) {
        var ref1, ref2;
        return new Vector((ref1 = this.x - (v != null ? v.x : void 0)) != null ? ref1 : 0, (ref2 = this.y - (v != null ? v.y : void 0)) != null ? ref2 : 0);
      };

      Vector.prototype.add = function(v) {
        var ref1, ref2;
        return new Vector((ref1 = this.x + (v != null ? v.x : void 0)) != null ? ref1 : 0, (ref2 = this.y + (v != null ? v.y : void 0)) != null ? ref2 : 0);
      };

      Vector.prototype.magnitude = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
      };

      Vector.prototype.clamp = function(r) {
        var ref1, ref2, ref3, ref4;
        this.x = _.clamp(this.x, r != null ? (ref1 = r.x) != null ? ref1[0] : void 0 : void 0, r != null ? (ref2 = r.x) != null ? ref2[1] : void 0 : void 0);
        return this.y = _.clamp(this.y, r != null ? (ref3 = r.y) != null ? ref3[0] : void 0 : void 0, r != null ? (ref4 = r.y) != null ? ref4[1] : void 0 : void 0);
      };

      return Vector;

    })();

    Slider.errors = {
      selectorEmpty: 'slider element selector must return at least one element',
      elementInvalid: 'first argument must be a selector or an element',
      valueInvalid: 'slider value must be between options.min and options.max',
      positionInvalid: 'slider position must be between 0 and 1'
    };

    Slider.polling = {
      timeout: null,
      interval: 1931,
      start: function() {
        if (this.timeout == null) {
          return this.timeout = setInterval(function() {
            return Slider.instances.map(function(slider) {
              if (slider.options.poll && !slider.transitioning && !slider.dragging) {
                return slider.position(slider.position());
              }
            });
          }, this.interval);
        }
      },
      stop: function() {
        if (this.timeout != null) {
          return clearInterval(this.timeout);
        }
      }
    };

    Slider.defaults = {
      min: 0,
      max: 1,
      value: 0,
      step: 0.1,
      warnings: true,
      orientation: 'horizontal',
      transitionDuration: 350,
      poll: false,
      formElement: null
    };

    Slider.instances = [];

    Slider.getInstance = function(element) {
      if (!(element instanceof Element)) {
        return null;
      }
      return _.find(Slider.instances, function(i) {
        return i.element === element;
      });
    };

    Slider.prototype.warn = function() {
      var ref1;
      if (this.options.warnings) {
        return typeof console !== "undefined" && console !== null ? (ref1 = console.warn) != null ? ref1.apply(console, arguments) : void 0 : void 0;
      }
    };

    function Slider(element, options) {
      var component, ctor, generator, ref1, ref2;
      this.options = _.extend({}, Slider.defaults, options != null ? options : {});
      if (typeof element === 'string') {
        this.element = document.querySelector(element);
        if (!this.element) {
          throw Slider.errors.selectorEmpty;
        }
      } else if (element instanceof Element) {
        this.element = element;
      } else {
        throw Slider.errors.elementInvalid;
      }
      if ((ref1 = Slider.instances) != null) {
        if (typeof ref1.push === "function") {
          ref1.push(this);
        }
      }
      this.onFormElementChange = (function(_this) {
        return function(e) {
          var ok, ref2, ref3, ref4, val;
          val = e != null ? (ref2 = e.target) != null ? ref2.value : void 0 : void 0;
          if (val != null) {
            val = Number(val);
            if (isFinite(val) && !isNaN(val)) {
              ok = _this.value(val, {
                updateFormElement: false
              });
              if (ok == null) {
                return e != null ? (ref3 = e.target) != null ? ref3.value = _this.value() : void 0 : void 0;
              }
            } else {
              _this.warn(Slider.errors.valueInvalid + " : " + val);
              return e != null ? (ref4 = e.target) != null ? ref4.value = _this.value() : void 0 : void 0;
            }
          }
        };
      })(this);
      if (this.options.formElement) {
        this.bindFormElement(this.options.formElement);
      }
      _.addClass(this.element, 'slider');
      _.addClass(this.element, this.options.orientation);
      ref2 = Slider.components;
      for (component in ref2) {
        generator = ref2[component];
        if (ctor = generator(this.options)) {
          this[component] = new ctor(this, this.options[component]);
        }
      }
      this.value(this.options.value, {
        changeEvent: false,
        transitionEvent: false
      });
      if (this.options.poll) {
        Slider.polling.start();
      }
      window.addEventListener('resize', _.throttle(600, (function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
    }

    Slider.prototype.refresh = function(o) {
      var refresh;
      refresh = (function(_this) {
        return function() {
          return _this.position(_this.position(), _.extend({
            changeEvent: false,
            transitionEvent: false
          }, o));
        };
      })(this);
      if (this.transitioning) {
        return _.listenOnce(this.element, 'transition', refresh);
      } else {
        return refresh();
      }
    };

    Slider.prototype.bindFormElement = function(element, options) {
      var defaults;
      defaults = {
        unbindOldElement: true
      };
      options = _.extend({}, defaults, options);
      if (typeof element === 'string') {
        element = document.querySelector(element);
        if (!element) {
          throw Slider.errors.selectorEmpty;
        }
      } else if (!(element instanceof Element)) {
        throw Slider.errors.elementInvalid;
      }
      if (options.unbindOldElement && this.formElement && this.onFormElementChange) {
        this.formElement.removeEventListener('change', this.onFormElementChange);
      }
      element.addEventListener('change', this.onFormElementChange);
      return this.formElement = element;
    };

    Slider.prototype.value = function(v, options) {
      if (options == null) {
        options = {};
      }
      return this.position(v, _.extend(options, {
        normalized: false
      }));
    };

    Slider.prototype.position = function(p, options) {
      var comp, ctr, defaults, pos, ref1, ref2, ref3, step, val;
      if (_.isObject(p)) {
        options = p;
        p = void 0;
      }
      defaults = {
        normalized: true,
        transition: this.options.transitionDuration,
        changeEvent: true,
        transitionEvent: true,
        step: (options != null ? options.normalized : void 0) === false ? this.options.step : this.options.step / (this.options.max - this.options.min),
        updateFormElement: true
      };
      options = _.extend({}, defaults, options);
      pos = p === void 0 ? this.normalizedPosition : options.normalized ? p : (p - this.options.min) / (this.options.max - this.options.min);
      if (options.step) {
        step = !options.normalized ? options.step / (this.options.max - this.options.min) : options.step;
      } else {
        step = 1 / this.knob.range();
      }
      pos = _.fixFPError(_.roundTo(pos, step));
      val = options.normalized ? function(x) {
        return x;
      } : (function(_this) {
        return function(x) {
          return _this.options.min + x * (_this.options.max - _this.options.min);
        };
      })(this);
      if (p === void 0) {
        return _.fixFPError(val(pos));
      }
      if (!((val(0) <= p && p <= val(1)))) {
        this.warn(options.normalized ? Slider.errors.positionInvalid + " : " + p : Slider.errors.valueInvalid + " : " + p);
        return;
      }
      this.normalizedPosition = pos;
      if (options.transition) {
        _.addClass(this.element, 'transition');
        this.transitioning = true;
      }
      ref1 = Slider.components;
      for (comp in ref1) {
        ctr = ref1[comp];
        if ((ref2 = this[comp]) != null) {
          if (typeof ref2.position === "function") {
            ref2.position(this.normalizedPosition, options);
          }
        }
      }
      if (options.updateFormElement) {
        if ((ref3 = this.formElement) != null) {
          ref3.value = this.value();
        }
      }
      if (options.changeEvent) {
        this.element.dispatchEvent(_.event('change', {
          value: this.value()
        }));
      }
      if (options.transition) {
        _.delay(options.transition, (function(_this) {
          return function() {
            return _.delay(17, function() {
              _.removeClass(_this.element, 'transition');
              _this.transitioning = false;
              if (options.transitionEvent) {
                return _this.element.dispatchEvent(_.event('transition', {
                  value: _this.value()
                }));
              }
            });
          };
        })(this));
      }
      return pos;
    };

    Component = Slider.Component = (function() {
      function Component() {}

      return Component;

    })();

    Track = Slider.Track = (function(superClass) {
      extend(Track, superClass);

      Track.defaults = {
        dragEvents: true
      };

      Track.prototype.size = function() {
        switch (this.slider.options.orientation) {
          case 'horizontal':
            return this.element.offsetWidth;
          case 'vertical':
            return this.element.offsetHeight;
        }
      };

      function Track(slider1, options) {
        var knobStartOffset, pixelPos, ref1, start, toggleClass;
        this.slider = slider1;
        this.options = _.extend({}, (ref1 = Track.defaults) != null ? ref1 : {}, options != null ? options : {});
        this.slider.element.appendChild(this.element = _.div({
          "class": 'track'
        }));
        start = null;
        knobStartOffset = null;
        pixelPos = (function(_this) {
          return function(pxOffset, options) {
            var p;
            p = (function() {
              switch (this.slider.options.orientation) {
                case 'horizontal':
                  return pxOffset.x;
                case 'vertical':
                  return pxOffset.y;
              }
            }).call(_this);
            p = _.clamp((p - _this.slider.knob.size() / 2) / _this.slider.knob.range(), 0, 1);
            return _this.slider.position(p, options);
          };
        })(this);
        toggleClass = _.throttle(100, (function(_this) {
          return function(cls, condition) {
            if (condition == null) {
              condition = true;
            }
            return _.toggleClass(_this.slider.element, cls, condition);
          };
        })(this));
        this.element.addEventListener(_.startEvent, (function(_this) {
          return function(e) {
            var trackOffset;
            start = new Vector(e);
            trackOffset = _.offset(_this.element);
            pixelPos(start.subtract(trackOffset), {
              transition: false,
              step: false,
              changeEvent: false
            });
            knobStartOffset = _this.slider.knob.offset.clone();
            _.removeClass(_this.slider.element, 'transition');
            toggleClass('dragging', true);
            return _this.slider.dragging = true;
          };
        })(this));
        window.addEventListener(_.endEvent, (function(_this) {
          return function(e) {
            if (start != null) {
              toggleClass('dragging', false);
              _this.slider.dragging = false;
              _this.slider.refresh({
                changeEvent: true,
                transitionEvent: true
              });
              return start = null;
            }
          };
        })(this));
        window.addEventListener(_.moveEvent, (function(_this) {
          return function(e) {
            var orientOffset;
            if (start) {
              orientOffset = (function() {
                switch (this.slider.options.orientation) {
                  case 'horizontal':
                    return {
                      x: this.slider.knob.size() / 2
                    };
                  case 'vertical':
                    return {
                      y: this.slider.knob.size() / 2
                    };
                }
              }).call(_this);
              pixelPos(knobStartOffset.add(new Vector(e).subtract(start)).add(orientOffset), {
                transition: false,
                step: false,
                changeEvent: false
              });
              if (_this.options.dragEvents) {
                return _this.slider.element.dispatchEvent(_.event('drag', {
                  position: _this.slider.position(),
                  value: _this.slider.value()
                }));
              }
            }
          };
        })(this));
      }

      return Track;

    })(Component);

    Knob = Slider.Knob = (function(superClass) {
      extend(Knob, superClass);

      Knob.defaults = {
        dragEvents: true
      };

      Knob.prototype.size = function() {
        switch (this.slider.options.orientation) {
          case 'horizontal':
            return this.element.offsetWidth + 2 * this.element.offsetLeft;
          case 'vertical':
            return this.element.offsetHeight + 2 * this.element.offsetTop;
        }
      };

      Knob.prototype.range = function() {
        return this.slider.track.size() - this.size();
      };

      Knob.prototype.position = function(p, options) {
        this.offset.set((function() {
          switch (this.slider.options.orientation) {
            case 'horizontal':
              return {
                x: this.range() * p,
                y: 0
              };
            case 'vertical':
              return {
                x: 0,
                y: this.range() * p
              };
          }
        }).call(this));
        return _.transform(this.element, this.offset);
      };

      function Knob(slider1, options) {
        var ref1;
        this.slider = slider1;
        this.options = _.extend({}, (ref1 = Knob.defaults) != null ? ref1 : {}, options != null ? options : {});
        this.slider.element.appendChild(this.element = _.div({
          "class": 'knob'
        }));
        this.offset = new Vector(0, 0);
        this;
      }

      return Knob;

    })(Component);

    Label = Slider.Label = (function(superClass) {
      extend(Label, superClass);

      Label.defaults = {
        location: 'knob',
        precision: 1,
        popup: true,
        format: function(v, options) {
          return _.formatNumber(v, {
            decimalPlaces: options.precision
          });
        }
      };

      Label.prototype.position = function(p, o) {
        var base, formatted;
        Label.__super__.position.call(this, p, o);
        formatted = typeof (base = this.options).format === "function" ? base.format(this.slider.value(), this.options) : void 0;
        return this.value.innerText = this.hiddenValue.innerText = this.hiddenKnobValue.innerText = formatted;
      };

      function Label(slider1, options) {
        this.slider = slider1;
        Label.__super__.constructor.call(this, this.slider, _.extend({}, Label.defaults, options != null ? options : {}));
        _.addClass(this.element, 'label');
        if (this.options.popup) {
          _.addClass(this.element, 'popup');
        }
        this.element.appendChild(this.popup = _.div({
          "class": 'popup'
        }, [
          this.value = _.div({
            "class": 'value'
          }), _.div({
            "class": 'arrow'
          })
        ]));
        this.element.appendChild(this.hiddenValue = _.div({
          "class": 'hidden value'
        }));
        if (this.options.location === 'knob') {
          this.slider.knob.element.appendChild(this.hiddenKnobValue = _.div({
            "class": 'hidden value'
          }));
        }
      }

      return Label;

    })(Knob);

    Fill = Slider.Fill = (function(superClass) {
      extend(Fill, superClass);

      Fill.defaults = null;

      Fill.prototype.position = function(p, options) {
        var styleProp;
        if (this.options === 'upper') {
          p = 1 - p;
        }
        styleProp = this.slider.options.orientation === 'horizontal' ? 'width' : 'height';
        return this.element.style[styleProp] = p * this.slider.knob.range() + this.slider.knob.size() / 2 + 'px';
      };

      function Fill(slider1, options) {
        this.slider = slider1;
        this.options = options != null ? options : Fill.defaults;
        _.addClass(this.slider.element, "fill-" + this.options);
        this.slider.track.element.appendChild(this.element = _.div({
          "class": 'fill'
        }));
      }

      return Fill;

    })(Component);

    Debug = Slider.Debug = (function(superClass) {
      extend(Debug, superClass);

      Debug.prototype.position = function(p, options) {
        return this.element.innerText = _.formatObject({
          position: p,
          value: this.slider.value()
        });
      };

      function Debug(slider1, options) {
        this.slider = slider1;
        this.slider.element.appendChild(this.element = _.pre({
          "class": 'debug'
        }));
      }

      return Debug;

    })(Component);

    Slider.components = {
      track: function() {
        return Track;
      },
      knob: function() {
        return Knob;
      },
      label: function() {
        return Label;
      },
      fill: function(o) {
        if (o.fill != null) {
          return Fill;
        }
      },
      debug: function(o) {
        if (o.debug) {
          return Debug;
        }
      }
    };

    return Slider;

  })();

}).call(this);
