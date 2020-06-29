(function (root, factory) {
  var pluginName = "HoverZone";

  if (typeof define === "function" && define.amd) {
    define([], factory(pluginName));
  } else if (typeof exports === "object") {
    module.exports = factory(pluginName);
  } else {
    root[pluginName] = factory(pluginName);
  }
})(this, function (HoverZone) {
  "use strict";

  var log_div = document.getElementById("log");

  if (!log_div) {
    log_div = document.createElement("div");
    log_div.id = "log";
    document.body.appendChild(log_div);
    console.log("you don't have log container, created for you >:(");
  } else { 
    console.log('you have log container, nice');
  }

  var defaults = {
    selector: ".hover-zone",
    horizontal: true,
    vertical: false,
    log_container: log_div,
    number: 3,
  };
  /**
   * Merge defaults with user options
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   */
  var extend = function (target, options) {
    var prop,
      extended = {};
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  };

  /**
     * Helper Functions
     @public
     */
  var logMe = function () {
    let date = new Date();
    this.log_container.innerHTML += date.getTime() + " " + message + "<br/>";
  };

  /**
   * Plugin Object
   * @param {Object} options User options
   * @constructor
   */
  function HoverZone(options) {
    this.options = extend(defaults, options);
    this.init(); // Initialization Code Here
  }

  /**
   * Plugin prototype
   * @public
   * @constructor
   */
  HoverZone.prototype = {
    getPosition: function (e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      this.self.logMe({ x, y });
      return {
        x,
        y,
      };
    },
    logMe: function (message) {
      
    },
    init: function () {
      // find all matching DOM elements.
      // makes `.selectors` object available to instance.
      this.self = this;
      this.log_container = document.getElementById(
        this.options.log_container_name
      );
      this.selectors = document.querySelectorAll(this.options.selector);
      for (var i = 0; i < this.selectors.length; i++) {
        var el = this.selectors[i];
        // Do something w/ each matched selector node.
        el.addEventListener("mousemove", this.getPosition);
        this.logMe(
          "mousemove listener added to #" + el.getAttribute("id")
        );
        // do something
      }
    } // #! init
  };
  return HoverZone;
});
