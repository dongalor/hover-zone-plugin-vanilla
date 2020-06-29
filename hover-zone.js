(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory(root));
  } else if (typeof exports === "object") {
    module.exports = factory(root);
  } else {
    root.HoverZone = factory(root); // @todo rename plugin
  }
})(
  typeof global !== "undefined" ? global : this.window || this.global,
  function (root) {
    "use strict";

    //////////////////////////////
    // Variables
    //////////////////////////////
    var HoverZone = {};

    var supports = !!document.querySelector && !!root.addEventListener; // Feature test

    var settings;

    // Default settings
    var defaults = {
      selector: "hz",
      horizontal: true,
      vertical: false,
      number: 3,
      initClass: "initialized",
      callbackBefore: function () {},
      callbackAfter: function () {},
    };

    //////////////////////////////
    // Private Functions
    //////////////////////////////

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    function forEach(collection, callback, scope) {
      if (Object.prototype.toString.call(collection) === "[object Object]") {
        for (var prop in collection) {
          if (Object.prototype.hasOwnProperty.call(collection, prop)) {
            callback.call(scope, collection[prop], prop, collection);
          }
        }
      } else {
        for (var i = 0, len = collection.length; i < len; i++) {
          callback.call(scope, collection[i], i, collection);
        }
      }
    }

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    function extend(defaults, options) {
      var extended = {};

      forEach(defaults, function (value, prop) {
        extended[prop] = defaults[prop];
      });

      forEach(options, function (value, prop) {
        extended[prop] = options[prop];
      });

      return extended;
    }

    //////////////////////////////
    // Public APIs
    //////////////////////////////

    /**
     * Destroy the current initialization.
     * @public
     */
    HoverZone.destroy = function () {
      // If plugin isn't already initialized, stop
      if (!settings) return;

      // Remove init class for conditional CSS
      document.documentElement[selector].remove(settings.initClass);

      // @todo Undo any other init functions...

      // Remove event listeners
      document.removeEventListener("click", eventHandler, false);
      document.documentElement[selector].classList.remove(settings.initClass);

      // Reset variables
      settings = null;
    };

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    HoverZone.init = function (options) {
      // Feature test
      if (!supports) return;
      
      // log container
      var log_container = document.getElementById(options.log_container_name);
      log_container = log_container || document.createElement("div");
      log_container.id = "log";
      document.body.appendChild(log_container);

      // Destroy any existing initializations
      this.destroy();

      // Merge user options with defaults
      settings = extend(defaults, options || {});

      this.selector = document.querySelector('.' + options.selector_name);

      this.zone = "";
        
      // @todo Do something...
      HoverZone.log_container = document.getElementById(
        settings.log_container_name
      );

      HoverZone.selectors = document.querySelectorAll('.' + settings.selector);

      for (var i = 0; i < this.selectors.length; i++) {
        var el = this.selectors[i];
        // Do something w/ each matched selector node.
        el.addEventListener("mousemove", this.getPosition);
        // Add class to HTML element to activate conditional CSS
        el.classList.add(settings.initClass);

        HoverZone.logMe(
          "mousemove listener added to #" + el.getAttribute("id")
        );
        // do something
      }
    };

    HoverZone.getPosition = function (e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var rw = parseInt(rect.width);
      var rh = parseInt(rect.height);

      var xpart = parseInt(rw / x);
      var ypart = parseInt(rh / y);

      var xzone = "";
      var yzone = "";

      if (xpart > 2) {
        xzone = "left";
      } else { 
        xzone = "right";
      }
      
      if (ypart > 2) {
        yzone = "top";
      } else {
        yzone = "bottom";
      }
      
      var result = {
        xzone,
        yzone,
        x,
        y,
        rw,
        rh
      };

      HoverZone.logMe(result);

      return result;
    };

    HoverZone.logMe = function (message) {
      var output = '';
      if (message.x) {
        output =
          message.x + ":" + message.y + ":" + message.rw + ":" + message.rh;
      }
      console.log(message);
      var header = document.createElement("div");
      header.style.position = 'absolute';
      header.style.bottom = 0;
      header.style.right = 0;

      header.style.color = 'red';
      header.innerHTML = "Hor:" + message.xzone + " Vert: " + message.yzone;
      
      this.log_container.innerHTML = output + "\n";
      this.log_container.appendChild(header);
    };

    return HoverZone;
  }
);
