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

    var HoverZone = {};

    var supports = !!document.querySelector && !!root.addEventListener; // Feature test

    var settings;

    // Default settings
    var defaults = {
      selector: "hz",
      horizontal: true,
      vertical: false,
      zones: 2,
      initClass: "initialized",
      callbackBefore: function () { },
      callbackAfter: function () { },
    };

    // Private Functions

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

      this.settings = settings;

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
        el.addEventListener("mouseleave", this.mouseleave);
        // Add class to HTML element to activate conditional CSS
        el.classList.add(settings.initClass);

        HoverZone.logMe(
          "mousemove listener added to #" + el.getAttribute("id")
        );
        // do something
      }

      document.getElementById('container').addEventListener("mouseleave", this.mouseLeave);
    };

    HoverZone.mouseLeave = function (e) {
      "x1 x2 x3 x4 x5 y1 y2".split(" ").forEach((c) => {
        var el = document.getElementsByClassName(c)[0];
        if (el) { 
          el.classList.remove(c);
        }
      });
    };
    HoverZone.getPosition = function (e) {
      // parent container
      var rect = e.target.getBoundingClientRect();
      
      var x = parseInt(e.clientX - rect.left);
      var y = parseInt(e.clientY - rect.top);
      
      if (x < 0) x = 1;
      if (y < 0) y = 1;

      var rw = parseInt(rect.width);
      var rh = parseInt(rect.height);

      var xblock = rect.width / HoverZone.settings.hzones;
      var yblock = rect.height / HoverZone.settings.vzones;
      

      var xpart = parseInt(rw / x);
      var ypart = parseInt(rh / y);

      var xzone;
      var yzone;


      
      var compareX = rw;
      
      //console.log("X comparison:");
      for (let i = HoverZone.settings.hzones; i >= 1; i--) {
        if (x <= compareX) {
          
          // console.log((rw / HoverZone.settings.zones) * i);
          xzone = "x" + i;
        } 
        
        //console.log({ x, compareX, xzone, xblock });
        compareX -= xblock;

        

      }

      var compareY = rh;

      //console.log("Y comparison:");
      for (let j = HoverZone.settings.vzones; j >= 1; j--) {
        if (y <= compareY) {
          // console.log((rw / HoverZone.settings.zones) * i);
          yzone = "y" + j;
        }

        //console.log({ y, compareY, yzone, yblock });

        compareY -= yblock;
      }

      
      // console.log({ xblock, yblock, xzone, yzone });
      
      
      var result = {
        xzone,
        yzone,
        x,
        y,
        rw,
        rh
      };

      HoverZone.logMe(result);

      "x1 x2 x3 x4 x5".split(" ").forEach((c) => {
        if (c != xzone) {
          e.srcElement.classList.remove(c);
        } else { 
          if (!e.srcElement.classList.contains(xzone)) {
            e.srcElement.classList.add(xzone);
          }
        }
      });
      "y1 y2".split(" ").forEach((c) => {
        if (c != yzone) {
          e.srcElement.classList.remove(c);
        } else {
          if (!e.srcElement.classList.contains(yzone)) {
            e.srcElement.classList.add(yzone);
          }
        }
      });

      return result;
    };

    HoverZone.logMe = function (message) {
      var output = '';
      if (message.x) {
        output =
          message.x + ":" + message.y + ":" + message.rw + ":" + message.rh;
        output += " " + message.xzone + ":" + message.yzone;
      }
      
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
