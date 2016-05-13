//for practice to create JS librairy
window.jdp = (function () {
    function Jdp(elements) {
        for (var i = 0; i < elements.length; i++) {
            this[i] = elements[i];
        }
        this.length = elements.length;
    };
    Jdp.prototype.map = function (callback) { // do something for each element and return something
        var result = [],
            i = 0;
        for (; i < this.length; i++) {
            result.push(callback.call(this, this[i], i));
        }
        return result;
    };
    Jdp.prototype.forEach = function (callback) { // do something for each element without return something
        this.map(callback);
        return this;
    };
    Jdp.prototype.mapOne = function (callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };
    Jdp.prototype.text = function (text) {
        if (typeof text !== undefined) {
            return this.forEach(function (el) {
                el.innerText = text;
            });
        } else {
            return this.mapOne(function (el) {
                el.innerText;
            });
        }
    };
    Jdp.prototype.html = function (html) {
        if (typeof html !== undefined) {
            return this.forEach(function (el) {
                el.innerHTML = html;
            });
        } else {
            return this.mapOne(function (el) {
                el.innerHTML;
            });
        }
    };
    Jdp.prototype.addClass = function (classes) {
        var className = '';
        if (typeof classes !== 'string') {
            for (var i = 0; i < classes.length; i++) {
                className += ' ' + classes[i];
            }
        } else {
            className = ' ' + classes;
        }
        return this.forEach(function (el) {
            el.className += className;
        });
    };

    Jdp.prototype.removeClass = function (classes) {
        if (typeof classes === 'string') {
            return this.forEach(function (el) {
                var cls = el.className.split(" ");
                for (var i = 0; i < cls.length; i++) {
                    if (cls[i].indexOf(classes) > -1) {
                        cls.splice(i, 1)
                    }
                }
                el.className = cls.join(" ");
            })
        } else {
            return this.forEach(function (el) {
                el.className = '';
            })
        }
    };
    Jdp.prototype.children = function () {
        var children = [];
        this.forEach(function (el) {
            if (el.hasChildNodes()) {
                var ch = jpd.element(el.childNodes)
                children.push(ch);
            }
        })
        return children;
    };
    Jdp.prototype.parent = function () {
        var parent = {};
        this.forEach(function (el) {
           parent = el.parentElement;
        });
        return parent;
    };
    Jdp.prototype.attr = function (name, value) {
        if (typeof name !== 'string') {
            throw "name's attribut must be a string";
            return;
        }
        if (typeof value !== 'string') {
            var attr = '';
            this.forEach(function (el) {
                attr = el.getAttribute(name);
            });
            return attr;
        } else {
            return this.forEach(function (el) {
                el.setAttribute(name, value);
            });
        }
    };
    Jdp.prototype.append = function (els) {
        return this.forEach(function (parEl, i) {
            els.forEach(function (childEl) {
                if (i > 0) {
                    childEl = childEl.cloneNode(true);
                }
                parEl.appendChild(childEl);
            })
        })
    };
    Jdp.prototype.prepend = function (els) {
        return this.forEach(function (parEl, i) {
            for (var j = els.length - 1; j > -1; j--) {
                childEl = (i > 0) ? els[j].cloneNode(true) : els[j];
                parEl.insertBefore(childEl, parEl.firstChild);
            }
        })
    };
    Jdp.prototype.removeNode = function () {
        return this.forEach(function (el) {
            return el.parentNode.removeChild(el);
        })
    };
    Jdp.prototype.on = (function(){
        if(document.addEventListener){
            return function(evt, callback){
                return this.forEach(function(el){
                    el.addEventListener(evt, callback, false);
                })
            }
        } else if( document.attachEvent){
            return function(evt, callback){
                return this.forEach(function(el){
                    el.attachEvent("on"+evt, callback)
                })
            }
        }else{
            return function(evt, callback){
                return this.forEach(function(el){
                    el["on"+evt] = callback;
                })
            }
        }
    }());
    var jpd = {
        element: function (selector) {
            var els;
            if (typeof selector === 'string') {
                els = document.querySelectorAll(selector);
            } else if (selector.length) {
                els = selector;
            } else {
                els = [selector];
            }
            return new Jdp(els);
        },
        create: function (tagName, attrs) {
            var el = new Jdp([document.createElement(tagName)]);
            if (attrs) {
                if (attrs.className) {
                    el.addClass(attrs.className);
                }
                if (attrs.text) {
                    el.text(attrs.text);
                }
                for (var k in attrs) {
                    console.log(k);
                    console.log(attrs[k])
                    if (attrs.hasOwnProperty[k]) {
                        el.attr(k, attrs[k]);
                    }
                }
            }
            return el;
        }

    }
    return jpd;
}());