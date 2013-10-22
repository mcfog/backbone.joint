;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone'], factory);
  } else {
    factory();
  }
})(this, function() {
var $, _, $J, extend, this$ = this, slice$ = [].slice;
$ = Backbone.$;
_ = function(){
  return this;
}()._ || (typeof require == 'function' ? require('underscore') : void 8);
$J = Backbone.Joint = {
  $: $,
  _: _
};
extend = Backbone.Model.extend;
$J.assert = typeof console != 'undefined' && console !== null
  ? function(cond, msg){
    msg == null && (msg = 'Assertion failed');
    if (!cond) {
      console.warn(msg);
    }
    if (cond) {
      return false;
    } else {
      return msg;
    }
  }
  : function(cond, msg){
    msg == null && (msg = 'Assertion failed');
    if (cond) {
      return false;
    } else {
      return msg;
    }
  };
$J.advice = typeof console != 'undefined' && console !== null
  ? function(cond, msg){
    if (!cond) {
      console.info(msg);
    }
    if (cond) {
      return false;
    } else {
      return msg;
    }
  }
  : function(cond, msg){
    msg == null && (msg = 'Assertion failed');
    if (cond) {
      return false;
    } else {
      return msg;
    }
  };
$J.before = function(func){
  var beforeFuncs;
  beforeFuncs = slice$.call(arguments, 1);
  return function(){
    var state;
    state = {
      context: this,
      args: arguments
    };
    _.some(beforeFuncs, function(bfunc){
      var ref$;
      bfunc.state == null && (bfunc.state = []);
      bfunc.state.unshift(this);
      bfunc.apply(this.context, this.args);
      ref$ = bfunc.state[0], this.args = ref$.args, this.context = ref$.context, this.breaked = ref$.breaked, this.preventDefault = ref$.preventDefault, this.returnValue = ref$.returnValue;
      bfunc.state.shift();
      return this.breaked;
    }, state);
    if (state.preventDefault) {
      return state.returnValue;
    } else {
      return func.apply(state.context, state.args);
    }
  };
};
$J.after = function(func){
  var afterFuncs;
  afterFuncs = slice$.call(arguments, 1);
  return function(){
    var state;
    state = {
      context: this,
      args: arguments,
      returnValue: func.apply(this, arguments)
    };
    _.some(afterFuncs, function(afunc){
      var ref$;
      afunc.state == null && (afunc.state = []);
      afunc.state.unshift(this);
      afunc.apply(this.context, this.args);
      ref$ = afunc.state[0], this.args = ref$.args, this.context = ref$.context, this.breaked = ref$.breaked, this.returnValue = ref$.returnValue;
      afunc.state.shift();
      return this.breaked;
    }, state);
    return state.returnValue;
  };
};
(function(){
  this.extend = extend;
  import$(this.prototype, Backbone.Events);
}.call($J.Emitter = function(){}));
(function(){
  var ver, this$ = this;
  this.when = bind$($, 'when');
  this.defer = function(){
    var dfr;
    dfr = $.Deferred();
    return {
      resolver: {
        resolve: bind$(dfr, 'resolve'),
        reject: bind$(dfr, 'reject'),
        notify: bind$(dfr, 'notify'),
        state: bind$(dfr, 'state')
      },
      promise: this._mkPromise(dfr)
    };
  };
  this.resolve = function(){
    var args, ref$, resolver, promise;
    args = slice$.call(arguments);
    ref$ = this$.defer(), resolver = ref$.resolver, promise = ref$.promise;
    resolver.resolve.apply(resolver, args);
    return promise;
  };
  this.reject = function(){
    var args, ref$, resolver, promise;
    args = slice$.call(arguments);
    ref$ = this$.defer(), resolver = ref$.resolver, promise = ref$.promise;
    resolver.reject.apply(resolver, args);
    return promise;
  };
  this._mkPromise = (ver = $.prototype.jquery)
    ? (function(){
      switch (false) {
      case !ver.match(/^1\.[5-7]/):
        return function(it){
          var x0$;
          x0$ = it.promise();
          x0$.then = function(){
            var newPromise;
            newPromise = this.pipe.apply(this, arguments);
            newPromise.then = arguments.callee;
            return newPromise;
          };
          return x0$;
        };
      default:
        return function(it){
          return it.promise();
        };
      }
    }())
    : function(it){
      return it.promise();
    };
}.call($J.Deferred = {}));
(function(){
  this.html = function($el, html){
    return $el.html(html);
  };
  this.replaceWith = function($el, newContext){
    return $el.replaceWith(newContext);
  };
  this.setInnerView = function($container, view){
    this.removeInnerView($container);
    return $container.empty().append(view.el).data('$J:innerView', view);
  };
  this.removeInnerView = function($container){
    var that;
    if (that = $container.data('$J:innerView')) {
      that.remove();
    }
    return $container;
  };
}.call($J.Dom = {}));
(function(parent){
  var fsr;
  fsr = function(){
    var ref$, when, defer, reject, this$ = this;
    ref$ = $J.Deferred, when = ref$.when, defer = ref$.defer, reject = ref$.reject;
    return when(this.fetchTemplate(), this.serializeData()).then(function(tpl, data){
      var that;
      if (that = $J.assert(tpl, 'falsy template')) {
        return reject(that);
      }
      return this$.renderHtml(tpl, data);
    });
  };
  $J.View = parent.extend({
    initialize: function(){
      this.data = {};
      this._sync = {};
      return this._subviews = {};
    },
    fetchTemplate: function(){
      return $J.Dom.html($("#" + this.template));
    },
    renderHtml: function(tpl, data){
      return _.template(tpl, data);
    },
    serializeData: function(){
      return _.extend({}, this.data, this._sync);
    },
    renderElement: function(){
      var this$ = this;
      this.trigger('$J:render:before');
      this.trigger('$J:render:full:before');
      return fsr.call(this).then(function(html){
        return $J.Dom.html(this$.$el, html);
      }).then(function(){
        return $J.Deferred.when(this$.mapSubviews(function(view, selector){
          var $el;
          $el = this$.$(selector);
          if ($J.assert($el.length > 0, 'subview selector missed')) {
            return;
          }
          $J.advice($el.length === 1, 'subview selector more than 1 match');
          if ($el.has(view.el).length === 0) {
            $J.Dom.setInnerView($el, view);
          }
          if (view instanceof $J.View) {
            return view.renderElement();
          } else {
            return view.render();
          }
        }));
      }).then(function(){
        this$.trigger('$J:render:done');
        this$.trigger('$J:render:full:done');
        return true;
      }, function(){
        this$.trigger('$J:render:fail', arguments);
        this$.trigger('$J:render:full:fail', arguments);
      });
    },
    renderFields: function(syncName, fields){
      var view, this$ = this;
      if (!fields) {
        return this.renderElement();
      }
      this.trigger('$J:render:before');
      this.trigger('$J:render:part:before', [syncName, fields]);
      view = this;
      fields = this.parseFields(fields);
      return fsr.call(this).then(function(html){
        var $html;
        $html = $J.Dom.html($(document.createElement('div')), html);
        return _.each(this$.extractFields($html, syncName, fields), function(src){
          return this$.replaceWithSrc(src);
        });
      }).then(function(){
        this$.trigger('$J:render:done');
        this$.trigger('$J:render:part:done', [syncName, fields]);
        return true;
      }, function(){
        this$.trigger('$J:render:fail', arguments);
        this$.trigger('$J:render:part:fail', arguments);
      });
    },
    parseFields: function(fields){
      fields = (function(){
        switch (false) {
        case !_.isString(fields):
          return fields.split(' ');
        case !_.isArray(fields):
          return fields;
        default:
          throw new Error('malformed fields');
        }
      }());
      return _.compact(fields);
    },
    extractFields: function($el, syncName, fields){
      var $r, this$ = this;
      $r = $();
      _.each(fields, function(field){
        return $r = $r.add($el.find("[j-field~=\"" + syncName + "." + field + "\"],[j-field~=\"" + syncName + ".*\"],[j-field~=\"*\"]"));
      });
      return $r.toArray();
    },
    replaceWithSrc: function(src){
      var $src, id, $dst;
      $src = $(src);
      id = $src.attr('j-id') || $src.attr('j-field');
      $dst = this.$el.find("[j-id=\"" + id + "\"],:not([j-id])[j-field=\"" + id + "\"]");
      if ($dst.length == 0 || $src.length == 0) {
        return;
      }
      return $J.Dom.replaceWith($dst, $src);
    },
    sync: function(syncName, synchronizer, events){
      var that, this$ = this;
      if (that = this._sync[syncName]) {
        this.stopListening(that);
      }
      this._sync[syncName] = synchronizer;
      this.listenTo(synchronizer, '$J:sync', function(fields){
        this$.renderFields(syncName, fields);
      });
      if (events) {
        this.listenTo(synchronizer, events, function(){
          this$.render();
        });
      }
      return this;
    },
    unsync: function(syncName){
      var that;
      if (that = this._sync[syncName]) {
        this.stopListening(that);
      }
      delete this._sync[syncName];
      return this;
    },
    setView: function(selector, view){
      var $el, this$ = this;
      $el = this.$(selector);
      if ($el.length > 0 && $el.has(view.el).length === 0) {
        $J.Dom.setInnerView($el, view);
      }
      this._subviews[selector] = view;
      return view.on('all', function(name){
        if (name.substring(0, 3) === '$J:') {
          return;
        }
        this$.trigger.apply(this$, arguments);
      });
    },
    remove: $J.before(parent.prototype.remove, function(){
      this.mapSubviews(function(it){
        it.remove();
      });
    }),
    delegateEvents: $J.before(parent.prototype.delegateEvents, function(){
      this.mapSubviews(function(it){
        if (it.$el) {
          it.delegateEvents();
        }
      });
    }),
    undelegateEvents: $J.before(parent.prototype.undelegateEvents, function(){
      this.mapSubviews(function(it){
        if (it.$el) {
          it.undelegateEvents();
        }
      });
    }),
    setElement: $J.after(parent.prototype.setElement, function(){
      return $J.advice(this.$el.length === 1, '`view.$el` should contain exactly one element');
    }),
    render: function(){
      this.renderElement();
      return this;
    },
    mapSubviews: function(iterator, context){
      return _.map(this._subviews, iterator, context);
    }
  });
}.call(this, Backbone.View));
$J.ViewModel = $J.Emitter.extend({
  constructor: function(){
    if (typeof this.initialize == 'function') {
      this.initialize.apply(this, arguments);
    }
    return this;
  },
  initialize: function(){},
  sync: function(){
    this.trigger.apply(this, ['$J:sync'].concat(slice$.call(arguments)));
  }
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
function bind$(obj, key){
  return function(){ return obj[key].apply(obj, arguments) };
}return Backbone.Joint;
});