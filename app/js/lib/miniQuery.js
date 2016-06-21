/*!
 * minQuery
 */

//Makes forEach available to HTMLCollections and NodeList
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;

var SweetSelector = (function(){
  return {
    select: function(selector){
      if (selector[0] === '#') {
        return [ document.getElementById(selector.slice(1,selector.length)) ];
      } else if (selector[0] === '.') {
        return document.getElementsByClassName(selector.slice(1,selector.length));
      } else {
        return document.getElementsByTagName(selector);
      }
    }
  }
}());

var DOM = (function(){
  return {
    hide: function(selector){
      SweetSelector.select(selector).forEach(function(element) {
        element.style.display = 'none';
      })
    },

    show: function(selector){
      SweetSelector.select(selector).forEach(function(element) {
        element.style.display = 'block';
      })
    },

    addClass: function(selector, className){
      SweetSelector.select(selector).forEach(function(element) {
        element.classList.add(className);
      })
    },

    removeClass: function(selector, className){
      SweetSelector.select(selector).forEach(function(element) {
        element.classList.remove(className);
      })
    }
  }
}());

var EventDispatcher = (function(){
  return {
    on: function(selector, eventName, callback){
      SweetSelector.select(selector).forEach(function(element) {
        element.addEventListener(eventName, callback, false);
      })
    },

    trigger: function(selector, eventName){
      var event = new Event(eventName);
      SweetSelector.select(selector).forEach(function(element) {
        element.dispatchEvent(event);
      })
    }
  }
}());

var AjaxWrapper = (function(){
  return {

    request: function(args){
      var url = args.url;
      var type = args.type;
      var data = args.data;
      var promise = new Promise(function(resolve, reject) {

        var client = new XMLHttpRequest();

        if (type.toUpperCase() === 'GET') {
          client.open(type, url)
          client.send();
        } else if (type.toUpperCase() === 'POST'){
          client.open(type, url)
          client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          client.send(data);
        }

        client.onload = function(){
            if(this.status >= 200 && this.status < 300){
              resolve(this.response);
            } else {
              reject(this.statusText);
            }
        };
        client.onerror = function(){
          reject(this.statusText);
        };
      });
      return promise;
    }
  }
}());


var miniQuery = function(selector){
  var selector = selector;
  return {
    select: function(){
      return SweetSelector.select(selector)
    },

    hide: function(){
      DOM.hide(selector);
    },

    show: function() {
      DOM.show(selector);
    },

    addClass: function(className){
      DOM.addClass(selector, className);
    },

    removeClass: function(className) {
      DOM.removeClass(selector, className);
    },

    on: function(eventName, callback) {
      EventDispatcher.on(selector, eventName, callback)
    },

    trigger: function(eventName) {
      EventDispatcher.trigger(selector, eventName)
    },

    ready: function(callback){
      document.addEventListener("DOMContentLoaded", function(event) {
        callback();
      });
    }
  }
};

miniQuery.ajax = function(args) {
  return AjaxWrapper.request(args);
}

miniQuery.ready = function(callback){
  document.addEventListener("DOMContentLoaded", function(event) {
    callback();
  });
}


var $ = Object.assign({}, miniQuery);
