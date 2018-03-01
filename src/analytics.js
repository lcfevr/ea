
// Polyfill for CustomEvent to support IE 9+
import ea from './config'
(function () {
    if ( typeof window.CustomEvent === "function" ) return false;
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

var EAJS = ea || {};

EAJS.serialize = function(obj) {
    if ('string' == typeof obj) {
        return obj;
    }

    return Object.keys(obj).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&');
};

EAJS.documentReady = function(f) {
    /in/.test(document.readyState) ? setTimeout('EAJS.documentReady(' + f + ')', 9) : f();
};

EAJS.iterateCollection = function(collection) {
    return function(f) {
        for (var i = 0; collection[i]; i++) {
            f(collection[i], i);
        }
    };
};

EAJS.log = function() {
    var log = {};
    log.history = log.history || [];

    log.history.push(arguments);

    if (window.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
};

EAJS.dispatchEvent = function(name, detail) {
    var event = new CustomEvent(name, {detail: detail});
    document.dispatchEvent(event);
};

if (typeof window[window.JackWolfTrackingObject] === 'undefined') {
    console.log('JackWolf tracking is not initiated correctly. Follow the documentation.');
} else {
    EAJS.input = window[window.JackWolfTrackingObject];
    EAJS.inputQueue = EAJS.input.q;

    // Dispatch the queue event when an event is added to the queue
    Object.defineProperty(EAJS.inputQueue, 'push', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function () {
            for (var i = 0, n = this.length, l = arguments.length; i < l; i++, n++) {
                EAJS.dispatchEvent('eventAddedToJackWolfQueue', arguments[i]);
            }
            return n;
        }
    });


    // 获取指定的数据
    EAJS.getInput = function(task) {
        if (typeof EAJS.inputQueue !== 'undefined' && EAJS.inputQueue.length) {
            var data = [];
            for (var i in EAJS.inputQueue) {
                if (EAJS.inputQueue[i][0] === task);
                data.push(EAJS.inputQueue[i]);
            }
            return data;
        } else {
            return false;
        }

        return false;
    }
}

export default EAJS

