var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy(component, detaching) {
        if (component.$$) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                $$.fragment.l(children(options.target));
            }
            else {
                $$.fragment.c();
            }
            if (options.intro && component.$$.fragment.i)
                component.$$.fragment.i();
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy(this, true);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var _Array = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    Array.prototype._isEmpty = function () {
        return this.length === 0;
    };
    Array.prototype._isEqual = function (a) {
        return JSON.stringify(this) === JSON.stringify(a);
    };
    Array.prototype._count = function (n) {
        return this.filter(function (v) { return v == n; }).length;
    };
    Array.prototype._uniq = function () {
        return Array.from(new Set(this));
    };
    Array.prototype._uniq$ = function () {
        var a = this._uniq();
        return this._copy(a);
    };
    Array.prototype._overlap = function () {
        return this.filter(function (v, i, a) { return a.indexOf(v) === i && i !== a.lastIndexOf(v); });
    };
    Array.prototype._overlap$ = function () {
        var a = this._overlap();
        return this._copy(a);
    };
    Array.prototype._first = function (n) {
        var _this = this;
        if (n === void 0) { n = 1; }
        if (n === 1) {
            return this[0];
        }
        else {
            return smicleUtil.range(n).map(function (i) { return _this[i]; });
        }
    };
    Array.prototype._last = function (n) {
        if (n === void 0) { n = 1; }
        var a = this.concat();
        if (n === 1) {
            return a.pop();
        }
        // prettier-ignore
        return a.reverse()._first(n).reverse();
    };
    Array.prototype._take = function (n) {
        var a = this.concat();
        return a._take$(n);
    };
    Array.prototype._take$ = function (n) {
        this.splice(n);
        return this;
    };
    Array.prototype._drop = function (n) {
        var a = this.concat();
        return a.splice(n);
    };
    Array.prototype._drop$ = function (n) {
        return this.splice(n);
    };
    Array.prototype._sample = function () {
        var a = this.concat();
        return a._sample$();
    };
    Array.prototype._sample$ = function () {
        var n = smicleUtil.randInt(this.length);
        var v = this[n];
        this._remove$(n);
        return v;
    };
    Array.prototype._asc = function (s) {
        if (s === void 0) { s = ''; }
        var a = this.concat();
        return a._asc$(s);
    };
    Array.prototype._asc$ = function (s) {
        if (s === void 0) { s = ''; }
        if (s === '') {
            return this.sort(function (a, b) { return a - b; });
        }
        else {
            return this.sort(function (a, b) { return a[s] - b[s]; });
        }
    };
    Array.prototype._desc = function (s) {
        if (s === void 0) { s = ''; }
        var a = this.concat();
        return a._desc$(s);
    };
    Array.prototype._desc$ = function (s) {
        if (s === void 0) { s = ''; }
        if (s === '') {
            return this.sort(function (a, b) { return b - a; });
        }
        else {
            return this.sort(function (a, b) { return b[s] - a[s]; });
        }
    };
    Array.prototype._rotate = function (n) {
        if (n === void 0) { n = 1; }
        var a = this.concat();
        return a._rotate$(n);
    };
    Array.prototype._rotate$ = function (n) {
        if (n === void 0) { n = 1; }
        n %= this.length;
        this.unshift.apply(this, this.splice(n));
        return this;
    };
    Array.prototype._shuffle = function () {
        var a = this.concat();
        return smicleUtil.range(this.length).map(function (_) { return a._sample$(); });
    };
    Array.prototype._shuffle$ = function () {
        var a = this._shuffle();
        return this._copy(a);
    };
    Array.prototype._flat = function () {
        var flattenDeep = function (l) {
            return l.reduce(function (a, c) { return (Array.isArray(c) ? a.concat(flattenDeep(c)) : a.concat(c)); }, []);
        };
        return flattenDeep(this);
    };
    Array.prototype._flat$ = function () {
        var a = this._flat();
        return this._copy(a);
    };
    Array.prototype._zip = function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return this.map(function (v, i) { return [v].concat(a.map(function (e) { return (e[i] ? e[i] : null); })); });
    };
    Array.prototype._zip$ = function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return this._copy(this._zip.apply(this, a));
    };
    Array.prototype._transpose = function () {
        var _this = this;
        return smicleUtil.range(this[0].length).map(function (i) { return smicleUtil.range(_this.length).map(function (j) { return _this[j][i]; }); });
    };
    Array.prototype._transpose$ = function () {
        var a = this._transpose();
        return this._copy(a);
    };
    Array.prototype._copy = function (a) {
        var _this = this;
        this._clear();
        a.forEach(function (v, i) { return (_this[i] = v); });
        return this;
    };
    Array.prototype._clear = function () {
        this.length = 0;
        return this;
    };
    Array.prototype._delete = function (s) {
        var a = this.concat();
        return a._delete$(s);
    };
    Array.prototype._delete$ = function (s) {
        this._remove$.apply(this, this.map(function (v, i) { return [v, i]; })
            .filter(function (v) { return v._first() == s; })
            .map(function (v) { return v._last(); }));
        return this;
    };
    Array.prototype._remove = function () {
        var n = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            n[_i] = arguments[_i];
        }
        var a = this.concat();
        return a._remove$.apply(a, n);
    };
    Array.prototype._remove$ = function () {
        var _this = this;
        var n = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            n[_i] = arguments[_i];
        }
        n._flat$();
        if (n.length === 1) {
            this.splice(n._first(), 1)._first();
        }
        else if (n.length > 1) {
            n._desc().forEach(function (v) { return _this.splice(v, 1); });
        }
        return this;
    };
    Array.prototype._insert = function (n) {
        var m = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            m[_i - 1] = arguments[_i];
        }
        var a = this.concat();
        return a._insert$.apply(a, [n].concat(m));
    };
    Array.prototype._insert$ = function (n) {
        var m = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            m[_i - 1] = arguments[_i];
        }
        this.splice.apply(this, [n, 0].concat(m._flat()));
        return this;
    };
    Array.prototype._compact = function () {
        return this.filter(function (v) { return v; });
    };
    Array.prototype._compact$ = function () {
        var a = this._compact();
        return this._copy(a);
    };
    Array.prototype._chunk = function (n) {
        var _this = this;
        var l = this.length;
        var m = n._ceil();
        return smicleUtil.range(0, l, m).map(function (i) { return _this.slice(i, i + m); });
    };
    Array.prototype._chunk$ = function (n) {
        var a = this._chunk(n);
        return this._copy(a);
    };
    Array.prototype._each = function (callback, thisObject) {
        return this.reduce(function (result, element) {
            result[result.length] = callback.call(thisObject, element);
            return result;
        }, []);
    };
    });

    unwrapExports(_Array);

    var _Object = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    Object.prototype._isEmpty = function () {
        return JSON.stringify(this) === '{}';
    };
    Object.prototype._isEqual = function (o) {
        return JSON.stringify(this) === JSON.stringify(o);
    };
    });

    unwrapExports(_Object);

    var _String = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    String.prototype._num = function () {
        return smicleUtil.isStrFinite(this) ? Number(this) : this;
    };
    String.prototype._pw = function () {
        return this.split(' ');
    };
    String.prototype._splitNum = function () {
        return this.split(' ').map(Number);
    };
    String.prototype._spaceFill = function (n) {
        return ' '.repeat(n - this.length) + this;
    };
    String.prototype._zeroFill = function (n) {
        return '0'.repeat(n - this.length) + this;
    };
    });

    unwrapExports(_String);

    var _Number = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    Number.prototype._str = function () {
        return String(this);
    };
    Number.prototype._abs = function () {
        return Math.abs(this);
    };
    Number.prototype._round = function (n) {
        if (n === void 0) { n = 1; }
        return Math.round(this / n) * n;
    };
    Number.prototype._ceil = function (n) {
        if (n === void 0) { n = 1; }
        return Math.ceil(this / n) * n;
    };
    Number.prototype._floor = function (n) {
        if (n === void 0) { n = 1; }
        return Math.floor(this / n) * n;
    };
    Number.prototype._spaceFill = function (n) {
        var s = String(this);
        return ' '.repeat(n - s.length) + s;
    };
    Number.prototype._zeroFill = function (n) {
        var s = String(this);
        return '0'.repeat(n - s.length) + s;
    };
    Number.prototype._minusOnlyZero = function () {
        return this < 0 ? 0 : this;
    };
    });

    unwrapExports(_Number);

    var prototype = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    });

    unwrapExports(prototype);

    var smicleUtil = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;


    exports.range = function(start, stop, step) {
      if (stop === void 0) {
        stop = 0;
      }
      if (step === void 0) {
        step = 1;
      }
      switch (arguments.length) {
        case 1:
          return Array.from(Array(start), function(_, i) {
            return i
          })
        case 2:
          var n = -start + stop;
          return Array.from(Array(n._minusOnlyZero()), function(_) {
            return start++
          })
        case 3:
          if (step > 0) {
            var n_1 = -start + stop;
            return Array.from(Array(n_1._minusOnlyZero()), function(_) {
              return start++
            }).filter(function(_, i) {
              return i % step == 0
            })
          } else if (step < 0) {
            var n_2 = start + -stop;
            return Array.from(Array(n_2._minusOnlyZero()), function(_) {
              return start--
            }).filter(function(_, i) {
              return i % step == 0
            })
          } else {
            console.error(Error('range() arg 3 must not be zero'));
          }
      }
      return []
    };
    exports.rand = function(n) {
      return Math.random() * n
    };
    exports.randInt = function(n) {
      return exports.rand(n)._floor()
    };
    exports.max = function() {
      var n = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        n[_i] = arguments[_i];
      }
      return Math.max.apply(Math, n._flat())
    };
    exports.min = function() {
      var n = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        n[_i] = arguments[_i];
      }
      return Math.min.apply(Math, n._flat())
    };
    exports.sum = function() {
      var n = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        n[_i] = arguments[_i];
      }
      return n._flat().reduce(function(a, c) {
        return a + c
      })
    };
    exports.mean = function() {
      var n = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        n[_i] = arguments[_i];
      }
      n._flat$();
      return exports.sum(n) / n.length
    };
    exports.isNumber = function(v) {
      return typeof v === 'number'
    };
    exports.isFinite = function(v) {
      return Number.isFinite(v)
    };
    exports.isStrFinite = function(v) {
      return RegExp(/^[-+]?[0-9]+(\.[0-9]+)?$/).test(v)
    };
    });

    unwrapExports(smicleUtil);
    var smicleUtil_1 = smicleUtil.range;
    var smicleUtil_2 = smicleUtil.rand;
    var smicleUtil_3 = smicleUtil.randInt;
    var smicleUtil_4 = smicleUtil.max;
    var smicleUtil_5 = smicleUtil.min;
    var smicleUtil_6 = smicleUtil.sum;
    var smicleUtil_7 = smicleUtil.mean;
    var smicleUtil_8 = smicleUtil.isNumber;
    var smicleUtil_9 = smicleUtil.isFinite;
    var smicleUtil_10 = smicleUtil.isStrFinite;

    const paintTheTrout = (N) => {
        const a = [];
        for (let n = ((N / 8) | 0) * 8, i = 0; i < 8; i++) {
            a.push(n + i);
        }
        for (let n = N % 8, i = 0; i < 8; n += 8, i++) {
            a.push(n);
        }
        for (let n = N; n < 64; n += 9) {
            a.push(n);
            if (n % 8 == 7)
                break;
        }
        for (let n = N; n >= 0; n -= 9) {
            a.push(n);
            if (n % 8 == 0)
                break;
        }
        for (let n = N; n >= 0; n -= 7) {
            a.push(n);
            if (n % 8 == 7)
                break;
        }
        for (let n = N; n < 64; n += 7) {
            a.push(n);
            if (n % 8 == 0)
                break;
        }
        return a._uniq();
    };

    /* src/components/GameArea.svelte generated by Svelte v3.4.4 */

    const file = "src/components/GameArea.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.f = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (3:2) {#if (i + 1) % 8 == 0}
    function create_if_block(ctx) {
    	var br;

    	return {
    		c: function create() {
    			br = element("br");
    			add_location(br, file, 2, 24, 116);
    		},

    		m: function mount(target, anchor) {
    			insert(target, br, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(br);
    			}
    		}
    	};
    }

    // (1:0) {#each field as f, i}
    function create_each_block(ctx) {
    	var div, div_value_value, t, if_block_anchor, dispose;

    	function click_handler(...args) {
    		return ctx.click_handler(ctx, ...args);
    	}

    	var if_block = ((ctx.i + 1) % 8 == 0) && create_if_block();

    	return {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			div.className = "trout svelte-92vj7h";
    			attr(div, "value", div_value_value = ctx.f);
    			add_location(div, file, 1, 2, 25);
    			dispose = listen(div, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			insert(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.field) && div_value_value !== (div_value_value = ctx.f)) {
    				attr(div, "value", div_value_value);
    			}

    			if ((ctx.i + 1) % 8 == 0) {
    				if (!if_block) {
    					if_block = create_if_block();
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    				detach(t);
    			}

    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment(ctx) {
    	var each_1_anchor;

    	var each_value = ctx.field;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.field) {
    				each_value = ctx.field;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	
    const dispatch = createEventDispatcher();
    let { count, judge, field } = $$props;
    const troutClick = (i) => {
        if (field[i] !== 0)
            return;
        field[i] = field[i] === 0 ? 2 : field[i]; $$invalidate('field', field);
        paintTheTrout(i)
            .filter(n => field[n] === 0)
            .forEach(n => { const $$result = field[n] = field[n] === 0 ? 1 : field[n]; $$invalidate('field', field); return $$result; });
        count++; $$invalidate('count', count);
        if (field.every(n => n !== 0)) {
            if (count === 8) {
                $$invalidate('judge', judge = `${count}個置けたねおめでとう`);
            }
            else {
                $$invalidate('judge', judge = `${count}個しか置けてないぞ`);
            }
        }
        dispatch('updateChild', {
            count: count,
            judge: judge,
            field: field,
        });
    };

    	const writable_props = ['count', 'judge', 'field'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<GameArea> was created with unknown prop '${key}'`);
    	});

    	function click_handler({ i }, _) {
    		return troutClick(i);
    	}

    	$$self.$set = $$props => {
    		if ('count' in $$props) $$invalidate('count', count = $$props.count);
    		if ('judge' in $$props) $$invalidate('judge', judge = $$props.judge);
    		if ('field' in $$props) $$invalidate('field', field = $$props.field);
    	};

    	return {
    		count,
    		judge,
    		field,
    		troutClick,
    		click_handler
    	};
    }

    class GameArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["count", "judge", "field"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.count === undefined && !('count' in props)) {
    			console.warn("<GameArea> was created without expected prop 'count'");
    		}
    		if (ctx.judge === undefined && !('judge' in props)) {
    			console.warn("<GameArea> was created without expected prop 'judge'");
    		}
    		if (ctx.field === undefined && !('field' in props)) {
    			console.warn("<GameArea> was created without expected prop 'field'");
    		}
    	}

    	get count() {
    		throw new Error("<GameArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<GameArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get judge() {
    		throw new Error("<GameArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set judge(value) {
    		throw new Error("<GameArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get field() {
    		throw new Error("<GameArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set field(value) {
    		throw new Error("<GameArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.4.4 */

    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	var div, main, h1, t1, t2, span0, t3, t4, button, br, t6, span1, t7, current, dispose;

    	var gamearea = new GameArea({
    		props: {
    		count: ctx.count,
    		judge: ctx.judge,
    		field: ctx.field
    	},
    		$$inline: true
    	});
    	gamearea.$on("updateChild", ctx.updateChild);

    	return {
    		c: function create() {
    			div = element("div");
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "8Queen";
    			t1 = space();
    			gamearea.$$.fragment.c();
    			t2 = space();
    			span0 = element("span");
    			t3 = text("Queenの数：");
    			t4 = text(ctx.count);
    			button = element("button");
    			button.textContent = "はじめから";
    			br = element("br");
    			t6 = space();
    			span1 = element("span");
    			t7 = text(ctx.judge);
    			h1.className = "title svelte-1bowyze";
    			add_location(h1, file$1, 2, 4, 36);
    			span0.className = "svelte-1bowyze";
    			add_location(span0, file$1, 4, 4, 149);
    			button.className = "svelte-1bowyze";
    			add_location(button, file$1, 4, 32, 177);
    			add_location(br, file$1, 4, 71, 216);
    			span1.className = "svelte-1bowyze";
    			add_location(span1, file$1, 5, 4, 225);
    			main.className = "svelte-1bowyze";
    			add_location(main, file$1, 1, 2, 25);
    			div.className = "centered svelte-1bowyze";
    			add_location(div, file$1, 0, 0, 0);
    			dispose = listen(button, "click", ctx.reset);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, main);
    			append(main, h1);
    			append(main, t1);
    			mount_component(gamearea, main, null);
    			append(main, t2);
    			append(main, span0);
    			append(span0, t3);
    			append(span0, t4);
    			append(main, button);
    			append(main, br);
    			append(main, t6);
    			append(main, span1);
    			append(span1, t7);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var gamearea_changes = {};
    			if (changed.count) gamearea_changes.count = ctx.count;
    			if (changed.judge) gamearea_changes.judge = ctx.judge;
    			if (changed.field) gamearea_changes.field = ctx.field;
    			gamearea.$set(gamearea_changes);

    			if (!current || changed.count) {
    				set_data(t4, ctx.count);
    			}

    			if (!current || changed.judge) {
    				set_data(t7, ctx.judge);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			gamearea.$$.fragment.i(local);

    			current = true;
    		},

    		o: function outro(local) {
    			gamearea.$$.fragment.o(local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			gamearea.$destroy();

    			dispose();
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	
    let count = 0;
    let judge = '';
    let field = smicleUtil_1(64).fill(0);
    const updateChild = (e) => {
        $$invalidate('count', count = e.detail.count);
        $$invalidate('judge', judge = e.detail.judge);
        $$invalidate('field', field = e.detail.field);
    };
    const reset = () => {
        $$invalidate('count', count = 0);
        $$invalidate('judge', judge = '');
        smicleUtil_1(64).forEach(i => { const $$result = field[i] = 0; $$invalidate('field', field); return $$result; });
    };

    	return { count, judge, field, updateChild, reset };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, []);
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world',
        },
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
