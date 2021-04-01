/** @license Urpflanze v0.4.0
 * urpflanze.js
 *
 * Github: https://github.com/genbs/urpflanze/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Urpflanze"] = factory();
	else
		root["Urpflanze"] = factory();
})(window, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/Utilites.js":
/*!**************************!*\
  !*** ./dist/Utilites.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseFunction": () => (/* binding */ parseFunction),
/* harmony export */   "cancelablePromise": () => (/* binding */ cancelablePromise),
/* harmony export */   "toArray": () => (/* binding */ toArray),
/* harmony export */   "parseColorAndConvert": () => (/* binding */ parseColorAndConvert),
/* harmony export */   "parseColor": () => (/* binding */ parseColor),
/* harmony export */   "hslToRgb": () => (/* binding */ hslToRgb),
/* harmony export */   "rgbToHsl": () => (/* binding */ rgbToHsl)
/* harmony export */ });
/**
 * @ignore
 */
const parseFunction = {
    suffix: '$fn:',
    parse: (data) => {
        return typeof data === 'function' && data.name !== 'SimpleAnimation' ? parseFunction.suffix + data.toString() : data;
    },
    unparse: (data) => {
        return typeof data === 'string' && data.indexOf(parseFunction.suffix) === 0
            ? eval(data.substr(parseFunction.suffix.length))
            : data;
    },
};
/**
 * Create Cancellable Promise
 *
 * @ignore
 * @template T
 * @param {Promise<T>} promise
 * @returns {ICancelablePromise<T>}
 */
function cancelablePromise(promise) {
    let resolved = false;
    let canceled = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise
            .then(val => {
            resolved = true;
            canceled ? reject('canceled') : resolve(val);
        })
            .catch(error => {
            resolved = true;
            canceled ? reject('canceled') : reject(error);
        });
    });
    return {
        promise: wrappedPromise,
        resolved: () => resolved,
        canceled: () => canceled,
        cancel: () => {
            canceled = true;
        },
    };
}
/**
 * Force value to array
 *
 * @ignore
 * @param {(number | Array<number>)} t
 * @returns {Array<number>}
 */
function toArray(t) {
    return Array.isArray(t) ? t : [t, t];
}
/**
 * Convert color to IConvertedColor
 * Supported format: 'hsla?' 'rgba?' 'hex{3,8}' number (0xFFFFFF[FF])
 *
 * @internal
 * @ignore
 * @param {(string | number)} color
 * @returns {(IConvertedColor | undefined)}
 */
function parseColorAndConvert(color) {
    const parsed = parseColor(color);
    if (parsed) {
        if (parsed.type === 'hsl') {
            const [r, g, b] = hslToRgb(parsed.a, parsed.b, parsed.c);
            return {
                r,
                g,
                b,
                h: parsed.a,
                s: parsed.b,
                l: parsed.c,
                alpha: parsed.alpha,
            };
        }
        else {
            const [h, s, l] = rgbToHsl(parsed.a, parsed.b, parsed.c);
            return {
                h,
                s,
                l,
                r: parsed.a,
                g: parsed.b,
                b: parsed.c,
                alpha: parsed.alpha,
            };
        }
    }
}
/**
 * Convert color to IColor
 * Supported format: 'hsla?' 'rgba?' 'hex{3,8}' number (0xFFFFFF[FF])
 *
 * @internal
 * @ignore
 * @param {(string | number)} color
 * @returns {(IColor | undefined)}
 */
function parseColor(color) {
    if (typeof color === 'number') {
        if (color > 0xffffff) {
            return {
                type: 'rgb',
                a: (color >> 24) & 255,
                b: (color >> 16) & 255,
                c: (color >> 8) & 255,
                alpha: (color & 255) / 255,
            };
        }
        else {
            return { type: 'rgb', a: (color >> 16) & 255, b: (color >> 8) & 255, c: color & 255, alpha: 1 };
        }
    }
    color = color.replace(/\s/g, '');
    let match = /^#([0-9a-f]{3,8})$/i.exec(color);
    if (match) {
        const hex = match[1];
        if (hex.length === 3) {
            return {
                type: 'rgb',
                a: parseInt(hex[0] + hex[0], 16),
                b: parseInt(hex[1] + hex[1], 16),
                c: parseInt(hex[2] + hex[2], 16),
                alpha: 1,
            };
        }
        else {
            return {
                type: 'rgb',
                a: parseInt(hex[0] + hex[1], 16),
                b: parseInt(hex[2] + hex[3], 16),
                c: parseInt(hex[4] + hex[5], 16),
                alpha: hex.length > 6 ? parseInt(hex.substring(6), 16) / 255 : 1,
            };
        }
    }
    match = /^((hsl|rgb)a?)\((\d+),(\d+)%?,(\d+)%?,?(.+)?\)$/i.exec(color);
    if (match) {
        const [, , type, a, b, c, alpha] = match;
        return {
            type: type,
            a: +a,
            b: +b,
            c: +c,
            alpha: alpha ? +alpha : 1,
        };
    }
}
/**
 * Convert hsl color to rgb
 *
 * @internal
 * @ignore
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {[number, number, number]}
 */
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        const hue2rgb = (p, q, t) => {
            t += t < 0 ? 1 : t > 1 ? -1 : 0;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [(0.5 + r * 255) << 0, (0.5 + g * 255) << 0, (0.5 + b * 255) << 0];
}
/**
 * Convert rbg to hsl
 *
 * @internal
 * @ignore
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {[number, number, number]} (0-360, 0-100, 0-100)
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h = h / 6;
    }
    return [(0.5 + h * 360) << 0, (0.5 + s * 100) << 0, (0.5 + l * 100) << 0];
}
//# sourceMappingURL=Utilites.js.map

/***/ }),

/***/ "./dist/meta.js":
/*!**********************!*\
  !*** ./dist/meta.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version),
/* harmony export */   "author": () => (/* binding */ author),
/* harmony export */   "license": () => (/* binding */ license)
/* harmony export */ });
const version = '0.4.0';
const author = 'Gennaro Bosone <gennaro.bs@gmail.com>';
const license = 'GPL-3.0-or-later';

//# sourceMappingURL=meta.js.map

/***/ }),

/***/ "./dist/services/animation/Animation.js":
/*!**********************************************!*\
  !*** ./dist/services/animation/Animation.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Simple__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Simple */ "./dist/services/animation/Simple.js");
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _scene_utilities_SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scene-utilities/SceneUtilitiesExtended */ "./dist/services/scene-utilities/SceneUtilitiesExtended.js");



/**
 * @ignore
 * @internal
 * @category Services.Animation
 */
const Animation = {
    composeAnimation: (scene, prop_name, animation) => {
        switch (animation.type) {
            case 'simple': {
                const simpleAnimation = Object.assign({}, animation.value);
                simpleAnimation.from = _scene_utilities_SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_2__.default.getTransformedValue(scene, prop_name, simpleAnimation.from);
                simpleAnimation.to = _scene_utilities_SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_2__.default.getTransformedValue(scene, prop_name, simpleAnimation.to);
                return _Simple__WEBPACK_IMPORTED_MODULE_0__.default.compose(simpleAnimation);
            }
            case 'raw': {
                const rawValue = animation.value;
                return new Function('Urpflanze', 'scene', `"use strict"; return ${rawValue.raw}`)(_urpflanze_core__WEBPACK_IMPORTED_MODULE_1__, scene);
            }
            // case 'random': {
            //     const randomValue = SetProp.getRandomFunctionForProp(prop_name)
            //     return ({ shape }) => randomValue(shape.rand())
            // }
        }
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Animation);
//# sourceMappingURL=Animation.js.map

/***/ }),

/***/ "./dist/services/animation/Easings.js":
/*!********************************************!*\
  !*** ./dist/services/animation/Easings.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Easing functions
 *
 * @category Services.Animation
 */
const Easings = {
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    linear: (time, start, end, duration) => (end * time) / duration + start,
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duratte duration
     * @returns {number}
     */
    quadraticIn: (time, start, end, duratte) => {
        time /= duratte;
        return end * time * time + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quadraticOut: (time, start, end, duration) => {
        time /= duration;
        return -end * time * (time - 2) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quadraticInOut: (time, start, end, duration) => {
        time /= duration / 2;
        if (time < 1)
            return (end / 2) * time * time + start;
        time--;
        return (-end / 2) * (time * (time - 2) - 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    cubicIn: (time, start, end, duration) => {
        time /= duration;
        return end * time * time * time + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    cubicOut: (time, start, end, duration) => {
        time /= duration;
        time--;
        return end * (time * time * time + 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    cubicInOut: (time, start, end, duration) => {
        time /= duration / 2;
        if (time < 1)
            return (end / 2) * time * time * time + start;
        time -= 2;
        return (end / 2) * (time * time * time + 2) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quarticIn: (time, start, end, duration) => {
        time /= duration;
        return end * time * time * time * time + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quarticOut: (time, start, end, duration) => {
        time /= duration;
        time--;
        return -end * (time * time * time * time - 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quarticInOut: (time, start, end, duration) => {
        time /= duration / 2;
        if (time < 1)
            return (end / 2) * time * time * time * time + start;
        time -= 2;
        return (-end / 2) * (time * time * time * time - 2) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quinticIn: (time, start, end, duration) => {
        time /= duration;
        return end * time * time * time * time * time + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quinticOut: (time, start, end, duration) => {
        time /= duration;
        time--;
        return end * (time * time * time * time * time + 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    quinticInOut: (time, start, end, duration) => {
        time /= duration / 2;
        if (time < 1)
            return (end / 2) * time * time * time * time * time + start;
        time -= 2;
        return (end / 2) * (time * time * time * time * time + 2) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    sinusoidalIn: (time, start, end, duration) => {
        return -end * Math.cos((time / duration) * (Math.PI / 2)) + end + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    sinusoidalOut: (time, start, end, duration) => {
        return end * Math.sin((time / duration) * (Math.PI / 2)) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    sinusoidalInOut: (time, start, end, duration) => {
        return (-end / 2) * (Math.cos((Math.PI * time) / duration) - 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    exponentialIn: (time, start, end, duration) => {
        return end * Math.pow(2, 10 * (time / duration - 1)) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    exponentialOut: (time, start, end, duration) => {
        return end * (-Math.pow(2, (-10 * time) / duration) + 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    exponentialInOut: (time, start, end, duration) => {
        time /= duration / 2;
        if (time < 1)
            return (end / 2) * Math.pow(2, 10 * (time - 1)) + start;
        time--;
        return (end / 2) * (-Math.pow(2, -10 * time) + 2) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    circularIn: (time, start, end, duration) => {
        time /= duration;
        return -end * (Math.sqrt(1 - time * time) - 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    circularOut: (time, start, end, duration) => {
        time /= duration;
        time--;
        return end * Math.sqrt(1 - time * time) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @returns {number}
     */
    circularInOut: (time, start, end, duration) => {
        time /= duration / 2;
        if (time < 1)
            return (-end / 2) * (Math.sqrt(1 - time * time) - 1) + start;
        time -= 2;
        return (end / 2) * (Math.sqrt(1 - time * time) + 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @param {number} a amplitude (optional)
     * @param {number} p period (optional)
     * @return {number}
     */
    elasticIn: function (time, start, end, duration, a, p) {
        if (time == 0) {
            return start;
        }
        if ((time /= duration) == 1) {
            return start + end;
        }
        if (!p) {
            p = duration * 0.3;
        }
        let s = 0;
        if (!a || a < Math.abs(end)) {
            a = end;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(end / a);
        }
        return -(a * Math.pow(2, 10 * (time -= 1)) * Math.sin(((time * duration - s) * (2 * Math.PI)) / p)) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @param {number} a amplitude (optional)
     * @param {number} p period (optional)
     * @return {number}
     */
    elasticOut: function (time, start, end, duration, a, p) {
        if (time == 0) {
            return start;
        }
        if ((time /= duration) == 1) {
            return start + end;
        }
        if (!p) {
            p = duration * 0.3;
        }
        let s = 0;
        if (!a || a < Math.abs(end)) {
            a = end;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(end / a);
        }
        return a * Math.pow(2, -10 * time) * Math.sin(((time * duration - s) * (2 * Math.PI)) / p) + end + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @param {number} a amplitude (optional)
     * @param {number} p period (optional)
     * @return {number}
     */
    elasticInOut: function (time, start, end, duration, a, p) {
        if (time == 0) {
            return start;
        }
        if ((time /= duration / 2) == 2) {
            return start + end;
        }
        if (!p) {
            p = duration * (0.3 * 1.5);
        }
        let s = 0;
        if (!a || a < Math.abs(end)) {
            a = end;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(end / a);
        }
        if (time < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (time -= 1)) * Math.sin(((time * duration - s) * (2 * Math.PI)) / p)) + start;
        }
        return (a * Math.pow(2, -10 * (time -= 1)) * Math.sin(((time * duration - s) * (2 * Math.PI)) / p) * 0.5 + end + start);
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @param {number} s overshoot (optional)
     * @return {number}
     */
    backIn: function (time, start, end, duration, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return end * (time /= duration) * time * ((s + 1) * time - s) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @param {number} s overshoot (optional)
     * @return {number}
     */
    backOut: function (time, start, end, duration, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return end * ((time = time / duration - 1) * time * ((s + 1) * time + s) + 1) + start;
    },
    /**
     * @param {number} time current time
     * @param {number} start start value
     * @param {number} end end value
     * @param {number} duration duration
     * @param {number} s overshoot (optional)
     * @return {number}
     */
    backInOut: function (time, start, end, duration, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((time /= duration / 2) < 1) {
            return (end / 2) * (time * time * (((s *= 1.525) + 1) * time - s)) + start;
        }
        return (end / 2) * ((time -= 2) * time * (((s *= 1.525) + 1) * time + s) + 2) + start;
    },
    /**
     * @param {number} t current time
     * @param {number} b start value
     * @param {number} c end value
     * @param {number} d duration
     * @return {number}
     */
    bounceIn: function (time, start, end, duration) {
        return end - Easings.bounceOut(duration - time, 0, end, duration) + start;
    },
    /**
     * @param {number} t current time
     * @param {number} b start value
     * @param {number} c end value
     * @param {number} d duration
     * @return {number}
     */
    bounceOut: function (time, start, end, duration) {
        if ((time /= duration) < 1 / 2.75) {
            return end * (7.5625 * time * time) + start;
        }
        else if (time < 2 / 2.75) {
            return end * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + start;
        }
        else if (time < 2.5 / 2.75) {
            return end * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + start;
        }
        return end * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + start;
    },
    /**
     *
     *
     * @param {number} time
     * @param {number} start
     * @param {number} end
     * @param {number} duration
     * @returns
     */
    bounceInOut: function (time, start, end, duration) {
        if (time < duration / 2) {
            return Easings.bounceIn(time * 2, 0, end, duration) * 0.5 + start;
        }
        return Easings.bounceOut(time * 2 - duration, 0, end, duration) * 0.5 + end * 0.5 + start;
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Easings);
//# sourceMappingURL=Easings.js.map

/***/ }),

/***/ "./dist/services/animation/Simple.js":
/*!*******************************************!*\
  !*** ./dist/services/animation/Simple.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Easings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Easings */ "./dist/services/animation/Easings.js");
/* harmony import */ var _Utilites__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Utilites */ "./dist/Utilites.js");


/**
 * @category Services.Animation
 */
const Simple = {
    loop: (props) => Simple.compose(Object.assign(Object.assign({ mode: 'sinusoidal', modeFunction: 'cos' }, props), { type: 'loop', delay: undefined })),
    uncontrolledLoop: (props) => Simple.compose(Object.assign(Object.assign({ mode: 'easing', modeFunction: 'linear' }, props), { type: 'uncontrolled-loop' })),
    static: (props) => Simple.compose(Object.assign(Object.assign({ mode: 'easing', modeFunction: 'linear' }, props), { type: 'static' })),
    compose: (simpleAnimation) => {
        if (typeof simpleAnimation.from !== 'string' && typeof simpleAnimation.to !== 'string') {
            const bArray = Array.isArray(simpleAnimation.from) || Array.isArray(simpleAnimation.to);
            //@ts-ignore
            const from = bArray ? (0,_Utilites__WEBPACK_IMPORTED_MODULE_1__.toArray)(simpleAnimation.from) : simpleAnimation.from;
            //@ts-ignore
            const to = bArray ? (0,_Utilites__WEBPACK_IMPORTED_MODULE_1__.toArray)(simpleAnimation.to) : simpleAnimation.to;
            const vCallback = bArray
                ? (current_index, v) => {
                    const a = (simpleAnimation.invertOdd && current_index % 2 == 1 ? to : from);
                    const b = (simpleAnimation.invertOdd && current_index % 2 == 1 ? from : to);
                    return simpleAnimation.typeValue === 'int'
                        ? [Math.round(a[0] + v * (b[0] - a[0])), Math.round(a[1] + v * (b[1] - a[1]))]
                        : [a[0] + v * (b[0] - a[0]), a[1] + v * (b[1] - a[1])];
                }
                : (current_index, v) => {
                    const a = (simpleAnimation.invertOdd && current_index % 2 == 1 ? to : from);
                    const b = (simpleAnimation.invertOdd && current_index % 2 == 1 ? from : to);
                    return simpleAnimation.typeValue === 'int' ? Math.round(a + v * (b - a)) : a + v * (b - a);
                };
            return createSimpleAnimationCallback(simpleAnimation, (props, v) => vCallback(props.repetition.index, v));
        }
        else {
            const from = (0,_Utilites__WEBPACK_IMPORTED_MODULE_1__.parseColorAndConvert)(simpleAnimation.from);
            const to = (0,_Utilites__WEBPACK_IMPORTED_MODULE_1__.parseColorAndConvert)(simpleAnimation.to);
            const vCallback = simpleAnimation.colorTransitionMode == 'hue' ? interpolateColorHSL : interpolateColorRGB;
            if (typeof from !== 'undefined' && typeof to !== 'undefined') {
                return createSimpleAnimationCallback(simpleAnimation, (props, v) => {
                    const a = simpleAnimation.invertOdd && props.repetition.index % 2 == 1 ? to : from;
                    const b = simpleAnimation.invertOdd && props.repetition.index % 2 == 1 ? from : to;
                    return vCallback(a, b, v);
                });
            }
            return () => 0;
        }
    },
};
function createSimpleAnimationCallback(animation, value) {
    const { duration, type, mode, modeFunction, delay } = animation;
    if (type === 'static') {
        if (delay && delay > 0)
            return function SimpleAnimation(props) {
                var _a, _b, _c;
                return value(props, (((_a = props.shape.scene) === null || _a === void 0 ? void 0 : _a.currentTime) || 0) <= delay
                    ? 0
                    : (((_b = props.shape.scene) === null || _b === void 0 ? void 0 : _b.currentTime) || 0) - delay >= duration
                        ? 1
                        : _Easings__WEBPACK_IMPORTED_MODULE_0__.default[modeFunction]((((_c = props.shape.scene) === null || _c === void 0 ? void 0 : _c.currentTime) || 0) - delay, 0, 1, duration));
            };
        else
            return function SimpleAnimation(props) {
                var _a, _b;
                return value(props, (((_a = props.shape.scene) === null || _a === void 0 ? void 0 : _a.currentTime) || 0) <= duration
                    ? _Easings__WEBPACK_IMPORTED_MODULE_0__.default[modeFunction](((_b = props.shape.scene) === null || _b === void 0 ? void 0 : _b.currentTime) || 0, 0, 1 - 0, duration)
                    : 1);
            };
    }
    else {
        if (type === 'loop') {
            if (mode == 'sinusoidal') {
                return function SimpleAnimation(props) {
                    var _a;
                    const frequency = ((((_a = props.shape.scene) === null || _a === void 0 ? void 0 : _a.currentTime) || 0 || 0) * 2 * Math.PI) / duration;
                    return value(props, 0.5 + Math[modeFunction](frequency) * 0.5);
                };
            } /* easing */
            else {
                return function SimpleAnimation(props) {
                    var _a;
                    const d2 = duration / 2;
                    const t = (((_a = props.shape.scene) === null || _a === void 0 ? void 0 : _a.currentTime) || 0) % duration;
                    return value(props, t <= d2
                        ? _Easings__WEBPACK_IMPORTED_MODULE_0__.default[modeFunction](t, 0, 1, d2)
                        : _Easings__WEBPACK_IMPORTED_MODULE_0__.default[modeFunction](d2 - (t - d2), 0, 1, d2));
                };
            }
        } // uncontrolled-loop
        else {
            if (mode == 'sinusoidal') {
                return function SimpleAnimation(props) {
                    var _a;
                    let time = (((_a = props.shape.scene) === null || _a === void 0 ? void 0 : _a.currentTime) || 0) % (duration + delay);
                    time = time <= delay ? 0 : time - delay;
                    const frequency = ((time || 0) * 2 * Math.PI) / duration;
                    return value(props, 0.5 + Math[modeFunction](frequency) * 0.5);
                };
            }
            else {
                if (delay && delay > 0)
                    return function SimpleAnimation(props) {
                        var _a;
                        const time = (((_a = props.shape.scene) === null || _a === void 0 ? void 0 : _a.currentTime) || 0) % (duration + delay);
                        return value(props, time <= delay
                            ? 0
                            : time - delay >= duration
                                ? 1
                                : _Easings__WEBPACK_IMPORTED_MODULE_0__.default[modeFunction](time - delay, 0, 1, duration));
                    };
                else
                    return function SimpleAnimation(props) {
                        var _a;
                        const time = (((_a = props.shape.scene) === null || _a === void 0 ? void 0 : _a.currentTime) || 0) % duration;
                        return value(props, time <= duration ? _Easings__WEBPACK_IMPORTED_MODULE_0__.default[modeFunction](time, 0, 1 - 0, duration) : 1);
                    };
            }
        }
    }
}
function interpolateColorRGB(start, end, v) {
    const r = start.r + v * (end.r - start.r);
    const g = start.g + v * (end.g - start.g);
    const b = start.b + v * (end.b - start.b);
    const alpha = start.alpha + v * (end.alpha - start.alpha);
    return `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${alpha})`;
}
function interpolateColorHSL(start, end, v) {
    const h = start.h + v * (end.h - start.h);
    const s = start.s + v * (end.s - start.s);
    const l = start.l + v * (end.l - start.l);
    const alpha = start.alpha + v * (end.alpha - start.alpha);
    return `hsla(${h},${s}%,${l}%,${alpha})`;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Simple);
//# sourceMappingURL=Simple.js.map

/***/ }),

/***/ "./dist/services/drawers/Drawer.js":
/*!*****************************************!*\
  !*** ./dist/services/drawers/Drawer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _timeline_Timeline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../timeline/Timeline */ "./dist/services/timeline/Timeline.js");
/* harmony import */ var _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scene-utilities/SceneUtilities */ "./dist/services/scene-utilities/SceneUtilities.js");
/* harmony import */ var _events_Emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../events/Emitter */ "./dist/services/events/Emitter.js");
/* harmony import */ var _Utilites__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Utilites */ "./dist/Utilites.js");





/**
 * Abstract Drawer
 *
 * @category Services.Drawer
 * @abstract
 * @class Drawer
 * @extends {Emitter<IDrawerEvents>}
 * @template IADrawerOptions
 * @template IDrawerEvents
 */
class Drawer extends _events_Emitter__WEBPACK_IMPORTED_MODULE_3__.default {
    constructor(scene = undefined, ratio = undefined, duration, framerate) {
        super();
        this.timeline = new _timeline_Timeline__WEBPACK_IMPORTED_MODULE_1__.default(duration, framerate);
        this.ratio = ratio || (scene && scene.width && scene.height ? scene.width / scene.height : 1);
        if (scene) {
            const size = Math.max(scene.width, scene.height);
            const width = this.ratio >= 1 ? size : size * this.ratio;
            const height = this.ratio >= 1 ? size / this.ratio : size;
            scene.resize(width, height);
            this.setScene(scene);
        }
        this.draw_id = null;
        this.redraw_id = null;
        this.animation_id = null;
        this.draw = this.draw.bind(this);
        this.animate = this.animate.bind(this);
        this.startAnimation = this.startAnimation.bind(this);
    }
    /**
     * Set scene
     *
     * @param {Scene} scene
     */
    setScene(scene) {
        this.scene = scene;
        // if (!this.resolution && this.scene.width) this.resolution = this.scene.width
    }
    /**
     * Return scene
     *
     * @return {*}  {Scene}
     */
    getScene() {
        return this.scene;
    }
    /**
     * Return timeline
     *
     * @return {*}  {Timeline}
     */
    getTimeline() {
        return this.timeline;
    }
    /**
     * Resize scene and canvas
     *
     * @param {number} width
     * @param {number} height
     * @param {number} [ratio]
     */
    resize(width, height, ratio) {
        ratio = ratio || this.ratio || width / height;
        const size = Math.max(width, height);
        width = ratio >= 1 ? size : size * ratio;
        height = ratio >= 1 ? size / ratio : size;
        this.ratio = ratio;
        if (this.scene) {
            this.scene.resize(width, height);
            _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Scene.walk((sceneChild) => {
                if (sceneChild.data) {
                    if (sceneChild.data.props) {
                        const props = sceneChild.data.props;
                        Object.keys(props).forEach(name => {
                            _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_2__.default.setProp(sceneChild, name, props[name], this.scene);
                        });
                    }
                    if (sceneChild.data.drawer) {
                        const drawer = sceneChild.data.drawer;
                        Object.keys(drawer).forEach(name => {
                            _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_2__.default.setDrawerProp(sceneChild, name, drawer[name], this.scene);
                        });
                    }
                }
            }, this.scene);
        }
    }
    /**
     * Resize by ratio
     *
     */
    setRatio(ratio) {
        if (this.scene) {
            this.resize(this.scene.width, this.scene.height, ratio);
        }
    }
    /**
     * Return drawer ratio
     */
    getRatio() {
        return this.ratio;
    }
    /**
     * Set draw option
     *
     * @template K
     * @param {(K | IADrawerOptions)} name
     */
    setOption(name, value) {
        if (typeof name == 'object') {
            const keys = Object.keys(name);
            for (let i = 0, len = keys.length; i < len; i++) {
                this.drawerOptions[keys[i]] = name[keys[i]];
            }
        }
        else {
            this.drawerOptions[name] = value;
        }
    }
    /**
     * Return option valie or default
     *
     * @template K
     * @param {K} name
     * @param {IADrawerOptions[K]} defaultValue
     */
    getOption(name, defaultValue) {
        var _a;
        return (_a = this.drawerOptions[name]) !== null && _a !== void 0 ? _a : defaultValue;
    }
    /**
     * Return all options
     */
    getOptions() {
        return this.drawerOptions;
    }
    /**
     * Internal tick animation
     */
    animate(timestamp) {
        if (this.timeline.bSequenceStarted()) {
            this.animation_id = requestAnimationFrame(this.animate);
            if (this.timeline.tick(timestamp))
                this.draw();
        }
    }
    /**
     * Start animation drawing
     */
    startAnimation() {
        this.stopAnimation();
        this.timeline.start();
        this.animation_id = requestAnimationFrame(this.animate);
    }
    /**
     * Stop animation drawing
     */
    stopAnimation() {
        this.timeline.stop();
        if (this.animation_id)
            cancelAnimationFrame(this.animation_id);
    }
    /**
     * Pause animation drawing
     */
    pauseAnimation() {
        this.timeline.pause();
        if (this.animation_id)
            cancelAnimationFrame(this.animation_id);
    }
    /**
     * Play animation drawing
     */
    playAnimation() {
        this.timeline.start();
        requestAnimationFrame(this.animate);
    }
    /**
     * Redraw
     *
     * @returns {void}
     * @memberof DrawerCanvas
     */
    redraw() {
        if (!this.timeline.bSequenceStarted()) {
            this.draw_id && cancelAnimationFrame(this.draw_id);
            if (typeof this.drawerOptions.ghosts === undefined || this.drawerOptions.ghosts === 0)
                this.timeline.stop();
            this.draw_id = requestAnimationFrame(this.draw);
        }
        else if (typeof this.drawerOptions.ghosts === undefined || this.drawerOptions.ghosts === 0) {
            this.stopAnimation();
            this.redraw_id && cancelAnimationFrame(this.redraw_id);
            this.redraw_id = requestAnimationFrame(this.startAnimation);
        }
    }
    /**
     * Return a style value
     *
     * @static
     * @template T
     * @param {ShapePrimitive<T>} shape
     * @param {keyof T} key
     * @param {IDrawerPropArguments} propArguments
     * @param {*} [defaultValue]
     * @returns {*}
     */
    static getStreamDrawerProp(shape, key, propArguments, defaultValue) {
        let attribute = shape.drawer[key];
        if (typeof attribute === 'function') {
            attribute = attribute(propArguments);
        }
        return attribute !== null && attribute !== void 0 ? attribute : defaultValue;
    }
    /**
     * Each ghosts index and create drawerOptions to pass at the draw method
     *
     * @static
     * @template T
     * @param {T} drawerOptions
     * @param {Timeline} timeline
     * @param {((ghostDrawerOptions: T & { ghostIndex?: number }) => any)} ghostCallback
     */
    static eachGhosts(drawerOptions, timeline, ghostCallback) {
        if (drawerOptions.ghosts) {
            const ghostDrawerOptions = Object.assign({}, drawerOptions);
            const drawAtTime = timeline.getTime();
            const sequenceDuration = timeline.getDuration();
            const ghostRepetition = {
                offset: 0,
                index: 0,
                count: drawerOptions.ghosts,
            };
            for (let i = 1; i <= drawerOptions.ghosts; i++) {
                ghostRepetition.index = i;
                ghostRepetition.offset = ghostRepetition.index / ghostRepetition.count;
                const ghostTime = drawAtTime -
                    (drawerOptions.ghostSkipFunction
                        ? drawerOptions.ghostSkipFunction(ghostRepetition, drawAtTime)
                        : i * drawerOptions.ghostSkipTime);
                ghostDrawerOptions.ghostIndex = i;
                ghostDrawerOptions.time = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.pmod)(ghostTime, sequenceDuration);
                ghostCallback(ghostDrawerOptions);
            }
        }
    }
    /**
     * Create color based on ghostMultiplier
     *
     * @static
     * @param {any} color
     * @param {number} ghostMultiplier
     * @return {*}  {(string | undefined)}
     */
    static ghostifyColor(color, ghostMultiplier) {
        if (typeof color === 'string' || typeof color === 'number') {
            const parsed = (0,_Utilites__WEBPACK_IMPORTED_MODULE_4__.parseColor)(color);
            if (parsed) {
                const ghostAlpha = parsed.alpha * ghostMultiplier;
                return parsed.type === 'rgb'
                    ? `rgba(${parsed.a},${parsed.b},${parsed.c},${ghostAlpha})`
                    : `hsla(${parsed.a},${parsed.b}%,${parsed.c}%,${ghostAlpha})`;
            }
        }
        return color;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Drawer);
//# sourceMappingURL=Drawer.js.map

/***/ }),

/***/ "./dist/services/drawers/drawer-canvas/DrawerCanvas.js":
/*!*************************************************************!*\
  !*** ./dist/services/drawers/drawer-canvas/DrawerCanvas.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _Drawer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Drawer */ "./dist/services/drawers/Drawer.js");
/* harmony import */ var _FrameBuffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FrameBuffer */ "./dist/services/drawers/drawer-canvas/FrameBuffer.js");



/**
 *
 * @category Services.Drawer
 * @extends {Emitter<DrawerCanvasEvents>}
 */
class DrawerCanvas extends _Drawer__WEBPACK_IMPORTED_MODULE_1__.default {
    constructor(scene, canvasOrContainer, drawerOptions, ratio = undefined, duration, framerate, bBuffering = false) {
        var _a, _b, _c, _d, _e;
        super(scene, ratio, duration, framerate);
        this.bBuffering = false;
        this.drawerOptions = {};
        this.drawerOptions.clear = (_a = drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.clear) !== null && _a !== void 0 ? _a : true;
        this.drawerOptions.time = (_b = drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.time) !== null && _b !== void 0 ? _b : 0;
        this.drawerOptions.simmetricLines = (_c = drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.simmetricLines) !== null && _c !== void 0 ? _c : 0;
        this.drawerOptions.noBackground = (_d = drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.noBackground) !== null && _d !== void 0 ? _d : false;
        this.drawerOptions.ghosts = (drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.ghosts) || 0;
        this.drawerOptions.ghostAlpha = (drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.ghostAlpha) === false ? false : true;
        this.drawerOptions.ghostSkipTime = (_e = drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.ghostSkipTime) !== null && _e !== void 0 ? _e : 30;
        this.drawerOptions.ghostSkipFunction = drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.ghostSkipFunction;
        this.drawerOptions.backgroundImage = drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.backgroundImage;
        this.drawerOptions.backgroundImageFit = (drawerOptions === null || drawerOptions === void 0 ? void 0 : drawerOptions.backgroundImageFit) || 'cover';
        this.bBuffering = bBuffering;
        this.buffer = new _FrameBuffer__WEBPACK_IMPORTED_MODULE_2__.default();
        if ((typeof HTMLCanvasElement !== 'undefined' && canvasOrContainer instanceof HTMLCanvasElement) ||
            (typeof OffscreenCanvas !== 'undefined' && canvasOrContainer instanceof OffscreenCanvas)) {
            const canvas = canvasOrContainer;
            this.setCanvas(canvas);
        }
        else if (canvasOrContainer) {
            const canvas = document.createElement('canvas');
            const container = canvasOrContainer;
            container.appendChild(canvas);
            this.setCanvas(canvas);
        }
    }
    setBuffering(bBuffering) {
        this.bBuffering = bBuffering;
        this.flushBuffer();
    }
    getBBuffering() {
        return this.bBuffering;
    }
    /**
     * Set scene
     *
     * @param {Scene} scene
     * @memberof CanvasDrawer
     */
    setScene(scene) {
        super.setScene(scene);
        if (this.canvas) {
            this.setCanvas(this.canvas); // and flush
        }
    }
    /**
     * Set the canvas or append to container
     *
     * @param {(HTMLElement | HTMLCanvasElement | OffscreenCanvas)} canvasOrContainer
     * @memberof CanvasDrawer
     */
    setCanvas(canvasOrContainer) {
        let canvas;
        if (typeof HTMLElement !== 'undefined' && canvasOrContainer instanceof HTMLElement) {
            if (typeof HTMLCanvasElement !== 'undefined' && canvasOrContainer instanceof HTMLCanvasElement) {
                canvas = canvasOrContainer;
            }
            else {
                canvas = (this.canvas || document.createElement('canvas'));
                while (canvasOrContainer.lastChild)
                    canvasOrContainer.removeChild(canvasOrContainer.lastChild);
                canvasOrContainer.appendChild(canvas);
            }
        }
        else {
            canvas = canvasOrContainer;
        }
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d', {
            alpha: true,
            desynchronized: this.bBuffering !== true,
        });
        if (this.scene) {
            this.resize(this.scene.width, this.scene.height); // and flush
        }
    }
    /**
     * Return canvas element
     *
     * @returns {(HTMLCanvasElement | OffscreenCanvas)}
     * @memberof DrawerCanvas
     */
    getCanvas() {
        return this.canvas;
    }
    /**
     * Return canvas context
     *
     * @returns {(CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null)}
     * @memberof DrawerCanvas
     */
    getContext() {
        return this.context;
    }
    /**
     * Resize scene and canvas
     *
     * @param {number} width
     * @param {number} height
     * @param {number} [ratio]
     * @memberof DrawerCanvas
     */
    resize(width, height, ratio) {
        super.resize(width, height, ratio);
        if (this.canvas && this.scene) {
            this.canvas.width = this.scene.width;
            this.canvas.height = this.scene.height;
            if (typeof HTMLCanvasElement !== 'undefined' && this.canvas instanceof HTMLCanvasElement) {
                this.canvas.style.width = this.scene.width + 'px';
                this.canvas.style.height = this.scene.height + 'px';
            }
        }
        this.flushBuffer();
        this.dispatch('drawer-canvas:resize');
        this.redraw();
    }
    flushBuffer() {
        if (this.bBuffering) {
            this.buffer.flush();
            this.dispatch('drawer-canvas:buffer_flush');
        }
    }
    getStoredFrames() {
        if (this.bBuffering) {
            return this.buffer.getStoredFrames();
        }
        return [];
    }
    /**
     * Set draw option
     *
     * @template K
     * @param {(K | IDrawerOptions)} name
     * @param {Required<IDrawerOptions>[K]} [value]
     * @memberof CanvasDrawer
     */
    setOption(name, value) {
        super.setOption(name, value);
        this.flushBuffer();
    }
    // public preload(): Promise<boolean> {
    // 	if (this.bBuffering && this.scene) {
    // 		return new Promise<boolean>((resolve, reject) => {
    // 			this.flushBuffer()
    // 			const sequence = this.timeline.getSequence()
    // 			let canvas: HTMLCanvasElement | OffscreenCanvas
    // 			if (typeof OffscreenCanvas !== 'undefined') canvas = new OffscreenCanvas(this.scene.width, this.scene.height)
    // 			else {
    // 				canvas = document.createElement('canvas')
    // 				canvas.width = this.scene.width
    // 				canvas.height = this.scene.height
    // 			}
    // 			const context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = canvas.getContext('2d', {
    // 				alpha: true,
    // 				desynchronized: false,
    // 			})
    // 			if (!context) reject('Create context error')
    // 			const drawerOptions = { ...this.drawerOptions }
    // 			const sequenceEndTime = this.timeline.getSequenceEndTime()
    // 			for (let i = 0; i < sequence.frames; i++) {
    // 				// requestAnimationFrame(() => {
    // 				const time = this.timeline.getFrameTime(i)
    // 				drawerOptions.clear = this.drawerOptions.clear || i === 0
    // 				drawerOptions.time = time
    // 				DrawerCanvas.draw(this.scene, context, drawerOptions, this.resolution)
    // 				if (drawerOptions.ghosts) {
    // 					for (let gi = 1; gi <= drawerOptions.ghosts; gi++) {
    // 						const ghostTime =
    // 							time -
    // 							(drawerOptions.ghostSkipFunction
    // 								? drawerOptions.ghostSkipFunction(gi)
    // 								: gi * (drawerOptions.ghostSkipTime ?? 30))
    // 						drawerOptions.clear = false
    // 						drawerOptions.ghostIndex = gi
    // 						drawerOptions.time =
    // 							ghostTime < 0
    // 								? ghostTime + sequenceEndTime
    // 								: ghostTime > sequenceEndTime
    // 								? ghostTime % sequenceEndTime
    // 								: ghostTime
    // 						DrawerCanvas.draw(this.scene, context, drawerOptions, this.resolution)
    // 					}
    // 				}
    // 				this.buffer.push(i, context as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D)
    // 				// })
    // 			}
    // 			resolve(true)
    // 		})
    // 	} else {
    // 		return Promise.reject()
    // 	}
    // }
    /**
     * Draw current scene
     *
     * @returns {number}
     * @memberof DrawerCanvas
     */
    draw() {
        var _a;
        if (typeof this.scene === 'undefined')
            return -1;
        let draw_time = 0;
        const timeline = this.timeline;
        const drawAtTime = timeline.getTime();
        const drawerOptions = Object.assign(Object.assign({}, this.drawerOptions), { ghostIndex: undefined, clear: this.drawerOptions.clear || timeline.getCurrentFrame() <= 1, time: drawAtTime });
        const currentFrame = timeline.getFrameAtTime(drawAtTime);
        this.dispatch('drawer-canvas:before_draw', {
            currentFrame: currentFrame,
            currentTime: drawAtTime,
        });
        if (this.bBuffering && this.buffer.exist(currentFrame)) {
            (_a = this.context) === null || _a === void 0 ? void 0 : _a.putImageData(this.buffer.get(currentFrame), 0, 0);
        }
        else {
            if (drawerOptions.ghosts) {
                _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.eachGhosts(drawerOptions, timeline, ghostDrawerOptions => {
                    ghostDrawerOptions.clear = drawerOptions.clear && ghostDrawerOptions.ghostIndex === 1;
                    draw_time += this.applyDraw(ghostDrawerOptions);
                });
                drawerOptions.clear = false;
            }
            draw_time += this.applyDraw(drawerOptions);
            if (this.bBuffering && this.context) {
                this.buffer.push(currentFrame, this.context);
                if (this.buffer.count() >= this.timeline.getFramesCount()) {
                    this.dispatch('drawer-canvas:buffer_loaded');
                }
            }
        }
        return draw_time;
    }
    /**
     * Redraw
     *
     * @returns {void}
     * @memberof DrawerCanvas
     */
    redraw() {
        if (!this.timeline.bSequenceStarted()) {
            this.draw_id && cancelAnimationFrame(this.draw_id);
            !this.drawerOptions.clear &&
                (typeof this.drawerOptions.ghosts === undefined || this.drawerOptions.ghosts === 0) &&
                this.timeline.stop();
            this.draw_id = requestAnimationFrame(this.draw);
        }
        else if (!this.drawerOptions.clear &&
            (typeof this.drawerOptions.ghosts === undefined || this.drawerOptions.ghosts === 0)) {
            this.stopAnimation();
            this.redraw_id && cancelAnimationFrame(this.redraw_id);
            this.redraw_id = requestAnimationFrame(this.startAnimation);
        }
    }
    applyDraw(options) {
        var _a, _b;
        const start_time = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now)();
        const scene = this.scene;
        const context = this.context;
        context.globalCompositeOperation = 'source-over';
        const time = (_a = options.time) !== null && _a !== void 0 ? _a : 0;
        const simmetricLines = (_b = options.simmetricLines) !== null && _b !== void 0 ? _b : 0;
        const clear = options.clear;
        const noBackground = options.noBackground;
        const backgroundImage = options.backgroundImage;
        const bGhost = typeof options.ghosts !== 'undefined' &&
            options.ghosts > 0 &&
            typeof options.ghostIndex !== 'undefined' &&
            options.ghostIndex > 0;
        const ghostMultiplier = bGhost ? 1 - options.ghostIndex / (options.ghosts + 0.5) : 0;
        const ghostAlpha = options.ghostAlpha === true;
        const width = scene.width;
        const height = scene.height;
        const ratio = width / height;
        if (clear) {
            if (noBackground) {
                context.clearRect(0, 0, width, height);
            }
            else {
                context.fillStyle = scene.background;
                context.fillRect(0, 0, width, height);
                if (backgroundImage) {
                    const sourceWidth = backgroundImage instanceof SVGImageElement ? backgroundImage.width.baseVal.value : backgroundImage.width;
                    const sourceHeight = backgroundImage instanceof SVGImageElement ? backgroundImage.height.baseVal.value : backgroundImage.height;
                    const sourceRatio = sourceWidth / sourceHeight;
                    let x = 0, y = 0, bgWidth = width, bgHeight = height;
                    if (sourceRatio !== ratio) {
                        if (options.backgroundImageFit === 'contain') {
                            bgWidth = ratio > sourceRatio ? (sourceWidth * height) / sourceHeight : width;
                            bgHeight = ratio > sourceRatio ? height : (sourceHeight * width) / sourceWidth;
                        }
                        else {
                            bgWidth = ratio < sourceRatio ? (sourceWidth * height) / sourceHeight : width;
                            bgHeight = ratio < sourceRatio ? height : (sourceHeight * width) / sourceWidth;
                        }
                        x = (width - bgWidth) / 2;
                        y = (height - bgHeight) / 2;
                    }
                    context.drawImage(backgroundImage, x, y, bgWidth, bgHeight);
                }
            }
            if (simmetricLines > 0) {
                DrawerCanvas.drawSimmetricLines(context, simmetricLines, width, height, scene.color);
            }
        }
        {
            let logFillColorWarn = false;
            let logStrokeColorWarn = false;
            scene.currentTime = time;
            scene.getChildren().forEach((sceneChild) => {
                if (!sceneChild.data ||
                    (!(sceneChild.data.visible === false) && !(bGhost && sceneChild.data.disableGhost === true))) {
                    sceneChild.generate(time, true);
                    context.save();
                    sceneChild.stream((stream) => {
                        const currentIndex = stream.currentIndexing;
                        const shape = currentIndex.shape;
                        const propArguments = {
                            canvasContext: context,
                            shape,
                            // singleRepetitionBounding: currentIndex.singleRepetitionBounding,
                            repetition: {
                                type: currentIndex.repetition.type,
                                angle: currentIndex.repetition.angle,
                                index: currentIndex.repetition.index,
                                count: currentIndex.repetition.count,
                                offset: currentIndex.repetition.offset,
                                row: {
                                    index: currentIndex.repetition.row.index,
                                    count: currentIndex.repetition.row.count,
                                    offset: currentIndex.repetition.row.offset,
                                },
                                col: {
                                    index: currentIndex.repetition.col.index,
                                    count: currentIndex.repetition.col.count,
                                    offset: currentIndex.repetition.col.offset,
                                },
                            },
                            parent: currentIndex.parent,
                        };
                        const composite = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'composite', propArguments, 'source-over');
                        context.globalCompositeOperation = composite;
                        context.beginPath();
                        context.moveTo(stream.buffer[stream.frameBufferIndex], stream.buffer[stream.frameBufferIndex + 1]);
                        for (let i = 2; i < stream.frameLength; i += 2) {
                            context.lineTo(stream.buffer[stream.frameBufferIndex + i], stream.buffer[stream.frameBufferIndex + i + 1]);
                        }
                        currentIndex.shape.isClosed() && context.closePath();
                        const alpha = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'opacity', propArguments, 1);
                        context.globalAlpha = alpha;
                        const shadowColor = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'shadowColor', propArguments);
                        const shadowBlur = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'shadowBlur', propArguments);
                        const shadowOffsetX = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'shadowOffsetX', propArguments);
                        const shadowOffsetY = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'shadowOffsetY', propArguments);
                        context.shadowColor = shadowColor;
                        context.shadowBlur = shadowBlur;
                        shadowOffsetX && (context.shadowOffsetX = shadowOffsetX);
                        shadowOffsetY && (context.shadowOffsetY = shadowOffsetY);
                        let fill = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'fill', propArguments);
                        if (typeof fill !== 'undefined') {
                            if (bGhost && ghostAlpha) {
                                const color = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.ghostifyColor(fill, ghostMultiplier);
                                if (color) {
                                    fill = color;
                                }
                                else if (!logFillColorWarn) {
                                    console.warn(`[Urpflanze:DrawerCanvas] Unable ghost fill color '${fill}',
									please enter a rgba or hsla color`);
                                    logFillColorWarn = true;
                                }
                            }
                            context.fillStyle = fill;
                            context.fill();
                        }
                        let stroke = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'stroke', propArguments, typeof fill === 'undefined' ? scene.color : undefined);
                        let lineWidth = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'lineWidth', propArguments, 1);
                        if (stroke) {
                            if (bGhost && ghostAlpha) {
                                const color = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.ghostifyColor(stroke, ghostMultiplier);
                                if (color) {
                                    stroke = color;
                                }
                                else if (!logStrokeColorWarn) {
                                    console.warn(`[Urpflanze:DrawerCanvas] Unable ghost stroke color '${stroke}',
									please enter a rgba or hsla color`);
                                    logStrokeColorWarn = true;
                                }
                                lineWidth *= ghostMultiplier;
                            }
                            const lineJoin = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'lineJoin', propArguments);
                            const lineCap = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'lineCap', propArguments);
                            const lineDash = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'lineDash', propArguments);
                            const lineDashOffset = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'lineDashOffset', propArguments);
                            const miterLimit = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'miterLimit', propArguments);
                            context.setLineDash.call(context, lineDash || []);
                            context.lineJoin = lineJoin;
                            context.lineCap = lineCap;
                            context.lineDashOffset = lineDashOffset;
                            context.miterLimit = miterLimit;
                            context.lineWidth = lineWidth;
                            context.strokeStyle = stroke;
                            context.stroke();
                        }
                    });
                    context.restore();
                }
            });
        }
        const end_time = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now)();
        return end_time - start_time;
    }
    static drawSimmetricLines(context, simmetricLines, width, height, color) {
        const offset = Math.PI / simmetricLines;
        const size = Math.max(width, height);
        const center = [size / 2, size / 2];
        for (let i = 0; i < simmetricLines; i++) {
            const a = [-size, -size];
            const b = [size * 2, size * 2];
            const rotate = i * offset + Math.PI / 4;
            _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Vec2.rotateZ(a, center, rotate);
            _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Vec2.rotateZ(b, center, rotate);
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 1;
            context.moveTo(a[0], a[1]);
            context.lineTo(b[0], b[1]);
            context.stroke();
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawerCanvas);
//# sourceMappingURL=DrawerCanvas.js.map

/***/ }),

/***/ "./dist/services/drawers/drawer-canvas/FrameBuffer.js":
/*!************************************************************!*\
  !*** ./dist/services/drawers/drawer-canvas/FrameBuffer.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 *
 * @category Services.Drawer
 * @class FrameBuffer
 */
class FrameBuffer {
    constructor() {
        this.frames = {};
    }
    exist(frameNumber) {
        return typeof this.frames[frameNumber] !== 'undefined';
    }
    get(frameNumber) {
        return this.exist(frameNumber) ? this.frames[frameNumber] : null;
    }
    count() {
        return Object.keys(this.frames).length;
    }
    push(frameNumber, context) {
        this.frames[frameNumber] = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    }
    flush() {
        this.frames = {};
    }
    getStoredFrames() {
        return Object.keys(this.frames).map(e => +e);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FrameBuffer);
//# sourceMappingURL=FrameBuffer.js.map

/***/ }),

/***/ "./dist/services/drawers/drawer-svg/DrawerSVG.js":
/*!*******************************************************!*\
  !*** ./dist/services/drawers/drawer-svg/DrawerSVG.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _Drawer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Drawer */ "./dist/services/drawers/Drawer.js");
/* harmony import */ var _Utilites__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../Utilites */ "./dist/Utilites.js");



/**
 * Abstract drawer
 *
 * @category Services.Drawer
 * @class DrawerSVG
 * @extends {Drawer<IDrawerSVGOptions, IDrawerSVGEvents>}
 */
class DrawerSVG extends _Drawer__WEBPACK_IMPORTED_MODULE_1__.default {
    // private svgElement: SVGElement
    constructor(scene, container, drawerOptions = {}, ratio = undefined, 
    // resolution = 0,
    duration, framerate) {
        var _a, _b, _c;
        super(scene, ratio, duration, framerate);
        this.container = container;
        this.drawerOptions = {
            time: (_a = drawerOptions.time) !== null && _a !== void 0 ? _a : 0,
            decimals: drawerOptions.decimals || 2,
            noBackground: (_b = drawerOptions.noBackground) !== null && _b !== void 0 ? _b : false,
            ghosts: drawerOptions.ghosts || 0,
            ghostAlpha: drawerOptions.ghostAlpha === false ? false : true,
            ghostSkipTime: (_c = drawerOptions.ghostSkipTime) !== null && _c !== void 0 ? _c : 30,
            ghostSkipFunction: drawerOptions.ghostSkipFunction,
        };
    }
    /**
     * Draw current scene
     *
     * @returns {number}
     * @memberof DrawerCanvas
     */
    draw() {
        if (typeof this.scene === 'undefined')
            return -1;
        let drawTime = 0;
        const timeline = this.timeline;
        const drawAtTime = timeline.getTime();
        const drawerOptions = Object.assign(Object.assign({}, this.drawerOptions), { ghostIndex: undefined, time: drawAtTime });
        const currentFrame = timeline.getFrameAtTime(drawAtTime);
        this.dispatch('drawer-svg:before_draw', {
            currentFrame: currentFrame,
            currentTime: drawAtTime,
        });
        const paths = [];
        if (drawerOptions.ghosts) {
            _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.eachGhosts(drawerOptions, timeline, ghostDrawerOptions => {
                drawTime += DrawerSVG.draw(this.scene, paths, ghostDrawerOptions);
            });
        }
        drawTime += DrawerSVG.draw(this.scene, paths, drawerOptions);
        this.appendSVGFromPaths(paths, drawerOptions);
        return drawTime;
    }
    appendSVGFromPaths(paths, drawerOptions) {
        if (this.scene && this.container) {
            while (this.container.lastChild)
                this.container.removeChild(this.container.lastChild);
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', this.scene.width + '');
            svg.setAttribute('height', this.scene.height + '');
            svg.setAttribute('viewBox', `0 0 ${this.scene.width} ${this.scene.height}`);
            const comm = document.createComment('Created with Urpflanze.js');
            svg.appendChild(comm);
            if (!drawerOptions.noBackground) {
                const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                background.setAttribute('width', this.scene.width + '');
                background.setAttribute('height', this.scene.height + '');
                DrawerSVG.setColor(background, 'fill', this.scene.background);
                svg.appendChild(background);
            }
            paths.forEach(path => svg.appendChild(path));
            this.container.appendChild(svg);
        }
    }
    static setColor(element, type, color) {
        if (color === 'none') {
            element.setAttribute(type, 'none');
        }
        else {
            const parsed = (0,_Utilites__WEBPACK_IMPORTED_MODULE_2__.parseColorAndConvert)(color);
            if (parsed) {
                element.setAttribute(type, `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
                if (parsed.alpha !== 1) {
                    const style = element.getAttribute('style') || '';
                    element.setAttribute('style', style + ` ${type}-opacity: ${parsed.alpha};`);
                }
            }
        }
    }
    static draw(scene, paths, options) {
        var _a;
        const start_time = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now)();
        const time = (_a = options.time) !== null && _a !== void 0 ? _a : 0;
        const decimals = options.decimals;
        const bGhost = typeof options.ghosts !== 'undefined' &&
            options.ghosts > 0 &&
            typeof options.ghostIndex !== 'undefined' &&
            options.ghostIndex > 0;
        const ghostMultiplier = bGhost ? 1 - options.ghostIndex / (options.ghosts + 0.5) : 0;
        const ghostAlpha = options.ghostAlpha === true;
        let logFillColorWarn = false;
        let logStrokeColorWarn = false;
        scene.currentTime = time;
        scene.getChildren().forEach((sceneChild) => {
            if (!sceneChild.data ||
                !(sceneChild.data.visible === false) ||
                !(bGhost && sceneChild.data.disableGhost === true)) {
                sceneChild.generate(time, true);
                sceneChild.stream((stream) => {
                    const tempPath = [];
                    const currentIndex = stream.currentIndexing;
                    const shape = currentIndex.shape;
                    const propArguments = {
                        shape,
                        // singleRepetitionBounding: currentIndex.singleRepetitionBounding,
                        repetition: currentIndex.repetition,
                        parent: currentIndex.parent,
                    };
                    for (let i = 0; i < stream.frameLength; i += 2) {
                        tempPath.push(stream.buffer[stream.frameBufferIndex + i].toFixed(decimals) +
                            ' ' +
                            stream.buffer[stream.frameBufferIndex + i + 1].toFixed(decimals));
                    }
                    let fill = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'fill', propArguments);
                    if (fill) {
                        if (bGhost && ghostAlpha) {
                            const color = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.ghostifyColor(fill, ghostMultiplier);
                            if (color) {
                                fill = color;
                            }
                            else if (!logFillColorWarn) {
                                console.warn(`[Urpflanze:DrawerCanvas] Unable ghost fill color '${fill}',
				            please enter a rgba or hsla color`);
                                logFillColorWarn = true;
                            }
                        }
                    }
                    let stroke = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'stroke', propArguments, typeof fill === 'undefined' ? scene.color : undefined);
                    let lineWidth = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.getStreamDrawerProp(shape, 'lineWidth', propArguments, 1);
                    if (stroke) {
                        if (bGhost && ghostAlpha) {
                            const color = _Drawer__WEBPACK_IMPORTED_MODULE_1__.default.ghostifyColor(stroke, ghostMultiplier);
                            if (color) {
                                stroke = color;
                            }
                            else if (!logStrokeColorWarn) {
                                console.warn(`[Urpflanze:DrawerCanvas] Unable ghost stroke color '${stroke}',
				            please enter a rgba or hsla color`);
                                logStrokeColorWarn = true;
                            }
                            lineWidth *= ghostMultiplier;
                        }
                    }
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', `M${tempPath.join(' L')} ${shape.isClosed() ? 'Z' : ''}`);
                    DrawerSVG.setColor(path, 'fill', fill || 'none');
                    if (stroke) {
                        DrawerSVG.setColor(path, 'stroke', stroke);
                        path.setAttribute('stroke-width', (lineWidth || 1) + '');
                    }
                    paths.push(path);
                });
            }
        });
        const end_time = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now)();
        return end_time - start_time;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawerSVG);
//# sourceMappingURL=DrawerSVG.js.map

/***/ }),

/***/ "./dist/services/events/Emitter.js":
/*!*****************************************!*\
  !*** ./dist/services/events/Emitter.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Class used for emit and dispatch events
 *
 * @category Services.Emitter
 * @abstract
 * @class Emitter
 * @template EventTypes
 */
class Emitter {
    constructor() {
        this.callbacks = {};
    }
    /**
     * Attach callback at event
     *
     * @param {keyof EventTypes} e
     * @param {(value: EventTypes[keyof EventTypes]) => any} callback
     * @memberof Emitter
     */
    attach(e, callback) {
        if (!(e in this.callbacks)) {
            this.callbacks[e] = [];
        }
        this.callbacks[e].push(callback);
    }
    /**
     * Remove callbach listener at event
     *
     * @param {keyof EventTypes} e
     * @param {(value: EventTypes[keyof EventTypes]) => void} callback
     * @memberof Emitter
     */
    detach(e, callback) {
        if (e in this.callbacks) {
            const index = this.callbacks[e].indexOf(callback);
            if (index >= 0) {
                this.callbacks[e].splice(index, 1);
            }
        }
    }
    /**
     * Dispatch event
     *
     * @param {keyof EventTypes} e
     * @param {EventTypes[keyof EventTypes]} [params]
     * @memberof Emitter
     */
    dispatch(e, params) {
        if (e in this.callbacks) {
            for (let i = 0, len = this.callbacks[e].length; i < len; i++)
                if (this.callbacks[e][i](params) === false)
                    break;
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Emitter);
//# sourceMappingURL=Emitter.js.map

/***/ }),

/***/ "./dist/services/exporters/GCODEExporter.js":
/*!**************************************************!*\
  !*** ./dist/services/exporters/GCODEExporter.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");

class GCODEExporter {
    static parse(drawer, settings) {
        const scene = drawer.getScene();
        if (scene) {
            const bindedSettings = Object.assign(Object.assign({}, GCODEExporter.defaults), settings);
            return GCODEExporter.generate(scene, bindedSettings).join('\n');
        }
        return '';
    }
    static setUnit(unit) {
        return unit === 'inches' ? 'G20' : 'G21';
    }
    static useRelativePosition() {
        return 'G91';
    }
    static useAbsolutePosition() {
        return 'G90';
    }
    static home(penUpCommand) {
        return [penUpCommand, 'G28 X0 Y0'];
    }
    static round(value, round) {
        return Math.round(value * round) / round;
    }
    static setCurrentMachinePosition(x, y, round) {
        return `G28.1 X${this.round(x, round)} Y${this.round(y, round)}`;
    }
    static setCurrentWorkspacePosition(x, y, round) {
        return `G92 X${this.round(x, round)} Y${this.round(y, round)}`;
    }
    static gotoTo(x, y, round, velocity) {
        return typeof velocity !== 'undefined'
            ? `G1 X${this.round(x, round)} Y${this.round(y, round)} F${velocity}`
            : `G0 X${this.round(x, round)} Y${this.round(y, round)}`;
    }
    static moveTo(penUpCommand, penDownCommand, x, y, round) {
        return [penUpCommand, this.gotoTo(x, y, round), penDownCommand];
    }
    static lineTo(x, y, velocity, round) {
        return this.gotoTo(x, y, round, velocity);
    }
    static concat(result, data) {
        if (typeof data === 'string')
            result.push(data);
        else
            data.forEach(line => result.push(line));
    }
    static generate(scene, settings) {
        // Calculate workspace area
        const workspaceWidth = settings.maxX - settings.minX;
        const workspaceHeight = settings.maxY - settings.minY;
        const workspaceRatio = workspaceWidth / workspaceHeight;
        // Calculate drawArea from scene
        const sceneRatio = scene.width / scene.height;
        const drawArea = [
            workspaceRatio > sceneRatio ? (scene.width * workspaceHeight) / scene.height : workspaceWidth,
            workspaceRatio > sceneRatio ? workspaceHeight : (scene.height * workspaceWidth) / scene.width,
        ];
        const drawAreaSceneOffset = [(workspaceWidth - drawArea[0]) / 2, (workspaceHeight - drawArea[1]) / 2];
        // Adapt drawArea to workspace
        const scale = workspaceRatio > sceneRatio ? scene.width / drawArea[0] : scene.height / drawArea[1];
        // const machineCenterPosition = [(settings.maxX + settings.minX) / 2, (settings.maxY + settings.minY) / 2]
        const gcode = [];
        this.concat(gcode, settings.penUpCommand);
        this.concat(gcode, this.setUnit(settings.unit));
        this.concat(gcode, this.useAbsolutePosition());
        this.concat(gcode, this.setCurrentMachinePosition(settings.minX, settings.minY, settings.round));
        this.concat(gcode, this.setCurrentWorkspacePosition(settings.minX, settings.minY, settings.round));
        scene.update(settings.atTime);
        const sceneChilds = scene.getChildren();
        for (let i = 0, len = sceneChilds.length; i < len; i++) {
            sceneChilds[i].generate(0, true);
            const childBuffer = sceneChilds[i].getBuffer() || [];
            const childIndexedBuffer = sceneChilds[i].getIndexedBuffer() || [];
            for (let currentBufferIndex = 0, vertexIndex = 0, len = childIndexedBuffer.length; currentBufferIndex < len; currentBufferIndex++) {
                const currentIndexing = childIndexedBuffer[i];
                const initialPointX = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.clamp)(settings.minX, settings.maxX, settings.minX + childBuffer[vertexIndex] / scale + drawAreaSceneOffset[0]);
                const initialPointY = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.clamp)(settings.minY, settings.maxY, settings.minY + childBuffer[vertexIndex + 1] / scale + drawAreaSceneOffset[1]);
                this.concat(gcode, this.moveTo(settings.penUpCommand, settings.penDownCommand, initialPointX, initialPointY, settings.round));
                vertexIndex += 2;
                for (let len = vertexIndex + currentIndexing.frameLength - 2; vertexIndex < len; vertexIndex += 2) {
                    const currentX = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.clamp)(settings.minX, settings.maxX, settings.minX + childBuffer[vertexIndex] / scale + drawAreaSceneOffset[0]);
                    const currentY = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.clamp)(settings.minY, settings.maxY, settings.minY + childBuffer[vertexIndex + 1] / scale + drawAreaSceneOffset[1]);
                    this.concat(gcode, this.lineTo(currentX, currentY, settings.velocity, settings.round));
                }
                if (currentIndexing.shape.isClosed())
                    this.concat(gcode, this.lineTo(initialPointX, initialPointY, settings.velocity, settings.round));
            }
        }
        this.concat(gcode, this.home(settings.penUpCommand));
        return gcode;
    }
}
GCODEExporter.defaults = {
    atTime: 0,
    round: 100,
    minX: 0,
    minY: 0,
    maxX: 297,
    maxY: 210,
    velocity: 1500,
    unit: 'millimeters',
    penUpCommand: 'M3 S30',
    penDownCommand: 'M3 S0',
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GCODEExporter);
//# sourceMappingURL=GCODEExporter.js.map

/***/ }),

/***/ "./dist/services/exporters/JSONExporter.js":
/*!*************************************************!*\
  !*** ./dist/services/exporters/JSONExporter.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _Utilites__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Utilites */ "./dist/Utilites.js");
/* harmony import */ var _importers_JSONImporter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../importers/JSONImporter */ "./dist/services/importers/JSONImporter.js");
/* harmony import */ var _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scene-utilities/SceneUtilities */ "./dist/services/scene-utilities/SceneUtilities.js");
/* harmony import */ var _scene_utilities_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../scene-utilities/SceneChildUtilitiesData */ "./dist/services/scene-utilities/SceneChildUtilitiesData.js");





/**
 *
 * @category Services.Export/Import
 * @class JSONExporter
 */
class JSONExporter {
    static parse(drawer, name = 'EmptyProject') {
        return JSONExporter.toString(JSONExporter.parseAsProject(drawer, name));
    }
    static toString(project) {
        return JSON.stringify(project);
    }
    static parseAsProject(drawer, name = 'EmptyProject') {
        const timeline = drawer.getTimeline();
        const project = _importers_JSONImporter__WEBPACK_IMPORTED_MODULE_2__.default.createEmptyProject();
        project.name = name;
        project.clear = drawer.getOption('clear', true);
        project.ghosts = drawer.getOption('ghosts', 0);
        project.ghostSkipTime = drawer.getOption('ghostSkipTime', undefined);
        project.ghostSkipFunction = _Utilites__WEBPACK_IMPORTED_MODULE_1__.parseFunction.parse(drawer.getOption('ghostSkipFunction', undefined));
        project.ratio = drawer.getRatio();
        const { duration, framerate } = timeline.getSequence();
        project.sequence = { duration, framerate };
        project.scene = {};
        const scene = drawer.getScene();
        if (scene) {
            project.width = scene.width;
            project.height = scene.height;
            // project.resolution = drawer.getResolution()
            project.color = scene.color;
            project.background = scene.background;
            const sceneChilds = scene.getChildren();
            for (let i = 0, len = sceneChilds.length; i < len; i++) {
                project.scene[sceneChilds[i].id] = JSONExporter.parseSceneChild(sceneChilds[i]);
            }
        }
        return project;
    }
    static filterDataTye(data, dataType) {
        const filtered = {};
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            const name = keys[i];
            if (name in _scene_utilities_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_4__.default &&
                _scene_utilities_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_4__.default[name].dataType === dataType) {
                filtered[name] = data[name];
            }
        }
        return filtered;
    }
    static parseSceneChild(sceneChild, parentId, depth = 0) {
        const projectSceneChild = {
            id: sceneChild.id + '',
            type: sceneChild.type,
            name: sceneChild.name,
            order: sceneChild.order,
            data: Object.assign(Object.assign({}, JSON.parse(JSON.stringify(sceneChild.data))), { props: undefined, style: undefined }),
            // data: {},
            depth,
            bPrimitive: sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapePrimitive,
            props: {},
            style: {},
            parentId,
        };
        Object.entries(sceneChild.getProps()).forEach(([key, value]) => {
            if (key in _scene_utilities_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_4__.default &&
                _scene_utilities_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_4__.default[key].dataType === 'props') {
                projectSceneChild.props[key] =
                    sceneChild.data.props[key] || _Utilites__WEBPACK_IMPORTED_MODULE_1__.parseFunction.parse(value);
            }
        });
        // const props = sceneChild.getProps()
        // const propsKeys = Object.keys(props) as Array<keyof ISceneChildProps>
        // for (let i = 0, len = propsKeys.length; i < len; i++) {
        // 	const propName = propsKeys[i]
        // 	if (
        // 		propName in SceneChildUtilitiesData &&
        // 		SceneChildUtilitiesData[propName as TSceneChildPropsDataKeys].dataType === 'props'
        // 	) {
        // 		projectSceneChild.props[propName] = sceneChild.data.props[propName] || parseFunction.parse(props[propName])
        // 	}
        // }
        // for (let i = 0, len = propsKeys.length; i < len; i++) props[propsKeys[i]] = parseFunction.parse(props[propsKeys[i]])
        // projectSceneChild.props = JSONExporter.filterDataTye({ ...props, ...sceneChild.data.props }, 'props')
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer) {
            projectSceneChild.shape = sceneChild.shape;
        }
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBase) {
            projectSceneChild.bUseParent = sceneChild.bUseParent;
            projectSceneChild.bUseRecursion = sceneChild.bUseRecursion;
            projectSceneChild.vertexCallback = _Utilites__WEBPACK_IMPORTED_MODULE_1__.parseFunction.parse(sceneChild.data.vertexCallback || sceneChild.vertexCallback);
        }
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapePrimitive) {
            Object.entries(sceneChild.drawer).forEach(([key, value]) => {
                if (key in _scene_utilities_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_4__.default &&
                    _scene_utilities_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_4__.default[key].dataType === 'drawer') {
                    projectSceneChild.style[key] =
                        sceneChild.data.style[key] || _Utilites__WEBPACK_IMPORTED_MODULE_1__.parseFunction.parse(value);
                }
            });
            // const style = sceneChild.style
            // const styleKeys = Object.keys(style) as Array<keyof IDrawerStreamProps>
            // for (let i = 0, len = styleKeys.length; i < len; i++)
            // 	style[styleKeys[i]] = parseFunction.parse(style[styleKeys[i]])
            // projectSceneChild.style = JSONExporter.filterDataTye({ ...style, ...sceneChild.data.style }, 'drawer')
            if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer)
                projectSceneChild.adaptMode = sceneChild.adaptMode;
            projectSceneChild.bClosed = sceneChild.bClosed;
        }
        else if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape || sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group) {
            const children = [];
            const shapeChildren = _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__.default.getChildren(sceneChild);
            for (let i = 0; i < shapeChildren.length; i++)
                children.push(JSONExporter.parseSceneChild(shapeChildren[i], sceneChild.id, depth + 1));
            projectSceneChild.children = children;
        }
        return projectSceneChild;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JSONExporter);
//# sourceMappingURL=JSONExporter.js.map

/***/ }),

/***/ "./dist/services/exporters/SVGExporter.js":
/*!************************************************!*\
  !*** ./dist/services/exporters/SVGExporter.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _drawers_drawer_svg_DrawerSVG__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../drawers/drawer-svg/DrawerSVG */ "./dist/services/drawers/drawer-svg/DrawerSVG.js");

const DEFAULT_SETTINGS = {
    size: 1080,
    quality: 1,
    time: 0,
    noBackground: true,
};
/**
 *
 * @category Services.Export/Import
 * @class SVGExporter
 */
class SVGExporter {
    static parse(drawer, settings) {
        settings = Object.assign(Object.assign({}, DEFAULT_SETTINGS), settings);
        const svg = this.parseAsSVG(drawer, settings);
        return svg.outerHTML;
    }
    static parseAsSVG(drawer, settings) {
        settings = Object.assign(Object.assign({}, DEFAULT_SETTINGS), settings);
        const scene = drawer.getScene();
        const drawerOptions = Object.assign(Object.assign({}, drawer.getOptions()), { time: settings.time, decimals: Math.floor(settings.quality * 4), noBackground: settings.noBackground });
        const container = document.createElement('div');
        const tmp = new _drawers_drawer_svg_DrawerSVG__WEBPACK_IMPORTED_MODULE_0__.default(scene, container, drawerOptions, drawer.getRatio());
        const tmpTimeline = tmp.getTimeline();
        tmpTimeline.setDuration(drawer.getTimeline().getDuration());
        tmpTimeline.setTime(drawerOptions.time || 0);
        tmp.draw();
        return container.firstChild;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SVGExporter);
//# sourceMappingURL=SVGExporter.js.map

/***/ }),

/***/ "./dist/services/importers/JSONImporter.js":
/*!*************************************************!*\
  !*** ./dist/services/importers/JSONImporter.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _drawers_drawer_canvas_DrawerCanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../drawers/drawer-canvas/DrawerCanvas */ "./dist/services/drawers/drawer-canvas/DrawerCanvas.js");
/* harmony import */ var _Utilites__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Utilites */ "./dist/Utilites.js");
/* harmony import */ var _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scene-utilities/SceneUtilities */ "./dist/services/scene-utilities/SceneUtilities.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v1.js");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../meta */ "./dist/meta.js");






/**
 *
 * @category Services.Export/Import
 * @class JSONImporter
 */
class JSONImporter {
    /**
     * Parse string to DrawerCanvas
     *
     * @static
     * @param {string} project_json
     * @returns {(DrawerCanvas | null)}
     */
    static parse(project_json) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (!project_json)
            return null;
        const parsed = project_json && project_json.length > 0 ? JSON.parse(project_json) : {};
        if (!('scene' in parsed))
            return null;
        const emptyProject = JSONImporter.createEmptyProject();
        const project = {
            id: (_a = parsed.id) !== null && _a !== void 0 ? _a : emptyProject.id,
            urpflanze_version: (_b = parsed.urpflanze_version) !== null && _b !== void 0 ? _b : emptyProject.urpflanze_version,
            name: (_c = parsed.name) !== null && _c !== void 0 ? _c : emptyProject.name,
            width: (_d = parsed.width) !== null && _d !== void 0 ? _d : emptyProject.width,
            height: (_e = parsed.height) !== null && _e !== void 0 ? _e : emptyProject.height,
            resolution: (_f = parsed.resolution) !== null && _f !== void 0 ? _f : emptyProject.resolution,
            background: (_g = parsed.background) !== null && _g !== void 0 ? _g : emptyProject.background,
            color: (_h = parsed.color) !== null && _h !== void 0 ? _h : emptyProject.color,
            clear: (_j = parsed.clear) !== null && _j !== void 0 ? _j : emptyProject.clear,
            ghosts: (_k = parsed.ghosts) !== null && _k !== void 0 ? _k : emptyProject.ghosts,
            ghostSkipTime: (_l = parsed.ghostSkipTime) !== null && _l !== void 0 ? _l : emptyProject.ghostSkipTime,
            ghostSkipFunction: (_m = parsed.ghostSkipFunction) !== null && _m !== void 0 ? _m : emptyProject.ghostSkipFunction,
            ratio: (_o = parsed.ratio) !== null && _o !== void 0 ? _o : emptyProject.ratio,
            scene: parsed.scene || emptyProject.scene,
            sequence: Object.assign(Object.assign({}, emptyProject.sequence), parsed.sequence),
        };
        const drawOptions = {
            clear: project.clear,
            ghosts: project.ghosts,
            ghostSkipTime: _Utilites__WEBPACK_IMPORTED_MODULE_2__.parseFunction.unparse(project.ghostSkipTime),
        };
        const scene = new _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Scene({
            color: project.color,
            background: project.background,
            width: project.width,
            height: project.height,
        });
        const drawer = new _drawers_drawer_canvas_DrawerCanvas__WEBPACK_IMPORTED_MODULE_1__.default(scene, undefined, drawOptions, project.ratio, project.resolution);
        const timeline = drawer.getTimeline();
        timeline.setSequence(project.sequence.duration, project.sequence.framerate);
        const sceneChilds = Object.values(project.scene || []);
        for (let i = 0, len = sceneChilds.length; i < len; i++) {
            const sceneChild = JSONImporter.parseSceneChild(sceneChilds[i], scene);
            sceneChild && scene.add(sceneChild);
        }
        return drawer;
    }
    static parseSceneChild(projectSceneChild, scene) {
        const shape = typeof projectSceneChild.shape !== 'undefined'
            ? Float32Array.from(Object.values(projectSceneChild.shape))
            : undefined;
        const settings = {
            id: projectSceneChild.id,
            name: projectSceneChild.name,
            order: projectSceneChild.order,
            // data: projectSceneChild.data,
            bUseParent: projectSceneChild.bUseParent,
            bUseRecursion: projectSceneChild.bUseRecursion,
            adaptMode: projectSceneChild.adaptMode,
            bClosed: projectSceneChild.bClosed,
            shape: shape,
        };
        const sceneChild = _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__.default.create(projectSceneChild.type, settings);
        if (sceneChild) {
            const props = Object.assign({}, projectSceneChild.props);
            const propKeys = Object.keys(props);
            propKeys.forEach(propKey => {
                _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__.default.setProp(sceneChild, propKey, _Utilites__WEBPACK_IMPORTED_MODULE_2__.parseFunction.unparse(props[propKey]), scene);
            });
            const style = Object.assign({}, projectSceneChild.style);
            const styleKeys = Object.keys(style);
            styleKeys.forEach(styleKey => {
                _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__.default.setDrawerProp(sceneChild, styleKey, _Utilites__WEBPACK_IMPORTED_MODULE_2__.parseFunction.unparse(style[styleKey]), scene);
            });
            if (typeof projectSceneChild.vertexCallback !== 'undefined')
                _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__.default.setSetting(sceneChild, 'vertexCallback', projectSceneChild.vertexCallback, scene);
            if (projectSceneChild.children && projectSceneChild.children.length > 0) {
                for (let i = 0, len = projectSceneChild.children.length; i < len; i++) {
                    const child = JSONImporter.parseSceneChild(projectSceneChild.children[i], scene);
                    child && _scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_3__.default.add(sceneChild, child);
                }
            }
            return sceneChild;
        }
        console.warn(`[Urpflanze:JSONImporter] can't import`, projectSceneChild);
        return null;
    }
}
/**
 * Empty project with default value
 *
 * @static
 */
JSONImporter.createEmptyProject = () => {
    return {
        id: (0,uuid__WEBPACK_IMPORTED_MODULE_5__.default)(),
        urpflanze_version: _meta__WEBPACK_IMPORTED_MODULE_4__.version,
        name: '',
        width: 600,
        height: 600,
        resolution: 600,
        background: '#000',
        color: '#fff',
        clear: true,
        ghosts: 0,
        ghostSkipTime: 30,
        ratio: 1,
        scene: {},
        sequence: {
            duration: 6000,
            framerate: 60,
        },
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JSONImporter);
//# sourceMappingURL=JSONImporter.js.map

/***/ }),

/***/ "./dist/services/importers/SVGImporter.js":
/*!************************************************!*\
  !*** ./dist/services/importers/SVGImporter.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var transformation_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! transformation-matrix */ "./node_modules/transformation-matrix/src/index.js");
/* harmony import */ var simplify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! simplify-js */ "./node_modules/simplify-js/simplify.js");
/* harmony import */ var simplify_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(simplify_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var svgpath__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! svgpath */ "./node_modules/svgpath/index.js");
/* harmony import */ var svgpath__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(svgpath__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _JSONImporter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./JSONImporter */ "./dist/services/importers/JSONImporter.js");
/* harmony import */ var _drawers_drawer_canvas_DrawerCanvas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../drawers/drawer-canvas/DrawerCanvas */ "./dist/services/drawers/drawer-canvas/DrawerCanvas.js");
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _Utilites__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Utilites */ "./dist/Utilites.js");







/**
 *
 * @category Services.Export/Import
 * @class JSONImporter
 */
class SVGImporter {
    /**
     * Check passed input is valid SVG string
     *
     * @static
     * @param {string} input
     * @returns {boolean}
     */
    static isSVG(input) {
        return SVGImporter.SVG_REGEX.test(input.replace(SVGImporter.COMMENT_REGEX, ''));
    }
    /**
     * Convert string to SVGElement
     *
     * @static
     * @param {string} input
     * @returns {(SVGElement | null)}
     */
    static stringToSVG(input) {
        if (!SVGImporter.isSVG(input)) {
            console.warn('[Urpflanze:SVGImport] | Input is not valid SVG string', input);
            return null;
        }
        if (typeof DOMParser === 'undefined') {
            console.warn('[Urpflanze:SVGImport] DOMParser not defined');
            return null;
        }
        const parser = new DOMParser();
        const document = parser.parseFromString(input, 'image/svg+xml');
        return document.querySelector('svg');
    }
    /**
     * Convert SVG string into DrawerCanvas
     *
     * @static
     * @param {string} input
     * @returns {(DrawerCanvas | null)}
     */
    static parse(input, simplify = 0.001) {
        const svg = SVGImporter.stringToSVG(input);
        if (svg === null) {
            console.warn('[Urpflanze:SVGImport] | Cannot convet string to SVG', input);
        }
        const parsed = SVGImporter.SVGStringToBuffers(input, simplify);
        if (parsed === null) {
            console.warn('[Urpflanze:SVGImport] | Cannot convet string DrawerCanvas', input);
            return null;
        }
        const emptyProject = _JSONImporter__WEBPACK_IMPORTED_MODULE_3__.default.createEmptyProject();
        const scene = new _urpflanze_core__WEBPACK_IMPORTED_MODULE_5__.Scene({
            color: emptyProject.color,
            background: emptyProject.background,
            width: parsed.viewBox[2] - parsed.viewBox[0],
            height: parsed.viewBox[3] - parsed.viewBox[1],
        });
        const result = SVGImporter.parsedToShape(parsed);
        if (result !== null)
            scene.add(result);
        return new _drawers_drawer_canvas_DrawerCanvas__WEBPACK_IMPORTED_MODULE_4__.default(scene, undefined);
    }
    /**
     * Convert SVG string to Shape or ShapeBuffer
     *
     * @static
     * @param {string} input
     * @param {number} [simplify=0.001]
     * @returns {(Shape | ShapeBuffer | null)}
     */
    static parseAsShape(input, simplify = 0.001) {
        const svg = SVGImporter.stringToSVG(input);
        if (svg === null) {
            console.warn('[Urpflanze:SVGImport] | Cannot convet string to SVG', input);
        }
        const parsed = SVGImporter.SVGStringToBuffers(input, simplify);
        if (parsed === null || parsed.buffers.length === 0) {
            console.warn('[Urpflanze:SVGImport] | Cannot convet string DrawerCanvas', input);
            return null;
        }
        return SVGImporter.parsedToShape(parsed);
    }
    /**
     * Convert parsed SVG to Shape or ShapeBuffer
     *
     * @static
     * @param {ISVGParsed} parsed
     * @returns {(Shape | ShapeBuffer | null)}
     */
    static parsedToShape(parsed) {
        const shapes = new Array(parsed.buffers.length);
        parsed.buffers.forEach(buffer => {
            shapes.push(new _urpflanze_core__WEBPACK_IMPORTED_MODULE_5__.ShapeBuffer({
                shape: buffer.buffer,
                bClosed: buffer.closed,
                drawer: {
                    fill: buffer.fill,
                    stroke: buffer.stroke,
                    lineWidth: buffer.lineWidth,
                },
            }));
        });
        if (shapes.length === 1)
            return shapes[0];
        const group = new _urpflanze_core__WEBPACK_IMPORTED_MODULE_5__.Group();
        shapes.forEach(s => group.add(s));
        return new _urpflanze_core__WEBPACK_IMPORTED_MODULE_5__.Shape({ shape: group });
    }
    /**
     * Convert SVG string to buffers
     *
     * @static
     * @param {string} input
     * @param {number} [simplify=0.001]
     * @returns {(ISVGParsed | null)}
     */
    static SVGStringToBuffers(input, simplify = 0.001) {
        const svg = SVGImporter.stringToSVG(input);
        if (svg === null) {
            console.error('[Urpflanze:SVGImport] | Cannot convert string to svg', input);
            return null;
        }
        const svgFill = SVGImporter.getStyleAttr('fill', svg);
        const svgStroke = SVGImporter.getStyleAttr('stroke', svg);
        const svgLineWidth = SVGImporter.getStyleAttr('stroke-width', svg);
        const viewBox = SVGImporter.getViewbox(svg);
        const groups = svg.querySelectorAll('g');
        groups.forEach(SVGImporter.propagateGroupTransformAndStyleToChildren);
        // Get all primitive elements
        const elements = Array.from(svg.querySelectorAll('rect, circle, ellipse, line, polyline, polygon, path'));
        // Convert elements to path
        const paths = [].concat(...elements.map(e => SVGImporter.elementToPath(e)));
        // Convert paths to buffe of points based on viewBox
        const expMatch = Math.max(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1])
            .toExponential(1)
            .match(/e(\+?[0-9]+)/);
        const exp = Math.min(10 ** Math.max(expMatch ? +expMatch[1] : 0, 0), 1000);
        const steps = 10 / (1000 / exp);
        let buffers = paths.map(path => SVGImporter.pathToBuffer(path, steps, viewBox));
        // Simplify buffers
        buffers = buffers.map(buffer => SVGImporter.simpliyBuffer(buffer, simplify));
        const result = [];
        for (let i = 0; i < buffers.length; i++) {
            const templineWidth = paths[i].getAttribute('stroke-width');
            let strokeWidth;
            if (templineWidth) {
                strokeWidth =
                    templineWidth.indexOf('%') >= 0
                        ? SVGImporter.fromPercentage(parseFloat(templineWidth), Math.sqrt((viewBox[2] - viewBox[0]) * (viewBox[3] - viewBox[1])))
                        : parseFloat(templineWidth);
            }
            const fill = SVGImporter.getStyleAttr('fill', paths[i], svgFill ? svgFill : undefined);
            const stroke = SVGImporter.getStyleAttr('stroke', paths[i], fill ? undefined : svgStroke || 'rgba(0,0,0,0)');
            const lineWidth = strokeWidth
                ? strokeWidth
                : stroke
                    ? svgLineWidth
                        ? parseFloat(svgLineWidth)
                        : 1
                    : svgLineWidth
                        ? parseFloat(svgLineWidth)
                        : undefined;
            result.push({
                buffer: buffers[i],
                closed: SVGImporter.pathIsClosed(paths[i]),
                fill,
                stroke,
                lineWidth,
            });
        }
        elements.forEach((e) => e.remove());
        return { viewBox, buffers: result };
    }
    /**
     * Replace 'none' to undefined
     *
     * @private
     * @static
     * @param {('fill' | 'stroke')} name
     * @param {SVGElement} path
     * @returns {(string | undefined)}
     */
    static getStyleAttr(name, element, defaultColor) {
        // get color from attribute
        const value = element.getAttribute(name);
        if (value === 'none')
            return undefined;
        if (typeof value !== 'undefined' && value !== null) {
            const parsed = (0,_Utilites__WEBPACK_IMPORTED_MODULE_6__.parseColor)(value);
            if (parsed) {
                return parsed.type === 'rgb'
                    ? `rgb(${parsed.a}, ${parsed.b}, ${parsed.c})`
                    : `hsl(${parsed.a}, ${parsed.b}%, ${parsed.c}%)`;
            }
        }
        // otherwise get color from style
        const styleName = name === 'stroke-width' ? 'strokeWidth' : name;
        if (typeof element.style[styleName] !== 'undefined' && element.style[styleName].length > 0) {
            return element.style[styleName];
        }
        return defaultColor;
    }
    /**
     * Return SVG viewBox
     * If it is not present, calculate it based on elements
     *
     * @static
     * @param {SVGElement} svg
     * @returns {[number, number, number, number]}
     */
    static getViewbox(svg) {
        // Check viexBox is setted
        const viewBox = svg.getAttribute('viewBox');
        if (viewBox) {
            return viewBox.split(' ').map(e => parseFloat(e));
        }
        // Check width and height if viewBox is not setted
        const width = svg.getAttribute('width');
        const height = svg.getAttribute('height');
        if (width && height) {
            return [0, 0, parseFloat(width), parseFloat(height)];
        }
        // Calculate dimension by elements
        svg = svg.cloneNode(true);
        const elements = Array.from(svg.querySelectorAll('rect, circle, ellipse, line, polyline, polygon, path'));
        const paths = [].concat.apply([], elements.map(e => SVGImporter.elementToPath(e)));
        if (paths.length > 0) {
            let width = 0, height = 0;
            for (let i = 0, len = paths.length; i < len; i++) {
                const box = _urpflanze_core__WEBPACK_IMPORTED_MODULE_5__.ShapeBuffer.getBounding(SVGImporter.pathToBuffer(paths[i], 1));
                box.width += box.x;
                box.height += box.y;
                if (box.width > width)
                    width = box.width;
                if (box.height > height)
                    height = box.height;
            }
            return [0, 0, width, height];
        }
        return [-1, -1, 1, 1];
    }
    /**
     * Check path is closed
     *
     * @static
     * @param {SVGPathElement} path
     * @returns {boolean}
     */
    static pathIsClosed(path) {
        var _a;
        return ((_a = path.getAttribute('d')) === null || _a === void 0 ? void 0 : _a.trim().substr(-1).toLowerCase()) === 'z';
    }
    /**
     * Optimize number of points
     *
     * @static
     * @param {Float32Array} buffer
     * @param {number} [simplifyLevel=0.01]
     * @returns {Float32Array}
     */
    static simpliyBuffer(buffer, simplifyLevel = 0.01) {
        const simplifiedBuffer = [];
        for (let i = 0, len = buffer.length; i < len; i += 2)
            simplifiedBuffer.push({ x: buffer[i], y: buffer[i + 1] });
        const points = simplify_js__WEBPACK_IMPORTED_MODULE_1___default()(simplifiedBuffer, simplifyLevel, true);
        points.forEach((point, index) => {
            buffer[index * 2] = point.x;
            buffer[index * 2 + 1] = point.y;
        });
        return buffer.subarray(0, points.length * 2);
    }
    /**
     * Convert path to buffer between [-1, 1]
     *
     * @static
     * @param {SVGPathElement} path
     * @param {number} [steps=0.01]
     * @param {*} [viewBox=[-1, -1, 1, 1]]
     * @returns {Float32Array}
     */
    static pathToBuffer(path, steps = 0.01, viewBox = [-1, -1, 1, 1]) {
        const width = viewBox[2] - viewBox[0];
        const height = viewBox[3] - viewBox[1];
        const rw = width > height ? 1 : width / height;
        const rh = width > height ? height / width : 1;
        // Apply transform matrix to path
        const transform = path.getAttribute('transform') || '';
        let matrix = [1, 0, 0, 0, 1, 0];
        if (transform.length > 0) {
            const transformMatrix = (0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.compose)((0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.fromDefinition)((0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.fromTransformAttribute)(transform)));
            matrix = [
                transformMatrix.a,
                transformMatrix.b,
                transformMatrix.c,
                transformMatrix.d,
                transformMatrix.e,
                transformMatrix.f,
            ];
        }
        const pathString = svgpath__WEBPACK_IMPORTED_MODULE_2___default()(path.getAttribute('d') || '')
            .matrix(matrix)
            .toString();
        const path_length = Math.floor(path.getTotalLength());
        const buffer_length = Math.floor(path_length / steps) * 2;
        const pathFromMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathFromMatrix.setAttribute('d', pathString);
        // Generate buffer
        const buffer = new Float32Array(buffer_length);
        for (let i = 0, j = 0; i < path_length; i += steps, j += 2) {
            const { x, y } = pathFromMatrix.getPointAtLength(i);
            buffer[j] = rw * (x / width) * 2 - 1;
            buffer[j + 1] = rh * (y / height) * 2 - 1;
            if (rw < 1)
                buffer[j] += 1 - rw;
            if (rh < 1)
                buffer[j + 1] += 1 - rh;
        }
        return buffer;
    }
    /**
     * Propagate transform for apply to point in path
     *
     * @private
     * @static
     * @param {SVGGElement} g
     */
    static propagateGroupTransformAndStyleToChildren(g) {
        const gTransform = g.getAttribute('transform');
        if (gTransform && gTransform.length > 0) {
            const gMatrix = (0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.compose)((0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.fromDefinition)((0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.fromTransformAttribute)(gTransform)));
            const children = g.children;
            Array.from(children).forEach(child => {
                let transform = child.getAttribute('transform');
                if (transform && transform.length > 0) {
                    const matrix = (0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.compose)((0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.fromDefinition)((0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.fromTransformAttribute)(transform)));
                    const finalMatrix = (0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.compose)(matrix, gMatrix);
                    transform = (0,transformation_matrix__WEBPACK_IMPORTED_MODULE_0__.toSVG)(finalMatrix);
                }
                child.setAttribute('transform', gTransform);
            });
        }
        const attrs = ['fill', 'stroke', 'stroke-width'];
        attrs.forEach(attr => {
            const value = g.getAttribute(attr);
            if (value) {
                Array.from(g.children).forEach(child => {
                    if (child.getAttribute(attr) === null) {
                        child.setAttribute(attr, value);
                    }
                });
            }
        });
    }
    /**
     * Convert SVG Element to Path
     *
     * @static
     * @param {SVGElement} element
     * @returns {Array<SVGPathElement>}
     */
    static elementToPath(element) {
        const transform = element.getAttribute('transform') || '';
        const fill = SVGImporter.getStyleAttr('fill', element, undefined);
        const stroke = SVGImporter.getStyleAttr('stroke', element, undefined);
        const lineWidth = SVGImporter.getStyleAttr('stroke-width', element, undefined);
        if (element.nodeName == 'path') {
            // Separate multiple path
            const d = element.getAttribute('d') || '';
            const result = svgpath__WEBPACK_IMPORTED_MODULE_2___default()(d)
                .abs()
                .toString()
                .split('M')
                .filter((e) => e.length > 0)
                .map((e) => 'M' + e);
            return result.map((d) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', d);
                path.setAttribute('transform', transform);
                fill && path.setAttribute('fill', fill);
                stroke && path.setAttribute('stroke', stroke);
                lineWidth && path.setAttribute('lineWidth', lineWidth);
                return path;
            });
        }
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const nodeName = element.nodeName;
        if (['rect', 'ellipse', 'circle', 'line', 'polyline', 'polygon'].includes(nodeName)) {
            path.setAttribute('d', SVGImporter.CONVERSION[nodeName](element));
            path.setAttribute('transform', transform);
            fill && path.setAttribute('fill', fill);
            stroke && path.setAttribute('stroke', stroke);
            lineWidth && path.setAttribute('lineWidth', lineWidth);
            return [path];
        }
        else {
            console.warn(`[Urpflanze:SVGImport] | Cannot convert ${nodeName} to path`);
            return [];
        }
    }
    /**
     * Get percentage to number
     *
     * @private
     * @static
     * @param {(number | string)} val
     * @param {number} base
     * @returns {number}
     */
    static fromPercentage(val, base) {
        return /%$/.test(val + '') ? (parseFloat((val + '').replace('%', '')) * 100) / base : +val;
    }
    /**
     * Separate multiple array
     *
     * @private
     * @static
     * @param {(Array<string | number>)} arr
     * @param {number} [size=2]
     * @returns {(Array<Array<string | number>>)}
     */
    static chunk(arr, size = 2) {
        const results = [];
        while (arr.length > 0)
            results.push(arr.splice(0, size));
        return results;
    }
}
/**
 * Match hex color
 * @static
 */
SVGImporter.HEX_REGEX = '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})';
/**
 * Match string is SVG
 * @static
 */
SVGImporter.SVG_REGEX = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;
/**
 * Match commments
 *
 * @static
 */
SVGImporter.COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
/**
 * Convert Elements to path
 *
 * @private
 * @static
 * @type {ISVGElementConversion}
 */
SVGImporter.CONVERSION = {
    rect: (rect) => {
        const width = parseFloat(rect.getAttribute('width') || '0');
        const height = parseFloat(rect.getAttribute('height') || '0');
        const x = parseFloat(rect.getAttribute('x') || '0');
        const y = parseFloat(rect.getAttribute('y') || '0');
        let rx = rect.getAttribute('rx') || 'auto';
        let ry = rect.getAttribute('ry') || 'auto';
        if (rx === 'auto' && ry === 'auto')
            rx = ry = 0;
        else if (rx !== 'auto' && ry === 'auto')
            rx = ry = SVGImporter.fromPercentage(rx, width);
        else if (ry !== 'auto' && rx === 'auto')
            ry = rx = SVGImporter.fromPercentage(ry, height);
        else {
            rx = SVGImporter.fromPercentage(rx, width);
            ry = SVGImporter.fromPercentage(ry, height);
        }
        if (rx > width / 2)
            rx = width / 2;
        if (ry > height / 2)
            ry = height / 2;
        const hasCurves = rx > 0 && ry > 0;
        return [
            `M${x + rx} ${y}`,
            `H${x + width - rx}`,
            ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + width} ${y + ry}`] : []),
            `V${y + height - ry}`,
            ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + width - rx} ${y + height}`] : []),
            `H${x + rx}`,
            ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x} ${y + height - ry}`] : []),
            `V${y + ry}`,
            ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + rx} ${y}`] : []),
            'Z',
        ].join(' ');
    },
    ellipse: (ellipse) => {
        var _a, _b, _c, _d;
        const cx = parseFloat(ellipse.getAttribute('cx') || '0');
        const cy = parseFloat(ellipse.getAttribute('cy') || '0');
        const rx = parseFloat((_b = (_a = ellipse.getAttribute('rx')) !== null && _a !== void 0 ? _a : ellipse.getAttribute('r')) !== null && _b !== void 0 ? _b : '0');
        const ry = parseFloat((_d = (_c = ellipse.getAttribute('ry')) !== null && _c !== void 0 ? _c : ellipse.getAttribute('r')) !== null && _d !== void 0 ? _d : '0');
        return [
            `M${cx + rx} ${cy}`,
            `A${rx} ${ry} 0 0 1 ${cx} ${cy + ry}`,
            `A${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`,
            `A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
            'Z',
        ].join(' ');
    },
    circle: (circle) => SVGImporter.CONVERSION.ellipse(circle),
    line: (line) => `M${line.getAttribute('x1') || '0'} ${line.getAttribute('y1') || '0'} L${line.getAttribute('x2') || '0'} ${line.getAttribute('y2') || '0'}`,
    polyline: (polyline) => {
        const points = polyline.getAttribute('points') || '';
        const pointsArray = points
            .trim()
            .replace(/  +/g, ' ')
            .split(' ')
            .reduce((arr, point) => [...arr, ...(point.includes(',') ? point.split(',') : [point])], []);
        const pairs = SVGImporter.chunk(pointsArray, 2);
        return pairs.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
    },
    polygon: (polygon) => SVGImporter.CONVERSION.polyline(polygon) + ' Z',
    path: (path) => path.getAttribute('d') + '',
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SVGImporter);
//# sourceMappingURL=SVGImporter.js.map

/***/ }),

/***/ "./dist/services/renderer/Capturer.js":
/*!********************************************!*\
  !*** ./dist/services/renderer/Capturer.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");

/**
 *
 * @category Services.Renderer
 * @class Capturer
 */
class Capturer {
    constructor(settings = {}) {
        this.type = settings.type || 'image/jpeg';
        this.encoder = this.type === 'image/png' ? 'png' : 'jpeg';
        this.extension = this.encoder === 'jpeg' ? '.jpg' : '.png';
        this.quality = settings && settings.quality ? settings.quality : 1;
        this.started = false;
        this.promises = [];
        this.chunks = [];
    }
    setSettings(settings) {
        this.type = settings.type || 'image/jpeg';
        this.encoder = this.type === 'image/png' ? 'png' : 'jpeg';
        this.extension = this.encoder === 'jpeg' ? '.jpg' : '.png';
        this.quality = settings && settings.quality ? settings.quality : 1;
    }
    start(total_frames) {
        this.chunks = new Array(total_frames);
        this.promises = new Array(total_frames);
        this.started = true;
    }
    stop() {
        this.chunks = [];
        this.promises = [];
        this.started = false;
    }
    capture(canvas, framenumber) {
        if (this.started) {
            const type = this.type;
            const quality = this.quality;
            const chunks = this.chunks;
            const promise = new Promise((resolve, reject) => {
                Capturer.render(canvas, type, quality)
                    .then(blob => {
                    chunks[framenumber] = blob;
                    resolve(framenumber);
                })
                    .catch(e => reject([framenumber, e]));
            });
            this.promises[framenumber] = promise;
            return promise;
        }
        return Promise.reject();
    }
    save() {
        if (this.started) {
            return new Promise((resolve, reject) => {
                Promise.all(this.promises).then(() => {
                    resolve(this.chunks);
                }, reason => {
                    reject(reason);
                });
            });
        }
        return Promise.reject('not started');
    }
    static getRenderTime(canvas, type, quality) {
        const startTime = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now)();
        return Capturer.render(canvas, type, quality).then(() => (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now)() - startTime);
    }
    static getBlob(canvas, type, quality) {
        return new Promise((resolve, reject) => {
            if (canvas instanceof OffscreenCanvas)
                return canvas.convertToBlob({ type, quality }).then(resolve).catch(reject);
            else if (canvas instanceof HTMLCanvasElement)
                return canvas.toBlob(blob => (blob ? resolve(blob) : reject()), type, quality);
        });
    }
    static render(canvas, type, quality) {
        return new Promise((resolve, reject) => {
            const blobPromise = Capturer.getBlob(canvas, type, quality);
            blobPromise
                .then(blob => {
                const fileReader = new FileReader();
                fileReader.addEventListener('load', () => {
                    fileReader.result && fileReader.result instanceof ArrayBuffer
                        ? resolve(new Uint8Array(fileReader.result))
                        : reject();
                }, { passive: true });
                fileReader.readAsArrayBuffer(blob);
            })
                .catch(e => reject(e));
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Capturer);
//# sourceMappingURL=Capturer.js.map

/***/ }),

/***/ "./dist/services/renderer/Renderer.js":
/*!********************************************!*\
  !*** ./dist/services/renderer/Renderer.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var jszip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jszip */ "./node_modules/jszip/dist/jszip.min.js");
/* harmony import */ var jszip__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jszip__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _events_Emitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../events/Emitter */ "./dist/services/events/Emitter.js");
/* harmony import */ var _Capturer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Capturer */ "./dist/services/renderer/Capturer.js");
/* harmony import */ var _Utilites__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Utilites */ "./dist/Utilites.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





/**
 *
 * @category Services.Renderer
 * @class Renderer
 * @extends {Emitter<IRenderEvents>}
 */
class Renderer extends _events_Emitter__WEBPACK_IMPORTED_MODULE_2__.default {
    constructor() {
        super();
        this.started = false;
        this.capturer = new _Capturer__WEBPACK_IMPORTED_MODULE_3__.default();
    }
    renderImage(drawer, settings) {
        this.stop();
        this.started = true;
        this.capturer.setSettings(settings);
        this.capturer.start(1);
        const promise = new Promise((resolve, reject) => {
            const bClear = drawer.getOption('clear', true);
            const timeline = drawer.getTimeline();
            const sequence = timeline.getSequence();
            if (!bClear) {
                const needFrame = settings.time >= sequence.duration ? sequence.frames : timeline.getFrameAtTime(settings.time);
                for (let i = 0; i <= needFrame; i++) {
                    timeline.setFrame(i);
                    drawer.draw();
                }
            }
            else {
                drawer.draw();
            }
            this.capturer.capture(drawer.getCanvas(), 0);
            this.capturer
                .save()
                .then(chunks => {
                resolve(chunks[0]);
                this.started = false;
            })
                .catch(reject);
        });
        this.renderPromise = (0,_Utilites__WEBPACK_IMPORTED_MODULE_4__.cancelablePromise)(promise);
        return promise;
    }
    prepareRenderAnimation(drawer, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTimeDrawTime = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_1__.now)();
            drawer.setOption('time', 0);
            drawer.draw();
            const drawTime = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_1__.now)() - startTimeDrawTime;
            const sequence = drawer.getTimeline().getSequence();
            const time = yield _Capturer__WEBPACK_IMPORTED_MODULE_3__.default.getRenderTime(drawer.getCanvas(), settings.type, settings.quality);
            const renderTime = time + drawTime;
            const totalTime = renderTime * sequence.frames;
            const maxDuration = 300;
            const parts = 1 + Math.floor(totalTime / 1000 / maxDuration);
            const frameForPart = Math.floor(sequence.frames / parts);
            return {
                estimated_time: totalTime,
                total_frames: sequence.frames,
                total_parts: parts,
                forPart: frameForPart,
            };
        });
    }
    stop() {
        this.started = false;
        this.renderPromise && this.renderPromise.cancel();
        this.capturer.stop();
    }
    renderAnimation(drawer, settings) {
        this.stop();
        this.started = true;
        const sequence = drawer.getTimeline().getSequence();
        const promise = new Promise((resolve, reject) => {
            this.prepareRenderAnimation(drawer, settings).then((startMeta) => __awaiter(this, void 0, void 0, function* () {
                this.dispatch('renderer:start', startMeta);
                /**
                 * start rendering
                 */
                const zipParts = [];
                for (let i = 0; i < startMeta.total_parts; i++) {
                    if (this.started) {
                        try {
                            const zipPart = yield this.renderAnimationPart(drawer, settings, i * startMeta.forPart, startMeta.forPart, i, sequence.frames, startMeta.total_parts);
                            if (zipPart)
                                zipParts.push(zipPart);
                            else
                                reject();
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                    else {
                        reject();
                    }
                }
                resolve(zipParts);
                this.started = false;
            }));
        });
        this.renderPromise = (0,_Utilites__WEBPACK_IMPORTED_MODULE_4__.cancelablePromise)(promise);
        return promise;
    }
    renderAnimationPart(drawer, settings, frame_from, frame_count, part, total_frames, total_parts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.capturer.setSettings(settings);
            this.capturer.stop();
            this.capturer.start(frame_count);
            const timeline = drawer.getTimeline();
            let lastRenderTime = 0;
            for (let i = 0; i < frame_count; i++) {
                if (!this.started)
                    return undefined;
                const current_frame = i + frame_from;
                if (current_frame <= total_frames) {
                    const measure_start = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_1__.now)();
                    timeline.setFrame(current_frame);
                    drawer.draw();
                    yield this.capturer.capture(drawer.getCanvas(), i);
                    const measure_end = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_1__.now)();
                    lastRenderTime = measure_end - measure_start;
                    this.dispatch('renderer:render-frame', {
                        frame: current_frame,
                        part: part,
                        forPart: frame_count,
                        total_frames: total_frames,
                        total_parts: total_parts,
                        render_time: lastRenderTime,
                    });
                }
            }
            const chunks = yield this.capturer.save();
            if (this.started) {
                const zip = new jszip__WEBPACK_IMPORTED_MODULE_0__();
                for (let i = 0, len = chunks.length; i < len; i++) {
                    const frame_number = (i + frame_from).toString();
                    let frameName = '';
                    for (let j = frame_number.length; j <= 4; j++)
                        frameName += '0';
                    frameName += frame_number;
                    zip.file(frameName + this.capturer.extension, chunks[i]);
                }
                const result = yield zip.generateAsync({ type: 'blob' });
                if (!this.started)
                    return undefined;
                this.capturer.stop();
                return result;
            }
            else {
                return undefined;
            }
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Renderer);
//# sourceMappingURL=Renderer.js.map

/***/ }),

/***/ "./dist/services/scene-utilities/SceneChildUtilitiesData.js":
/*!******************************************************************!*\
  !*** ./dist/services/scene-utilities/SceneChildUtilitiesData.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");

const OptionShapePrimitiveAdaptMode = [
    { key: 'None', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.None },
    { key: 'Scale', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Scale },
    { key: 'Center', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Center },
    { key: 'Fill', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Fill },
];
const OptionSpiralType = [
    { key: 'ARCHIMEDE', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral.types.ARCHIMEDE },
    { key: 'FERMAT', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral.types.FERMAT },
    { key: 'HYPERBOLIC', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral.types.HYPERBOLIC },
    { key: 'LITUUS', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral.types.LITUUS },
    { key: 'LOGARITHMIC', value: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral.types.LOGARITHMIC },
];
/**
 * @category Services.Scene Utilities
 */
const SceneChildUtilitiesData = {
    repetitions: {
        animable: true,
        name: 'repetitions',
        label: 'Repetitions',
        type: 'range',
        min: 1,
        max: 200,
        step: 1,
        default: 1,
        default_animate: 20,
        canBArray: true,
        transformation: 'none',
        dataType: 'props',
        type_value: 'int',
    },
    distance: {
        animable: true,
        name: 'distance',
        label: 'Distance',
        type: 'range',
        min: -100,
        max: 100,
        step: 0.1,
        default: 0,
        canBArray: true,
        default_animate: 25,
        transformation: 'scene-size-percentage',
        dataType: 'props',
    },
    displace: {
        animable: true,
        name: 'displace',
        label: 'Displace',
        type: 'range',
        min: -360,
        max: 360,
        step: 1,
        default: 0,
        default_animate: 360,
        transformation: 'angle',
        dataType: 'props',
    },
    squeezeX: {
        animable: true,
        name: 'squeezeX',
        label: 'SqueezeX',
        type: 'range',
        min: -0.2,
        max: 0.2,
        step: 0.01,
        default: 0,
        default_animate: 0.1,
        transformation: 'scene-size-percentage-inverse',
        dataType: 'props',
    },
    squeezeY: {
        animable: true,
        name: 'squeezeY',
        label: 'SqueezeY',
        type: 'range',
        min: -0.2,
        max: 0.2,
        step: 0.01,
        default: 0,
        default_animate: 0.1,
        transformation: 'scene-size-percentage-inverse',
        dataType: 'props',
    },
    rotateX: {
        animable: true,
        name: 'rotateX',
        label: 'RotateX',
        type: 'range',
        min: -360,
        max: 360,
        step: 1,
        default: 0,
        default_animate: 360,
        transformation: 'angle',
        dataType: 'props',
    },
    rotateY: {
        animable: true,
        name: 'rotateY',
        label: 'RotateY',
        type: 'range',
        min: -360,
        max: 360,
        step: 1,
        default: 0,
        default_animate: 360,
        transformation: 'angle',
        dataType: 'props',
    },
    rotateZ: {
        animable: true,
        name: 'rotateZ',
        label: 'RotateZ',
        type: 'range',
        min: -360,
        max: 360,
        step: 1,
        default: 0,
        default_animate: 360,
        transformation: 'angle',
        dataType: 'props',
    },
    skewX: {
        animable: true,
        name: 'skewX',
        label: 'SkewX',
        type: 'range',
        min: -90,
        max: 90,
        step: 1,
        default: 0,
        default_animate: 1,
        transformation: 'angle',
        dataType: 'props',
    },
    skewY: {
        animable: true,
        name: 'skewY',
        label: 'SkewY',
        type: 'range',
        min: -90,
        max: 90,
        step: 1,
        default: 0,
        default_animate: 1,
        transformation: 'angle',
        dataType: 'props',
    },
    translate: {
        animable: true,
        name: 'translate',
        label: 'Translate',
        type: 'multiple-range',
        min: -100,
        max: 100,
        step: 0.1,
        default: 0,
        default_animate: 0,
        initialArray: true,
        transformation: 'scene-size-percentage',
        dataType: 'props',
    },
    scale: {
        animable: true,
        name: 'scale',
        label: 'Scale',
        type: 'multiple-range',
        min: -5,
        max: 5,
        step: 0.01,
        default: 1,
        default_animate: 3,
        transformation: 'none',
        dataType: 'props',
    },
    transformOrigin: {
        animable: true,
        name: 'transformOrigin',
        label: 'Transform Origin',
        type: 'multiple-range',
        min: -1,
        max: 1,
        step: 0.01,
        default: [0, 0],
        default_animate: [-1, 1],
        initialArray: true,
        transformation: 'none',
        dataType: 'props',
    },
    perspective: {
        animable: true,
        name: 'perspective',
        label: 'Perspective',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
        default: 0,
        default_animate: 0.8,
        transformation: 'none',
        dataType: 'props',
    },
    perspectiveOrigin: {
        animable: true,
        name: 'perspectiveOrigin',
        label: 'Perspective Origin',
        type: 'multiple-range',
        min: -1,
        max: 1,
        step: 0.01,
        default: [0, 0],
        default_animate: [-1, 1],
        initialArray: true,
        transformation: 'none',
        dataType: 'props',
    },
    // primitive style
    fill: {
        animable: true,
        name: 'fill',
        label: 'Fill',
        type: 'color',
        default: '#000',
        default_animate: '#fff',
        transformation: 'none',
        dataType: 'drawer',
    },
    stroke: {
        animable: true,
        name: 'stroke',
        label: 'Stroke',
        type: 'color',
        default: '#fff',
        default_animate: '#000',
        transformation: 'none',
        dataType: 'drawer',
    },
    lineWidth: {
        animable: true,
        name: 'lineWidth',
        label: 'Stroke weight',
        type: 'slider',
        min: 0,
        max: 30,
        step: 0.01,
        default: 0.1,
        default_animate: 3,
        transformation: 'scene-size-percentage',
        dataType: 'drawer',
    },
    bClosed: {
        name: 'bClosed',
        label: 'Closed',
        type: 'checkbox',
        default: undefined,
        transformation: 'none',
        dataType: 'settings',
    },
    bUseParent: {
        name: 'bUseParent',
        label: 'Use parent repetition',
        type: 'checkbox',
        default: false,
        transformation: 'none',
        dataType: 'settings',
    },
    bUseRecursion: {
        name: 'bUseRecursion',
        label: 'Use recursion repetition',
        type: 'checkbox',
        default: false,
        transformation: 'none',
        dataType: 'settings',
    },
    vertexCallback: {
        name: 'vertexCallback',
        label: 'vertexCallback',
        type: 'function',
        default: undefined,
        transformation: 'none',
        dataType: 'settings',
    },
    adaptMode: {
        name: 'adaptMode',
        label: 'Adapt',
        type: 'radio',
        options: OptionShapePrimitiveAdaptMode,
        default: undefined,
        transformation: 'none',
        dataType: 'settings',
    },
    // recursion
    recursions: {
        animable: true,
        name: 'recursion',
        label: 'Recursion',
        type: 'range',
        min: 1,
        max: 8,
        step: 1,
        default: 1,
        default_animate: 2,
        transformation: 'none',
        dataType: 'props',
        type_value: 'int',
    },
    recursionScale: {
        animable: true,
        name: 'recursionScale',
        label: 'Recursion Scale',
        type: 'range',
        min: 0.1,
        max: 5,
        step: 0.01,
        default: 1,
        default_animate: 2,
        transformation: 'none',
        dataType: 'props',
    },
    recursionVertex: {
        animable: true,
        name: 'recursionVertex',
        label: 'Recursion Vertex',
        type: 'range',
        min: 1,
        max: 100,
        step: 1,
        default: 10,
        default_animate: 20,
        transformation: 'none',
        dataType: 'props',
        type_value: 'int',
    },
    // primitive
    sideLength: {
        animable: true,
        name: 'sideLength',
        label: 'Side Length',
        type: 'multiple-range',
        min: 0.01,
        max: 100,
        step: 0.1,
        default: 10,
        default_animate: 20,
        transformation: 'scene-size-percentage',
        dataType: 'props',
    },
    // polygon
    sideNumber: {
        animable: true,
        name: 'sideNumber',
        label: 'Side Number',
        type: 'range',
        min: 1,
        max: 20,
        step: 1,
        default: 5,
        default_animate: 2,
        transformation: 'none',
        dataType: 'props',
    },
    // rose
    n: {
        animable: true,
        name: 'n',
        label: 'n',
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        default: 1,
        default_animate: 3,
        transformation: 'none',
        dataType: 'props',
    },
    d: {
        animable: true,
        name: 'd',
        label: 'd',
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        default: 2,
        default_animate: 4,
        transformation: 'none',
        dataType: 'props',
    },
    // lissajous
    wx: {
        animable: true,
        name: 'wx',
        label: 'wx',
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        default: 1,
        default_animate: 3,
        transformation: 'none',
        dataType: 'props',
    },
    wy: {
        animable: true,
        name: 'wy',
        label: 'wy',
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        default: 2,
        default_animate: 4,
        transformation: 'none',
        dataType: 'props',
    },
    wz: {
        animable: true,
        name: 'wz',
        label: 'wz',
        type: 'range',
        min: -360,
        max: 360,
        step: 1,
        default: 0,
        default_animate: 360,
        transformation: 'angle',
        dataType: 'props',
    },
    // spiral
    twists: {
        animable: true,
        name: 'twists',
        label: 'Twists',
        type: 'range',
        min: 1,
        max: 60,
        step: 0.1,
        default: 1,
        default_animate: 3,
        transformation: 'none',
        dataType: 'props',
    },
    twistsStart: {
        animable: true,
        name: 'twists_start',
        label: 'Twists start',
        type: 'range',
        min: 0,
        max: 60,
        step: 0.1,
        default: 0,
        default_animate: 1,
        transformation: 'none',
        dataType: 'props',
    },
    spiral: {
        name: 'spiral',
        label: 'Spiral type',
        type: 'select',
        options: OptionSpiralType,
        default: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral.types.ARCHIMEDE,
        transformation: 'none',
        dataType: 'props',
    },
    // supershape
    a: {
        animable: true,
        name: 'a',
        label: 'A',
        type: 'range',
        min: -5,
        max: 5,
        step: 0.1,
        default: 1,
        default_animate: 0.1,
        transformation: 'none',
        dataType: 'props',
    },
    b: {
        animable: true,
        name: 'b',
        label: 'B',
        type: 'range',
        min: -5,
        max: 5,
        step: 0.1,
        default: 1,
        default_animate: 0.1,
        transformation: 'none',
        dataType: 'props',
    },
    m: {
        animable: true,
        name: 'm',
        label: 'm',
        type: 'range',
        min: 1,
        max: 20,
        step: 1,
        default: 1,
        default_animate: 6,
        transformation: 'none',
        dataType: 'props',
        type_value: 'int',
    },
    n1: {
        animable: true,
        name: 'n1',
        label: 'n1',
        type: 'range',
        min: -3,
        max: 3,
        step: 0.01,
        default: 1,
        default_animate: 0.1,
        transformation: 'none',
        dataType: 'props',
    },
    n2: {
        animable: true,
        name: 'n2',
        label: 'n2',
        type: 'range',
        min: -3,
        max: 3,
        step: 0.01,
        default: 1,
        default_animate: 0.1,
        transformation: 'none',
        dataType: 'props',
    },
    n3: {
        animable: true,
        name: 'n3',
        label: 'n3',
        type: 'range',
        min: -3,
        max: 3,
        step: 0.01,
        default: 1,
        default_animate: 0.1,
        transformation: 'none',
        dataType: 'props',
    },
    // loop
    'loop.start': {
        name: 'loop.start',
        label: 'start',
        type: 'range',
        default: undefined,
        min: 0,
        max: 100,
        step: 0.01,
        transformation: 'none',
        dataType: 'props',
    },
    'loop.end': {
        name: 'loop.end',
        label: 'end',
        type: 'range',
        default: undefined,
        min: 0,
        max: 100,
        step: 0.01,
        transformation: 'none',
        dataType: 'props',
    },
    'loop.inc': {
        name: 'loop.inc',
        label: 'inc',
        type: 'range',
        default: undefined,
        min: 0.01,
        max: 100,
        step: 0.01,
        transformation: 'none',
        dataType: 'props',
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SceneChildUtilitiesData);
//# sourceMappingURL=SceneChildUtilitiesData.js.map

/***/ }),

/***/ "./dist/services/scene-utilities/SceneUtilities.js":
/*!*********************************************************!*\
  !*** ./dist/services/scene-utilities/SceneUtilities.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v1.js");
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _animation_Animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animation/Animation */ "./dist/services/animation/Animation.js");
/* harmony import */ var _SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SceneChildUtilitiesData */ "./dist/services/scene-utilities/SceneChildUtilitiesData.js");
/* harmony import */ var _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SceneUtilitiesExtended */ "./dist/services/scene-utilities/SceneUtilitiesExtended.js");





/**
 *
 * @category Services.Scene Utilities
 * @class SceneUtilities
 */
class SceneUtilities {
    constructor() {
        this.registeredSceneChilds = {};
        this.registeredSceneChilds = {
            Line: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Line,
            Triangle: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Triangle,
            Rect: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Rect,
            Polygon: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Polygon,
            Circle: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Circle,
            Rose: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Rose,
            Spiral: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral,
            Lissajous: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Lissajous,
            SuperShape: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.SuperShape,
            Group: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group,
            Shape: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape,
            ShapeRecursive: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeRecursive,
            ShapeLoop: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop,
            ShapeBuffer: _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer,
        };
    }
    //#region Register scene child
    /**
     * Return a list of name of registered sceneChild
     *
     * @returns {Array<string>}
     * @memberof SceneUtilities
     */
    getRegistered() {
        return Object.keys(this.registeredSceneChilds);
    }
    /**
     * Register scene child for fast creation
     *
     * @param {string} type
     * @param {SceneChildInstance} ref
     * @memberof SceneUtilities
     */
    register(type, ref) {
        if (!(type in this.registeredSceneChilds)) {
            this.registeredSceneChilds[type] = ref;
        }
        else {
            console.warn(`SceneUtilities: SceneChild "${type}" is already registered`);
        }
    }
    /**
     * unregister scene child
     *
     * @param {string} type
     * @memberof SceneUtilities
     */
    unregister(type) {
        if (type in this.registeredSceneChilds) {
            delete this.registeredSceneChilds[type];
        }
        else {
            console.warn(`SceneUtilities: SceneChild "${type}" is not registered`);
        }
    }
    //#endregion
    //#region Scene manipulation
    /**
     * Logic creation of a SceneChild
     * Since scene is not passed, name are set if they are present in args or type
     *
     *
     * @param {(string | SceneChild)} item
     * @param {TSceneChildUtilitiesSettings} [setting]
     * @param {Scene} [scene]
     * @returns {(SceneChild | null)}
     * @memberof SceneUtilities
     */
    create(item, settings, scene) {
        var _a;
        scene = scene ? scene : typeof item !== 'string' ? item.scene : undefined;
        if (item instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.SceneChild) {
            this.getChildren(item).forEach(child => this.create(child, undefined, scene));
            return item;
        }
        if (item in this.registeredSceneChilds) {
            if (!settings)
                settings = {};
            settings.id = settings.id || (0,uuid__WEBPACK_IMPORTED_MODULE_4__.default)();
            if (!settings.name && scene)
                settings.name = item + '_' + (this.getCountSceneChildOfType(scene, item) + 1);
            if (!settings.data)
                settings.data = {};
            if (!('props' in settings.data))
                settings.data.props = {};
            if (!('style' in settings.data))
                settings.data.style = {};
            if (!('visible' in settings.data))
                settings.data.visible = true;
            // if (!('highlighted' in settings.data)) settings.data.highlighted = false
            // if (!('disableGhost' in settings.data)) settings.data.disableGhost = false
            // if (item === 'ShapeLoop') {
            // 	if (!('loop' in settings)) settings.loop = { start: 0, end: Math.PI * 2, inc: (Math.PI * 2) / 20 }
            // }
            const sceneChild = new this.registeredSceneChilds[item](settings);
            if (sceneChild && scene && this.isAPrimitive(sceneChild)) {
                this.set(sceneChild, 'sideLength', { type: 'transformable-prop', value: (_a = _SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_2__.default.sideLength) === null || _a === void 0 ? void 0 : _a.default }, scene);
                // this.setProp(
                // 	sceneChild,
                // 	'sideLength',
                // 	{ type: 'transformable-prop', value: SceneChildUtilitiesData.sideLength?.default },
                // 	scene
                // )
            }
            this.getChildren(sceneChild).forEach(child => this.create(child));
            return sceneChild;
        }
        console.warn(`SceneUtilities: Creation failed. SceneChild "${item}" is not registered`);
        return null;
    }
    /**
     * Return number of element from a type
     *
     * @param {Scene} scene
     * @param {string} type
     * @returns {number}
     * @memberof SceneUtilities
     */
    getCountSceneChildOfType(scene, type) {
        let count = 0;
        _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Scene.walk(sceneChild => {
            count += sceneChild.type == type ? 1 : 0;
        }, scene);
        return count;
    }
    /**
     * Return a copy of sceneChild
     *
     * @param {SceneChild} sceneChild
     * @param {Scene} [scene]
     * @param {boolean} [strict]
     * @returns {(SceneChild | null)}
     * @memberof SceneUtilities
     */
    copy(sceneChild, scene, strict = false) {
        // copy only props, without name, id
        const setting = sceneChild.getProps();
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBase) {
            setting.bUseParent = sceneChild.bUseParent;
            setting.bUseRecursion = sceneChild.bUseRecursion;
        }
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer) {
            setting.shape = sceneChild.shape;
            setting.adaptMode = sceneChild.adaptMode;
        }
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapePrimitive) {
            setting.bClosed = sceneChild.bClosed;
            setting.vertexCallback = sceneChild.vertexCallback;
        }
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop) {
            setting.loopDependencies = sceneChild.loopDependencies;
        }
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop) {
            setting.loopDependencies = sceneChild.loopDependencies;
        }
        if (strict) {
            setting.id = sceneChild.id;
            setting.name = sceneChild.name;
            setting.order = sceneChild.order;
            setting.data = JSON.parse(JSON.stringify(sceneChild.data || {}));
        }
        const copied = this.create(sceneChild.type, setting, scene);
        if (copied) {
            if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group) {
                sceneChild.getChildren().forEach((child) => {
                    const copiedChild = this.copy(child, scene);
                    copiedChild && copied.add(copiedChild);
                });
            }
            else if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape && copied instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape && sceneChild.shape) {
                const copiedShape = this.copy(sceneChild.shape, scene);
                copiedShape && (copied.shape = copiedShape);
            }
            else if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer && copied instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer && sceneChild.shape) {
                copied.setShape(new Float32Array(sceneChild.shape));
            }
            return copied;
        }
        console.warn(`SceneUtilities: Copy failed.`, sceneChild);
        return null;
    }
    /**
     * Add scene child to parent.
     * Create a group if parent is Shape and has one element (not Group) inside.
     *
     * @param {(SceneChild | Scene)} parent
     * @param {(string | SceneChild)} sceneChild
     * @param {TSceneChildUtilityProps} [props]
     * @param {Scene} [scene]
     * @returns {(SceneChild | null)}
     * @memberof SceneUtilities
     */
    add(parent, sceneChild, settings, scene) {
        let newSceneChild = null;
        if (parent instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group || parent instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Scene) {
            newSceneChild = this.create(sceneChild, settings, scene);
            newSceneChild && parent.add(newSceneChild);
        }
        else if (parent instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape) {
            if (parent.shape == undefined) {
                newSceneChild = this.create(sceneChild, settings, scene);
                newSceneChild && parent.setShape(newSceneChild);
            }
            else if (parent.shape instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBase) {
                newSceneChild = this.create(sceneChild, settings, scene);
                if (newSceneChild) {
                    const newGroup = this.create('Group', undefined, scene);
                    const sibling = parent.shape;
                    this.remove(parent, sibling);
                    parent.setShape(newGroup);
                    newGroup.add(sibling);
                    newGroup.add(newSceneChild);
                }
            }
            else if (parent.shape instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group) {
                this.add(parent.shape, sceneChild, undefined, scene);
            }
        }
        return newSceneChild;
    }
    /**
     * Remove scene child from
     *
     * @param {SceneChild} from
     * @param {SceneChild} [item]
     * @memberof SceneUtilities
     */
    remove(from, item) {
        if (!item) {
            // 'from' as item to remove
            if (from.scene) {
                const parent = this.getParent(from);
                !parent ? from.scene.removeFromId(from.id) : this.remove(parent, from);
            }
            else {
                console.warn(`SceneUtilities: Remove failed. SceneChild is not added into scene`, from);
            }
        }
        else {
            if (from instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group)
                from.removeFromId(item.id);
            else if (from instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape)
                from.setShape(undefined);
        }
    }
    //#endregion
    //#region Scene parent and children
    /**
     * Get Root parent
     *
     * @param {SceneChild} sceneChild
     * @returns {(SceneChild | null)}
     * @memberof SceneUtilities
     */
    getRootParent(sceneChild) {
        const parents = this.getParents(sceneChild);
        return parents.length > 0 ? parents[0] : null;
    }
    /**
     * Get first level parent
     *
     * @param {SceneChild} sceneChild
     * @returns {(SceneChild | null)}
     * @memberof SceneUtilities
     */
    getParent(sceneChild) {
        const parents = this.getParents(sceneChild);
        return parents.length > 0 ? parents[parents.length - 1] : null;
    }
    /**
     * Get all parents
     *
     * @param {SceneChild} sceneChild
     * @returns {Array<SceneChild>}
     * @memberof SceneUtilities
     */
    getParents(sceneChild) {
        return sceneChild && sceneChild.scene ? sceneChild.scene.getParentsOfSceneChild(sceneChild) : [];
    }
    /**
     * Return children of a shape.
     * Only Group has array of children, Shape has only one child.
     *
     * @param {SceneChild} sceneChild
     * @returns {Array<SceneChild>}
     * @memberof SceneUtilities
     */
    getChildren(sceneChild) {
        if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group)
            return sceneChild.getChildren();
        return sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape && sceneChild.shape ? [sceneChild.shape] : [];
    }
    /**
     * Return only primitive children
     *
     * @param {SceneChild} sceneChild
     * @returns {Array<SceneChild>}
     * @memberof SceneUtilities
     */
    getChildrenPrimitives(sceneChild) {
        let result = [];
        const children = this.getChildren(sceneChild);
        for (let i = 0, len = children.length; i < len; i++) {
            if (children[i] instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapePrimitive)
                result.push(children[i]);
            else
                result = result.concat(...this.getChildrenPrimitives(children[i]));
        }
        return result;
    }
    /**
     * Return a list of neighbors
     *
     * @param {SceneChild} sceneChild
     * @returns {(Array<SceneChild>)}
     * @memberof SceneUtilities
     */
    getNeighbors(sceneChild) {
        if (sceneChild.scene) {
            const parent = this.getParent(sceneChild);
            return parent == null ? sceneChild.scene.getChildren() : this.getChildren(parent);
        }
        return [];
    }
    /**
     * Return a number of element type into a scene
     *
     * @param {Scene} scene
     * @param {string} type
     * @returns {number}
     * @memberof SceneUtilities
     */
    getCountOfSceneChildType(scene, type) {
        let count = 0;
        _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Scene.walk(sceneChild => {
            count += sceneChild.type == type ? 1 : 0;
        }, scene);
        return count;
    }
    // /**
    //  * Walk through sceneChild
    //  *
    //  * @param {SceneChild} sceneChild
    //  * @param {(child: SceneChild) => void} callback
    //  * @memberof SceneUtilities
    //  */
    // walk(sceneChild: SceneChild, callback: (child: SceneChild) => void) {
    // 	callback(sceneChild)
    // 	this.getChildren(sceneChild).forEach(child => callback(child))
    // }
    //#endregion
    //#region checker
    /**
     * Check sceneChild is Group
     *
     * @param {SceneChild} sceneChild
     * @returns {boolean}
     * @memberof SceneUtilities
     */
    isGroup(sceneChild) {
        return sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group;
    }
    /**
     * Check sceneChild are Shape and has a child
     *
     * @param {SceneChild} sceneChild
     * @returns {boolean}
     * @memberof SceneUtilities
     */
    hasShapeChild(sceneChild) {
        return sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape ? sceneChild.shape !== undefined : false;
    }
    /**
     * Check sceneChild is a ShapeBuffer an are binded
     *
     * @param {SceneChild} sceneChild
     * @returns {boolean}
     * @memberof SceneUtilities
     */
    hasShapeBuffer(sceneChild) {
        return sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer;
    }
    /**
     * Check scene child is a Primitive
     *
     * @param {SceneChild} sceneChild
     * @returns {boolean}
     * @memberof SceneUtilities
     */
    isAPrimitive(sceneChild) {
        return sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapePrimitive;
    }
    /**
     * Check scene child is a ShapeLoop
     *
     * @param {SceneChild} sceneChild
     * @returns {boolean}
     * @memberof SceneUtilities
     */
    hasLoop(sceneChild) {
        return sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop;
    }
    //#endregion
    set(sceneChild, name, value, scene) {
        switch (_SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_2__.default[name].dataType) {
            case 'props':
                return this.setProp(sceneChild, name, value, scene);
            case 'drawer':
                return this.setDrawerProp(sceneChild, name, value, scene);
            case 'settings':
                return this.setSetting(sceneChild, name, value, scene);
        }
    }
    /**
     * Set prop: convert animation or transformable props
     *
     * @static
     * @param {SceneChild} sceneChild
     * @param {TSceheChildUtilityPropValue} value
     * @param {Scene} scene
     * @memberof SceneUtilities
     */
    setProp(sceneChild, name, value, scene) {
        if (typeof sceneChild.data === 'undefined') {
            sceneChild.data = { props: {} };
        }
        else if (typeof sceneChild.data.props === 'undefined') {
            sceneChild.data.props = {};
        }
        sceneChild.clearBuffer(true, true);
        // Check LoopAnimation
        if (name === 'loop') {
            if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop && _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bValueLoop(value)) {
                const shapeLoopAnimation = value;
                sceneChild.data.props.loop = value;
                sceneChild.setProp('loop', _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.composeLoop(shapeLoopAnimation));
                // Set loopDependencies
                const dynamic = shapeLoopAnimation.dynamyc;
                const realDynamic = sceneChild.loopDependencies.indexOf('propArguments') >= 0;
                if (dynamic !== realDynamic) {
                    const dependencies = [...sceneChild.loopDependencies];
                    if (dynamic)
                        !(dependencies.indexOf('propArguments') >= 0) && dependencies.push('propArguments');
                    else
                        dependencies.indexOf('propArguments') >= 0 && dependencies.splice(dependencies.indexOf('propArguments', 1));
                    sceneChild.loopDependencies = dependencies;
                }
            }
            return;
        }
        // Check Animation
        if (_SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bValueAnimation(value)) {
            sceneChild.data.props[name] = value;
            sceneChild.setProp(name, _animation_Animation__WEBPACK_IMPORTED_MODULE_1__.default.composeAnimation(scene, name, value));
            return;
        }
        // Check Transormable prop
        if (_SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bPropInSceneChildUtilitiesData(name) &&
            _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bValueTransformable(value)) {
            sceneChild.data.props[name] = value;
            sceneChild.setProp(name, _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.getTransformedValue(scene, name, value));
            return;
        }
        // Otherwise, set prop without transformation
        //Equivalent of: if (name in SceneChildPropsData && SceneChildPropsData[name].transformation !== 'none')
        sceneChild.setProp(name, value, true);
        delete sceneChild.data.props[name];
        // Not set to data because exporter override sceneChild.data.props on sceneChild.props (default)
        //sceneChild.data.props[name] = value
    }
    /**
     * Set prop, convert raw function, animation on transformable prop
     *
     * @static
     * @param {SceneChild} sceneChild
     * @param {TDrawerPropsExtendedKeys} name
     * @param {*} value
     * @param {Scene} scene
     * @memberof SceneUtilities
     */
    setDrawerProp(sceneChild, name, value, scene) {
        if (this.isAPrimitive(sceneChild)) {
            if (typeof sceneChild.data === 'undefined') {
                sceneChild.data = { style: {} };
            }
            else if (typeof sceneChild.data.style === 'undefined') {
                sceneChild.data.style = {};
            }
            if (_SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bValueAnimation(value)) {
                sceneChild.data.drawer[name] = value;
                sceneChild.drawer[name] = _animation_Animation__WEBPACK_IMPORTED_MODULE_1__.default.composeAnimation(scene, name, value);
                return;
            }
            // Check Transormable prop
            if (_SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bPropInSceneChildUtilitiesData(name) &&
                _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bValueTransformable(value)) {
                sceneChild.data.style[name] = value;
                sceneChild.style[name] = _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.getTransformedValue(scene, name, value);
                return;
            }
            // Otherwise, set prop without transformation
            //Equivalent of: if (name in SceneChildPropsData && SceneChildPropsData[name].transformation !== 'none')
            // @ts-ignore
            sceneChild.style[name] = value;
            delete sceneChild.data.style[name];
        }
    }
    /**
     * TODO:
     * Set Args (props, drawer, other settings)
     * SceneChildPropData refactoring
     */
    setSetting(sceneChild, name, value, scene) {
        sceneChild.clearBuffer(true, true);
        if (name === 'vertexCallback') {
            if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBase && _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.bValueVertexCallback(value)) {
                sceneChild.data.vertexCallback = value;
                sceneChild.vertexCallback = _SceneUtilitiesExtended__WEBPACK_IMPORTED_MODULE_3__.default.composeVertexCallback(value);
                // If shape is static vertexCallback has no effect
                // sceneChild.bUseParent = true
            }
            return;
        }
        switch (name) {
            case 'bUseParent':
                if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBase)
                    sceneChild.bUseParent = value;
                break;
            case 'bUseRecursion':
                if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBase)
                    sceneChild.bUseRecursion = value;
                break;
            case 'bClosed':
                if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapePrimitive)
                    sceneChild.setClosed(value);
                break;
            case 'adaptMode':
                if (sceneChild instanceof _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer)
                    sceneChild.adapt(value);
                break;
            default:
                if (typeof sceneChild[name] !== 'undefined') {
                    //@ts-ignore
                    sceneChild[name] = value;
                }
                break;
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new SceneUtilities());
//# sourceMappingURL=SceneUtilities.js.map

/***/ }),

/***/ "./dist/services/scene-utilities/SceneUtilitiesExtended.js":
/*!*****************************************************************!*\
  !*** ./dist/services/scene-utilities/SceneUtilitiesExtended.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SceneChildUtilitiesData */ "./dist/services/scene-utilities/SceneChildUtilitiesData.js");


/**
 *
 * @category Services.Scene Utilities
 * @class SceneUtilitiesExtended
 */
class SceneUtilitiesExtended {
    //#region ShapeLoop
    static bValueLoop(value) {
        return (typeof value === 'object' &&
            'start' in value &&
            'end' in value &&
            'inc' in value &&
            'vertex' in value &&
            value.vertex.raw &&
            value.vertex.raw.length > 0);
    }
    static bValueVertexCallback(value) {
        return value && value.raw && value.raw.length > 0;
    }
    static composeVertexCallback(value) {
        if (value && value.raw) {
            const vertexCallback = new Function('vertex', 'vertexRepetition', SceneUtilitiesExtended.RAW_ARGUMENTS, `return ${value.raw}`);
            return vertexCallback;
        }
    }
    static composeLoop(loop) {
        const vertex = loop.vertex.raw
            ? new Function('shapeLoopRepetition', SceneUtilitiesExtended.RAW_ARGUMENTS, `return ${loop.vertex.raw}`)
            : undefined;
        //Todo: number -> resolve function
        return {
            start: loop.start,
            end: loop.end,
            inc: loop.inc,
            vertex,
        };
    }
    //#endregion
    // static getRandomFunctionForProp(name): (rand: number) => any {
    //     const prop: ISceneChildProp = UISceneChildUtilitiesStatic.sceneChildProps[name]
    //     switch (prop.type)
    //     {
    //         case 'multiple-range': case 'range': case 'slider':
    //             return (rand: number) => {
    //                 const min = prop.min as number / 2
    //                 const max = prop.max as number / 2
    //                 const value = min + ((max - min) * rand)
    //                 return prop.bAngle ? toRadians(value) : value
    //             }
    //         case 'color':
    //             return (rand: number) => `hsl(${Math.floor(360 * rand)}, ${Math.floor(25 + 75 * rand)}%, ${Math.floor(25 + 75 * rand)}%)`
    //         default:
    //             return (rand: number) => undefined
    //     }
    // }
    //#endregion
    //#region Props relative to drawer
    /**
     * Check value is TAnimation
     * @param value
     */
    static bValueAnimation(value) {
        return (value &&
            typeof value === 'object' &&
            value.type &&
            (value.type === 'simple' || value.type === 'raw') /*|| value.type == 'random'*/);
    }
    /**
     * Check value is TTransformableProp
     * @param value
     */
    static bValueTransformable(value) {
        return (value !== null &&
            typeof value === 'object' &&
            typeof value.type === 'string' &&
            value.type === 'transformable-prop');
    }
    /**
     * Check the prop need transformation when set
     * @param name
     */
    static bPropInSceneChildUtilitiesData(name) {
        return (typeof _SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_1__.default[name] !== 'undefined' && _SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_1__.default[name].transformation !== 'none');
    }
    /**
     * Transform value
     * @param scene
     * @param name
     * @param value
     */
    static getTransformedValue(scene, name, value) {
        const sceneChildProp = _SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_1__.default[name];
        if (SceneUtilitiesExtended.bPropInSceneChildUtilitiesData(name) &&
            SceneUtilitiesExtended.bValueTransformable(value)) {
            value = value.value;
            const sceneX = name === 'distance' ? scene.height : scene.width;
            const sceneY = name === 'distance' ? scene.width : scene.height;
            switch (sceneChildProp.transformation) {
                case 'angle':
                    if (Array.isArray(value)) {
                        return [(0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toRadians)(value[0]), (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toRadians)(value[1])];
                    }
                    return (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toRadians)(value);
                case 'scene-size-percentage': {
                    if (typeof scene !== 'undefined') {
                        if (Array.isArray(value)) {
                            return [(value[0] * sceneX) / 100, (value[1] * sceneY) / 100];
                        }
                        return (value * (scene.center[0] + scene.center[1])) / 100;
                    }
                    break;
                }
                case 'scene-size-percentage-inverse': {
                    if (typeof scene !== 'undefined') {
                        if (Array.isArray(value)) {
                            return [(value[0] * 100) / sceneX, (value[1] * 100) / sceneY];
                        }
                        return (value * 100) / (scene.center[0] + scene.center[1]);
                    }
                    break;
                }
            }
        }
        return value;
    }
    /**
     * Transform value inverse
     * @param scene
     * @param name
     * @param value
     */
    static getTransformedValueInverse(scene, name, value) {
        const sceneChildProp = _SceneChildUtilitiesData__WEBPACK_IMPORTED_MODULE_1__.default[name];
        if (SceneUtilitiesExtended.bPropInSceneChildUtilitiesData(name) &&
            SceneUtilitiesExtended.bValueTransformable(value)) {
            value = value.value;
            const sceneX = name === 'distance' ? scene.height : scene.width;
            const sceneY = name === 'distance' ? scene.width : scene.height;
            switch (sceneChildProp.transformation) {
                case 'angle': {
                    if (Array.isArray(value)) {
                        return [(0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toDegrees)(value[0]), (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toDegrees)(value[1])];
                    }
                    return (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toDegrees)(value);
                }
                case 'scene-size-percentage': {
                    if (typeof scene !== 'undefined') {
                        if (Array.isArray(value)) {
                            return [(value[0] * 100) / sceneX, (value[1] * 100) / sceneY];
                        }
                        return (value * 100) / (scene.center[0] + scene.center[1]);
                    }
                    break;
                }
                case 'scene-size-percentage-inverse': {
                    if (typeof scene !== 'undefined') {
                        if (Array.isArray(value)) {
                            return [(value[0] * sceneX) / 100, (value[1] * sceneY) / 100];
                        }
                        return (value * (scene.center[0] + scene.center[1])) / 100;
                    }
                    break;
                }
            }
        }
        return value;
    }
}
SceneUtilitiesExtended.RAW_ARGUMENTS = '{ repetition, recursion, shape }';
SceneUtilitiesExtended.RAW_ARGUMENTS_WITH_PARENT = '{ repetition, recursion, shape, parent }';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SceneUtilitiesExtended);
//# sourceMappingURL=SceneUtilitiesExtended.js.map

/***/ }),

/***/ "./dist/services/timeline/Timeline.js":
/*!********************************************!*\
  !*** ./dist/services/timeline/Timeline.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _events_Emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../events/Emitter */ "./dist/services/events/Emitter.js");


/**
 * Is used for sequence time management.
 * It is necessary to set the duration and the number of frames per second (frame rate).
 *
 * @category Services.Timeline
 * @class Timeline
 * @extends {Emitter<ITimelineEvents>}
 */
class Timeline extends _events_Emitter__WEBPACK_IMPORTED_MODULE_1__.default {
    constructor(duration = 60000, framerate = 60) {
        super();
        this.fps_samples_size = 30;
        this.fps_samples = [];
        this.fps_samples_index = 0;
        this.paused_time = 0;
        this.sequence = {
            duration,
            framerate,
            frames: Math.round((duration / 1000) * framerate),
        };
        this.tick_time = 1000 / this.sequence.framerate;
        this.fps = this.sequence.framerate;
        this.b_sequence_started = false;
        this.current_frame = 0;
        this.current_time = 0;
        this.last_tick = 0;
        this.start_time = 0;
    }
    //#region sequence meta
    /**
     * Return the sequence
     *
     * @returns {Sequence}
     */
    getSequence() {
        return Object.assign({}, this.sequence);
    }
    /**
     * Set Sequence
     *
     * @param {number} duration
     * @param {number} framerate
     */
    setSequence(duration, framerate) {
        this.sequence.duration = duration;
        this.sequence.framerate = framerate;
        this.tick_time = 1000 / this.sequence.framerate;
        this.sequence.frames = Math.round((this.sequence.duration / 1000) * this.sequence.framerate);
        this.dispatch('timeline:update_sequence', this.getSequence());
    }
    /**
     * Set duration of timeline
     *
     * @param {number} framerate
     */
    setDuration(duration) {
        this.setSequence(duration, this.sequence.framerate);
    }
    /**
     * Get timeline duration
     *
     * @returns {number}
     */
    getDuration() {
        return this.sequence.duration;
    }
    /**
     * Return framerate
     *
     * @returns {number}
     */
    getFramerate() {
        return this.sequence.framerate;
    }
    /**
     * Set a framerate
     *
     * @param {number} framerate
     */
    setFramerate(framerate) {
        this.setSequence(this.sequence.duration, framerate);
    }
    /**
     * Get number of frames based on duration and framerate
     *
     * @returns {number}
     */
    getFramesCount() {
        return this.sequence.frames;
    }
    //#endregion meta
    //#region change status
    bSequenceStarted() {
        return this.b_sequence_started;
    }
    /**
     * Start the sequence
     *
     */
    start() {
        if (!this.b_sequence_started) {
            this.b_sequence_started = true;
            this.start_time = this.paused_time;
            this.dispatch('timeline:change_status', Timeline.START);
        }
    }
    /**
     * Pause the sequence
     *
     */
    pause() {
        if (this.b_sequence_started) {
            this.paused_time = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now)();
            this.b_sequence_started = false;
            this.dispatch('timeline:change_status', Timeline.PAUSE);
        }
    }
    /**
     * Stop the sequence and reset
     *
     */
    stop() {
        if (this.b_sequence_started) {
            this.b_sequence_started = false;
            this.current_time = 0;
            this.current_frame = 0;
            this.start_time = 0;
            this.paused_time = 0;
            this.dispatch('timeline:change_status', Timeline.STOP);
        }
    }
    /**
     * Animation tick
     *
     * @param {number} timestamp current timestamp
     * @returns {boolean}
     */
    tick(timestamp) {
        if (this.b_sequence_started) {
            if (!this.start_time) {
                this.start_time = timestamp;
                this.last_tick = -this.tick_time;
            }
            const currentTime = timestamp - this.start_time;
            const elapsed = currentTime - this.last_tick;
            if (elapsed >= this.tick_time) {
                this.calculateFPS(1 / (elapsed / 1000));
                this.last_tick = currentTime;
                this.current_time = (currentTime - (elapsed % this.tick_time)) % this.sequence.duration;
                this.current_frame = this.getFrameAtTime(this.current_time);
                this.dispatch('timeline:progress', {
                    current_frame: this.current_frame,
                    current_time: this.current_time,
                    fps: this.fps,
                });
                return true;
            }
        }
        return false;
    }
    /**
     * Calculate fps
     *
     * @private
     * @param {number} currentFPS
     */
    calculateFPS(currentFPS) {
        const samples = this.fps_samples.length;
        if (samples > 0) {
            let average = 0;
            for (let i = 0; i < samples; i++)
                average += this.fps_samples[i];
            this.fps = Math.round(average / samples);
        }
        this.fps_samples[this.fps_samples_index] = Math.round(currentFPS);
        this.fps_samples_index = (this.fps_samples_index + 1) % this.fps_samples_size;
    }
    //#endregion
    //#region Frame and Time
    /**
     * Return current animation frame
     *
     * @returns {number}
     */
    getCurrentFrame() {
        return this.current_frame;
    }
    /**
     * get the time at specific frame number
     *
     * @param {number} frame
     * @returns {number}
     */
    getFrameTime(frame) {
        frame = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.pmod)(frame, this.sequence.frames);
        return (frame * this.tick_time) % this.sequence.duration;
    }
    /**
     * Return frame number at time
     *
     * @param {number} time
     * @returns {number}
     */
    getFrameAtTime(time) {
        return Math.round((time % this.sequence.duration) / this.tick_time);
    }
    /**
     * set current frame
     *
     * @param {number} frame
     */
    setFrame(frame) {
        this.current_frame = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.pmod)(frame, this.sequence.frames);
        this.current_time = this.getFrameTime(this.current_frame);
        this.dispatch('timeline:progress', {
            current_frame: this.current_frame,
            current_time: this.current_time,
            fps: this.fps,
        });
    }
    /**
     * Return tick time (based on framerate)
     *
     * @returns {number}
     */
    getTickTime() {
        return this.tick_time;
    }
    /**
     * Return the current time
     *
     * @returns {number}
     */
    getTime() {
        return this.current_time;
    }
    /**
     * Set animation at time
     *
     * @param {number} time
     */
    setTime(time) {
        time = (0,_urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.pmod)(time, this.sequence.duration);
        this.current_time = time;
        this.current_frame = this.getFrameAtTime(time);
        this.dispatch('timeline:progress', {
            current_frame: this.current_frame,
            current_time: this.current_time,
            fps: this.fps,
        });
    }
}
/**
 * Animation status started
 * @internal
 */
Timeline.START = 'start';
/**
 * Animation status paused
 * @internal
 */
Timeline.PAUSE = 'pause';
/**
 * Animation status stop
 * @internal
 */
Timeline.STOP = 'stop';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Timeline);
//# sourceMappingURL=Timeline.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/Group.js":
/*!****************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/Group.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Group": () => (/* binding */ Group)
/* harmony export */ });
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Scene */ "./node_modules/@urpflanze/core/dist/Scene.js");
/* harmony import */ var _SceneChild__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SceneChild */ "./node_modules/@urpflanze/core/dist/SceneChild.js");
/* harmony import */ var _shapes_ShapeBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shapes/ShapeBase */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBase.js");
/* harmony import */ var _math_bounding__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./math/bounding */ "./node_modules/@urpflanze/core/dist/math/bounding.js");




/**
 * A SceneChild container, propagates properties to children
 *
 * @order 3
 * @category Core.Scene
 * @extends {SceneChild}
 * @example
 * ```javascript
 * // Group example
 *
 * const rect = new Urpflanze.Rect({
 * 	distance: 100 // <- if a property is set the group will not overwrite it
 * })
 * const group = new Urpflanze.Group({
 * 	repetitions: 3,
 * 	distance: 200
 * })
 *
 * group.add(rect)
 * group.add(new Urpflanze.Triangle())
 * ```
 * @class Group
 */
class Group extends _SceneChild__WEBPACK_IMPORTED_MODULE_1__.SceneChild {
    /**
     * Creates an instance of Group
     *
     * @param {ISceneChildSettings} [settings={}]
     * @memberof Group
     */
    constructor(settings = {}) {
        settings.type = 'Group';
        super(settings);
        this.children = [];
        ['id', 'name', 'data', 'order', 'type'].forEach((prop) => {
            if (prop in settings)
                delete settings[prop];
        });
        this.props = settings;
    }
    /**
     * Check group has static children
     *
     * @returns {boolean}
     * @memberof Group
     */
    isStatic() {
        const children = this.children;
        for (let i = 0, len = children.length; i < len; i++)
            if (!children[i].isStatic())
                return false;
        return true;
    }
    /**
     * Check group has static children indexed
     *
     * @returns {boolean}
     * @memberof Group
     */
    isStaticIndexed() {
        const children = this.children;
        for (let i = 0, len = children.length; i < len; i++)
            if (!children[i].isStaticIndexed())
                return false;
        return true;
    }
    /**
     * Add item to Group
     *
     * @param {Array<SceneChild>} items
     * @memberof Group
     */
    add(...items) {
        for (let i = 0, len = items.length; i < len; i++) {
            const item = items[i];
            const rawItemProps = item.getProps();
            Object.keys(this.props).forEach((propKey) => {
                if (typeof rawItemProps[propKey] === 'undefined')
                    item.setProp(propKey, this.props[propKey]);
            });
            item.order =
                typeof item.order !== 'undefined'
                    ? item.order
                    : this.children.length > 0
                        ? Math.max.apply(this, this.children.map(e => e.order || 0)) + 1
                        : 0;
            this.scene && _Scene__WEBPACK_IMPORTED_MODULE_0__.Scene.propagateToChilden(item, this.scene);
            this.children.push(item);
        }
        this.sortChildren();
    }
    /**
     * Sort children
     *
     * @memberof Group
     */
    sortChildren() {
        this.children.sort((a, b) => a.order - b.order);
        this.children = this.children.map((child, index) => {
            child.order = index;
            return child;
        });
        this.clearBuffer(true);
    }
    /**
     * Return shape children
     *
     * @returns {Array<SceneChild>}
     * @memberof Group
     */
    getChildren() {
        return this.children;
    }
    /**
     * Find scene child from id or name
     *
     * @param {number | string} idOrName
     * @returns {(SceneChild | null)}
     * @memberof Group
     */
    find(idOrName) {
        if (this.id === idOrName || this.name === idOrName)
            return this;
        const children = this.getChildren();
        for (let i = 0, len = children.length; i < len; i++) {
            const result = children[i].find(idOrName);
            if (result !== null)
                return result;
        }
        return null;
    }
    /**
     * Get item from group
     *
     * @param {number} index
     * @returns {(SceneChild | null)}
     * @memberof Group
     */
    get(index) {
        return index >= 0 && index < this.children.length ? this.children[index] : null;
    }
    /**
     * Remove item from group
     *
     * @param {number} index
     * @returns {(false | Array<SceneChild>)}
     * @memberof Group
     */
    remove(index) {
        if (index >= 0 && index < this.children.length) {
            const removed = this.children.splice(index, 1);
            this.clearBuffer(true);
            return removed;
        }
        return false;
    }
    /**
     * Remove from id
     *
     * @param {number} id
     * @memberof Scene
     */
    removeFromId(id) {
        for (let i = 0, len = this.children.length; i < len; i++) {
            if (this.children[i].id == id) {
                this.children.splice(i, 1);
                return this.clearBuffer(true);
            }
        }
    }
    /**
     * Generate children buffers
     *
     * @param {number} generateId
     * @param {boolean} [bDirectSceneChild=false]
     * @param {ISceneChildPropArguments} [parentPropArguments]
     * @memberof Group
     */
    generate(generateId, bDirectSceneChild = false, parentPropArguments) {
        this.children.forEach(item => item.generate(generateId, bDirectSceneChild, parentPropArguments));
    }
    /**
     * Sum the children bounding
     *
     * @return {IShapeBounding}
     */
    getBounding() {
        const boundings = [];
        const bounding = _math_bounding__WEBPACK_IMPORTED_MODULE_3__.Bounding.empty();
        if (this.children.length > 0) {
            this.children.forEach(item => boundings.push(item.getBounding()));
            for (let i = 0, len = this.children.length; i < len; i++) {
                bounding.x = bounding.x > boundings[i].x ? boundings[i].x : bounding.x;
                bounding.y = bounding.y > boundings[i].y ? boundings[i].y : bounding.y;
                bounding.width = bounding.width < boundings[i].width ? boundings[i].width : bounding.width;
                bounding.height = bounding.height < boundings[i].height ? boundings[i].height : bounding.height;
            }
            bounding.cx = bounding.x + bounding.width / 2;
            bounding.cy = bounding.y + bounding.height / 2;
        }
        return bounding;
    }
    /**
     * Chear children buffer
     *
     * @param {boolean} [bClearIndexed=false]
     * @param {boolean} [bPropagateToParents=false]
     * @memberof Group
     */
    clearBuffer(bClearIndexed = false, bPropagateToParents = true) {
        this.children.forEach(item => item.clearBuffer(bClearIndexed, false));
        if (this.scene && bPropagateToParents) {
            const parents = this.scene.getParentsOfSceneChild(this);
            parents.length > 0 && parents[parents.length - 1].clearBuffer(bClearIndexed, bPropagateToParents /* true */);
        }
        // if (bPropagateToParents && this.scene)
        // {
        //     const parents = this.scene.getParentsOfSceneChild(this)
        //     parents.length > 0 && parents[parents.length - 1].clearBuffer(bClearIndexed, true, false)
        // }
        // if (bPropagateToChildren)
        // {
        //     this.children.forEach(sceneChild => sceneChild.clearBuffer(bClearIndexed, false, true))
        // }
    }
    /**
     * Set a single or multiple props
     *
     * @abstract
     * @param {(keyof ISceneChildProps | ISceneChildProps)} key
     * @param {*} [value]
     * @memberof SceneChild
     */
    setProp(key, value) {
        if (typeof key === 'object')
            Object.keys(key).forEach((k) => (this.props[k] = key[k]));
        else
            this.props[key] = value;
        this.children.forEach(item => item.setProp(key, value));
    }
    /**
     * Set a single or multiple props
     *
     * @param {(keyof ISceneChildProps | ISceneChildProps)} key
     * @param {*} [value]
     * @memberof ShapeBase
     */
    setPropUnsafe(key, value) {
        super.setPropUnsafe(key, value);
        this.children.forEach(item => item.setPropUnsafe(key, value));
    }
    /**
     * Return length of buffer
     *
     * @param {ISceneChildPropArguments} propArguments
     * @returns {number}
     * @memberof Group
     */
    getBufferLength(propArguments) {
        return this.children.map(sceneChild => sceneChild.getBufferLength(propArguments)).reduce((p, c) => p + c, 0);
    }
    /**
     * return a single buffer binded from children
     *
     * @returns {Float32Array}
     * @memberof Group
     */
    getBuffer() {
        const buffers = this.children
            .map(item => item.getBuffer())
            .filter(b => b !== undefined);
        const size = buffers.reduce((currLength, buffer) => currLength + buffer.length, 0);
        if (size > 0) {
            const result = new Float32Array(size);
            result.set(buffers[0], 0);
            for (let i = 1, offset = 0, len = buffers.length; i < len; i++) {
                offset += buffers[i - 1].length;
                result.set(buffers[i], offset);
            }
            return result;
        }
        return _shapes_ShapeBase__WEBPACK_IMPORTED_MODULE_2__.ShapeBase.EMPTY_BUFFER;
    }
    /**
     * return a single buffer binded from children
     *
     * @returns {(Array<IBufferIndex> | undefined)}
     * @memberof Group
     */
    getIndexedBuffer() {
        const indexed = this.children.map(item => item.getIndexedBuffer()).filter(b => b !== undefined);
        return [].concat.apply([], indexed);
    }
    /**
     * Call strem on children
     *
     * @param {(streamArguments: IStreamArguments) => void} callback
     * @memberof Group
     */
    stream(callback) {
        this.children.forEach(item => item.stream(callback));
    }
}

//# sourceMappingURL=Group.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/Scene.js":
/*!****************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/Scene.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scene": () => (/* binding */ Scene)
/* harmony export */ });
/* harmony import */ var _SceneChild__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SceneChild */ "./node_modules/@urpflanze/core/dist/SceneChild.js");
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Group */ "./node_modules/@urpflanze/core/dist/Group.js");
/* harmony import */ var _shapes_Shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shapes/Shape */ "./node_modules/@urpflanze/core/dist/shapes/Shape.js");



/**
 * Container for all SceneChild.
 * The main purpose is to manage the drawing order and update the child buffers
 *
 * @order 1
 * @category Core.Scene
 * @class Scene
 */
class Scene {
    /**
     * Creates an instance of Scene.
     * You can see the default values in the property definitions
     */
    constructor(settings = {}) {
        /**
         * Logical number, the drawer will take care of defining the unit of measure
         */
        this.width = 400;
        /**
         * Logical number, the drawer will take care of defining the unit of measure
         */
        this.height = 400;
        /**
         * Default background color (black)
         */
        this.background = 'hsla(0, 0%, 0%, 1)';
        /**
         * Default ScenePrimitive stroke color (white)
         */
        this.color = 'hsla(0, 0%, 100%, 1)';
        /**
         * Current time
         */
        this.currentTime = 0;
        if (typeof settings.width !== 'undefined')
            this.width = settings.width;
        if (typeof settings.height !== 'undefined')
            this.height = settings.height;
        if (typeof settings.background !== 'undefined')
            this.background = settings.background;
        if (typeof settings.color !== 'undefined')
            this.color = settings.color;
        this.children = [];
        this.center = [this.width / 2, this.height / 2];
    }
    /**
     * Return width percentage
     *
     * @param {number} [percentage=100]
     * @returns {number}
     */
    getWidth(percentage = 100) {
        return (this.width * percentage) / 100;
    }
    /**
     * Return height percentage
     *
     * @param {number} [percentage=100]
     * @returns {number}
     */
    getHeight(percentage = 100) {
        return (this.height * percentage) / 100;
    }
    /**
     * Resize the scene size
     *
     * @param {number} width
     * @param {number} [height=width]
     * @memberof Scene
     */
    resize(width, height = width) {
        this.width = width;
        this.height = height;
        this.center = [this.width / 2, this.height / 2];
        this.children.forEach(sceneChild => sceneChild.clearBuffer(true, false));
    }
    /**
     * Update all children, generate a streamable buffer for drawing
     *
     * @param {number} [atTime] time in ms
     * @memberof Scene
     */
    update(atTime) {
        this.currentTime = atTime;
        for (let i = 0, len = this.children.length; i < len; i++) {
            this.children[i].generate(this.currentTime, true);
        }
    }
    /**
     * Traverse the child buffer and use it with callback
     *
     * @param {(streamArguments: IStreamArguments) => void} callback
     * @memberof Scene
     */
    stream(callback) {
        this.children.forEach(sceneChild => sceneChild.stream(callback));
    }
    /*
     |--------------------------------------------------------------------------
     |  SceneChild
     |--------------------------------------------------------------------------
     */
    /**
     * Return a list of children
     *
     * @returns {Array<SceneChild>}
     * @memberof Scene
     */
    getChildren() {
        return this.children;
    }
    /**
     * Add SceneChild to Scene, pass `order` as last parameter for drawing priorities
     *
     * @param {Array<SceneChild>} items
     * @param {number} [order]
     * @memberof Scene
     */
    add(...items /**, order: number */) {
        const order = typeof items[items.length - 1] === 'number' ? items[items.length - 1] : undefined;
        const len = items.length - (typeof order === 'undefined' ? 0 : 1);
        for (let i = 0; i < len; i++) {
            const item = items[i];
            item.order =
                typeof order !== 'undefined'
                    ? order + i
                    : typeof item.order !== 'undefined'
                        ? item.order
                        : this.children.length > 0
                            ? Math.max.apply(this, this.children.map(e => e.order || 0)) + 1
                            : 0;
            Scene.propagateToChilden(item, this);
            this.children.push(item);
            item.clearBuffer(true, false);
        }
        this.sortChildren();
    }
    /**
     * Sort children by order
     *
     * @memberof Scene
     */
    sortChildren() {
        this.children.sort((a, b) => a.order - b.order);
        this.children = this.children.map((child, index) => {
            child.order = index;
            return child;
        });
    }
    /**
     * Find sceneChild from id or name in the whole scene
     *
     * @param {string | number} idOrName
     * @returns {(SceneChild | null)}
     * @memberof Scene
     */
    find(idOrName) {
        const children = this.getChildren();
        for (let i = 0, len = children.length; i < len; i++) {
            const result = children[i].find(idOrName);
            if (result !== null)
                return result;
        }
        return null;
    }
    /**
     * Get shape by index
     *
     * @param {number} index
     * @returns {(SceneChild | null)}
     * @memberof Scene
     */
    get(index) {
        return index >= 0 && index < this.children.length ? this.children[index] : null;
    }
    /**
     * Remove a shape by index
     *
     * @param {number} index
     * @memberof Scene
     */
    remove(index) {
        index >= 0 && index < this.children.length && this.children.splice(index, 1);
    }
    /**
     * Removes all children
     *
     * @memberof Scene
     */
    removeChildren() {
        this.children = [];
    }
    /**
     * Remove sceneChild by id or name
     *
     * @param {number | number} idOrName
     * @memberof Scene
     */
    removeFromId(idOrName) {
        for (let i = 0, len = this.children.length; i < len; i++)
            if (this.children[i].id === idOrName || this.children[i].name === idOrName) {
                this.children.splice(i, 1);
                return;
            }
    }
    /**
     * Return true if sceneChild is direct children
     *
     * @param {SceneChild} sceneChild
     * @returns {boolean}
     * @memberof Scene
     */
    isFirstLevelChild(sceneChild) {
        for (let i = 0, len = this.children.length; i < len; i++)
            if (this.children[i].id === sceneChild.id)
                return true;
        const parents = this.getParentsOfSceneChild(sceneChild);
        return parents.length === 1 && parents[0] instanceof _Group__WEBPACK_IMPORTED_MODULE_1__.Group;
    }
    /**
     * Returns the list of sceneChild hierarchy starting from the scene
     *
     * @param {SceneChild} sceneChild
     * @returns {Array<SceneChild>}
     * @memberof Scene
     */
    getParentsOfSceneChild(sceneChild) {
        const result = Scene.getParentsOfSceneChild(this, sceneChild);
        if (result) {
            result.splice(0, 1);
            return result;
        }
        return [];
    }
    /**
     * Returns the list of sceneChild hierarchy starting from the scene
     *
     * @static
     * @param {(Scene | SceneChild)} current
     * @param {SceneChild} sceneChild
     * @param {(Array<SceneChild | Scene>)} [parents=[]]
     * @returns {(Array<SceneChild | Scene> | null)}
     * @memberof Scene
     */
    static getParentsOfSceneChild(current, sceneChild, parents = []) {
        let result;
        if (current instanceof _SceneChild__WEBPACK_IMPORTED_MODULE_0__.SceneChild) {
            if (current.id == sceneChild.id)
                return parents;
            if (current instanceof _shapes_Shape__WEBPACK_IMPORTED_MODULE_2__.Shape && current.shape) {
                const tmpParents = parents.slice();
                tmpParents.push(current);
                if ((result = Scene.getParentsOfSceneChild(current.shape, sceneChild, tmpParents)))
                    return result;
            }
        }
        if (current instanceof Scene || current instanceof _Group__WEBPACK_IMPORTED_MODULE_1__.Group) {
            const children = current.getChildren();
            parents.push(current);
            for (let i = 0, len = children.length; i < len; i++) {
                const child = children[i];
                if ((result = Scene.getParentsOfSceneChild(child, sceneChild, parents)))
                    return result;
            }
            parents.pop();
        }
        return null;
    }
    /**
     * Walk through the scene
     *
     * @static
     * @param {SceneChild} callbackk
     * @param {(Scene | SceneChild)} current
     * @memberof Scene
     */
    static walk(callback, current) {
        if (current instanceof _SceneChild__WEBPACK_IMPORTED_MODULE_0__.SceneChild) {
            if (callback(current) === false)
                return false;
            if (current instanceof _shapes_Shape__WEBPACK_IMPORTED_MODULE_2__.Shape && current.shape)
                if (Scene.walk(callback, current.shape) === false)
                    return false;
        }
        if (current instanceof Scene || current instanceof _Group__WEBPACK_IMPORTED_MODULE_1__.Group) {
            const children = current.getChildren();
            for (let i = 0, len = children.length; i < len; i++) {
                const child = children[i];
                if (Scene.walk(callback, child) === false)
                    return false;
            }
        }
    }
    /**
     * Propagate scene to sceneChild (and children)
     *
     * @static
     * @param {SceneChild} sceneChild
     * @param {Scene} scene
     * @memberof Scene
     */
    static propagateToChilden(sceneChild, scene) {
        sceneChild.scene = scene;
        if (sceneChild instanceof _Group__WEBPACK_IMPORTED_MODULE_1__.Group) {
            sceneChild.getChildren().forEach((item) => {
                Scene.propagateToChilden(item, scene);
            });
        }
        else if (sceneChild instanceof _shapes_Shape__WEBPACK_IMPORTED_MODULE_2__.Shape && sceneChild.shape) {
            sceneChild.shape.scene = scene;
            Scene.propagateToChilden(sceneChild.shape, scene);
        }
    }
}

//# sourceMappingURL=Scene.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/SceneChild.js":
/*!*********************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/SceneChild.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SceneChild": () => (/* binding */ SceneChild)
/* harmony export */ });
/**
 * Autoincrement sceneChild default id
 *
 * @internal
 * @ignore
 */
let __id = 0;
/**
 * The element to be added into a scene.
 * Preserve props, drawing order, generate and return buffers.
 * The only implementations of this class are <a href="[base_url]/Group">Group</a> and <a href="[base_url]/ShapeBase">ShapeBase</a>
 *
 * @abstract
 * @category Core.Abstract
 * @order 2
 * @class SceneChild
 */
class SceneChild {
    /**
     * Creates an instance of SceneChild.
     * Base values will be assigned in case they are not passed
     *
     * @param {ISceneChildSettings} settings
     */
    constructor(settings) {
        var _a;
        this.id = (_a = settings.id) !== null && _a !== void 0 ? _a : ++__id;
        this.type = settings.type || 'SceneChild';
        this.name = settings.name || this.type + '_' + this.id;
        this.data = settings.data || {};
        this.props = {};
    }
    /**
     * Find this or form or children.
     * Overridden by classes that extend it
     *
     * @param {string | number} idOrName
     * @returns {(SceneChild | null)}
     */
    find(idOrName) {
        if (this.id === idOrName || this.name === idOrName)
            return this;
        return null;
    }
    /**
     * Return the sceneChild properties
     *
     * @returns {ISceneChildProps}
     */
    getProps() {
        return this.props;
    }
    /**
     * Return a sceneChild prop or default value
     *
     * @param {keyof ISceneChildProps} key
     * @param {ISceneChildPropArguments} [propArguments]
     * @param {*} [defaultValue]
     * @returns {*}
     */
    getProp(key, propArguments, defaultValue) {
        var _a;
        return ((_a = this.props[key]) !== null && _a !== void 0 ? _a : defaultValue);
    }
    /**
     * Set a single or multiple props
     *
     * @param {(keyof ISceneChildProps | ISceneChildProps)} key
     * @param {*} [value]
     */
    setPropUnsafe(key, value) {
        if (typeof key == 'string')
            this.props[key] = value;
        else
            Object.keys(key).forEach((k) => (this.props[k] = key[k]));
    }
}

//# sourceMappingURL=SceneChild.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/Utilities.js":
/*!********************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/Utilities.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "now": () => (/* binding */ now),
/* harmony export */   "toDegrees": () => (/* binding */ toDegrees),
/* harmony export */   "toRadians": () => (/* binding */ toRadians),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "relativeClamp": () => (/* binding */ relativeClamp),
/* harmony export */   "noise": () => (/* binding */ noise),
/* harmony export */   "angleFromRepetition": () => (/* binding */ angleFromRepetition),
/* harmony export */   "angle2FromRepetition": () => (/* binding */ angle2FromRepetition),
/* harmony export */   "distanceFromRepetition": () => (/* binding */ distanceFromRepetition)
/* harmony export */ });
/* harmony import */ var simplex_noise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! simplex-noise */ "./node_modules/simplex-noise/simplex-noise.js");
/* harmony import */ var simplex_noise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(simplex_noise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_scene_child__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/scene-child */ "./node_modules/@urpflanze/core/dist/types/scene-child.js");
/* harmony import */ var _math_Vec2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math/Vec2 */ "./node_modules/@urpflanze/core/dist/math/Vec2.js");



// isDef: (object: any): boolean => typeof object !== 'undefined' && object !== null,
const measurement = typeof performance !== 'undefined' ? performance : Date;
/**
 * Get current timestamp in milliseconds
 *
 * @category Utilities
 * @returns {number}
 */
function now() {
    return measurement.now();
}
// aOr: (...args: Array<any>): any => {
// 	for (let i = 0; i < args.length; i++) if (Utilities.isDef(args[i])) return args[i]
// },
/**
 * Convert number from radians to degrees
 *
 * @category Utilities
 *
 * @example
 * ```javascript
 * Urpflanze.toDegrees(Math.PI) // 180
 * ```
 *
 * @param {number} radians
 * @returns {number}
 */
function toDegrees(radians) {
    return (radians * 180) / Math.PI;
}
/**
 * Convert angle from degrees to radians
 * @example
 * ```javascript
 * Urpflanze.toRadians(180) // 3.141592653589793
 * ```
 *
 * @category Utilities
 * @param {number} degrees
 * @returns {number}
 */
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
// perf: (name: string, callback: any, log: boolean = false): number => {
// 	const t1 = now()
// 	callback()
// 	const t2 = now()
// 	log && console.log('perf ' + name + ': ' + (t2 - t1))
// 	return t2 - t1
// }
/**
 * Linear interpolation from `a` when `i` as 0 an `b` when `i' as 1
 *
 * @category Utilities
 * @param {number} a
 * @param {number} b
 * @param {number} i
 * @returns {number}
 */
function lerp(a, b, i) {
    return (1 - i) * a + i * b;
}
/**
 * Return number between min and max
 *
 * @category Utilities
 * @example
 * ```javascript
 * Urpflanze.clamp(0, 1, 1.2) // 1
 * Urpflanze.clamp(0, 1, -2) // 0
 * ```
 * @param {number} min
 * @param {number} max
 * @param {number} value
 * @returns {number}
 */
function clamp(min, max, value) {
    return value <= min ? min : value >= max ? max : value;
}
/**
 * Map number between refMin e refMax from min and max
 *
 * @category Utilities
 *
 * @example
 * ```javascript
 * Urpflanze.relativeClamp(0, 1, 0.5, 100, 200) // 150
 * ```
 *
 * @param {number} refMin
 * @param {number} refMax
 * @param {number} value
 * @param {number} toMin
 * @param {number} toMax
 * @returns {number}
 */
function relativeClamp(refMin, refMax, value, toMin, toMax) {
    return clamp(toMin, toMax, ((value - refMin) / (refMax - refMin)) * (toMax - toMin) + toMin);
}
/**
 * @internal
 * @ignore
 */
const noises = {
    random: new simplex_noise__WEBPACK_IMPORTED_MODULE_0__(Math.random),
};
/**
 * <a href="https://github.com/jwagner/simplex-noise.js" target="_blank">SimplexNoise</a>
 * Use 'random' as seed property for random seed.
 * Return value between -1 and 1
 *
 * @category Utilities
 *
 * @param {string} [seed='random']
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @returns {number} between -1 and 1
 */
function noise(seed = 'random', x = 0, y = 0, z = 0) {
    if (typeof noises[seed] === 'undefined') {
        noises[seed] = new simplex_noise__WEBPACK_IMPORTED_MODULE_0__(seed);
    }
    return noises[seed].noise3D(x, y, z);
}
/**
 * Return angle (atan) from offset (or center) for matrix repetition.
 * Offset is array between [-1, -1] and [1, 1].
 * The return value is between -Math.PI / 2 and Math.PI / 2
 *
 * @category Utilities
 *
 * @param {IRepetition} repetition
 * @param {[number, number]} offsetFromCenter
 * @returns {number} between -Math.PI / 2 and Math.PI / 2
 */
function angleFromRepetition(repetition, offsetFromCenter = [0, 0]) {
    if (repetition.type === _types_scene_child__WEBPACK_IMPORTED_MODULE_1__.ERepetitionType.Matrix) {
        const centerMatrix = [(repetition.col.count - 1) / 2, (repetition.row.count - 1) / 2];
        centerMatrix[0] += centerMatrix[0] * offsetFromCenter[0];
        centerMatrix[1] += centerMatrix[1] * offsetFromCenter[1];
        const x = repetition.col.index - 1 - centerMatrix[0];
        const y = repetition.row.index - 1 - centerMatrix[1];
        return x === 0 ? 0 : Math.atan(y / x);
    }
    return (repetition.angle - Math.PI) / 2;
}
/**
 * Return angle (atan2, 4 quadrants) from offset (or center) for matrix repetition.
 * Offset is array between [-1, -1] and [1, 1].
 * The return value is between -Math.PI an Math.PI
 *
 * @category Utilities
 *
 * @param {IRepetition} repetition
 * @param {[number, number]} offsetFromCenter
 * @returns {number} between -Math.PI an Math.PI
 */
function angle2FromRepetition(repetition, offsetFromCenter = [0, 0]) {
    if (repetition.type === _types_scene_child__WEBPACK_IMPORTED_MODULE_1__.ERepetitionType.Matrix) {
        const centerMatrix = [(repetition.col.count - 1) / 2, (repetition.row.count - 1) / 2];
        centerMatrix[0] += centerMatrix[0] * offsetFromCenter[0];
        centerMatrix[1] += centerMatrix[1] * offsetFromCenter[1];
        const x = repetition.col.index - 1 - centerMatrix[0];
        const y = repetition.row.index - 1 - centerMatrix[1];
        return x === 0 ? 0 : Math.atan2(y, x);
    }
    return repetition.angle - Math.PI;
}
/**
 * Return distance from offset (or center) for matrix repetition.
 * The return value is between 0 and 1
 *
 * @category Utilities
 *
 * @param {IRepetition} repetition
 * @param {[number, number]} offsetFromCenter offset relative to distance prop
 * @returns {number} between 0 and 1
 */
function distanceFromRepetition(repetition, offsetFromCenter = [0, 0]) {
    if (repetition.type === _types_scene_child__WEBPACK_IMPORTED_MODULE_1__.ERepetitionType.Matrix) {
        const centerMatrix = [0.5, 0.5];
        centerMatrix[0] += centerMatrix[0] * offsetFromCenter[0];
        centerMatrix[1] += centerMatrix[1] * offsetFromCenter[1];
        const current = [repetition.col.offset, repetition.row.offset];
        return _math_Vec2__WEBPACK_IMPORTED_MODULE_2__.default.distance(current, centerMatrix);
    }
    return 1;
}
//# sourceMappingURL=Utilities.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERepetitionType": () => (/* reexport safe */ _types_scene_child__WEBPACK_IMPORTED_MODULE_1__.ERepetitionType),
/* harmony export */   "EAdaptMode": () => (/* reexport safe */ _types_shape_base__WEBPACK_IMPORTED_MODULE_2__.EAdaptMode),
/* harmony export */   "Scene": () => (/* reexport safe */ _Scene__WEBPACK_IMPORTED_MODULE_5__.Scene),
/* harmony export */   "SceneChild": () => (/* reexport safe */ _SceneChild__WEBPACK_IMPORTED_MODULE_6__.SceneChild),
/* harmony export */   "Group": () => (/* reexport safe */ _Group__WEBPACK_IMPORTED_MODULE_7__.Group),
/* harmony export */   "ShapeBase": () => (/* reexport safe */ _shapes_ShapeBase__WEBPACK_IMPORTED_MODULE_8__.ShapeBase),
/* harmony export */   "ShapePrimitive": () => (/* reexport safe */ _shapes_ShapePrimitive__WEBPACK_IMPORTED_MODULE_9__.ShapePrimitive),
/* harmony export */   "ShapeLoop": () => (/* reexport safe */ _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_10__.ShapeLoop),
/* harmony export */   "ShapeBuffer": () => (/* reexport safe */ _shapes_ShapeBuffer__WEBPACK_IMPORTED_MODULE_11__.ShapeBuffer),
/* harmony export */   "Shape": () => (/* reexport safe */ _shapes_Shape__WEBPACK_IMPORTED_MODULE_12__.Shape),
/* harmony export */   "ShapeRecursive": () => (/* reexport safe */ _shapes_ShapeRecursive__WEBPACK_IMPORTED_MODULE_13__.ShapeRecursive),
/* harmony export */   "Line": () => (/* reexport safe */ _shapes_primitives_Line__WEBPACK_IMPORTED_MODULE_14__.Line),
/* harmony export */   "Triangle": () => (/* reexport safe */ _shapes_primitives_Triangle__WEBPACK_IMPORTED_MODULE_15__.Triangle),
/* harmony export */   "Rect": () => (/* reexport safe */ _shapes_primitives_Rect__WEBPACK_IMPORTED_MODULE_16__.Rect),
/* harmony export */   "Polygon": () => (/* reexport safe */ _shapes_primitives_Polygon__WEBPACK_IMPORTED_MODULE_17__.Polygon),
/* harmony export */   "Circle": () => (/* reexport safe */ _shapes_primitives_Circle__WEBPACK_IMPORTED_MODULE_18__.Circle),
/* harmony export */   "Rose": () => (/* reexport safe */ _shapes_primitives_Rose__WEBPACK_IMPORTED_MODULE_19__.Rose),
/* harmony export */   "Spiral": () => (/* reexport safe */ _shapes_primitives_Spiral__WEBPACK_IMPORTED_MODULE_20__.Spiral),
/* harmony export */   "Lissajous": () => (/* reexport safe */ _shapes_primitives_Lissajous__WEBPACK_IMPORTED_MODULE_21__.Lissajous),
/* harmony export */   "SuperShape": () => (/* reexport safe */ _shapes_primitives_SuperShape__WEBPACK_IMPORTED_MODULE_22__.SuperShape),
/* harmony export */   "lerp": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.lerp),
/* harmony export */   "clamp": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.clamp),
/* harmony export */   "relativeClamp": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.relativeClamp),
/* harmony export */   "toDegrees": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.toDegrees),
/* harmony export */   "toRadians": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.toRadians),
/* harmony export */   "now": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.now),
/* harmony export */   "noise": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.noise),
/* harmony export */   "angleFromRepetition": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.angleFromRepetition),
/* harmony export */   "angle2FromRepetition": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.angle2FromRepetition),
/* harmony export */   "distanceFromRepetition": () => (/* reexport safe */ _Utilities__WEBPACK_IMPORTED_MODULE_23__.distanceFromRepetition),
/* harmony export */   "Vec2": () => (/* reexport safe */ _math_Vec2__WEBPACK_IMPORTED_MODULE_24__.default),
/* harmony export */   "PHI": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_25__.PHI),
/* harmony export */   "PI2": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_25__.PI2),
/* harmony export */   "log": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_25__.log),
/* harmony export */   "pmod": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_25__.pmod)
/* harmony export */ });
/* harmony import */ var _types_scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/scene */ "./node_modules/@urpflanze/core/dist/types/scene.js");
/* harmony import */ var _types_scene_child__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/scene-child */ "./node_modules/@urpflanze/core/dist/types/scene-child.js");
/* harmony import */ var _types_shape_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types/shape-base */ "./node_modules/@urpflanze/core/dist/types/shape-base.js");
/* harmony import */ var _types_shape_primitives__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types/shape-primitives */ "./node_modules/@urpflanze/core/dist/types/shape-primitives.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/common.js");
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Scene */ "./node_modules/@urpflanze/core/dist/Scene.js");
/* harmony import */ var _SceneChild__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SceneChild */ "./node_modules/@urpflanze/core/dist/SceneChild.js");
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Group */ "./node_modules/@urpflanze/core/dist/Group.js");
/* harmony import */ var _shapes_ShapeBase__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shapes/ShapeBase */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBase.js");
/* harmony import */ var _shapes_ShapePrimitive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./shapes/ShapePrimitive */ "./node_modules/@urpflanze/core/dist/shapes/ShapePrimitive.js");
/* harmony import */ var _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shapes/ShapeLoop */ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js");
/* harmony import */ var _shapes_ShapeBuffer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shapes/ShapeBuffer */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBuffer.js");
/* harmony import */ var _shapes_Shape__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./shapes/Shape */ "./node_modules/@urpflanze/core/dist/shapes/Shape.js");
/* harmony import */ var _shapes_ShapeRecursive__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shapes/ShapeRecursive */ "./node_modules/@urpflanze/core/dist/shapes/ShapeRecursive.js");
/* harmony import */ var _shapes_primitives_Line__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./shapes/primitives/Line */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Line.js");
/* harmony import */ var _shapes_primitives_Triangle__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./shapes/primitives/Triangle */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Triangle.js");
/* harmony import */ var _shapes_primitives_Rect__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./shapes/primitives/Rect */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Rect.js");
/* harmony import */ var _shapes_primitives_Polygon__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./shapes/primitives/Polygon */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Polygon.js");
/* harmony import */ var _shapes_primitives_Circle__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./shapes/primitives/Circle */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Circle.js");
/* harmony import */ var _shapes_primitives_Rose__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./shapes/primitives/Rose */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Rose.js");
/* harmony import */ var _shapes_primitives_Spiral__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./shapes/primitives/Spiral */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Spiral.js");
/* harmony import */ var _shapes_primitives_Lissajous__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./shapes/primitives/Lissajous */ "./node_modules/@urpflanze/core/dist/shapes/primitives/Lissajous.js");
/* harmony import */ var _shapes_primitives_SuperShape__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./shapes/primitives/SuperShape */ "./node_modules/@urpflanze/core/dist/shapes/primitives/SuperShape.js");
/* harmony import */ var _Utilities__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./Utilities */ "./node_modules/@urpflanze/core/dist/Utilities.js");
/* harmony import */ var _math_Vec2__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./math/Vec2 */ "./node_modules/@urpflanze/core/dist/math/Vec2.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./math */ "./node_modules/@urpflanze/core/dist/math/index.js");
/**
 * Types & Interface
 */




// Set glMatrixArrayType

gl_matrix__WEBPACK_IMPORTED_MODULE_4__.setMatrixArrayType(Array);
/**
 * Core
 */



// Shapes















// Utilities



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/math/Vec2.js":
/*!********************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/math/Vec2.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Temporany matrix
 *
 * @internal
 * @ignore
 */
const MATRIX = new Array(4);
/**
 * Vec2 operation
 *
 * @category Core.Utilities
 */
const Vec2 = {
    /**
     * Create new vertex
     *
     * @param {Array<number> | number} [x=0]
     * @param {number} [y]
     * @returns {Array<number>}
     */
    create: (x = 0, y) => {
        const out = new Array(2);
        if (typeof x === 'number') {
            out[0] = x;
            out[1] = y !== null && y !== void 0 ? y : x;
        }
        else {
            out[0] = x[0];
            out[1] = x[1];
        }
        return out;
    },
    normalize: (v) => {
        const len = Vec2.length(v);
        return len !== 0 ? [v[0] / len, v[1] / len] : [0, 0];
    },
    /**
     * Distance between two points
     *
     * @param {Array<number>} a
     * @param {Array<number>} b
     * @returns {number}
     */
    distance: (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]),
    /**
     * dot product
     *
     * @param {Array<number>} a
     * @param {Array<number>} b
     * @returns {number}
     */
    dot: (a, b) => a[0] * b[0] + a[1] * b[1],
    /**
     * length of point
     *
     * @param {Array<number>} vec
     * @returns {number}
     */
    length: (vec) => Math.hypot(vec[0], vec[1]),
    /**
     * angle between two point
     *
     * @param {Array<number>} a
     * @param {Array<number>} b
     * @returns {number}
     */
    angle: (a, b) => {
        a = Vec2.normalize(a);
        b = Vec2.normalize(b);
        return Math.acos(Vec2.dot(a, b));
    },
    /**
     * skewX point
     *
     * @param {Array<number>} vec
     * @param {number} m
     */
    skewX: (vec, m) => {
        vec[0] += Math.tan(m) * vec[1];
    },
    /**
     * skewY point
     *
     * @param {Array<number>} vec
     * @param {number} m
     */
    skewY: (vec, m) => {
        vec[1] += Math.tan(m) * vec[0];
    },
    /**
     * squeezeX point
     *
     * @param {Array<number>} vec
     * @param {number} m
     */
    squeezeX: (vec, m) => {
        vec[1] += vec[1] * (vec[0] * -m);
    },
    /**
     * squeezeY point
     *
     * @param {Array<number>} vec
     * @param {number} m
     */
    squeezeY: (vec, m) => {
        vec[0] += vec[0] * (vec[1] * m);
    },
    /**
     * Rotate point
     *
     * @param {Array<number>} vec
     * @param {Array<number>} MATRIX
     * @param {Array<number>} fromPoint
     * @internal
     */
    rotate: (vec, MATRIX, fromPoint) => {
        const p0 = vec[0] - fromPoint[0];
        const p1 = vec[1] - fromPoint[1];
        vec[0] = p0 * MATRIX[0] + p1 * MATRIX[1] + fromPoint[0];
        vec[1] = p0 * MATRIX[2] + p1 * MATRIX[3] + fromPoint[1];
    },
    /**
     * RotateX point
     *
     * @param {Array<number>} vec
     * @param {Array<number>} fromPoint
     * @param {number} rad
     */
    rotateX: (vec, fromPoint, rad) => {
        MATRIX[0] = 1;
        MATRIX[1] = 0;
        MATRIX[2] = 0;
        MATRIX[3] = Math.cos(rad);
        Vec2.rotate(vec, MATRIX, fromPoint);
    },
    /**
     * RotateY point
     *
     * @param {Array<number>} vec
     * @param {Array<number>} fromPoint
     * @param {number} rad
     */
    rotateY: (vec, fromPoint, rad) => {
        MATRIX[0] = Math.cos(rad);
        MATRIX[1] = 0;
        MATRIX[2] = 0;
        MATRIX[3] = 1;
        Vec2.rotate(vec, MATRIX, fromPoint);
    },
    /**
     * RotateZ point
     *
     * @param {Array<number>} vec
     * @param {Array<number>} fromPoint
     * @param {number} rad
     */
    rotateZ: (vec, fromPoint, rad) => {
        MATRIX[0] = Math.cos(rad);
        MATRIX[1] = -Math.sin(rad);
        MATRIX[2] = Math.sin(rad);
        MATRIX[3] = Math.cos(rad);
        Vec2.rotate(vec, MATRIX, fromPoint);
    },
    /**
     * Translate vertex
     *
     * @param {Array<number>} vec
     * @param {Array<number>} to
     */
    translate: (vec, to) => {
        vec[0] += to[0];
        vec[1] += to[1];
    },
    /**
     * Scale vertex
     *
     * @param {Array<number>} vec
     * @param {Array<number>} to
     */
    scale: (vec, to) => {
        vec[0] *= to[0];
        vec[1] *= to[1];
    },
    /**
     * Scale vertex
     *
     * @param {Array<number>} vec
     * @param {Array<number>} to
     */
    divide: (vec, to) => {
        vec[0] /= to[0];
        vec[1] /= to[1];
    },
    /**
     * Vec to string
     *
     * @param {Array<number>} vec
     * @return {string}
     */
    toString: (vec) => `x: ${vec[0]}, y: ${vec[1]}`,
    /**
     * Vertex [0, 0]
     */
    ZERO: Array.from([0, 0]),
    /**
     * Vertex [1, 1]
     */
    ONE: Array.from([1, 1]),
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vec2);
//# sourceMappingURL=Vec2.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/math/bounding.js":
/*!************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/math/bounding.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bounding": () => (/* binding */ Bounding)
/* harmony export */ });
/**
 * @internal
 * @ignore
 */
const Bounding = {
    empty: () => ({
        cx: 0,
        cy: 0,
        x: -1,
        y: -1,
        width: 2,
        height: 2,
    }),
    clear: (tmpBounding) => {
        tmpBounding[0] = undefined;
        tmpBounding[1] = undefined;
        tmpBounding[2] = undefined;
        tmpBounding[3] = undefined;
    },
    add: (tmpBounding, x, y) => {
        if (typeof tmpBounding[0] === 'undefined' || x < tmpBounding[0])
            tmpBounding[0] = x;
        if (typeof tmpBounding[2] === 'undefined' || x > tmpBounding[2])
            tmpBounding[2] = x;
        if (typeof tmpBounding[1] === 'undefined' || y < tmpBounding[1])
            tmpBounding[1] = y;
        if (typeof tmpBounding[3] === 'undefined' || y > tmpBounding[3])
            tmpBounding[3] = y;
    },
    sum: (dest, bounding) => {
        if (typeof bounding[0] !== 'undefined' &&
            typeof bounding[1] !== 'undefined' &&
            typeof bounding[2] !== 'undefined' &&
            typeof bounding[3] !== 'undefined') {
            if (typeof dest[0] === 'undefined' ||
                typeof dest[1] === 'undefined' ||
                typeof dest[2] === 'undefined' ||
                typeof dest[3] === 'undefined') {
                dest[0] = bounding[0];
                dest[1] = bounding[1];
                dest[2] = bounding[2];
                dest[3] = bounding[3];
            }
            else {
                if (dest[0] < bounding[0])
                    dest[0] = bounding[0];
                if (dest[2] > bounding[2])
                    dest[2] = bounding[2];
                if (dest[1] < bounding[1])
                    dest[1] = bounding[1];
                if (dest[3] > bounding[3])
                    dest[3] = bounding[3];
            }
        }
        else {
            console.warn('[Urplfanze:Bounding] cannot sum bounding');
        }
    },
    bind: (bounding, tmpBounding) => {
        if (typeof tmpBounding[0] !== 'undefined' &&
            typeof tmpBounding[1] !== 'undefined' &&
            typeof tmpBounding[2] !== 'undefined' &&
            typeof tmpBounding[3] !== 'undefined') {
            bounding.x = tmpBounding[0];
            bounding.y = tmpBounding[1];
            bounding.width = tmpBounding[2] - tmpBounding[0];
            bounding.height = tmpBounding[3] - tmpBounding[1];
            bounding.cx = bounding.x + bounding.width / 2;
            bounding.cy = bounding.y + bounding.height / 2;
        }
        else {
            console.warn('[Urplfanze:Bounding] cannot bind bounding');
        }
    },
};

//# sourceMappingURL=bounding.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/math/gl-matrix-extensions.js":
/*!************************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/math/gl-matrix-extensions.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VEC3_ZERO": () => (/* binding */ VEC3_ZERO),
/* harmony export */   "VEC3_ONE": () => (/* binding */ VEC3_ONE),
/* harmony export */   "VEC2_ZERO": () => (/* binding */ VEC2_ZERO),
/* harmony export */   "VEC2_ONE": () => (/* binding */ VEC2_ONE),
/* harmony export */   "fromSkew": () => (/* binding */ fromSkew),
/* harmony export */   "toVec2": () => (/* binding */ toVec2),
/* harmony export */   "toVec3": () => (/* binding */ toVec3)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/common.js");

const VEC3_ZERO = [0, 0, 0];
const VEC3_ONE = [1, 1, 1];
const VEC2_ZERO = [0, 0];
const VEC2_ONE = [1, 1];
gl_matrix__WEBPACK_IMPORTED_MODULE_0__.setMatrixArrayType(Array);
/**
 * Skew matrix
 *
 * @internal
 * @ignore
 */
function fromSkew(out, skew) {
    out[0] = 1;
    out[1] = Math.tan(skew[1]);
    out[2] = 0;
    out[3] = 0;
    out[4] = Math.tan(skew[0]);
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
/**
 * number to vec 2
 *
 * @internal
 * @ignore
 */
function toVec2(x) {
    if (Array.isArray(x))
        return [x[0], x[1]];
    return [x, x];
}
/**
 * number to vec 3
 *
 * @internal
 * @ignore
 */
function toVec3(x, defaultZValue = 0) {
    if (Array.isArray(x)) {
        return [x[0], x[1], defaultZValue];
    }
    return [x, x, defaultZValue];
}
//# sourceMappingURL=gl-matrix-extensions.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/math/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/math/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "PI2": () => (/* binding */ PI2),
/* harmony export */   "PHI": () => (/* binding */ PHI),
/* harmony export */   "pmod": () => (/* binding */ pmod)
/* harmony export */ });
/**
 * Return logarith value and base
 *
 * @category Core.Utilities
 *
 * @param n number
 * @param base number
 */
const log = (n, base) => Math.log(n) / Math.log(base);
/**
 * @category Core.Utilities
 */
const PI2 = Math.PI * 2;
/**
 * @category Core.Utilities
 */
const PHI = (1 + Math.sqrt(5)) / 2;
/**
 * Return a positive module of positive or negative value
 *
 * @category Core.Utilities
 *
 * @param value number
 * @param base number
 */
const pmod = (value, base) => {
    const result = value % base;
    return result < 0 ? result + base : result;
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/Shape.js":
/*!***********************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/Shape.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Shape": () => (/* binding */ Shape)
/* harmony export */ });
/* harmony import */ var _ShapeBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShapeBase */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBase.js");
/* harmony import */ var _SceneChild__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../SceneChild */ "./node_modules/@urpflanze/core/dist/SceneChild.js");
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Scene */ "./node_modules/@urpflanze/core/dist/Scene.js");



/**
 * Container of ShapeBase or Group, it applies transformations on each repetition
 *
 * @category Core.Shapes
 */
class Shape extends _ShapeBase__WEBPACK_IMPORTED_MODULE_0__.ShapeBase {
    /**
     * Creates an instance of Shape.
     *
     * @param {ShapeSettings} [settings={}]
     */
    constructor(settings = {}) {
        settings.type = settings.type || 'Shape';
        super(settings);
        if (settings.shape instanceof _SceneChild__WEBPACK_IMPORTED_MODULE_1__.SceneChild) {
            this.shape = settings.shape;
        }
        else {
            console.warn("[Urpflanze:Shape] requires the 'shape' property to be instance of SceneChild,\nYou passed:", settings.shape);
        }
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
    /**
     * Check if shape is static
     *
     * @returns {boolean}
     */
    isStatic() {
        return super.isStatic() && (this.shape ? this.shape.isStatic() : true);
    }
    /**
     * Check if shape has static index
     *
     * @returns {boolean}
     */
    isStaticIndexed() {
        return super.isStaticIndexed() && (this.shape ? this.shape.isStaticIndexed() : true);
    }
    /**
     * Find shape by id or name
     *
     * @param {number | string} idOrName
     * @returns {(SceneChild | null)}
     */
    find(idOrName) {
        if (this.id === idOrName || this.name === idOrName)
            return this;
        if (this.shape)
            return this.shape.find(idOrName);
        return null;
    }
    /**
     * Return length of buffer
     *
     * @param {ISceneChildPropArguments} propArguments
     * @returns {number}
     */
    getBufferLength(propArguments) {
        if (this.bStatic && this.buffer && this.buffer.length > 0)
            return this.buffer.length;
        const childBufferLength = this.shape ? this.shape.getBufferLength(propArguments) : 0;
        return childBufferLength * this.getRepetitionCount();
    }
    /**
     * Return a buffer of children shape or loop generated buffer
     *
     * @protected
     * @param {number} generateId
     * @param {ISceneChildPropArguments} propArguments
     * @returns {Float32Array}
     */
    generateBuffer(generateId, propArguments) {
        if (this.shape) {
            this.shape.generate(generateId, false, propArguments);
            return this.shape.getBuffer() || Shape.EMPTY_BUFFER;
        }
        return Shape.EMPTY_BUFFER;
    }
    /**
     * Return bounding
     *
     * @param {boolean} bDirectSceneChild
     * @returns {IShapeBounding}
     */
    getShapeBounding() {
        if (this.shape) {
            return this.shape.getBounding();
        }
        return this.bounding; // empty bounding defined in ShapeBase
    }
    /**
     * Add to indexed buffer
     *
     * @protected
     * @param {number} frameLength
     * @param {IRepetition} repetition
     * @returns {number} nextIndex
     */
    addIndex(frameLength, repetition, recursion
    // singleRepetitionBounding: IShapeBounding
    ) {
        if (this.shape) {
            const childIndexedBuffer = this.shape.getIndexedBuffer() || [];
            const parent = {
                shape: this,
                frameLength,
                // singleRepetitionBounding,
                repetition: {
                    type: repetition.type,
                    angle: repetition.angle,
                    index: repetition.index,
                    count: repetition.count,
                    offset: repetition.offset,
                    row: {
                        index: repetition.row.index,
                        count: repetition.row.count,
                        offset: repetition.row.offset,
                    },
                    col: {
                        index: repetition.col.index,
                        count: repetition.col.count,
                        offset: repetition.col.offset,
                    },
                },
            };
            if (typeof recursion !== 'undefined') {
                parent.recursion = {
                    index: recursion.index,
                    offset: recursion.offset,
                    count: recursion.offset,
                    level: recursion.level,
                };
            }
            for (let i = 0, len = childIndexedBuffer.length; i < len; i++) {
                const currentIndexed = Object.assign({}, childIndexedBuffer[i]);
                currentIndexed.parent = currentIndexed.parent ? Shape.setIndexedParent(currentIndexed.parent, parent) : parent;
                this.indexedBuffer.push(currentIndexed);
            }
        }
    }
    /**
     * Set parent of indexed
     *
     * @static
     * @param {(IBufferIndex | IParentBufferIndex)} current
     * @param {IParentBufferIndex} parent
     * @returns {(IBufferIndex | IParentBufferIndex)}
     */
    static setIndexedParent(current, parent) {
        const index = {
            shape: current.shape,
            // singleRepetitionBounding: current.singleRepetitionBounding,
            repetition: {
                type: current.repetition.type,
                angle: current.repetition.angle,
                index: current.repetition.index,
                count: current.repetition.count,
                offset: current.repetition.offset,
                row: {
                    index: current.repetition.row.index,
                    count: current.repetition.row.count,
                    offset: current.repetition.row.offset,
                },
                col: {
                    index: current.repetition.col.index,
                    count: current.repetition.col.count,
                    offset: current.repetition.col.offset,
                },
            },
            frameLength: current.frameLength,
        };
        if (typeof current.recursion !== 'undefined') {
            index.recursion = {
                index: current.recursion.index,
                offset: current.recursion.offset,
                count: current.recursion.offset,
                level: current.recursion.level,
            };
        }
        index.parent = current.parent ? Shape.setIndexedParent(current.parent, parent) : parent;
        return index;
    }
    /**
     * Set shape
     *
     * @param {(SceneChild | undefined)} [shape]
     */
    setShape(shape) {
        if (typeof shape === 'undefined') {
            this.shape = undefined;
            this.clearBuffer(true, true);
        }
        else {
            this.scene && _Scene__WEBPACK_IMPORTED_MODULE_2__.Scene.propagateToChilden(shape, this.scene);
            this.shape = shape;
            this.shape.clearBuffer(true, true);
        }
    }
}

//# sourceMappingURL=Shape.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/ShapeBase.js":
/*!***************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/ShapeBase.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShapeBase": () => (/* binding */ ShapeBase)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec2.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _types_scene_child__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/scene-child */ "./node_modules/@urpflanze/core/dist/types/scene-child.js");
/* harmony import */ var _Utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utilities */ "./node_modules/@urpflanze/core/dist/Utilities.js");
/* harmony import */ var _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../math/gl-matrix-extensions */ "./node_modules/@urpflanze/core/dist/math/gl-matrix-extensions.js");
/* harmony import */ var _math_Vec2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../math/Vec2 */ "./node_modules/@urpflanze/core/dist/math/Vec2.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../math */ "./node_modules/@urpflanze/core/dist/math/index.js");
/* harmony import */ var _math_bounding__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../math/bounding */ "./node_modules/@urpflanze/core/dist/math/bounding.js");
/* harmony import */ var _SceneChild__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../SceneChild */ "./node_modules/@urpflanze/core/dist/SceneChild.js");








const tmpMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_7__.create();
const transformMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_7__.create();
const perspectiveMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_7__.create();
const repetitionMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_7__.create();
/**
 * Main class for shape generation
 *
 * @category Core.Abstract
 * @abstract
 * @class ShapeBase
 * @order 4
 * @extends {SceneChild}
 */
class ShapeBase extends _SceneChild__WEBPACK_IMPORTED_MODULE_6__.SceneChild {
    /**
     * Creates an instance of ShapeBase
     *
     * @param {ISceneChildSettings} [settings={}]
     */
    constructor(settings = {}) {
        super(settings);
        /**
         * Shape generation id
         * used for prevent buffer calculation
         *
         * @internal
         * @ignore
         */
        this.generateId = -1;
        /**
         * Flag used to determine if indexedBuffer has been generated
         *
         * @internal
         * @ignore
         */
        this.bIndexed = false;
        /**
         * Array used for index a vertex buffer
         * only for first level scene children
         *
         * @internal
         * @ignore
         */
        this.indexedBuffer = [];
        /**
         * The bounding inside the scene
         *
         * @type {IShapeBounding}
         */
        this.bounding = {
            cx: 0,
            cy: 0,
            x: -1,
            y: -1,
            width: 2,
            height: 2,
        };
        this.props = {
            distance: settings.distance,
            repetitions: settings.repetitions,
            rotateX: settings.rotateX,
            rotateY: settings.rotateY,
            rotateZ: settings.rotateZ,
            skewX: settings.skewX,
            skewY: settings.skewY,
            squeezeX: settings.squeezeX,
            squeezeY: settings.squeezeY,
            displace: settings.displace,
            translate: settings.translate,
            scale: settings.scale,
            transformOrigin: settings.transformOrigin,
            perspective: settings.perspective,
            perspectiveOrigin: settings.perspectiveOrigin,
        };
        this.bUseParent = !!settings.bUseParent;
        this.bUseRecursion = !!settings.bUseRecursion;
        this.vertexCallback = settings.vertexCallback;
    }
    /**
     * Check if the shape should be generated every time
     *
     * @returns {boolean}
     */
    isStatic() {
        const props = this.props;
        return (typeof props.distance !== 'function' &&
            typeof props.repetitions !== 'function' &&
            typeof props.rotateX !== 'function' &&
            typeof props.rotateY !== 'function' &&
            typeof props.rotateZ !== 'function' &&
            typeof props.displace !== 'function' &&
            typeof props.skewX !== 'function' &&
            typeof props.skewY !== 'function' &&
            typeof props.squeezeX !== 'function' &&
            typeof props.squeezeY !== 'function' &&
            typeof props.translate !== 'function' &&
            typeof props.scale !== 'function' &&
            typeof props.transformOrigin !== 'function');
    }
    /**
     * Check if the indexedBuffer array needs to be recreated every time,
     * this can happen when a shape generates an array of vertices different in length at each repetition
     *
     * @returns {boolean}
     */
    isStaticIndexed() {
        return typeof this.props.repetitions !== 'function';
    }
    /**
     * Return a prop value
     *
     * @param {keyof ISceneChildProps} key
     * @param {ISceneChildPropArguments} [propArguments]
     * @param {*} [defaultValue]
     * @returns {*}
     */
    getProp(key, propArguments, defaultValue) {
        let attribute = this.props[key];
        if (typeof attribute === 'function') {
            attribute = attribute(propArguments);
        }
        return typeof attribute === 'undefined' || Number.isNaN(attribute) ? defaultValue : attribute;
    }
    /**
     * Set a single or multiple props
     *
     * @param {(keyof ISceneChildProps | ISceneChildProps)} key
     * @param {*} [value]
     * @param {boolean} [bClearIndexed=false]
     */
    setProp(key, value, bClearIndexed = false) {
        if (typeof key == 'string') {
            bClearIndexed = bClearIndexed || key == 'repetitions';
            this.props[key] = value;
        }
        else {
            bClearIndexed = bClearIndexed || 'repetitions' in key;
            Object.keys(key).forEach((k) => (this.props[k] = key[k]));
        }
        this.clearBuffer(bClearIndexed, true);
    }
    /**
     *  Unset buffer
     *
     * @param {boolean} [bClearIndexed=false]
     * @param {boolean} [bPropagateToParents=false]
     * @param {boolean} [bPropagateToChildren=false]
     */
    clearBuffer(bClearIndexed = false, bPropagateToParents = true) {
        this.buffer = undefined;
        if (bClearIndexed) {
            this.bIndexed = false;
            this.indexedBuffer = [];
        }
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
        if (bPropagateToParents && this.scene && !this.scene.isFirstLevelChild(this)) {
            const parents = this.scene.getParentsOfSceneChild(this);
            parents.length > 0 && parents[parents.length - 1].clearBuffer(bClearIndexed, bPropagateToParents /* true */);
        }
    }
    /**
     * Update the vertex array if the shape is not static and update the indexedBuffer if it is also not static
     *
     * @param {number} generateId generation id
     * @param {boolean} [bDirectSceneChild=false] adjust shape of center of scene
     * @param {ISceneChildPropArguments} [parentPropArguments]
     */
    generate(generateId, bDirectSceneChild = false, parentPropArguments) {
        var _a, _b;
        if (this.buffer && (this.bStatic || (generateId === this.generateId && !this.bUseParent && !this.bUseRecursion))) {
            return;
        }
        this.generateId = generateId;
        if (!this.bStaticIndexed || !this.bIndexed)
            this.indexedBuffer = [];
        const propArguments = ShapeBase.getEmptyPropArguments(this, parentPropArguments);
        const repetition = propArguments.repetition;
        const repetitions = this.getProp('repetitions', propArguments, 1);
        const repetitionType = Array.isArray(repetitions) ? _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Matrix : _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Ring;
        const repetitionCount = Array.isArray(repetitions)
            ? repetitions[0] * ((_a = repetitions[1]) !== null && _a !== void 0 ? _a : repetitions[0])
            : repetitions;
        const repetitionRowCount = Array.isArray(repetitions) ? repetitions[0] : repetitionCount;
        const repetitionColCount = Array.isArray(repetitions) ? (_b = repetitions[1]) !== null && _b !== void 0 ? _b : repetitions[0] : 1;
        const rowRepetition = repetition.row;
        rowRepetition.count = repetitionRowCount;
        const colRepetition = repetition.col;
        colRepetition.count = repetitionColCount;
        repetition.count = repetitionCount;
        repetition.col.count = repetitionColCount;
        repetition.row.count = repetitionRowCount;
        repetition.type = repetitionType;
        let totalBufferLength = 0;
        const buffers = [];
        let currentIndex = 0;
        const centerMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_8__.fromValues((repetitionColCount - 1) / 2, (repetitionRowCount - 1) / 2);
        const sceneCenter = this.scene ? [this.scene.center[0], this.scene.center[1], 0] : [0, 0, 0];
        const tmpTotalShapeBounding = [undefined, undefined, undefined, undefined];
        const tmpSingleRepetitionBounding = [undefined, undefined, undefined, undefined];
        for (let currentRowRepetition = 0; currentRowRepetition < repetitionRowCount; currentRowRepetition++) {
            for (let currentColRepetition = 0; currentColRepetition < repetitionColCount; currentColRepetition++, currentIndex++) {
                repetition.index = currentIndex + 1;
                repetition.offset = repetitionCount > 1 ? currentIndex / (repetitionCount - 1) : 1;
                repetition.angle = repetitionType === _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Ring ? (_math__WEBPACK_IMPORTED_MODULE_4__.PI2 / repetitionCount) * currentIndex : 0;
                colRepetition.index = currentColRepetition + 1;
                colRepetition.offset = repetitionColCount > 1 ? currentColRepetition / (repetitionColCount - 1) : 1;
                rowRepetition.index = currentRowRepetition + 1;
                rowRepetition.offset = repetitionRowCount > 1 ? currentRowRepetition / (repetitionRowCount - 1) : 1;
                // Generate primitives buffer recursively
                const buffer = this.generateBuffer(generateId, propArguments);
                const bufferLength = buffer.length;
                const bounding = this.getShapeBounding();
                buffers[currentIndex] = new Float32Array(bufferLength);
                totalBufferLength += bufferLength;
                {
                    const distance = _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.toVec2(this.getProp('distance', propArguments, _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.VEC2_ZERO));
                    const displace = this.getProp('displace', propArguments, 0);
                    const scale = _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.toVec3(this.getProp('scale', propArguments, _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.VEC2_ONE), 1);
                    const translate = _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.toVec3(this.getProp('translate', propArguments, _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.VEC2_ZERO), 0);
                    const skewX = this.getProp('skewX', propArguments, 0);
                    const skewY = this.getProp('skewY', propArguments, 0);
                    const squeezeX = this.getProp('squeezeX', propArguments, 0);
                    const squeezeY = this.getProp('squeezeY', propArguments, 0);
                    const rotateX = this.getProp('rotateX', propArguments, 0);
                    const rotateY = this.getProp('rotateY', propArguments, 0);
                    const rotateZ = this.getProp('rotateZ', propArguments, 0);
                    const perspective = (0,_Utilities__WEBPACK_IMPORTED_MODULE_1__.clamp)(0, 1, this.getProp('perspective', propArguments, 0));
                    const perspectiveOrigin = _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.toVec3(this.getProp('perspectiveOrigin', propArguments, _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.VEC2_ZERO), 0);
                    const transformOrigin = _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.toVec3(this.getProp('transformOrigin', propArguments, _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.VEC2_ZERO), 0);
                    let offset;
                    switch (repetitionType) {
                        case _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Ring:
                            offset = gl_matrix__WEBPACK_IMPORTED_MODULE_9__.fromValues(distance[0], 0, 0);
                            gl_matrix__WEBPACK_IMPORTED_MODULE_9__.rotateZ(offset, offset, _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.VEC3_ZERO, repetition.angle + displace);
                            break;
                        case _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Matrix:
                            offset = gl_matrix__WEBPACK_IMPORTED_MODULE_9__.fromValues(distance[1] * (currentColRepetition - centerMatrix[0]), distance[0] * (currentRowRepetition - centerMatrix[1]), 0);
                            break;
                    }
                    const perspectiveSize = perspective > 0 ? Math.max(bounding.width, bounding.height) / 2 : 1;
                    const perspectiveValue = perspective > 0 ? perspectiveSize + (1 - perspective) * (perspectiveSize * 10) : 0;
                    const bTransformOrigin = perspective !== 0 || transformOrigin[0] !== 0 || transformOrigin[1] !== 0;
                    const bPerspectiveOrigin = perspectiveOrigin[0] !== 0 || perspectiveOrigin[1] !== 0;
                    if (bTransformOrigin) {
                        transformOrigin[0] *= bounding.width / 2;
                        transformOrigin[1] *= bounding.height / 2;
                        transformOrigin[2] = perspectiveValue;
                    }
                    /**
                     * Create Matrices
                     */
                    {
                        /**
                         * Create Transformation matrix
                         */
                        gl_matrix__WEBPACK_IMPORTED_MODULE_7__.identity(transformMatrix);
                        bTransformOrigin && gl_matrix__WEBPACK_IMPORTED_MODULE_7__.translate(transformMatrix, transformMatrix, transformOrigin);
                        if (translate[0] !== 0 || translate[1] !== 0)
                            gl_matrix__WEBPACK_IMPORTED_MODULE_7__.translate(transformMatrix, transformMatrix, translate);
                        if (skewX !== 0 || skewY !== 0) {
                            _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_2__.fromSkew(tmpMatrix, [skewX, skewY]);
                            gl_matrix__WEBPACK_IMPORTED_MODULE_7__.multiply(transformMatrix, transformMatrix, tmpMatrix);
                        }
                        rotateX !== 0 && gl_matrix__WEBPACK_IMPORTED_MODULE_7__.rotateX(transformMatrix, transformMatrix, rotateX);
                        rotateY !== 0 && gl_matrix__WEBPACK_IMPORTED_MODULE_7__.rotateY(transformMatrix, transformMatrix, rotateY);
                        rotateZ !== 0 && gl_matrix__WEBPACK_IMPORTED_MODULE_7__.rotateZ(transformMatrix, transformMatrix, rotateZ);
                        if (scale[0] !== 1 || scale[1] !== 1)
                            gl_matrix__WEBPACK_IMPORTED_MODULE_7__.scale(transformMatrix, transformMatrix, scale);
                        bTransformOrigin &&
                            gl_matrix__WEBPACK_IMPORTED_MODULE_7__.translate(transformMatrix, transformMatrix, gl_matrix__WEBPACK_IMPORTED_MODULE_9__.scale(transformOrigin, transformOrigin, -1));
                        /**
                         * Create Perspective matrix
                         */
                        if (perspectiveValue > 0) {
                            if (bPerspectiveOrigin) {
                                perspectiveOrigin[0] *= bounding.width / 2;
                                perspectiveOrigin[1] *= bounding.height / 2;
                                perspectiveOrigin[2] = 0;
                            }
                            gl_matrix__WEBPACK_IMPORTED_MODULE_7__.perspective(perspectiveMatrix, -Math.PI / 2, 1, 0, Infinity);
                        }
                        /**
                         * Create Repetition matrix
                         */
                        gl_matrix__WEBPACK_IMPORTED_MODULE_7__.identity(repetitionMatrix);
                        gl_matrix__WEBPACK_IMPORTED_MODULE_7__.translate(repetitionMatrix, repetitionMatrix, offset);
                        if (bDirectSceneChild) {
                            gl_matrix__WEBPACK_IMPORTED_MODULE_7__.translate(repetitionMatrix, repetitionMatrix, sceneCenter);
                        }
                        if (repetitionType === _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Ring)
                            gl_matrix__WEBPACK_IMPORTED_MODULE_7__.rotateZ(repetitionMatrix, repetitionMatrix, repetition.angle + displace);
                    }
                    _math_bounding__WEBPACK_IMPORTED_MODULE_5__.Bounding.clear(tmpSingleRepetitionBounding);
                    // Apply matrices on vertex
                    for (let bufferIndex = 0; bufferIndex < bufferLength; bufferIndex += 2) {
                        const vertex = [buffer[bufferIndex], buffer[bufferIndex + 1], perspectiveValue];
                        {
                            // Apply squeeze, can be insert into transformMatrix?
                            squeezeX !== 0 && _math_Vec2__WEBPACK_IMPORTED_MODULE_3__.default.squeezeX(vertex, squeezeX);
                            squeezeY !== 0 && _math_Vec2__WEBPACK_IMPORTED_MODULE_3__.default.squeezeY(vertex, squeezeY);
                            // Apply transforms
                            gl_matrix__WEBPACK_IMPORTED_MODULE_9__.transformMat4(vertex, vertex, transformMatrix);
                            // Apply perspective
                            if (perspectiveValue > 0) {
                                bPerspectiveOrigin && gl_matrix__WEBPACK_IMPORTED_MODULE_9__.add(vertex, vertex, perspectiveOrigin);
                                gl_matrix__WEBPACK_IMPORTED_MODULE_9__.transformMat4(vertex, vertex, perspectiveMatrix);
                                gl_matrix__WEBPACK_IMPORTED_MODULE_9__.scale(vertex, vertex, perspectiveValue);
                                bPerspectiveOrigin && gl_matrix__WEBPACK_IMPORTED_MODULE_9__.sub(vertex, vertex, perspectiveOrigin);
                            }
                            // custom vertex manipulation
                            if (this.vertexCallback) {
                                const index = bufferIndex / 2;
                                const count = bufferLength / 2;
                                const vertexRepetition = {
                                    index: index + 1,
                                    count,
                                    offset: count > 1 ? index / (count - 1) : 1,
                                };
                                this.vertexCallback(vertex, vertexRepetition, propArguments);
                            }
                            // final, apply repetition matrix
                            gl_matrix__WEBPACK_IMPORTED_MODULE_9__.transformMat4(vertex, vertex, repetitionMatrix);
                        }
                        buffers[currentIndex][bufferIndex] = vertex[0];
                        buffers[currentIndex][bufferIndex + 1] = vertex[1];
                        // Bounding.add(tmpSingleRepetitionBounding, vertex[0], vertex[1])
                        _math_bounding__WEBPACK_IMPORTED_MODULE_5__.Bounding.add(tmpTotalShapeBounding, vertex[0], vertex[1]);
                    }
                }
                // Bounding.sum(tmpTotalShapeBounding, tmpSingleRepetitionBounding)
                // After buffer creation, add a frame into indexedBuffer if not static or update bounding
                // const singleRepetitionBounding = { cx: 0, cy: 0, x: -1, y: -1, width: 2, height: 2 }
                // Bounding.bind(singleRepetitionBounding, tmpSingleRepetitionBounding)
                if (!this.bStaticIndexed || !this.bIndexed) {
                    this.addIndex(bufferLength, repetition);
                }
            }
        }
        _math_bounding__WEBPACK_IMPORTED_MODULE_5__.Bounding.bind(this.bounding, tmpTotalShapeBounding);
        this.buffer = new Float32Array(totalBufferLength);
        for (let i = 0, offset = 0, len = buffers.length; i < len; offset += buffers[i].length, i++)
            this.buffer.set(buffers[i], offset);
        this.bIndexed = true;
    }
    /**
     * Return current shape (whit repetions) bounding
     *
     * @return {*}  {IShapeBounding}
     */
    getBounding() {
        return this.bounding;
    }
    /**
     * Get number of repetitions
     *
     * @returns {number}
     */
    getRepetitionCount() {
        var _a;
        const repetitions = this.getProp('repetitions', undefined, 1);
        return Array.isArray(repetitions) ? repetitions[0] * ((_a = repetitions[1]) !== null && _a !== void 0 ? _a : repetitions[0]) : repetitions;
    }
    /**
     * Return buffer
     *
     * @returns {(Float32Array | undefined)}
     */
    getBuffer() {
        return this.buffer;
    }
    /**
     * Return indexed buffer
     *
     * @returns {(Array<IBufferIndex> | undefined)}
     */
    getIndexedBuffer() {
        return this.indexedBuffer;
    }
    /**
     * Return number of encapsulation
     *
     * @param {IBufferIndex} index
     * @returns {number}
     */
    static getIndexParentLevel(index) {
        if (typeof index.parent === 'undefined')
            return 0;
        let currentParent = index.parent;
        let currentParentLevel = 1;
        while (typeof currentParent.parent !== 'undefined') {
            currentParentLevel++;
            currentParent = currentParent.parent;
        }
        return currentParentLevel;
    }
    /**
     * Stream buffer
     *
     * @param {(TStreamCallback} callback
     */
    stream(callback) {
        if (this.buffer && this.indexedBuffer) {
            for (let i = 0, j = 0, len = this.indexedBuffer.length; i < len; i++) {
                const currentIndexing = this.indexedBuffer[i];
                callback({
                    buffer: this.buffer,
                    frameLength: currentIndexing.frameLength,
                    frameBufferIndex: j,
                    currentIndexing: currentIndexing,
                    currentShapeIndex: i,
                    totalShapes: len,
                });
                j += currentIndexing.frameLength;
            }
        }
    }
    /**
     * Return empty propArguments
     *
     * @static
     * @param {ShapeBase} shape
     * @return {*}  {ISceneChildPropArguments}
     */
    static getEmptyPropArguments(shape, parentPropArguments) {
        // prettier-ignore
        const repetition = {
            type: _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Ring, angle: 0, index: 1, offset: 1, count: 1,
            row: { index: 1, offset: 1, count: 1 },
            col: { index: 1, offset: 1, count: 1 },
        };
        return {
            repetition,
            shape,
            parent: parentPropArguments,
        };
    }
}
/**
 * Empty buffer
 *
 * @internal
 * @ignore
 */
ShapeBase.EMPTY_BUFFER = new Float32Array(0);
/**
 * Empty BaseRepetition
 *
 * @internal
 * @ignore
 */
ShapeBase.getEmptySimpleRepetition = () => ({
    index: 1,
    offset: 1,
    count: 1,
});
/**
 * Empty Repetition
 *
 * @internal
 * @ignore
 */
ShapeBase.getEmptyRepetition = () => (Object.assign(Object.assign({ type: _types_scene_child__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType.Ring, angle: 0 }, ShapeBase.getEmptySimpleRepetition()), { row: ShapeBase.getEmptySimpleRepetition(), col: ShapeBase.getEmptySimpleRepetition() }));

//# sourceMappingURL=ShapeBase.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/ShapeBuffer.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/ShapeBuffer.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShapeBuffer": () => (/* binding */ ShapeBuffer)
/* harmony export */ });
/* harmony import */ var _types_shape_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/shape-base */ "./node_modules/@urpflanze/core/dist/types/shape-base.js");
/* harmony import */ var _math_bounding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../math/bounding */ "./node_modules/@urpflanze/core/dist/math/bounding.js");
/* harmony import */ var _shapes_ShapePrimitive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shapes/ShapePrimitive */ "./node_modules/@urpflanze/core/dist/shapes/ShapePrimitive.js");



/**
 * @category Core.Shapes
 */
class ShapeBuffer extends _shapes_ShapePrimitive__WEBPACK_IMPORTED_MODULE_2__.ShapePrimitive {
    /**
     * Creates an instance of ShapeBuffer.
     *
     * @param {IShapeBufferSettings} [settings={}]
     */
    constructor(settings = {}) {
        var _a, _b;
        settings.type = settings.type || 'ShapeBuffer';
        settings.adaptMode = (_a = settings.adaptMode) !== null && _a !== void 0 ? _a : _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Scale;
        super(settings);
        this.adaptMode = (_b = settings.adaptMode) !== null && _b !== void 0 ? _b : _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.None;
        if (typeof settings.shape === 'undefined') {
            console.warn('[Urpflanze:ShapeBuffer] ShapeBuffer require a buffer passed from `shape` property');
            this.shape = ShapeBuffer.EMPTY_BUFFER;
        }
        else {
            this.shape = ShapeBuffer.adapt(settings.shape, _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Fill);
        }
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
    /**
     *  Unset buffer
     *
     * @param {boolean} [bClearIndexed=false]
     * @param {boolean} [bPropagateToParents=false]
     */
    clearBuffer(bClearIndexed = false, bPropagateToParents = true) {
        super.clearBuffer(bClearIndexed, bPropagateToParents);
        this.shapeBuffer = undefined;
    }
    /**
     * Apply sideLength on <mark>.shape</mark> buffer and calculate bounding
     *
     * @protected
     */
    bindBuffer(propArguments) {
        const sideLength = this.getRepetitionSideLength(propArguments);
        const shapeBuffer = this.shape;
        const tmpBounding = [undefined, undefined, undefined, undefined];
        for (let i = 0, len = shapeBuffer.length; i < len; i += 2) {
            shapeBuffer[i] *= sideLength[0];
            shapeBuffer[i + 1] *= sideLength[1];
            _math_bounding__WEBPACK_IMPORTED_MODULE_1__.Bounding.add(tmpBounding, shapeBuffer[i], shapeBuffer[i + 1]);
        }
        _math_bounding__WEBPACK_IMPORTED_MODULE_1__.Bounding.bind(this.currentGenerationPrimitiveBounding, tmpBounding);
        this.shapeBuffer = shapeBuffer;
    }
    /**
     * Return length of buffer
     *
     * @param {ISceneChildPropArguments} propArguments
     * @returns {number}
     */
    getBufferLength( /*propArguments?: ISceneChildPropArguments*/) {
        if (this.buffer && this.buffer.length > 0)
            return this.buffer.length;
        return this.shape.length * this.getRepetitionCount();
    }
    /**
     * Return a buffer of children shape or loop generated buffer
     *
     * @protected
     * @param {number} generateId
     * @param {ISceneChildPropArguments} propArguments
     * @returns {Float32Array}
     */
    generateBuffer(generateId, propArguments) {
        if (typeof this.shapeBuffer === 'undefined' || typeof this.props.sideLength === 'function') {
            this.bindBuffer(propArguments);
        }
        return this.shapeBuffer;
    }
    /**
     * Set shape
     *
     * @param {(Float32Array)} [shape]
     */
    setShape(shape) {
        this.shape = ShapeBuffer.adapt(shape, _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Fill);
        this.clearBuffer(true);
    }
    /**
     * Subdivide buffer n times
     *
     * @param {number} [level=1]
     */
    subdivide(level = 1) {
        let subdivided = this.shape;
        if (subdivided && subdivided.length > 0) {
            for (let i = 0; i < level; i++)
                subdivided = ShapeBuffer.subdivide(subdivided, this.bClosed);
            this.setShape(subdivided);
        }
    }
    /**
     * Subdivide buffer
     *
     * @static
     * @param {Float32Array} shape
     * @param {boolean} [bClosed=true]
     * @returns {(Float32Array)}
     */
    static subdivide(shape, bClosed = true) {
        const shapeLength = shape.length;
        const subdivided = new Float32Array(shapeLength * 2 - (bClosed ? 0 : 2));
        for (let i = 0; i < shapeLength; i += 2) {
            if (i === 0) {
                subdivided[0] = shape[0];
                subdivided[1] = shape[1];
            }
            else {
                const px = shape[i - 2];
                const py = shape[i - 1];
                const x = shape[i];
                const y = shape[i + 1];
                const nx = (x + px) / 2;
                const ny = (y + py) / 2;
                subdivided[(i - 1) * 2] = nx;
                subdivided[(i - 1) * 2 + 1] = ny;
                subdivided[i * 2] = x;
                subdivided[i * 2 + 1] = y;
            }
        }
        if (bClosed) {
            subdivided[(shapeLength - 1) * 2] = (shape[0] + shape[shapeLength - 2]) / 2;
            subdivided[(shapeLength - 1) * 2 + 1] = (shape[1] + shape[shapeLength - 1]) / 2;
        }
        return subdivided;
    }
    /**
     * Return adaptMode
     *
     * @returns {EAdaptMode}
     * @memberof ShapeBase
     */
    getAdaptMode() {
        return this.adaptMode;
    }
    /**
     * Set adaptMode
     *
     * @param {EAdaptMode} bAdapted
     * @memberof ShapeBase
     */
    adapt(adaptMode) {
        this.adaptMode = adaptMode;
        this.shape = ShapeBuffer.adapt(this.shape, _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Fill);
        this.clearBuffer(true);
    }
    /**
     * Return adapted buffer between [-1,-1] and [1,1]
     *
     * @public
     * @static
     * @param {Float32Array} input
     * @param {EAdaptMode} mode
     * @returns {Float32Array}
     * @memberof ShapeBuffer
     */
    static adapt(input, mode, rect) {
        if (mode === _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.None)
            return Float32Array.from(input);
        const output = new Float32Array(input.length);
        if (!rect) {
            rect = ShapeBuffer.getBounding(input);
        }
        const scale = rect.width >= 2 || rect.height >= 2 || (mode >= _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Fill && (rect.width < 2 || rect.height < 2))
            ? 2 / Math.max(rect.width, rect.height)
            : 1;
        const translateX = mode >= _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Center ? rect.cx : 0;
        const translateY = mode >= _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.Center ? rect.cy : 0;
        for (let i = 0, len = input.length; i < len; i += 2) {
            output[i] = (input[i] - translateX) * scale;
            output[i + 1] = (input[i + 1] - translateY) * scale;
        }
        return output;
    }
    /**
     * Get buffer bounding
     *
     * @static
     * @param {Float32Array | Array<number>} buffer
     * @returns {IShapeBounding}
     * @memberof ShapePrimitive
     */
    static getBounding(buffer, bounding) {
        if (typeof bounding === 'undefined')
            bounding = _math_bounding__WEBPACK_IMPORTED_MODULE_1__.Bounding.empty();
        const tmp_bounding = [undefined, undefined, undefined, undefined];
        for (let i = 0, len = buffer.length; i < len; i += 2) {
            _math_bounding__WEBPACK_IMPORTED_MODULE_1__.Bounding.add(tmp_bounding, buffer[i], buffer[i + 1]);
        }
        _math_bounding__WEBPACK_IMPORTED_MODULE_1__.Bounding.bind(bounding, tmp_bounding);
        return bounding;
    }
}

//# sourceMappingURL=ShapeBuffer.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js":
/*!***************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShapeLoop": () => (/* binding */ ShapeLoop)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../math */ "./node_modules/@urpflanze/core/dist/math/index.js");
/* harmony import */ var _math_bounding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../math/bounding */ "./node_modules/@urpflanze/core/dist/math/bounding.js");
/* harmony import */ var _shapes_ShapePrimitive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shapes/ShapePrimitive */ "./node_modules/@urpflanze/core/dist/shapes/ShapePrimitive.js");
/* harmony import */ var _ShapeBase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ShapeBase */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBase.js");




/**
 * Shape Loop
 *
 * @category Core.Shapes
 * @public
 * @class ShapeLoop
 * @extends {ShapePrimitive}
 */
class ShapeLoop extends _shapes_ShapePrimitive__WEBPACK_IMPORTED_MODULE_2__.ShapePrimitive {
    /**
     * Creates an instance of ShapeLoop.
     *
     * @param {IShapeLoopSettings} [settings={}]
     * @param {boolean} [bPreventGeneration=false]
     */
    constructor(settings = {}, bPreventGeneration = false) {
        settings.type = settings.type || 'ShapeLoop';
        super(settings);
        this.loopDependencies = (settings.loopDependencies || []).concat('sideLength');
        this.props.loop = settings.loop;
        if (!bPreventGeneration) {
            this.loop = {
                start: 0,
                end: _math__WEBPACK_IMPORTED_MODULE_0__.PI2,
                inc: _math__WEBPACK_IMPORTED_MODULE_0__.PI2 / 10,
                vertex: () => [0, 0],
            };
            this.bStaticLoop = this.isStaticLoop();
            this.bStatic = this.isStatic();
            this.bStaticIndexed = this.isStaticIndexed();
        }
    }
    /**
     * Check if currentOrSingleLoopBuffer is static
     *
     * @returns {boolean}
     */
    isStaticLoop() {
        if (this.loopDependencies.includes('propArguments'))
            return false;
        for (let i = 0, len = this.loopDependencies.length; i < len; i++)
            if (typeof this.props[this.loopDependencies[i]] === 'function')
                return false;
        return true;
    }
    /**
     * Check if shape is static
     *
     * @returns {boolean}
     */
    isStatic() {
        return this.bStaticLoop && super.isStatic();
    }
    /**
     * Check if shape has static indexed
     *
     * @returns {boolean}
     */
    isStaticIndexed() {
        return this.bStaticLoop && super.isStaticIndexed();
    }
    /**
     *  Unset buffer
     *
     * @param {boolean} [bClearIndexed=false]
     * @param {boolean} [bPropagateToParents=false]
     */
    clearBuffer(bClearIndexed = false, bPropagateToParents = true) {
        this.bStaticLoop = this.isStaticLoop();
        if (bClearIndexed) {
            this.currentOrSingleLoopBuffer = undefined;
        }
        super.clearBuffer(bClearIndexed, bPropagateToParents);
    }
    /**
     * Set single or multiple props
     *
     * @param {(K)} key
     * @param {*} [value]
     * @param {boolean} [bClearIndexed=false]
     */
    setProp(key, value) {
        let bClearIndexed = false;
        const keys = typeof key === 'string' ? { [key]: value } : key;
        for (let i = this.loopDependencies.length - 1; i >= 0; i--) {
            if (this.loopDependencies[i] in keys) {
                // this.props.loop = undefined
                bClearIndexed = true;
                break;
            }
        }
        if ('loop' in keys) {
            keys.loop = Object.assign(Object.assign({}, this.props.loop), keys.loop);
            bClearIndexed = true;
        }
        super.setProp(keys, value, bClearIndexed);
    }
    /**
     * Return length of buffer
     *
     * @param {ISceneChildPropArguments} [propArguments]
     * @returns {number}
     */
    getBufferLength(propArguments) {
        if (this.bStatic && typeof this.buffer !== 'undefined')
            return this.buffer.length;
        if (this.bStaticLoop && typeof this.currentOrSingleLoopBuffer !== 'undefined')
            return this.currentOrSingleLoopBuffer.length * this.getRepetitionCount();
        const { count } = this.getLoop(propArguments || _ShapeBase__WEBPACK_IMPORTED_MODULE_3__.ShapeBase.getEmptyPropArguments(this));
        return this.getRepetitionCount() * count * 2;
    }
    /**
     * Return a buffer of children shape or loop generated buffer
     *
     * @protected
     * @param {number} generateId
     * @param {ISceneChildPropArguments} propArguments
     * @returns {Float32Array}
     */
    generateBuffer(generateId, propArguments) {
        if (!this.bStaticLoop)
            return this.generateLoopBuffer(propArguments);
        if (typeof this.props.sideLength === 'function' || typeof this.currentOrSingleLoopBuffer === 'undefined')
            this.currentOrSingleLoopBuffer = this.generateLoopBuffer(propArguments);
        return this.currentOrSingleLoopBuffer;
    }
    /**
     * Generate loop buffer
     *
     * @protected
     * @param {ISceneChildPropArguments} propArguments
     * @returns {Float32Array}
     */
    generateLoopBuffer(propArguments) {
        const { start, inc, /*end,*/ count } = this.getLoop(propArguments);
        const sideLength = this.getRepetitionSideLength(propArguments);
        const getVertex = (this.props.loop && this.props.loop.vertex
            ? this.props.loop.vertex
            : this.loop.vertex);
        const shapeLoop = {
            index: 0,
            offset: 0,
            current: 0,
            count: count,
        };
        const vertexLength = shapeLoop.count;
        const bufferLength = vertexLength * 2;
        const currentOrSingleLoopBuffer = new Float32Array(bufferLength);
        const tmpBounding = [undefined, undefined, undefined, undefined];
        for (let i = 0, j = 0; i < vertexLength; i++, j += 2) {
            const current = start + inc * i;
            const offset = shapeLoop.count > 1 ? i / (shapeLoop.count - 1) : 1;
            // const angle = (end - start) * offset + start
            shapeLoop.current = current;
            shapeLoop.index = i + 1;
            shapeLoop.offset = offset;
            const vertex = Float32Array.from(getVertex(shapeLoop, propArguments));
            currentOrSingleLoopBuffer[j] = vertex[0];
            currentOrSingleLoopBuffer[j + 1] = vertex[1];
            currentOrSingleLoopBuffer[j] *= sideLength[0];
            currentOrSingleLoopBuffer[j + 1] *= sideLength[1];
            _math_bounding__WEBPACK_IMPORTED_MODULE_1__.Bounding.add(tmpBounding, currentOrSingleLoopBuffer[j], currentOrSingleLoopBuffer[j + 1]);
        }
        _math_bounding__WEBPACK_IMPORTED_MODULE_1__.Bounding.bind(this.currentGenerationPrimitiveBounding, tmpBounding);
        return currentOrSingleLoopBuffer;
    }
    /**
     * Return information about a client loop gnerator
     *
     * @public
     * @param {ISceneChildPropArguments} propArguments
     * @returns {ShapeLoopInformation}
     */
    getLoop(propArguments) {
        var _a, _b, _c, _d, _e, _f;
        let start = (_b = (_a = this.props.loop) === null || _a === void 0 ? void 0 : _a.start) !== null && _b !== void 0 ? _b : this.loop.start;
        let end = (_d = (_c = this.props.loop) === null || _c === void 0 ? void 0 : _c.end) !== null && _d !== void 0 ? _d : this.loop.end;
        let inc = (_f = (_e = this.props.loop) === null || _e === void 0 ? void 0 : _e.inc) !== null && _f !== void 0 ? _f : this.loop.inc;
        start = (typeof start === 'function' ? start(propArguments) : start);
        end = (typeof end === 'function' ? end(propArguments) : end);
        inc = (typeof inc === 'function' ? inc(propArguments) : inc);
        const count = Math.ceil((end - start) / inc);
        return { start, end, inc, count: count <= 0 ? 0 : count };
    }
    /**
     * Subdivide loop n times
     *
     * @param {number} [level=1]
     */
    subdivide(level = 1) {
        const currentLoop = this.props.loop || this.loop;
        // TODO: subdivide function?
        if (typeof currentLoop.inc === 'number') {
            currentLoop.inc = (currentLoop.inc || 1) / 2 ** level;
            this.setProp('loop', currentLoop);
        }
    }
    /**
     * Set shape from loop generator
     *
     * @param {(IShapeLoopGenerator)} [shape]
     */
    setShape(loop) {
        this.setProp('loop', loop);
    }
}
ShapeLoop.PId2 = Math.PI / 2;

//# sourceMappingURL=ShapeLoop.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/ShapePrimitive.js":
/*!********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/ShapePrimitive.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShapePrimitive": () => (/* binding */ ShapePrimitive)
/* harmony export */ });
/* harmony import */ var _ShapeBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShapeBase */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBase.js");
/* harmony import */ var _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../math/gl-matrix-extensions */ "./node_modules/@urpflanze/core/dist/math/gl-matrix-extensions.js");
/* harmony import */ var _math_bounding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../math/bounding */ "./node_modules/@urpflanze/core/dist/math/bounding.js");



/**
 * @category Core.Abstract
 */
class ShapePrimitive extends _ShapeBase__WEBPACK_IMPORTED_MODULE_0__.ShapeBase {
    /**
     * Creates an instance of ShapePrimitive.
     *
     * @param {IShapePrimitiveSettings} [settings={}]
     */
    constructor(settings = {}) {
        var _a;
        super(settings);
        /**
         * Contain the bounding of the last generated buffer
         *
         * @type {IShapeBounding}
         */
        this.currentGenerationPrimitiveBounding = _math_bounding__WEBPACK_IMPORTED_MODULE_2__.Bounding.empty();
        this.props.sideLength =
            typeof settings.sideLength === 'undefined'
                ? undefined
                : typeof settings.sideLength === 'function'
                    ? settings.sideLength
                    : _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_1__.toVec2(settings.sideLength);
        this.drawer = settings.drawer || {};
        this.bClosed = (_a = settings.bClosed) !== null && _a !== void 0 ? _a : true;
    }
    /**
     * Check if shape is static
     *
     * @returns {boolean}
     * @memberof ShapePrimitive
     */
    isStatic() {
        return typeof this.props.sideLength !== 'function' && super.isStatic();
    }
    getRepetitionSideLength(propArguments) {
        if (this.bStatic) {
            // not set default value into constructor because it can be overridden by group
            if (typeof this.props.sideLength === 'undefined') {
                this.props.sideLength = [50, 50];
            }
            else if (typeof this.props.sideLength === 'number') {
                this.props.sideLength = [this.props.sideLength, this.props.sideLength];
            }
            return this.props.sideLength;
        }
        return _math_gl_matrix_extensions__WEBPACK_IMPORTED_MODULE_1__.toVec2(this.getProp('sideLength', propArguments, [50, 50]));
    }
    /**
     * Return a bounding of generated buffer if is direct scene child
     *
     * @returns {IShapeBounding}
     * @memberof ShapePrimitive
     */
    getShapeBounding() {
        return this.currentGenerationPrimitiveBounding;
    }
    /**
     * Add this to indexedBuffer
     *
     * @protected
     * @param {number} frameLength
     * @param {IRepetition} repetition
     * @returns {number} nextIndex
     */
    addIndex(frameLength, repetition, recursion
    // singleRepetitionBounding: IShapeBounding
    ) {
        const index = {
            shape: this,
            frameLength,
            // singleRepetitionBounding,
            repetition: {
                type: repetition.type,
                angle: repetition.angle,
                index: repetition.index,
                count: repetition.count,
                offset: repetition.offset,
                row: {
                    index: repetition.row.index,
                    count: repetition.row.count,
                    offset: repetition.row.offset,
                },
                col: {
                    index: repetition.col.index,
                    count: repetition.col.count,
                    offset: repetition.col.offset,
                },
            },
        };
        if (typeof recursion !== 'undefined') {
            index.recursion = {
                index: recursion.index,
                offset: recursion.offset,
                count: recursion.offset,
                level: recursion.level,
            };
        }
        this.indexedBuffer.push(index);
    }
    /**
     * Return bClosed
     *
     * @returns {boolean}
     * @memberof ShapePrimitive
     */
    isClosed() {
        return this.bClosed;
    }
    /**
     * Set bClosed
     *
     * @param {boolean} bClosed
     * @memberof ShapePrimitive
     */
    setClosed(bClosed) {
        this.bClosed = bClosed;
    }
}

//# sourceMappingURL=ShapePrimitive.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/ShapeRecursive.js":
/*!********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/ShapeRecursive.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShapeRecursive": () => (/* binding */ ShapeRecursive)
/* harmony export */ });
/* harmony import */ var _shapes_Shape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shapes/Shape */ "./node_modules/@urpflanze/core/dist/shapes/Shape.js");

/**
 * @category Core.Shapes
 */
class ShapeRecursive extends _shapes_Shape__WEBPACK_IMPORTED_MODULE_0__.Shape {
    /**
     * Creates an instance of ShapeRecursive.
     *
     * @param {IShapeRecursiveSettings} [settings={}]
     */
    constructor(settings = {}) {
        settings.type = settings.type || 'ShapeRecursive';
        super(settings);
        this.props.recursions = settings.recursions || 1;
        this.props.recursionScale = settings.recursionScale || 2;
        this.props.recursionVertex = settings.recursionVertex || 0;
        // this.bInner = settings.bInner ?? false
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
        // this.currentGenerationRecursiveBounding = Bounding.empty()
    }
    /**
     *  Unset buffer
     *
     * @param {boolean} [bClearIndexed=false]
     * @param {boolean} [bPropagateToParents=false]
     * @param {boolean} [bPropagateToChildren=false]
     */
    clearBuffer(bClearIndexed = false, bPropagateToParents = true) {
        if (bClearIndexed) {
            this.shapeRecursiveBuffer = undefined;
        }
        super.clearBuffer(bClearIndexed, bPropagateToParents);
    }
    // /**
    //  * Set type of recursion
    //  *
    //  * @param {boolean} inner
    //  */
    // public setRecursionnInner(inner: boolean): void {
    // 	this.bInner = inner
    // 	this.clearBuffer(true)
    // }
    /**
     *
     * @returns {boolean}
     */
    isStatic() {
        return (typeof this.props.recursions !== 'function' &&
            typeof this.props.recursionScale !== 'function' &&
            typeof this.props.recursionVertex !== 'function' &&
            super.isStatic());
    }
    /**
     *
     * @returns {boolean}
     */
    isStaticIndexed() {
        return (typeof this.props.recursions !== 'function' &&
            typeof this.props.recursionVertex !== 'function' &&
            super.isStaticIndexed());
    }
    /**
     * Return a buffer of children shape with recursion
     *
     * @protected
     * @param {number} generateId
     * @param {ISceneChildPropArguments} propArguments
     * @returns {Float32Array}
     */
    generateBuffer(generateId, propArguments) {
        if (!this.isStatic() || typeof this.shapeRecursiveBuffer === 'undefined') {
            this.bindBuffer(generateId, propArguments);
        }
        return this.shapeRecursiveBuffer;
    }
    /**
     * Generate Recoursive shape buffer
     *
     * @protected
     * @param {number} generateId
     * @param {ISceneChildPropArguments} propArguments
     */
    bindBuffer(generateId, propArguments) {
        if (typeof this.shape === 'undefined') {
            this.shapeRecursiveBuffer = _shapes_Shape__WEBPACK_IMPORTED_MODULE_0__.Shape.EMPTY_BUFFER;
            return;
        }
        const recursions = Math.floor(this.getProp('recursions', propArguments, 1));
        const recursionVertex = Math.floor(this.getProp('recursionVertex', propArguments, 0));
        const recursionScale = this.getProp('recursionScale', propArguments, 2);
        let currentRecursionRepetition = {
            index: 1,
            offset: 1,
            count: 1,
            level: { index: 1, offset: recursions > 1 ? 0 : 1, count: 1 },
        };
        if (recursions <= 1) {
            const buffer = this.generateShapeBuffer(propArguments, generateId, currentRecursionRepetition);
            // this.currentGenerationRecursiveBounding = this.shape.getBounding()
            this.shapeRecursiveBuffer = buffer;
            return;
        }
        let shapeBuffer = this.generateShapeBuffer(propArguments, generateId, currentRecursionRepetition);
        const storedRecursion = [currentRecursionRepetition];
        let paretRecursionIndex = 0, added = 1;
        // const tmpBounding = [undefined, undefined, undefined, undefined]
        const singleShapeBufferLength = shapeBuffer.length;
        const realVertexCount = singleShapeBufferLength / 2;
        const singleShapeVertexCount = recursionVertex <= 0 ? realVertexCount : Math.min(recursionVertex, realVertexCount);
        const recursionOffsetMultiplier = recursionVertex === 0 ? 1 : realVertexCount / Math.min(recursionVertex, realVertexCount);
        const recusiveShapeBuffer = new Float32Array(ShapeRecursive.summmation(recursions, singleShapeVertexCount) * singleShapeBufferLength);
        for (let i = 0; i < singleShapeBufferLength; i += 2) {
            recusiveShapeBuffer[i] = shapeBuffer[i];
            recusiveShapeBuffer[i + 1] = shapeBuffer[i + 1];
            // Bounding.add(tmpBounding, recusiveShapeBuffer[i], recusiveShapeBuffer[i + 1])
        }
        for (let currentRecursion = 1; currentRecursion < recursions; currentRecursion++) {
            const level_offset = recursions > 1 ? currentRecursion / (recursions - 1) : 1;
            const currentRecursionVertexCount = ShapeRecursive.summmation(currentRecursion, singleShapeVertexCount);
            const recursionBufferStartIndex = currentRecursionVertexCount * singleShapeBufferLength;
            const parentRecursion = currentRecursion - 1;
            const parentRecursionBufferStartIndex = parentRecursion === 0
                ? 0
                : ShapeRecursive.summmation(parentRecursion, singleShapeVertexCount) * singleShapeBufferLength;
            for (let currentShapeRecursionRepetition = 0, totalRecursionRepetitions = singleShapeVertexCount ** currentRecursion; currentShapeRecursionRepetition < totalRecursionRepetitions; currentShapeRecursionRepetition++, added++) {
                currentRecursionRepetition = {
                    index: currentShapeRecursionRepetition + 1,
                    offset: totalRecursionRepetitions > 1 ? currentShapeRecursionRepetition / (totalRecursionRepetitions - 1) : 1,
                    count: totalRecursionRepetitions,
                    level: { index: currentRecursion + 1, offset: level_offset, count: recursions },
                    parent: storedRecursion[paretRecursionIndex],
                };
                storedRecursion.push(currentRecursionRepetition);
                shapeBuffer = this.generateShapeBuffer(propArguments, generateId, currentRecursionRepetition);
                const shapeVertexBufferIndex = recursionBufferStartIndex + currentShapeRecursionRepetition * singleShapeBufferLength;
                // const centerVertexIndex = parentRecursionBufferStartIndex + currentShapeRecursionRepetition * 2
                const centerVertexIndex = Math.floor(parentRecursionBufferStartIndex + currentShapeRecursionRepetition * 2 * recursionOffsetMultiplier);
                const centerX = recusiveShapeBuffer[centerVertexIndex];
                const centerY = recusiveShapeBuffer[centerVertexIndex + 1];
                const currentRecursionScale = recursionScale ** currentRecursion;
                for (let i = 0, len = singleShapeBufferLength; i < len; i += 2) {
                    // if (this.bInner) {
                    // 	const parentCurrentVertex =
                    // 		parentRecursionBufferStartIndex +
                    // 		Math.floor(currentShapeRecursionRepetition / singleShapeVertexCount) *
                    // 			singleShapeVertexCount *
                    // 			recursionOffsetMultiplier *
                    // 			2
                    // 	const parentX = recusiveShapeBuffer[parentCurrentVertex + i]
                    // 	const parentY = recusiveShapeBuffer[parentCurrentVertex + i + 1]
                    // 	recusiveShapeBuffer[shapeVertexBufferIndex + i] = (centerX - parentX) / recursionScale + parentX
                    // 	recusiveShapeBuffer[shapeVertexBufferIndex + i + 1] = (centerY - parentY) / recursionScale + parentY
                    // const parentX = shapeBuffer[i] / recursionScale ** currentRecursion
                    // const parentY = shapeBuffer[i + 1] / recursionScale ** currentRecursion
                    // recusiveShapeBuffer[shapeVertexBufferIndex + i] = (centerX - parentX) / recursionScale + parentX
                    // recusiveShapeBuffer[shapeVertexBufferIndex + i + 1] = (centerY - parentY) / recursionScale + parentY
                    // } else {
                    const parentXScaled = shapeBuffer[i] / currentRecursionScale;
                    const parentYScaled = shapeBuffer[i + 1] / currentRecursionScale;
                    recusiveShapeBuffer[shapeVertexBufferIndex + i] = centerX + parentXScaled;
                    recusiveShapeBuffer[shapeVertexBufferIndex + i + 1] = centerY + parentYScaled;
                    // }
                    // Bounding.add(
                    // 	tmpBounding,
                    // 	recusiveShapeBuffer[shapeVertexBufferIndex + i],
                    // 	recusiveShapeBuffer[shapeVertexBufferIndex + i + 1]
                    // )
                }
                if (added % singleShapeVertexCount === 0) {
                    paretRecursionIndex += 1;
                }
            }
        }
        // Bounding.bind(this.currentGenerationRecursiveBounding, tmpBounding)
        this.shapeRecursiveBuffer = recusiveShapeBuffer;
    }
    generateShapeBuffer(propArguments, generateId, recursionRepetition) {
        propArguments.recursion = recursionRepetition;
        return super.generateBuffer(generateId, propArguments);
    }
    /**
     * Add this to indexedBuffer
     *
     * @protected
     * @param {number} frameLength
     * @param {IRepetition} repetition
     * @returns {number} nextIndex
     */
    addIndex(frameLength, repetition, recursion
    // singleRepetitionBounding: IShapeBounding
    ) {
        if (this.shape) {
            const propArguments = { repetition, shape: this };
            const recursions = Math.floor(this.getProp('recursions', propArguments, 1));
            const recursionVertex = Math.floor(this.getProp('recursionVertex', propArguments, 0));
            // const realFrameLength = ShapeRecursive.summmation(recursions, this.shape.getBufferLength() / 2)
            const bufferIndex = {
                shape: this,
                frameLength: frameLength,
                // singleRepetitionBounding,
                repetition: {
                    type: repetition.type,
                    angle: repetition.angle,
                    index: repetition.index,
                    count: repetition.count,
                    offset: repetition.offset,
                    row: {
                        index: repetition.row.index,
                        count: repetition.row.count,
                        offset: repetition.row.offset,
                    },
                    col: {
                        index: repetition.col.index,
                        count: repetition.col.count,
                        offset: repetition.col.offset,
                    },
                },
            };
            if (typeof recursion !== 'undefined') {
                bufferIndex.recursion = {
                    index: recursion.index,
                    offset: recursion.offset,
                    count: recursion.offset,
                    level: recursion.level,
                };
            }
            const childIndexedBuffer = this.shape.getIndexedBuffer() || [];
            for (let childIndexed = 0, childIndexedLen = childIndexedBuffer.length; childIndexed < childIndexedLen; childIndexed++) {
                const currentIndexed = Object.assign({}, childIndexedBuffer[childIndexed]);
                const currentRecursionRepetition = {
                    index: 1,
                    offset: 1,
                    count: 1,
                    level: { index: 1, offset: recursions > 1 ? 0 : 1, count: recursions },
                };
                const recursionBufferIndex = Object.assign(Object.assign({}, bufferIndex), { recursion: currentRecursionRepetition });
                currentIndexed.parent = currentIndexed.parent
                    ? _shapes_Shape__WEBPACK_IMPORTED_MODULE_0__.Shape.setIndexedParent(currentIndexed.parent, recursionBufferIndex)
                    : recursionBufferIndex;
                this.indexedBuffer.push(currentIndexed);
            }
            if (recursions > 1) {
                const realVertexCount = this.shape.getBufferLength(propArguments) / 2;
                const vertexCount = recursionVertex <= 0 ? realVertexCount : Math.min(recursionVertex, realVertexCount);
                const storedRecursion = this.indexedBuffer.map(indexed => [
                    indexed.parent.recursion,
                ]);
                let paretRecursionIndex = 0, added = 1;
                for (let i = 1; i < recursions; i++) {
                    const level_offset = recursions > 1 ? i / (recursions - 1) : 1;
                    for (let j = 0, len = vertexCount ** i; j < len; j++, added++) {
                        const recursionOffset = len > 1 ? j / (len - 1) : 1;
                        for (let childIndexed = 0, childIndexedLen = childIndexedBuffer.length; childIndexed < childIndexedLen; childIndexed++) {
                            const currentIndexed = Object.assign({}, childIndexedBuffer[childIndexed]);
                            const currentRecursionRepetition = {
                                index: j + 1,
                                offset: recursionOffset,
                                count: len,
                                level: { index: i + 1, offset: level_offset, count: recursions },
                                parent: storedRecursion[childIndexed][paretRecursionIndex],
                            };
                            const recursionBufferIndex = Object.assign(Object.assign({}, bufferIndex), { recursion: currentRecursionRepetition });
                            currentIndexed.parent = currentIndexed.parent
                                ? _shapes_Shape__WEBPACK_IMPORTED_MODULE_0__.Shape.setIndexedParent(currentIndexed.parent, recursionBufferIndex)
                                : recursionBufferIndex;
                            this.indexedBuffer.push(currentIndexed);
                            storedRecursion[childIndexed].push(currentRecursionRepetition);
                            if (added % vertexCount === 0) {
                                paretRecursionIndex += 1;
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * Retturn summation value
     *
     * @static
     * @param {number} recursion
     * @param {number} vertexCount
     * @returns {number}
     */
    static summmation(recursion, vertexCount) {
        if (recursion === 1)
            return 1;
        let result = 1;
        for (let i = 1; i < recursion; i++)
            result += vertexCount ** i;
        return result;
    }
    /**
     * Empty recursion repetition
     *
     * @static
     * @return {*}  {IRecursionRepetition}
     */
    static getEmptyRecursion() {
        return {
            index: 1,
            offset: 1,
            count: 1,
            level: { index: 1, offset: 1, count: 1 },
        };
    }
}

//# sourceMappingURL=ShapeRecursive.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Circle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Circle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Circle": () => (/* binding */ Circle)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../math */ "./node_modules/@urpflanze/core/dist/math/index.js");
/* harmony import */ var _ShapeLoop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ShapeLoop */ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js");


/**
 *
 * @category Core.Primitives
 * @class Circle
 * @extends {ShapeLoop}
 */
class Circle extends _ShapeLoop__WEBPACK_IMPORTED_MODULE_1__.ShapeLoop {
    /**
     * Creates an instance of Circle.
     *
     * @param {ShapeLoopSettings} [settings={}]
     * @memberof Circle
     */
    constructor(settings = {}) {
        settings.type = 'Circle';
        super(settings, true);
        this.loop = {
            start: 0,
            end: _math__WEBPACK_IMPORTED_MODULE_0__.PI2,
            inc: propArguments => {
                const sideLength = this.getRepetitionSideLength(propArguments);
                return (1 / Math.pow(sideLength[0] * sideLength[1], 0.25)) * _ShapeLoop__WEBPACK_IMPORTED_MODULE_1__.ShapeLoop.PId2;
            },
            vertex: shapeLoopRepetition => [Math.cos(shapeLoopRepetition.current), Math.sin(shapeLoopRepetition.current)],
        };
        this.bStaticLoop = this.isStaticLoop();
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
}

//# sourceMappingURL=Circle.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Line.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Line.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Line": () => (/* binding */ Line)
/* harmony export */ });
/* harmony import */ var _types_shape_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types/shape-base */ "./node_modules/@urpflanze/core/dist/types/shape-base.js");
/* harmony import */ var _ShapeBuffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ShapeBuffer */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBuffer.js");


/**
 *
 * @category Core.Primitives
 * @class Line
 * @extends {ShapeBuffer}
 */
class Line extends _ShapeBuffer__WEBPACK_IMPORTED_MODULE_1__.ShapeBuffer {
    /**
     * Creates an instance of Line.
     *
     * @param {ShapeBaseSettings} [settings={}]
     * @memberof Line
     */
    constructor(settings = {}) {
        settings.type = 'Line';
        settings.shape = [-1, 0, 1, 0];
        settings.adaptMode = _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.None;
        settings.bClosed = false;
        super(settings);
    }
}

//# sourceMappingURL=Line.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Lissajous.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Lissajous.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Lissajous": () => (/* binding */ Lissajous)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../math */ "./node_modules/@urpflanze/core/dist/math/index.js");
/* harmony import */ var _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shapes/ShapeLoop */ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js");


/**
 * Lissajous shape
 *
 * @category Core.Primitives
 * @class Lissajous
 * @extends {ShapeLoop}
 */
class Lissajous extends _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_1__.ShapeLoop {
    /**
     * Creates an instance of Lissajous.
     *
     * @param {ILissajousSettings} [settings={}]
     * @memberof Lissajous
     */
    constructor(settings = {}) {
        settings.type = 'Lissajous';
        settings.loopDependencies = (settings.loopDependencies || []).concat(['wx', 'wy', 'wz']);
        super(settings, true);
        this.props.wx = settings.wx || 1;
        this.props.wy = settings.wy || 2;
        this.props.wz = settings.wz || 0;
        this.loop = {
            start: 0,
            end: _math__WEBPACK_IMPORTED_MODULE_0__.PI2,
            inc: propArguments => {
                const wx = this.getProp('wx', propArguments);
                const wy = this.getProp('wy', propArguments);
                const ratio = wx == wy ? _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_1__.ShapeLoop.PId2 : 0.5 - Math.min(49, wx + wy) * 0.01;
                const sideLength = this.getRepetitionSideLength(propArguments);
                return (1 / Math.pow(sideLength[0] * sideLength[1], 0.25)) * ratio;
            },
            vertex: (shapeLoopRepetition) => {
                return this.wx === this.wy
                    ? [Math.cos(shapeLoopRepetition.current + this.wz), Math.sin(shapeLoopRepetition.current)]
                    : [Math.cos(this.wx * shapeLoopRepetition.current + this.wz), Math.sin(this.wy * shapeLoopRepetition.current)];
            },
        };
        this.bStaticLoop = this.isStaticLoop();
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
    generateLoopBuffer(propArguments) {
        this.wx = this.getProp('wx', propArguments, 1);
        this.wy = this.getProp('wy', propArguments, 2);
        this.wz = this.getProp('wz', propArguments, 2);
        return super.generateLoopBuffer(propArguments);
    }
}

//# sourceMappingURL=Lissajous.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Polygon.js":
/*!************************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Polygon.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Polygon": () => (/* binding */ Polygon)
/* harmony export */ });
/* harmony import */ var _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shapes/ShapeLoop */ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../math */ "./node_modules/@urpflanze/core/dist/math/index.js");


/**
 * Polygon shape
 *
 * @category Core.Primitives
 * @class Polygon
 * @extends {ShapeLoop}
 */
class Polygon extends _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop {
    constructor(settings = {}) {
        settings.type = settings.type || 'Polygon';
        settings.loopDependencies = (settings.loopDependencies || []).concat(['sideNumber']);
        super(settings, true);
        this.props.sideNumber = settings.sideNumber;
        this.loop = {
            start: 0,
            end: _math__WEBPACK_IMPORTED_MODULE_1__.PI2,
            inc: (propArguments) => {
                return _math__WEBPACK_IMPORTED_MODULE_1__.PI2 / this.getProp('sideNumber', propArguments, 5);
            },
            vertex: shapeLoopRepetition => {
                return [Math.cos(shapeLoopRepetition.current), Math.sin(shapeLoopRepetition.current)];
            },
        };
        this.bStaticLoop = this.isStaticLoop();
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
}

//# sourceMappingURL=Polygon.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Rect.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Rect.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rect": () => (/* binding */ Rect)
/* harmony export */ });
/* harmony import */ var _types_shape_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types/shape-base */ "./node_modules/@urpflanze/core/dist/types/shape-base.js");
/* harmony import */ var _shapes_ShapeBuffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shapes/ShapeBuffer */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBuffer.js");


/**
 *
 * @category Core.Primitives
 * @class Rect
 * @extends {ShapeBuffer}
 */
class Rect extends _shapes_ShapeBuffer__WEBPACK_IMPORTED_MODULE_1__.ShapeBuffer {
    /**
     * Creates an instance of Rect.
     *
     * @param {ShapeBaseSettings} [settings={}]
     * @memberof Rect
     */
    constructor(settings = {}) {
        settings.type = 'Rect';
        settings.shape = [-1, -1, 1, -1, 1, 1, -1, 1];
        settings.adaptMode = _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.None;
        super(settings);
    }
}

//# sourceMappingURL=Rect.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Rose.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Rose.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rose": () => (/* binding */ Rose)
/* harmony export */ });
/* harmony import */ var _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shapes/ShapeLoop */ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../math */ "./node_modules/@urpflanze/core/dist/math/index.js");


/**
 * Rose shape
 *
 * @category Core.Primitives
 * @class Rose
 * @extends {ShapeLoop}
 */
class Rose extends _shapes_ShapeLoop__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop {
    /**
     * Creates an instance of Rose.
     *
     * @param {IRoseSettings} [settings={}]
     * @memberof Rose
     */
    constructor(settings = {}) {
        var _a, _b;
        settings.type = 'Rose';
        settings.loopDependencies = (settings.loopDependencies || []).concat(['n', 'd']);
        super(settings, true);
        this.props.n = (_a = settings.n) !== null && _a !== void 0 ? _a : 1;
        this.props.d = (_b = settings.d) !== null && _b !== void 0 ? _b : 2;
        this.loop = {
            start: 0,
            end: (propArguments) => Rose.getFinalAngleFromK(this.getProp('n', propArguments), this.getProp('d', propArguments)),
            inc: (propArguments) => {
                const n = this.getProp('n', propArguments);
                const d = this.getProp('d', propArguments);
                const sideLength = this.getRepetitionSideLength(propArguments);
                const sides = Math.pow(sideLength[0] * sideLength[1], 0.45);
                const k = d < n ? n / d : 1.5;
                return _math__WEBPACK_IMPORTED_MODULE_1__.PI2 / (sides * k);
            },
            vertex: (shapeLoopRepetition) => {
                const f = Math.cos(this.k * shapeLoopRepetition.current);
                return [f * Math.cos(shapeLoopRepetition.current), f * Math.sin(shapeLoopRepetition.current)];
            },
        };
        this.bStaticLoop = this.isStaticLoop();
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
    generateLoopBuffer(propArguments) {
        this.k = this.getProp('n', propArguments) / this.getProp('d', propArguments);
        return super.generateLoopBuffer(propArguments);
    }
    /**
     * Return end angle of rose
     *
     * @static
     * @param {number} n
     * @param {number} d
     * @returns {number}
     * @memberof Rose
     */
    static getFinalAngleFromK(n, d) {
        if (n == d)
            return _math__WEBPACK_IMPORTED_MODULE_1__.PI2;
        const k = n / d;
        const p = n * d;
        if (!Number.isInteger(k) && k % 0.5 == 0)
            return 4 * Math.PI;
        return Math.PI * d * (p % 2 == 0 ? 2 : 1);
    }
}

//# sourceMappingURL=Rose.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Spiral.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Spiral.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Spiral": () => (/* binding */ Spiral)
/* harmony export */ });
/* harmony import */ var _ShapeLoop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ShapeLoop */ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../math */ "./node_modules/@urpflanze/core/dist/math/index.js");


/**
 * Spiral shape
 *
 * @category Core.Primitives
 * @class Spiral
 * @extends {ShapeLoop}
 */
class Spiral extends _ShapeLoop__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop {
    /**
     * Creates an instance of Spiral.
     *
     * @param {SpiralSettings} [settings={}]
     * @memberof Spiral
     */
    constructor(settings = {}) {
        var _a, _b, _c;
        settings.type = 'Spiral';
        settings.bClosed = false;
        settings.loopDependencies = (settings.loopDependencies || []).concat(['twists', 'twistsStart', 'spiral']);
        super(settings, true);
        this.props.spiral = (_a = settings.spiral) !== null && _a !== void 0 ? _a : Spiral.types.ARCHIMEDE;
        this.props.twists = (_b = settings.twists) !== null && _b !== void 0 ? _b : 2;
        this.props.twistsStart = (_c = settings.twistsStart) !== null && _c !== void 0 ? _c : 0;
        this.loop = {
            start: (propArguments) => _math__WEBPACK_IMPORTED_MODULE_1__.PI2 * this.getProp('twistsStart', propArguments),
            end: (propArguments) => _math__WEBPACK_IMPORTED_MODULE_1__.PI2 *
                (this.getProp('twistsStart', propArguments) + this.getProp('twists', propArguments)),
            inc: (propArguments) => {
                const twists = this.getProp('twists', propArguments);
                const rep = _math__WEBPACK_IMPORTED_MODULE_1__.PI2 * twists;
                const sideLength = this.getRepetitionSideLength(propArguments);
                const radius = 4 + Math.sqrt(sideLength[0] * sideLength[1]);
                return rep / (radius * twists);
            },
            vertex: (shapeLoopRepetition) => {
                const r = this.r(shapeLoopRepetition.current);
                return [r * Math.cos(shapeLoopRepetition.current), r * Math.sin(shapeLoopRepetition.current)];
            },
        };
        this.bStaticLoop = this.isStaticLoop();
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
    generateLoopBuffer(propArguments) {
        this.spiral = this.getProp('spiral', propArguments);
        this.r = Spiral.getRFromTSpiralType(this.spiral);
        return super.generateLoopBuffer(propArguments);
    }
    // /**
    //  * Set single or multiple props
    //  *
    //  * @param {(keyof ISpiralProps | ISpiralProps)} key
    //  * @param {*} [value]
    //  * @memberof Spiral
    //  */
    // public setProp(key: keyof ISpiralProps | ISpiralProps, value?: any): void {
    // 	key = typeof key === 'string' ? { [key]: value } : key
    // 	if (('twists' in key || 'twistsStart' in key) && this.props.loop) {
    // 		this.props.loop.start = undefined
    // 		this.props.loop.end = undefined
    // 	}
    // 	super.setProp(key as keyof IShapeLoopProps, value)
    // }
    /**
     * Point position and scale factor for spiral types
     *
     * @static
     * @param {TSpiralType} spiral
     * @returns {number}
     * @memberof Spiral
     */
    static getRFromTSpiralType(spiral) {
        switch (spiral) {
            case Spiral.types.ARCHIMEDE:
                return angle => angle / 10;
            case Spiral.types.HYPERBOLIC:
                return angle => (1 / angle) * 3;
            case Spiral.types.FERMAT:
                return angle => angle ** 0.5 / 3;
            case Spiral.types.LITUUS:
                return angle => angle ** -0.5;
            case Spiral.types.LOGARITHMIC:
                return angle => Math.E ** (angle * 0.2) / 10;
        }
        return angle => angle;
    }
}
/**
 * Spural types
 *
 * @static
 * @type {{ [name in TSpiralType]: TSpiralType }}
 * @memberof Spiral
 */
Spiral.types = {
    ARCHIMEDE: 'ARCHIMEDE',
    HYPERBOLIC: 'HYPERBOLIC',
    FERMAT: 'FERMAT',
    LITUUS: 'LITUUS',
    LOGARITHMIC: 'LOGARITHMIC',
};

//# sourceMappingURL=Spiral.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/SuperShape.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/SuperShape.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SuperShape": () => (/* binding */ SuperShape)
/* harmony export */ });
/* harmony import */ var _ShapeLoop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ShapeLoop */ "./node_modules/@urpflanze/core/dist/shapes/ShapeLoop.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../math */ "./node_modules/@urpflanze/core/dist/math/index.js");


/**
 * ShperShape
 *
 * @category Core.Primitives
 * @class SuperShape
 * @extends {ShapeLoop}
 */
class SuperShape extends _ShapeLoop__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop {
    /**
     * Creates an instance of SuperShape.
     *
     * @param {ISuperShapeSettings} [settings={}]
     * @memberof SuperShape
     */
    constructor(settings = {}) {
        var _a, _b, _c, _d, _e, _f;
        settings.type = 'SuperShape';
        settings.loopDependencies = (settings.loopDependencies || []).concat(['a', 'b', 'm', 'n1', 'n2', 'n3']);
        super(settings, true);
        this.props.a = (_a = settings.a) !== null && _a !== void 0 ? _a : 1;
        this.props.b = (_b = settings.b) !== null && _b !== void 0 ? _b : 1;
        this.props.m = (_c = settings.m) !== null && _c !== void 0 ? _c : 6;
        this.props.n1 = (_d = settings.n1) !== null && _d !== void 0 ? _d : 1;
        this.props.n2 = (_e = settings.n2) !== null && _e !== void 0 ? _e : 1;
        this.props.n3 = (_f = settings.n3) !== null && _f !== void 0 ? _f : 1;
        this.loop = {
            start: 0,
            end: _math__WEBPACK_IMPORTED_MODULE_1__.PI2,
            inc: propArguments => {
                const sideLength = this.getRepetitionSideLength(propArguments);
                return Math.PI / Math.pow(sideLength[0] * sideLength[1], 0.5);
            },
            vertex: (shapeLoopRepetition) => {
                const angle = shapeLoopRepetition.current;
                const m = (this.m * angle) / 4;
                const a = Math.abs(Math.cos(m) / this.a) ** this.n2;
                const b = Math.abs(Math.sin(m) / this.b) ** this.n3;
                const raux = (a + b) ** (1 / this.n1);
                const r = raux === 0 ? 1 : 1 / raux;
                return [r * Math.cos(angle), r * Math.sin(angle)];
            },
        };
        this.bStaticLoop = this.isStaticLoop();
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
    generateLoopBuffer(propArguments) {
        this.a = this.getProp('a', propArguments);
        this.b = this.getProp('b', propArguments);
        this.m = this.getProp('m', propArguments);
        this.n1 = this.getProp('n1', propArguments);
        this.n2 = this.getProp('n2', propArguments);
        this.n3 = this.getProp('n3', propArguments);
        return super.generateLoopBuffer(propArguments);
    }
}

//# sourceMappingURL=SuperShape.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/shapes/primitives/Triangle.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/shapes/primitives/Triangle.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Triangle": () => (/* binding */ Triangle)
/* harmony export */ });
/* harmony import */ var _types_shape_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types/shape-base */ "./node_modules/@urpflanze/core/dist/types/shape-base.js");
/* harmony import */ var _ShapeBuffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ShapeBuffer */ "./node_modules/@urpflanze/core/dist/shapes/ShapeBuffer.js");


/**
 * Triangle ShapeBuffer
 *
 * @category Core.Primitives
 */
class Triangle extends _ShapeBuffer__WEBPACK_IMPORTED_MODULE_1__.ShapeBuffer {
    /**
     * Creates an instance of Triangleeee.
     *
     * @param {ShapeBaseSettings} [settings={}]
     * @memberof Triangle
     */
    constructor(settings = {}) {
        settings.type = 'Triangle';
        settings.shape = [-1, -1, 1, 0, -1, 1];
        settings.adaptMode = _types_shape_base__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode.None;
        super(settings);
    }
}

//# sourceMappingURL=Triangle.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/types/scene-child.js":
/*!****************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/types/scene-child.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERepetitionType": () => (/* binding */ ERepetitionType)
/* harmony export */ });
/**
 * Repetition type enumerator.
 *
 * @category Core.Repetition
 * @internal
 */
var ERepetitionType;
(function (ERepetitionType) {
    /**
     * Defines the type of repetition of the shape,
     * in a circular way starting from the center of the scene
     * @order 1
     */
    ERepetitionType[ERepetitionType["Ring"] = 1] = "Ring";
    /**
     * Defines the type of repetition of the shape,
     * on a nxm grid starting from the center of the scene
     * @order 2
     */
    ERepetitionType[ERepetitionType["Matrix"] = 2] = "Matrix";
})(ERepetitionType || (ERepetitionType = {}));
//# sourceMappingURL=scene-child.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/types/scene.js":
/*!**********************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/types/scene.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=scene.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/types/shape-base.js":
/*!***************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/types/shape-base.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EAdaptMode": () => (/* binding */ EAdaptMode)
/* harmony export */ });
/**
 *
 *
 * @category Core.Enums
 */
var EAdaptMode;
(function (EAdaptMode) {
    /**
     * The buffer is not changed
     * @order 1
     */
    EAdaptMode[EAdaptMode["None"] = 0] = "None";
    /**
     * The buffer is scaled in a range between [-1, -1] and [1,1]
     * @order 2
     */
    EAdaptMode[EAdaptMode["Scale"] = 2] = "Scale";
    /**
     * The buffer is scaled in a range between [-1, -1] and [1,1] and is centered
     * @order 3
     */
    EAdaptMode[EAdaptMode["Center"] = 4] = "Center";
    /**
     * The buffer is adapted centrally and expanded in a range between [-1, -1] and [1,1]
     * @order 4
     */
    EAdaptMode[EAdaptMode["Fill"] = 8] = "Fill";
})(EAdaptMode || (EAdaptMode = {}));
//# sourceMappingURL=shape-base.js.map

/***/ }),

/***/ "./node_modules/@urpflanze/core/dist/types/shape-primitives.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@urpflanze/core/dist/types/shape-primitives.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=shape-primitives.js.map

/***/ }),

/***/ "./node_modules/gl-matrix/esm/common.js":
/*!**********************************************!*\
  !*** ./node_modules/gl-matrix/esm/common.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EPSILON": () => (/* binding */ EPSILON),
/* harmony export */   "ARRAY_TYPE": () => (/* binding */ ARRAY_TYPE),
/* harmony export */   "RANDOM": () => (/* binding */ RANDOM),
/* harmony export */   "setMatrixArrayType": () => (/* binding */ setMatrixArrayType),
/* harmony export */   "toRadian": () => (/* binding */ toRadian),
/* harmony export */   "equals": () => (/* binding */ equals)
/* harmony export */ });
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/***/ }),

/***/ "./node_modules/gl-matrix/esm/mat4.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/mat4.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "identity": () => (/* binding */ identity),
/* harmony export */   "transpose": () => (/* binding */ transpose),
/* harmony export */   "invert": () => (/* binding */ invert),
/* harmony export */   "adjoint": () => (/* binding */ adjoint),
/* harmony export */   "determinant": () => (/* binding */ determinant),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "translate": () => (/* binding */ translate),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "rotateX": () => (/* binding */ rotateX),
/* harmony export */   "rotateY": () => (/* binding */ rotateY),
/* harmony export */   "rotateZ": () => (/* binding */ rotateZ),
/* harmony export */   "fromTranslation": () => (/* binding */ fromTranslation),
/* harmony export */   "fromScaling": () => (/* binding */ fromScaling),
/* harmony export */   "fromRotation": () => (/* binding */ fromRotation),
/* harmony export */   "fromXRotation": () => (/* binding */ fromXRotation),
/* harmony export */   "fromYRotation": () => (/* binding */ fromYRotation),
/* harmony export */   "fromZRotation": () => (/* binding */ fromZRotation),
/* harmony export */   "fromRotationTranslation": () => (/* binding */ fromRotationTranslation),
/* harmony export */   "fromQuat2": () => (/* binding */ fromQuat2),
/* harmony export */   "getTranslation": () => (/* binding */ getTranslation),
/* harmony export */   "getScaling": () => (/* binding */ getScaling),
/* harmony export */   "getRotation": () => (/* binding */ getRotation),
/* harmony export */   "fromRotationTranslationScale": () => (/* binding */ fromRotationTranslationScale),
/* harmony export */   "fromRotationTranslationScaleOrigin": () => (/* binding */ fromRotationTranslationScaleOrigin),
/* harmony export */   "fromQuat": () => (/* binding */ fromQuat),
/* harmony export */   "frustum": () => (/* binding */ frustum),
/* harmony export */   "perspective": () => (/* binding */ perspective),
/* harmony export */   "perspectiveFromFieldOfView": () => (/* binding */ perspectiveFromFieldOfView),
/* harmony export */   "ortho": () => (/* binding */ ortho),
/* harmony export */   "lookAt": () => (/* binding */ lookAt),
/* harmony export */   "targetTo": () => (/* binding */ targetTo),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "frob": () => (/* binding */ frob),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "multiplyScalar": () => (/* binding */ multiplyScalar),
/* harmony export */   "multiplyScalarAndAdd": () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "sub": () => (/* binding */ sub)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation(out, mat) {
  var scaling = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function ortho(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyey - centery) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyez - centerz) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ "./node_modules/gl-matrix/esm/vec2.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/vec2.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "divide": () => (/* binding */ divide),
/* harmony export */   "ceil": () => (/* binding */ ceil),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "scaleAndAdd": () => (/* binding */ scaleAndAdd),
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "squaredDistance": () => (/* binding */ squaredDistance),
/* harmony export */   "length": () => (/* binding */ length),
/* harmony export */   "squaredLength": () => (/* binding */ squaredLength),
/* harmony export */   "negate": () => (/* binding */ negate),
/* harmony export */   "inverse": () => (/* binding */ inverse),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "dot": () => (/* binding */ dot),
/* harmony export */   "cross": () => (/* binding */ cross),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "transformMat2": () => (/* binding */ transformMat2),
/* harmony export */   "transformMat2d": () => (/* binding */ transformMat2d),
/* harmony export */   "transformMat3": () => (/* binding */ transformMat3),
/* harmony export */   "transformMat4": () => (/* binding */ transformMat4),
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "angle": () => (/* binding */ angle),
/* harmony export */   "zero": () => (/* binding */ zero),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "len": () => (/* binding */ len),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "div": () => (/* binding */ div),
/* harmony export */   "dist": () => (/* binding */ dist),
/* harmony export */   "sqrDist": () => (/* binding */ sqrDist),
/* harmony export */   "sqrLen": () => (/* binding */ sqrLen),
/* harmony export */   "forEach": () => (/* binding */ forEach)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(2);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {ReadonlyVec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues(x, y) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to ceil
 * @returns {vec2} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to floor
 * @returns {vec2} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to round
 * @returns {vec2} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0],
      y = a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to negate
 * @returns {vec2} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to invert
 * @returns {vec2} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to normalize
 * @returns {vec2} out
 */

function normalize(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Rotate a 2D vector
 * @param {vec2} out The receiving vec2
 * @param {ReadonlyVec2} a The vec2 point to rotate
 * @param {ReadonlyVec2} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec2} out
 */

function rotate(out, a, b, rad) {
  //Translate point to the origin
  var p0 = a[0] - b[0],
      p1 = a[1] - b[1],
      sinC = Math.sin(rad),
      cosC = Math.cos(rad); //perform rotation and translate to correct position

  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {ReadonlyVec2} a The first operand
 * @param {ReadonlyVec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
  mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
      // mag &&.. short circuits if mag == 0
  cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec2 to zero
 *
 * @param {vec2} out the receiving vector
 * @returns {vec2} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1];
  var b0 = b[0],
      b1 = b[1];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
}
/**
 * Alias for {@link vec2.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec2.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec2.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();

/***/ }),

/***/ "./node_modules/gl-matrix/esm/vec3.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/vec3.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "length": () => (/* binding */ length),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "divide": () => (/* binding */ divide),
/* harmony export */   "ceil": () => (/* binding */ ceil),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "scaleAndAdd": () => (/* binding */ scaleAndAdd),
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "squaredDistance": () => (/* binding */ squaredDistance),
/* harmony export */   "squaredLength": () => (/* binding */ squaredLength),
/* harmony export */   "negate": () => (/* binding */ negate),
/* harmony export */   "inverse": () => (/* binding */ inverse),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "dot": () => (/* binding */ dot),
/* harmony export */   "cross": () => (/* binding */ cross),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "hermite": () => (/* binding */ hermite),
/* harmony export */   "bezier": () => (/* binding */ bezier),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "transformMat4": () => (/* binding */ transformMat4),
/* harmony export */   "transformMat3": () => (/* binding */ transformMat3),
/* harmony export */   "transformQuat": () => (/* binding */ transformQuat),
/* harmony export */   "rotateX": () => (/* binding */ rotateX),
/* harmony export */   "rotateY": () => (/* binding */ rotateY),
/* harmony export */   "rotateZ": () => (/* binding */ rotateZ),
/* harmony export */   "angle": () => (/* binding */ angle),
/* harmony export */   "zero": () => (/* binding */ zero),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "div": () => (/* binding */ div),
/* harmony export */   "dist": () => (/* binding */ dist),
/* harmony export */   "sqrDist": () => (/* binding */ sqrDist),
/* harmony export */   "len": () => (/* binding */ len),
/* harmony export */   "sqrLen": () => (/* binding */ sqrLen),
/* harmony export */   "forEach": () => (/* binding */ forEach)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 * Math.PI;
  var z = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

/***/ }),

/***/ "./node_modules/jszip/dist/jszip.min.js":
/*!**********************************************!*\
  !*** ./node_modules/jszip/dist/jszip.min.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!

JSZip v3.6.0 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/

!function(e){if(true)module.exports=e();else {}}(function(){return function s(a,o,u){function h(r,e){if(!o[r]){if(!a[r]){var t=undefined;if(!e&&t)return require(r,!0);if(f)return f(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return h(t||e)},i,i.exports,s,a,o,u)}return o[r].exports}for(var f=undefined,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(e,t,r){"use strict";var c=e("./utils"),l=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,u=[],h=0,f=e.length,l=f,d="string"!==c.getTypeOf(e);h<e.length;)l=f-h,n=d?(t=e[h++],r=h<f?e[h++]:0,h<f?e[h++]:0):(t=e.charCodeAt(h++),r=h<f?e.charCodeAt(h++):0,h<f?e.charCodeAt(h++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<l?(15&r)<<2|n>>6:64,o=2<l?63&n:64,u.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return u.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,u=0;if("data:"===e.substr(0,"data:".length))throw new Error("Invalid base64 input, it looks like a data url.");var h,f=3*(e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(h=l.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),h[u++]=t,64!==s&&(h[u++]=r),64!==a&&(h[u++]=n);return h}},{"./support":30,"./utils":32}],2:[function(e,t,r){"use strict";var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){"use strict";var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(e){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){"use strict";var n=e("./utils"),a=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r){var n=a,i=0+r;e^=-1;for(var s=0;s<i;s++)e=e>>>8^n[255&(e^t[s])];return-1^e}(0|t,e,e.length):function(e,t,r){var n=a,i=0+r;e^=-1;for(var s=0;s<i;s++)e=e>>>8^n[255&(e^t.charCodeAt(s))];return-1^e}(0|t,e,e.length):0}},{"./utils":32}],5:[function(e,t,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,t,r){"use strict";var n;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n}},{lie:37}],7:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function u(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}r.magic="\b\0",s.inherits(u,a),u.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1)},u.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},u.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},u.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}},r.compressWorker=function(e){return new u("Deflate",e)},r.uncompressWorker=function(){return new u("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){"use strict";function I(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function i(e,t,r,n,i,s){var a,o,u=e.file,h=e.compression,f=s!==B.utf8encode,l=O.transformTo("string",s(u.name)),d=O.transformTo("string",B.utf8encode(u.name)),c=u.comment,p=O.transformTo("string",s(c)),m=O.transformTo("string",B.utf8encode(c)),_=d.length!==u.name.length,g=m.length!==c.length,v="",b="",w="",y=u.dir,k=u.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),f||!_&&!g||(S|=2048);var z,E=0,C=0;y&&(E|=16),"UNIX"===i?(C=798,E|=((z=u.unixPermissions)||(z=y?16893:33204),(65535&z)<<16)):(C=20,E|=63&(u.dosPermissions||0)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v+="up"+I((b=I(1,1)+I(T(l),4)+d).length,2)+b),g&&(v+="uc"+I((w=I(1,1)+I(T(p),4)+m).length,2)+w);var A="";return A+="\n\0",A+=I(S,2),A+=h.magic,A+=I(a,2),A+=I(o,2),A+=I(x.crc32,4),A+=I(x.compressedSize,4),A+=I(x.uncompressedSize,4),A+=I(l.length,2),A+=I(v.length,2),{fileRecord:R.LOCAL_FILE_HEADER+A+l+v,dirRecord:R.CENTRAL_FILE_HEADER+I(C,2)+A+I(p.length,2)+"\0\0\0\0"+I(E,4)+I(n,4)+l+v+p}}var O=e("../utils"),s=e("../stream/GenericWorker"),B=e("../utf8"),T=e("../crc32"),R=e("../signature");function n(e,t,r,n){s.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}O.inherits(n,s),n.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,s.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}))},n.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=i(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},n.prototype.closedSource=function(e){this.accumulate=!1;var t,r=this.streamFiles&&!e.file.dir,n=i(e,r,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(n.dirRecord),r)this.push({data:(t=e,R.DATA_DESCRIPTOR+I(t.crc32,4)+I(t.compressedSize,4)+I(t.uncompressedSize,4)),meta:{percent:100}});else for(this.push({data:n.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},n.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r,n,i,s,a,o,u=this.bytesWritten-e,h=(r=this.dirRecords.length,n=u,i=e,s=this.zipComment,a=this.encodeFileName,o=O.transformTo("string",a(s)),R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+I(r,2)+I(r,2)+I(n,4)+I(i,4)+I(o.length,2)+o);this.push({data:h,meta:{percent:100}})},n.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},n.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on("error",function(e){t.error(e)}),this},n.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},n.prototype.error=function(e){var t=this._sources;if(!s.prototype.error.call(this,e))return!1;for(var r=0;r<t.length;r++)try{t[r].error(e)}catch(e){}return!0},n.prototype.lock=function(){s.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=n},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){"use strict";var h=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),u=0;try{e.forEach(function(e,t){u++;var r=function(e,t){var r=e||t,n=h[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o)}),o.entriesCount=u}catch(e){o.error(e)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){"use strict";function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e}}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.5.0",n.loadAsync=function(e,t){return(new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){"use strict";var n=e("./utils"),i=e("./external"),o=e("./utf8"),u=e("./zipEntries"),s=e("./stream/Crc32Probe"),h=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new s);r.on("error",function(e){t(e)}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e()}).resume()})}t.exports=function(e,s){var a=this;return s=n.extend(s||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),h.isNode&&h.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):n.prepareContent("the loaded zip file",e,!0,s.optimizedBinaryString,s.base64).then(function(e){var t=new u(s);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(s.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n];a.file(i.fileNameStr,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:s.createFolders})}return t.zipComment.length&&(a.comment=t.zipComment),a})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t)}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}})}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e)}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){"use strict";var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t)}).on("error",function(e){n.emit("error",e)}).on("end",function(){n.push(null)})}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume()},t.exports=n},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){"use strict";t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}}},{}],15:[function(e,t,r){"use strict";function s(e,t,r){var n,i=f.getTypeOf(t),s=f.extend(r||{},d);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=h(e)),s.createFolders&&(n=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""}(e))&&g.call(this,n,!0);var a,o="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!o),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string"),a=t instanceof c||t instanceof l?t:m.isNode&&m.isStream(t)?new _(e,t):f.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var u=new p(e,a,s);this.files[e]=u}function h(e){return"/"!==e.slice(-1)&&(e+="/"),e}var i=e("./utf8"),f=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),d=e("./defaults"),c=e("./compressedObject"),p=e("./zipObject"),o=e("./generate"),m=e("./nodejsUtils"),_=e("./nodejs/NodejsStreamInputAdapter"),g=function(e,t){return t=void 0!==t?t:d.createFolders,e=h(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function u(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)this.files.hasOwnProperty(t)&&(n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n))},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t)}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(u(e)){var n=e;return this.filter(function(e,t){return!t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(u(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=g.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(e){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=f.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");f.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n)}catch(e){(t=new l("error")).error(e)}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){t.exports=e("stream")},{stream:void 0}],17:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){"use strict";var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(e){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(e){},lastIndexOfSignature:function(e){},readAndCheckSignature:function(e){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,r){"use strict";var n=e("./Uint8ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){"use strict";var n=e("./ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),u=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new u(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0)}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){"use strict";function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(e){this.emit("error",e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.end()}),e.on("error",function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n},{}],29:[function(e,t,r){"use strict";var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),f=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter")}catch(e){}function u(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string"}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock()}catch(e){this._worker=new s("error"),this._worker.error(e)}}u.prototype={accumulate:function(e){return o=this,u=e,new a.Promise(function(t,r){var n=[],i=o._internalType,s=o._outputType,a=o._mimeType;o.on("data",function(e,t){n.push(e),u&&u(t)}).on("error",function(e){n=[],r(e)}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return f.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e)}catch(e){r(e)}n=[]}).resume()});var o,u},on:function(e,t){var r=this;return"data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta)}):this._worker.on(e,function(){h.delay(t,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=u},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size}catch(e){r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch(e){r.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,s){"use strict";for(var o=e("./utils"),u=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),h=new Array(256),i=0;i<256;i++)h[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null}function f(){n.call(this,"utf-8 encode")}h[254]=h[254]=1,s.utf8encode=function(e){return u.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=u.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return u.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=h[n]))a[r++]=65533,t+=i-1;else{for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(u.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(u.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(u.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+h[e[r]]>t?r:t}(t),i=t;n!==t.length&&(u.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(f,n),f.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta})},s.Utf8EncodeWorker=f},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,o){"use strict";var u=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),n=e("set-immediate-shim"),f=e("./external");function i(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}o.newBlob=function(t,r){o.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var s={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return u.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return!1}}(),nodebuffer:function(){try{return u.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return!1}}()}};function a(e){var t=65536,r=o.getTypeOf(e),n=!0;if("uint8array"===r?n=s.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=s.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return s.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2)}return s.stringifyByChar(e)}function d(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}o.applyFromCharCode=a;var c={};c.string={string:i,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:a,array:i,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return a(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:i,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:a,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:i,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:a,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:i},o.transformTo=function(e,t){if(t=t||"",!e)return t;o.checkSupport(e);var r=o.getTypeOf(t);return c[r][e](t)},o.getTypeOf=function(e){return"string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":u.nodebuffer&&r.isBuffer(e)?"nodebuffer":u.uint8array&&e instanceof Uint8Array?"uint8array":u.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},o.checkSupport=function(e){if(!u[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},o.MAX_VALUE_16BITS=65535,o.MAX_VALUE_32BITS=-1,o.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},o.delay=function(e,t,r){n(function(){e.apply(r||null,t||[])})},o.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r},o.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])arguments[e].hasOwnProperty(t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},o.prepareContent=function(n,e,i,s,a){return f.Promise.resolve(e).then(function(n){return u.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new f.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result)},e.onerror=function(e){r(e.target.error)},e.readAsArrayBuffer(n)}):n}).then(function(e){var t,r=o.getTypeOf(e);return r?("arraybuffer"===r?e=o.transformTo("uint8array",e):"string"===r&&(a?e=h.decode(e):i&&!0!==s&&(e=l(t=e,u.uint8array?new Uint8Array(t.length):new Array(t.length)))),e):f.Promise.reject(new Error("Can't read the data of '"+n+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=(e("./utf8"),e("./support"));function u(e){this.files=[],this.loadOptions=e}u.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=u},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),u=e("./compressions"),h=e("./support");function f(e,t){this.options=e,this.loadOptions=t}f.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in u)if(u.hasOwnProperty(t)&&u[t].magic===e)return u[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(e){if(this.extraFields[1]){var t=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=t.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=t.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=t.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=t.readInt(4))}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i)},handleUTF8:function(){var e=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=f},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){"use strict";function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),u=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker))}catch(e){(t=new u("error")).error(e)}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof u?this._data:new i(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},l=0;l<h.length;l++)n.prototype[h[l]]=f;t.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,f,t){(function(t){"use strict";var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(h),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2}}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){h(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.document.documentElement.appendChild(e)}:function(){setTimeout(h,0)};else{var o=new t.MessageChannel;o.port1.onmessage=h,r=function(){o.port2.postMessage(0)}}var u=[];function h(){var e,t;n=!0;for(var r=u.length;r;){for(t=u,u=[],e=-1;++e<r;)t[e]();r=u.length}n=!1}f.exports=function(e){1!==u.push(e)||n||r()}}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(e,t,r){"use strict";var i=e("immediate");function h(){}var f={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==h&&c(this,e)}function u(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function l(t,r,n){i(function(){var e;try{e=r(n)}catch(e){return f.reject(t,e)}e===t?f.reject(t,new TypeError("Cannot resolve promise with itself")):f.resolve(t,e)})}function d(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function c(t,e){var r=!1;function n(e){r||(r=!0,f.reject(t,e))}function i(e){r||(r=!0,f.resolve(t,e))}var s=p(function(){e(i,n)});"error"===s.status&&n(s.value)}function p(e,t){var r={};try{r.value=e(t),r.status="success"}catch(e){r.status="error",r.value=e}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(h);return this.state!==n?l(r,this.state===a?e:t,this.outcome):this.queue.push(new u(r,e,t)),r},u.prototype.callFulfilled=function(e){f.resolve(this.promise,e)},u.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e)},u.prototype.callRejected=function(e){f.reject(this.promise,e)},u.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e)},f.resolve=function(e,t){var r=p(d,t);if("error"===r.status)return f.reject(e,r.value);var n=r.value;if(n)c(e,n);else{e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t)}return e},f.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){return e instanceof this?e:f.resolve(new this(h),e)},o.reject=function(e){var t=new this(h);return f.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);for(var s=new Array(n),a=0,t=-1,o=new this(h);++t<n;)u(e[t],t);return o;function u(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,f.resolve(o,s))},function(e){i||(i=!0,f.reject(o,e))})}},o.race=function(e){if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var t=e.length,r=!1;if(!t)return this.resolve([]);for(var n,i=-1,s=new this(h);++i<t;)n=e[i],this.resolve(n).then(function(e){r||(r=!0,f.resolve(s,e))},function(e){r||(r=!0,f.reject(s,e))});return s}},{immediate:36}],38:[function(e,t,r){"use strict";var n={};(0,e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){"use strict";var a=e("./zlib/deflate"),o=e("./utils/common"),u=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),h=Object.prototype.toString,f=0,l=-1,d=0,c=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:l,method:c,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==f)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?u.string2buf(t.dictionary):"[object ArrayBuffer]"===h.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==f)throw new Error(i[r]);this._dict_set=!0}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return!1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=u.string2buf(e):"[object ArrayBuffer]"===h.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==f)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(u.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)))}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===f):2!==n||(this.onEnd(f),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===f&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return(t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return(t=t||{}).gzip=!0,n(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){"use strict";var d=e("./zlib/inflate"),c=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=c.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=d.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,d.inflateGetHeader(this.strm,this.header)}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,u=this.strm,h=this.options.chunkSize,f=this.options.dictionary,l=!1;if(this.ended)return!1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?u.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?u.input=new Uint8Array(e):u.input=e,u.next_in=0,u.avail_in=u.input.length;do{if(0===u.avail_out&&(u.output=new c.Buf8(h),u.next_out=0,u.avail_out=h),(r=d.inflate(u,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&f&&(o="string"==typeof f?p.string2buf(f):"[object ArrayBuffer]"===_.call(f)?new Uint8Array(f):f,r=d.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===l&&(r=m.Z_OK,l=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);u.next_out&&(0!==u.avail_out&&r!==m.Z_STREAM_END&&(0!==u.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(u.output,u.next_out),s=u.next_out-i,a=p.buf2string(u.output,i),u.next_out=s,u.avail_out=h-s,s&&c.arraySet(u.output,u.output,i,s,0),this.onData(a)):this.onData(c.shrinkBuf(u.output,u.next_out)))),0===u.avail_in&&0===u.avail_out&&(l=!0)}while((0<u.avail_in||0===u.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=d.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(u.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e)},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=c.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return(t=t||{}).raw=!0,o(e,t)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(n)},{}],42:[function(e,t,r){"use strict";var u=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(e){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){s=!1}for(var h=new u.Buf8(256),n=0;n<256;n++)h[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function f(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,u.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}h[254]=h[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new u.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return f(e,e.length)},r.binstring2buf=function(e){for(var t=new u.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=h[i]))o[n++]=65533,r+=s-1;else{for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i)}return f(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+h[e[r]]>t?r:t}},{"./common":41}],43:[function(e,t,r){"use strict";t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521}return i|s<<16|0}},{}],44:[function(e,t,r){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,r){"use strict";var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}},{}],46:[function(e,t,r){"use strict";var u,d=e("../utils/common"),h=e("./trees"),c=e("./adler32"),p=e("./crc32"),n=e("./messages"),f=0,l=0,m=-2,i=2,_=8,s=286,a=30,o=19,g=2*s+1,v=15,b=3,w=258,y=w+b+1,k=42,x=113;function S(e,t){return e.msg=n[t],t}function z(e){return(e<<1)-(4<e?9:0)}function E(e){for(var t=e.length;0<=--t;)e[t]=0}function C(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(d.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function A(e,t){h._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,C(e.strm)}function I(e,t){e.pending_buf[e.pending++]=t}function O(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function B(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,u=e.strstart>e.w_size-y?e.strstart-(e.w_size-y):0,h=e.window,f=e.w_mask,l=e.prev,d=e.strstart+w,c=h[s+a-1],p=h[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(h[(r=t)+a]===p&&h[r+a-1]===c&&h[r]===h[s]&&h[++r]===h[s+1]){s+=2,r++;do{}while(h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&s<d);if(n=w-(d-s),s=d-w,a<n){if(e.match_start=t,o<=(a=n))break;c=h[s+a-1],p=h[s+a]}}}while((t=l[t&f])>u&&0!=--i);return a<=e.lookahead?a:e.lookahead}function T(e){var t,r,n,i,s,a,o,u,h,f,l=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=l+(l-y)){for(d.arraySet(e.window,e.window,l,l,0),e.match_start-=l,e.strstart-=l,e.block_start-=l,t=r=e.hash_size;n=e.head[--t],e.head[t]=l<=n?n-l:0,--r;);for(t=r=l;n=e.prev[--t],e.prev[t]=l<=n?n-l:0,--r;);i+=l}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,u=e.strstart+e.lookahead,f=void 0,(h=i)<(f=a.avail_in)&&(f=h),r=0===f?0:(a.avail_in-=f,d.arraySet(o,a.input,a.next_in,f,u),1===a.state.wrap?a.adler=c(a.adler,o,f,u):2===a.state.wrap&&(a.adler=p(a.adler,o,f,u)),a.next_in+=f,a.total_in+=f,f),e.lookahead+=r,e.lookahead+e.insert>=b)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+b-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<b)););}while(e.lookahead<y&&0!==e.strm.avail_in)}function R(e,t){for(var r,n;;){if(e.lookahead<y){if(T(e),e.lookahead<y&&t===f)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=b&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-y&&(e.match_length=B(e,r)),e.match_length>=b)if(n=h._tr_tally(e,e.strstart-e.match_start,e.match_length-b),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=b){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=e.strstart<b-1?e.strstart:b-1,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}function D(e,t){for(var r,n,i;;){if(e.lookahead<y){if(T(e),e.lookahead<y&&t===f)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=b&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=b-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-y&&(e.match_length=B(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===b&&4096<e.strstart-e.match_start)&&(e.match_length=b-1)),e.prev_length>=b&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-b,n=h._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-b),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=b-1,e.strstart++,n&&(A(e,!1),0===e.strm.avail_out))return 1}else if(e.match_available){if((n=h._tr_tally(e,0,e.window[e.strstart-1]))&&A(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return 1}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=h._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<b-1?e.strstart:b-1,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}function F(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i}function N(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new d.Buf16(2*g),this.dyn_dtree=new d.Buf16(2*(2*a+1)),this.bl_tree=new d.Buf16(2*(2*o+1)),E(this.dyn_ltree),E(this.dyn_dtree),E(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new d.Buf16(v+1),this.heap=new d.Buf16(2*s+1),E(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new d.Buf16(2*s+1),E(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function U(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?k:x,e.adler=2===t.wrap?0:1,t.last_flush=f,h._tr_init(t),l):S(e,m)}function P(e){var t,r=U(e);return r===l&&((t=e.state).window_size=2*t.w_size,E(t.head),t.max_lazy_match=u[t.level].max_lazy,t.good_match=u[t.level].good_length,t.nice_match=u[t.level].nice_length,t.max_chain_length=u[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=b-1,t.match_available=0,t.ins_h=0),r}function L(e,t,r,n,i,s){if(!e)return m;var a=1;if(-1===t&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||9<i||r!==_||n<8||15<n||t<0||9<t||s<0||4<s)return S(e,m);8===n&&(n=9);var o=new N;return(e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+b-1)/b),o.window=new d.Buf8(2*o.w_size),o.head=new d.Buf16(o.hash_size),o.prev=new d.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new d.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,P(e)}u=[new F(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(T(e),0===e.lookahead&&t===f)return 1;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,A(e,!1),0===e.strm.avail_out))return 1;if(e.strstart-e.block_start>=e.w_size-y&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):(e.strstart>e.block_start&&(A(e,!1),e.strm.avail_out),1)}),new F(4,4,8,4,R),new F(4,5,16,8,R),new F(4,6,32,32,R),new F(4,4,16,16,D),new F(8,16,32,32,D),new F(8,16,128,128,D),new F(8,32,128,256,D),new F(32,128,258,1024,D),new F(32,258,258,4096,D)],r.deflateInit=function(e,t){return L(e,t,_,15,8,0)},r.deflateInit2=L,r.deflateReset=P,r.deflateResetKeep=U,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?m:(e.state.gzhead=t,l):m},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?S(e,m):m;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&4!==t)return S(e,0===e.avail_out?-5:m);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===k)if(2===n.wrap)e.adler=0,I(n,31),I(n,139),I(n,8),n.gzhead?(I(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),I(n,255&n.gzhead.time),I(n,n.gzhead.time>>8&255),I(n,n.gzhead.time>>16&255),I(n,n.gzhead.time>>24&255),I(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),I(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(I(n,255&n.gzhead.extra.length),I(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(I(n,0),I(n,0),I(n,0),I(n,0),I(n,0),I(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),I(n,3),n.status=x);else{var a=_+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=x,O(n,a),0!==n.strstart&&(O(n,e.adler>>>16),O(n,65535&e.adler)),e.adler=1}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),C(e),i=n.pending,n.pending!==n.pending_buf_size));)I(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),C(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,I(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),C(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,I(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103)}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&C(e),n.pending+2<=n.pending_buf_size&&(I(n,255&e.adler),I(n,e.adler>>8&255),e.adler=0,n.status=x)):n.status=x),0!==n.pending){if(C(e),0===e.avail_out)return n.last_flush=-1,l}else if(0===e.avail_in&&z(t)<=z(r)&&4!==t)return S(e,-5);if(666===n.status&&0!==e.avail_in)return S(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==f&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(T(e),0===e.lookahead)){if(t===f)return 1;break}if(e.match_length=0,r=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=w){if(T(e),e.lookahead<=w&&t===f)return 1;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=b&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+w;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=w-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=b?(r=h._tr_tally(e,1,e.match_length-b),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}(n,t):u[n.level].func(n,t);if(3!==o&&4!==o||(n.status=666),1===o||3===o)return 0===e.avail_out&&(n.last_flush=-1),l;if(2===o&&(1===t?h._tr_align(n):5!==t&&(h._tr_stored_block(n,0,0,!1),3===t&&(E(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),C(e),0===e.avail_out))return n.last_flush=-1,l}return 4!==t?l:n.wrap<=0?1:(2===n.wrap?(I(n,255&e.adler),I(n,e.adler>>8&255),I(n,e.adler>>16&255),I(n,e.adler>>24&255),I(n,255&e.total_in),I(n,e.total_in>>8&255),I(n,e.total_in>>16&255),I(n,e.total_in>>24&255)):(O(n,e.adler>>>16),O(n,65535&e.adler)),C(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?l:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==k&&69!==t&&73!==t&&91!==t&&103!==t&&t!==x&&666!==t?S(e,m):(e.state=null,t===x?S(e,-3):l):m},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,u,h,f=t.length;if(!e||!e.state)return m;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==k||r.lookahead)return m;for(1===s&&(e.adler=c(e.adler,t,f,0)),r.wrap=0,f>=r.w_size&&(0===s&&(E(r.head),r.strstart=0,r.block_start=0,r.insert=0),h=new d.Buf8(r.w_size),d.arraySet(h,t,f-r.w_size,r.w_size,0),t=h,f=r.w_size),a=e.avail_in,o=e.next_in,u=e.input,e.avail_in=f,e.next_in=0,e.input=t,T(r);r.lookahead>=b;){for(n=r.strstart,i=r.lookahead-(b-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+b-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=b-1,T(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=b-1,r.match_available=0,e.next_in=o,e.input=u,e.avail_in=a,r.wrap=s,l},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,t,r){"use strict";t.exports=function(e,t){var r,n,i,s,a,o,u,h,f,l,d,c,p,m,_,g,v,b,w,y,k,x,S,z,E;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,E=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),u=r.dmax,h=r.wsize,f=r.whave,l=r.wnext,d=r.window,c=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,v=(1<<r.distbits)-1;e:do{p<15&&(c+=z[n++]<<p,p+=8,c+=z[n++]<<p,p+=8),b=m[c&g];t:for(;;){if(c>>>=w=b>>>24,p-=w,0==(w=b>>>16&255))E[s++]=65535&b;else{if(!(16&w)){if(0==(64&w)){b=m[(65535&b)+(c&(1<<w)-1)];continue t}if(32&w){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}y=65535&b,(w&=15)&&(p<w&&(c+=z[n++]<<p,p+=8),y+=c&(1<<w)-1,c>>>=w,p-=w),p<15&&(c+=z[n++]<<p,p+=8,c+=z[n++]<<p,p+=8),b=_[c&v];r:for(;;){if(c>>>=w=b>>>24,p-=w,!(16&(w=b>>>16&255))){if(0==(64&w)){b=_[(65535&b)+(c&(1<<w)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&b,p<(w&=15)&&(c+=z[n++]<<p,(p+=8)<w&&(c+=z[n++]<<p,p+=8)),u<(k+=c&(1<<w)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(c>>>=w,p-=w,(w=s-a)<k){if(f<(w=k-w)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=d,(x=0)===l){if(x+=h-w,w<y){for(y-=w;E[s++]=d[x++],--w;);x=s-k,S=E}}else if(l<w){if(x+=h+l-w,(w-=l)<y){for(y-=w;E[s++]=d[x++],--w;);if(x=0,l<y){for(y-=w=l;E[s++]=d[x++],--w;);x=s-k,S=E}}}else if(x+=l-w,w<y){for(y-=w;E[s++]=d[x++],--w;);x=s-k,S=E}for(;2<y;)E[s++]=S[x++],E[s++]=S[x++],E[s++]=S[x++],y-=3;y&&(E[s++]=S[x++],1<y&&(E[s++]=S[x++]))}else{for(x=s-k;E[s++]=E[x++],E[s++]=E[x++],E[s++]=E[x++],2<(y-=3););y&&(E[s++]=E[x++],1<y&&(E[s++]=E[x++]))}break}}break}}while(n<i&&s<o);n-=y=p>>3,c&=(1<<(p-=y<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=c,r.bits=p}},{}],49:[function(e,t,r){"use strict";var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),T=e("./inffast"),R=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function u(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function h(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=u(e,t))!==N&&(e.state=null),r):U}var f,l,d=!0;function j(e){if(d){var t;for(f=new I.Buf32(512),l=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(R(D,e.lens,0,288,f,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;R(F,e.lens,0,32,l,0,e.work,{bits:5}),d=!1}e.lencode=f,e.lenbits=9,e.distcode=l,e.distbits=5}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=u,r.inflateResetKeep=a,r.inflateInit=function(e){return h(e,15)},r.inflateInit2=h,r.inflate=function(e,t){var r,n,i,s,a,o,u,h,f,l,d,c,p,m,_,g,v,b,w,y,k,x,S,z,E=0,C=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,u=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,h=r.hold,f=r.bits,l=o,d=u,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(2&r.wrap&&35615===h){C[r.check=0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0),f=h=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&h)<<8)+(h>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&h)){e.msg="unknown compression method",r.mode=30;break}if(f-=4,k=8+(15&(h>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&h?10:12,f=h=0;break;case 2:for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(r.flags=h,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=h>>8&1),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0)),f=h=0,r.mode=3;case 3:for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.head&&(r.head.time=h),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,C[2]=h>>>16&255,C[3]=h>>>24&255,r.check=B(r.check,C,4,0)),f=h=0,r.mode=4;case 4:for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.head&&(r.head.xflags=255&h,r.head.os=h>>8),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0)),f=h=0,r.mode=5;case 5:if(1024&r.flags){for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.length=h,r.head&&(r.head.extra_len=h),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0)),f=h=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(c=r.length)&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,c,k)),512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,r.length-=c),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(c=0;k=n[s+c++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(c=0;k=n[s+c++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(h!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}f=h=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}e.adler=r.check=L(h),f=h=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){h>>>=7&f,f-=7&f,r.mode=27;break}for(;f<3;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}switch(r.last=1&h,f-=1,3&(h>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;h>>>=2,f-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30}h>>>=2,f-=2;break;case 14:for(h>>>=7&f,f-=7&f;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if((65535&h)!=(h>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&h,f=h=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(c=r.length){if(o<c&&(c=o),u<c&&(c=u),0===c)break e;I.arraySet(i,n,s,c,a),o-=c,s+=c,u-=c,a+=c,r.length-=c;break}r.mode=12;break;case 17:for(;f<14;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(r.nlen=257+(31&h),h>>>=5,f-=5,r.ndist=1+(31&h),h>>>=5,f-=5,r.ncode=4+(15&h),h>>>=4,f-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;f<3;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.lens[A[r.have++]]=7&h,h>>>=3,f-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=R(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(E=r.lencode[h&(1<<r.lenbits)-1])>>>16&255,v=65535&E,!((_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(v<16)h>>>=_,f-=_,r.lens[r.have++]=v;else{if(16===v){for(z=_+2;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(h>>>=_,f-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],c=3+(3&h),h>>>=2,f-=2}else if(17===v){for(z=_+3;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}f-=_,k=0,c=3+(7&(h>>>=_)),h>>>=3,f-=3}else{for(z=_+7;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}f-=_,k=0,c=11+(127&(h>>>=_)),h>>>=7,f-=7}if(r.have+c>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;c--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=R(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=R(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=u){e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,T(e,d),a=e.next_out,i=e.output,u=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,h=r.hold,f=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(E=r.lencode[h&(1<<r.lenbits)-1])>>>16&255,v=65535&E,!((_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(g&&0==(240&g)){for(b=_,w=g,y=v;g=(E=r.lencode[y+((h&(1<<b+w)-1)>>b)])>>>16&255,v=65535&E,!(b+(_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}h>>>=b,f-=b,r.back+=b}if(h>>>=_,f-=_,r.back+=_,r.length=v,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.length+=h&(1<<r.extra)-1,h>>>=r.extra,f-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(E=r.distcode[h&(1<<r.distbits)-1])>>>16&255,v=65535&E,!((_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(0==(240&g)){for(b=_,w=g,y=v;g=(E=r.distcode[y+((h&(1<<b+w)-1)>>b)])>>>16&255,v=65535&E,!(b+(_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}h>>>=b,f-=b,r.back+=b}if(h>>>=_,f-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=v,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.offset+=h&(1<<r.extra)-1,h>>>=r.extra,f-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===u)break e;if(c=d-u,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=c>r.wnext?(c-=r.wnext,r.wsize-c):r.wnext-c,c>r.length&&(c=r.length),m=r.window}else m=i,p=a-r.offset,c=r.length;for(u<c&&(c=u),u-=c,r.length-=c;i[a++]=m[p++],--c;);0===r.length&&(r.mode=21);break;case 26:if(0===u)break e;i[a++]=r.length,u--,r.mode=21;break;case 27:if(r.wrap){for(;f<32;){if(0===o)break e;o--,h|=n[s++]<<f,f+=8}if(d-=u,e.total_out+=d,r.total+=d,d&&(e.adler=r.check=r.flags?B(r.check,i,d,a-d):O(r.check,i,d,a-d)),d=u,(r.flags?h:L(h))!==r.check){e.msg="incorrect data check",r.mode=30;break}f=h=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(h!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}f=h=0}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return-4;case 32:default:return U}return e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,(r.wsize||d!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,d-e.avail_out)?(r.mode=31,-4):(l-=e.avail_in,d-=e.avail_out,e.total_in+=l,e.total_out+=d,r.total+=d,r.wrap&&d&&(e.adler=r.check=r.flags?B(r.check,i,d,e.next_out-d):O(r.check,i,d,e.next_out-d)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==l&&0===d||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){"use strict";var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var u,h,f,l,d,c,p,m,_,g=o.bits,v=0,b=0,w=0,y=0,k=0,x=0,S=0,z=0,E=0,C=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),T=null,R=0;for(v=0;v<=15;v++)O[v]=0;for(b=0;b<n;b++)O[t[r+b]]++;for(k=g,y=15;1<=y&&0===O[y];y--);if(y<k&&(k=y),0===y)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(w=1;w<y&&0===O[w];w++);for(k<w&&(k=w),v=z=1;v<=15;v++)if(z<<=1,(z-=O[v])<0)return-1;if(0<z&&(0===e||1!==y))return-1;for(B[1]=0,v=1;v<15;v++)B[v+1]=B[v]+O[v];for(b=0;b<n;b++)0!==t[r+b]&&(a[B[t[r+b]]++]=b);if(c=0===e?(A=T=a,19):1===e?(A=F,I-=257,T=N,R-=257,256):(A=U,T=P,-1),v=w,d=s,S=b=C=0,f=-1,l=(E=1<<(x=k))-1,1===e&&852<E||2===e&&592<E)return 1;for(;;){for(p=v-S,_=a[b]<c?(m=0,a[b]):a[b]>c?(m=T[R+a[b]],A[I+a[b]]):(m=96,0),u=1<<v-S,w=h=1<<x;i[d+(C>>S)+(h-=u)]=p<<24|m<<16|_|0,0!==h;);for(u=1<<v-1;C&u;)u>>=1;if(0!==u?(C&=u-1,C+=u):C=0,b++,0==--O[v]){if(v===y)break;v=t[r+a[b]]}if(k<v&&(C&l)!==f){for(0===S&&(S=k),d+=w,z=1<<(x=v-S);x+S<y&&!((z-=O[x+S])<=0);)x++,z<<=1;if(E+=1<<x,1===e&&852<E||2===e&&592<E)return 1;i[f=C&l]=k<<24|x<<16|d-s|0}}return 0!==C&&(i[d+C]=v-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(e,t,r){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,t,r){"use strict";var o=e("../utils/common");function n(e){for(var t=e.length;0<=--t;)e[t]=0}var _=15,i=16,u=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],h=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],f=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],l=new Array(576);n(l);var d=new Array(60);n(d);var c=new Array(512);n(c);var p=new Array(256);n(p);var m=new Array(29);n(m);var g,v,b,w=new Array(30);function y(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length}function s(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function k(e){return e<256?c[e]:c[256+(e>>>7)]}function x(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function S(e,t,r){e.bi_valid>i-r?(e.bi_buf|=t<<e.bi_valid&65535,x(e,e.bi_buf),e.bi_buf=t>>i-e.bi_valid,e.bi_valid+=r-i):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function z(e,t,r){S(e,r[2*t],r[2*t+1])}function E(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function C(e,t,r){var n,i,s=new Array(_+1),a=0;for(n=1;n<=_;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=E(s[o]++,o))}}function A(e){var t;for(t=0;t<286;t++)e.dyn_ltree[2*t]=0;for(t=0;t<30;t++)e.dyn_dtree[2*t]=0;for(t=0;t<19;t++)e.bl_tree[2*t]=0;e.dyn_ltree[512]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function I(e){8<e.bi_valid?x(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function O(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function B(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&O(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!O(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n}function T(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?z(e,i,t):(z(e,(s=p[i])+256+1,t),0!==(a=u[s])&&S(e,i-=m[s],a),z(e,s=k(--n),r),0!==(a=h[s])&&S(e,n-=w[s],a)),o<e.last_lit;);z(e,256,t)}function R(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,u=t.stat_desc.elems,h=-1;for(e.heap_len=0,e.heap_max=573,r=0;r<u;r++)0!==s[2*r]?(e.heap[++e.heap_len]=h=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=h<2?++h:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=h,r=e.heap_len>>1;1<=r;r--)B(e,s,r);for(i=u;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],B(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,B(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,u=t.dyn_tree,h=t.max_code,f=t.stat_desc.static_tree,l=t.stat_desc.has_stree,d=t.stat_desc.extra_bits,c=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=_;s++)e.bl_count[s]=0;for(u[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<573;r++)p<(s=u[2*u[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),u[2*n+1]=s,h<n||(e.bl_count[s]++,a=0,c<=n&&(a=d[n-c]),o=u[2*n],e.opt_len+=o*(s+a),l&&(e.static_len+=o*(f[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)h<(i=e.heap[--r])||(u[2*i+1]!==s&&(e.opt_len+=(s-u[2*i+1])*u[2*i],u[2*i+1]=s),n--)}}(e,t),C(s,h,e.bl_count)}function D(e,t,r){var n,i,s=-1,a=t[1],o=0,u=7,h=4;for(0===a&&(u=138,h=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<u&&i===a||(o<h?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[32]++):o<=10?e.bl_tree[34]++:e.bl_tree[36]++,s=i,h=(o=0)===a?(u=138,3):i===a?(u=6,3):(u=7,4))}function F(e,t,r){var n,i,s=-1,a=t[1],o=0,u=7,h=4;for(0===a&&(u=138,h=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<u&&i===a)){if(o<h)for(;z(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(z(e,i,e.bl_tree),o--),z(e,16,e.bl_tree),S(e,o-3,2)):o<=10?(z(e,17,e.bl_tree),S(e,o-3,3)):(z(e,18,e.bl_tree),S(e,o-11,7));s=i,h=(o=0)===a?(u=138,3):i===a?(u=6,3):(u=7,4)}}n(w);var N=!1;function U(e,t,r,n){var i,s,a;S(e,0+(n?1:0),3),s=t,a=r,I(i=e),x(i,a),x(i,~a),o.arraySet(i.pending_buf,i.window,s,a,i.pending),i.pending+=a}r._tr_init=function(e){N||(function(){var e,t,r,n,i,s=new Array(_+1);for(n=r=0;n<28;n++)for(m[n]=r,e=0;e<1<<u[n];e++)p[r++]=n;for(p[r-1]=n,n=i=0;n<16;n++)for(w[n]=i,e=0;e<1<<h[n];e++)c[i++]=n;for(i>>=7;n<30;n++)for(w[n]=i<<7,e=0;e<1<<h[n]-7;e++)c[256+i++]=n;for(t=0;t<=_;t++)s[t]=0;for(e=0;e<=143;)l[2*e+1]=8,e++,s[8]++;for(;e<=255;)l[2*e+1]=9,e++,s[9]++;for(;e<=279;)l[2*e+1]=7,e++,s[7]++;for(;e<=287;)l[2*e+1]=8,e++,s[8]++;for(C(l,287,s),e=0;e<30;e++)d[2*e+1]=5,d[2*e]=E(e,5);g=new y(l,u,257,286,_),v=new y(d,h,0,30,_),b=new y(new Array(0),a,0,19,7)}(),N=!0),e.l_desc=new s(e.dyn_ltree,g),e.d_desc=new s(e.dyn_dtree,v),e.bl_desc=new s(e.bl_tree,b),e.bi_buf=0,e.bi_valid=0,A(e)},r._tr_stored_block=U,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return 0;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return 1;for(t=32;t<256;t++)if(0!==e.dyn_ltree[2*t])return 1;return 0}(e)),R(e,e.l_desc),R(e,e.d_desc),a=function(e){var t;for(D(e,e.dyn_ltree,e.l_desc.max_code),D(e,e.dyn_dtree,e.d_desc.max_code),R(e,e.bl_desc),t=18;3<=t&&0===e.bl_tree[2*f[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?U(e,t,r,n):4===e.strategy||s===i?(S(e,2+(n?1:0),3),T(e,l,d)):(S(e,4+(n?1:0),3),function(e,t,r,n){var i;for(S(e,t-257,5),S(e,r-1,5),S(e,n-4,4),i=0;i<n;i++)S(e,e.bl_tree[2*f[i]+1],3);F(e,e.dyn_ltree,t-1),F(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),T(e,e.dyn_ltree,e.dyn_dtree)),A(e),n&&I(e)},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(p[r]+256+1)]++,e.dyn_dtree[2*k(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){var t;S(e,2,3),z(e,256,l),16===(t=e).bi_valid?(x(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}},{"../utils/common":41}],53:[function(e,t,r){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,r){"use strict";t.exports="function"==typeof setImmediate?setImmediate:function(){var e=[].slice.apply(arguments);e.splice(1,0,0),setTimeout.apply(null,e)}},{}]},{},[10])(10)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});

/***/ }),

/***/ "./node_modules/simplex-noise/simplex-noise.js":
/*!*****************************************************!*\
  !*** ./node_modules/simplex-noise/simplex-noise.js ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.


 Copyright (c) 2018 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
(function() {
  'use strict';

  var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  var F3 = 1.0 / 3.0;
  var G3 = 1.0 / 6.0;
  var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  function SimplexNoise(randomOrSeed) {
    var random;
    if (typeof randomOrSeed == 'function') {
      random = randomOrSeed;
    }
    else if (randomOrSeed) {
      random = alea(randomOrSeed);
    } else {
      random = Math.random;
    }
    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }

  }
  SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
      -1, 1, 0,
      1, -1, 0,

      -1, -1, 0,
      1, 0, 1,
      -1, 0, 1,

      1, 0, -1,
      -1, 0, -1,
      0, 1, 1,

      0, -1, 1,
      0, 1, -1,
      0, -1, -1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
      0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
      1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
      -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
      1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
      -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
      1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
      -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
    noise2D: function(xin, yin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0 = 0; // Noise contributions from the three corners
      var n1 = 0;
      var n2 = 0;
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin) * F2; // Hairy factor for 2D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j) * G2;
      var X0 = i - t; // Unskew the cell origin back to (x,y) space
      var Y0 = j - t;
      var x0 = xin - X0; // The x,y distances from the cell origin
      var y0 = yin - Y0;
      // For the 2D case, the simplex shape is an equilateral triangle.
      // Determine which simplex we are in.
      var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      else {
        i1 = 0;
        j1 = 1;
      } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6
      var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
      var y2 = y0 - 1.0 + 2.0 * G2;
      // Work out the hashed gradient indices of the three simplex corners
      var ii = i & 255;
      var jj = j & 255;
      // Calculate the contribution from the three corners
      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        var gi0 = permMod12[ii + perm[jj]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
      }
      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
      }
      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to return values in the interval [-1,1].
      return 70.0 * (n0 + n1 + n2);
    },
    // 3D simplex noise
    noise3D: function(xin, yin, zin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0, n1, n2, n3; // Noise contributions from the four corners
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var k = Math.floor(zin + s);
      var t = (i + j + k) * G3;
      var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
      var Y0 = j - t;
      var Z0 = k - t;
      var x0 = xin - X0; // The x,y,z distances from the cell origin
      var y0 = yin - Y0;
      var z0 = zin - Z0;
      // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
      // Determine which simplex we are in.
      var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
      var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
      if (x0 >= y0) {
        if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // X Y Z order
        else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // X Z Y order
        else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // Z X Y order
      }
      else { // x0<y0
        if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Z Y X order
        else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Y Z X order
        else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // Y X Z order
      }
      // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
      // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
      // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
      // c = 1/6.
      var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
      var y1 = y0 - j1 + G3;
      var z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
      var y2 = y0 - j2 + 2.0 * G3;
      var z2 = z0 - k2 + 2.0 * G3;
      var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
      var y3 = y0 - 1.0 + 3.0 * G3;
      var z3 = z0 - 1.0 + 3.0 * G3;
      // Work out the hashed gradient indices of the four simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      // Calculate the contribution from the four corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
        t3 *= t3;
        n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to stay just inside [-1,1]
      return 32.0 * (n0 + n1 + n2 + n3);
    },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function(x, y, z, w) {
      var perm = this.perm;
      var grad4 = this.grad4;

      var n0, n1, n2, n3, n4; // Noise contributions from the five corners
      // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
      var s = (x + y + z + w) * F4; // Factor for 4D skewing
      var i = Math.floor(x + s);
      var j = Math.floor(y + s);
      var k = Math.floor(z + s);
      var l = Math.floor(w + s);
      var t = (i + j + k + l) * G4; // Factor for 4D unskewing
      var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
      var Y0 = j - t;
      var Z0 = k - t;
      var W0 = l - t;
      var x0 = x - X0; // The x,y,z,w distances from the cell origin
      var y0 = y - Y0;
      var z0 = z - Z0;
      var w0 = w - W0;
      // For the 4D case, the simplex is a 4D shape I won't even try to describe.
      // To find out which of the 24 possible simplices we're in, we need to
      // determine the magnitude ordering of x0, y0, z0 and w0.
      // Six pair-wise comparisons are performed between each possible pair
      // of the four coordinates, and the results are used to rank the numbers.
      var rankx = 0;
      var ranky = 0;
      var rankz = 0;
      var rankw = 0;
      if (x0 > y0) rankx++;
      else ranky++;
      if (x0 > z0) rankx++;
      else rankz++;
      if (x0 > w0) rankx++;
      else rankw++;
      if (y0 > z0) ranky++;
      else rankz++;
      if (y0 > w0) ranky++;
      else rankw++;
      if (z0 > w0) rankz++;
      else rankw++;
      var i1, j1, k1, l1; // The integer offsets for the second simplex corner
      var i2, j2, k2, l2; // The integer offsets for the third simplex corner
      var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
      // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
      // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
      // impossible. Only the 24 indices which have non-zero entries make any sense.
      // We use a thresholding to set the coordinates in turn from the largest magnitude.
      // Rank 3 denotes the largest coordinate.
      i1 = rankx >= 3 ? 1 : 0;
      j1 = ranky >= 3 ? 1 : 0;
      k1 = rankz >= 3 ? 1 : 0;
      l1 = rankw >= 3 ? 1 : 0;
      // Rank 2 denotes the second largest coordinate.
      i2 = rankx >= 2 ? 1 : 0;
      j2 = ranky >= 2 ? 1 : 0;
      k2 = rankz >= 2 ? 1 : 0;
      l2 = rankw >= 2 ? 1 : 0;
      // Rank 1 denotes the second smallest coordinate.
      i3 = rankx >= 1 ? 1 : 0;
      j3 = ranky >= 1 ? 1 : 0;
      k3 = rankz >= 1 ? 1 : 0;
      l3 = rankw >= 1 ? 1 : 0;
      // The fifth corner has all coordinate offsets = 1, so no need to compute that.
      var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
      var y1 = y0 - j1 + G4;
      var z1 = z0 - k1 + G4;
      var w1 = w0 - l1 + G4;
      var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
      var y2 = y0 - j2 + 2.0 * G4;
      var z2 = z0 - k2 + 2.0 * G4;
      var w2 = w0 - l2 + 2.0 * G4;
      var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
      var y3 = y0 - j3 + 3.0 * G4;
      var z3 = z0 - k3 + 3.0 * G4;
      var w3 = w0 - l3 + 3.0 * G4;
      var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
      var y4 = y0 - 1.0 + 4.0 * G4;
      var z4 = z0 - 1.0 + 4.0 * G4;
      var w4 = w0 - 1.0 + 4.0 * G4;
      // Work out the hashed gradient indices of the five simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      var ll = l & 255;
      // Calculate the contribution from the five corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
        t0 *= t0;
        n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
        t1 *= t1;
        n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
        t2 *= t2;
        n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
        t3 *= t3;
        n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
      }
      var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
      if (t4 < 0) n4 = 0.0;
      else {
        var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
        t4 *= t4;
        n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
      }
      // Sum up and scale the result to cover the range [-1,1]
      return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }
  };

  function buildPermutationTable(random) {
    var i;
    var p = new Uint8Array(256);
    for (i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (i = 0; i < 255; i++) {
      var r = i + ~~(random() * (256 - i));
      var aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    return p;
  }
  SimplexNoise._buildPermutationTable = buildPermutationTable;

  function alea() {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    var mash = masher();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < arguments.length; i++) {
      s0 -= mash(arguments[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(arguments[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(arguments[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;
    return function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
  }
  function masher() {
    var n = 0xefc8249d;
    return function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
  }

  // amd
  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {return SimplexNoise;}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  // common js
  if (true) exports.SimplexNoise = SimplexNoise;
  // browser
  else {}
  // nodejs
  if (true) {
    module.exports = SimplexNoise;
  }

})();


/***/ }),

/***/ "./node_modules/simplify-js/simplify.js":
/*!**********************************************!*\
  !*** ./node_modules/simplify-js/simplify.js ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

(function () { 'use strict';

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
        index;

    for (var i = first + 1; i < last; i++) {
        var sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points, sqTolerance) {
    var last = points.length - 1;

    var simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
}

// both algorithms combined for awesome performance
function simplify(points, tolerance, highestQuality) {

    if (points.length <= 2) return points;

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

// export as AMD module / Node module / browser or worker variable
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return simplify; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
else {}

})();


/***/ }),

/***/ "./node_modules/svgpath/index.js":
/*!***************************************!*\
  !*** ./node_modules/svgpath/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./lib/svgpath */ "./node_modules/svgpath/lib/svgpath.js");


/***/ }),

/***/ "./node_modules/svgpath/lib/a2c.js":
/*!*****************************************!*\
  !*** ./node_modules/svgpath/lib/a2c.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
// Convert an arc to a sequence of cubic bézier curves
//



var TAU = Math.PI * 2;


/* eslint-disable space-infix-ops */

// Calculate an angle between two unit vectors
//
// Since we measure angle between radii of circular arcs,
// we can use simplified math (without length normalization)
//
function unit_vector_angle(ux, uy, vx, vy) {
  var sign = (ux * vy - uy * vx < 0) ? -1 : 1;
  var dot  = ux * vx + uy * vy;

  // Add this to work with arbitrary vectors:
  // dot /= Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);

  // rounding errors, e.g. -1.0000000000000002 can screw up this
  if (dot >  1.0) { dot =  1.0; }
  if (dot < -1.0) { dot = -1.0; }

  return sign * Math.acos(dot);
}


// Convert from endpoint to center parameterization,
// see http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
//
// Return [cx, cy, theta1, delta_theta]
//
function get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi) {
  // Step 1.
  //
  // Moving an ellipse so origin will be the middlepoint between our two
  // points. After that, rotate it to line up ellipse axes with coordinate
  // axes.
  //
  var x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
  var y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;

  var rx_sq  =  rx * rx;
  var ry_sq  =  ry * ry;
  var x1p_sq = x1p * x1p;
  var y1p_sq = y1p * y1p;

  // Step 2.
  //
  // Compute coordinates of the centre of this ellipse (cx', cy')
  // in the new coordinate system.
  //
  var radicant = (rx_sq * ry_sq) - (rx_sq * y1p_sq) - (ry_sq * x1p_sq);

  if (radicant < 0) {
    // due to rounding errors it might be e.g. -1.3877787807814457e-17
    radicant = 0;
  }

  radicant /=   (rx_sq * y1p_sq) + (ry_sq * x1p_sq);
  radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);

  var cxp = radicant *  rx/ry * y1p;
  var cyp = radicant * -ry/rx * x1p;

  // Step 3.
  //
  // Transform back to get centre coordinates (cx, cy) in the original
  // coordinate system.
  //
  var cx = cos_phi*cxp - sin_phi*cyp + (x1+x2)/2;
  var cy = sin_phi*cxp + cos_phi*cyp + (y1+y2)/2;

  // Step 4.
  //
  // Compute angles (theta1, delta_theta).
  //
  var v1x =  (x1p - cxp) / rx;
  var v1y =  (y1p - cyp) / ry;
  var v2x = (-x1p - cxp) / rx;
  var v2y = (-y1p - cyp) / ry;

  var theta1 = unit_vector_angle(1, 0, v1x, v1y);
  var delta_theta = unit_vector_angle(v1x, v1y, v2x, v2y);

  if (fs === 0 && delta_theta > 0) {
    delta_theta -= TAU;
  }
  if (fs === 1 && delta_theta < 0) {
    delta_theta += TAU;
  }

  return [ cx, cy, theta1, delta_theta ];
}

//
// Approximate one unit arc segment with bézier curves,
// see http://math.stackexchange.com/questions/873224
//
function approximate_unit_arc(theta1, delta_theta) {
  var alpha = 4/3 * Math.tan(delta_theta/4);

  var x1 = Math.cos(theta1);
  var y1 = Math.sin(theta1);
  var x2 = Math.cos(theta1 + delta_theta);
  var y2 = Math.sin(theta1 + delta_theta);

  return [ x1, y1, x1 - y1*alpha, y1 + x1*alpha, x2 + y2*alpha, y2 - x2*alpha, x2, y2 ];
}

module.exports = function a2c(x1, y1, x2, y2, fa, fs, rx, ry, phi) {
  var sin_phi = Math.sin(phi * TAU / 360);
  var cos_phi = Math.cos(phi * TAU / 360);

  // Make sure radii are valid
  //
  var x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
  var y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;

  if (x1p === 0 && y1p === 0) {
    // we're asked to draw line to itself
    return [];
  }

  if (rx === 0 || ry === 0) {
    // one of the radii is zero
    return [];
  }


  // Compensate out-of-range radii
  //
  rx = Math.abs(rx);
  ry = Math.abs(ry);

  var lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }


  // Get center parameters (cx, cy, theta1, delta_theta)
  //
  var cc = get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi);

  var result = [];
  var theta1 = cc[2];
  var delta_theta = cc[3];

  // Split an arc to multiple segments, so each segment
  // will be less than τ/4 (= 90°)
  //
  var segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
  delta_theta /= segments;

  for (var i = 0; i < segments; i++) {
    result.push(approximate_unit_arc(theta1, delta_theta));
    theta1 += delta_theta;
  }

  // We have a bezier approximation of a unit circle,
  // now need to transform back to the original ellipse
  //
  return result.map(function (curve) {
    for (var i = 0; i < curve.length; i += 2) {
      var x = curve[i + 0];
      var y = curve[i + 1];

      // scale
      x *= rx;
      y *= ry;

      // rotate
      var xp = cos_phi*x - sin_phi*y;
      var yp = sin_phi*x + cos_phi*y;

      // translate
      curve[i + 0] = xp + cc[0];
      curve[i + 1] = yp + cc[1];
    }

    return curve;
  });
};


/***/ }),

/***/ "./node_modules/svgpath/lib/ellipse.js":
/*!*********************************************!*\
  !*** ./node_modules/svgpath/lib/ellipse.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


/* eslint-disable space-infix-ops */

// The precision used to consider an ellipse as a circle
//
var epsilon = 0.0000000001;

// To convert degree in radians
//
var torad = Math.PI / 180;

// Class constructor :
//  an ellipse centred at 0 with radii rx,ry and x - axis - angle ax.
//
function Ellipse(rx, ry, ax) {
  if (!(this instanceof Ellipse)) { return new Ellipse(rx, ry, ax); }
  this.rx = rx;
  this.ry = ry;
  this.ax = ax;
}

// Apply a linear transform m to the ellipse
// m is an array representing a matrix :
//    -         -
//   | m[0] m[2] |
//   | m[1] m[3] |
//    -         -
//
Ellipse.prototype.transform = function (m) {
  // We consider the current ellipse as image of the unit circle
  // by first scale(rx,ry) and then rotate(ax) ...
  // So we apply ma =  m x rotate(ax) x scale(rx,ry) to the unit circle.
  var c = Math.cos(this.ax * torad), s = Math.sin(this.ax * torad);
  var ma = [
    this.rx * (m[0]*c + m[2]*s),
    this.rx * (m[1]*c + m[3]*s),
    this.ry * (-m[0]*s + m[2]*c),
    this.ry * (-m[1]*s + m[3]*c)
  ];

  // ma * transpose(ma) = [ J L ]
  //                      [ L K ]
  // L is calculated later (if the image is not a circle)
  var J = ma[0]*ma[0] + ma[2]*ma[2],
      K = ma[1]*ma[1] + ma[3]*ma[3];

  // the discriminant of the characteristic polynomial of ma * transpose(ma)
  var D = ((ma[0]-ma[3])*(ma[0]-ma[3]) + (ma[2]+ma[1])*(ma[2]+ma[1])) *
          ((ma[0]+ma[3])*(ma[0]+ma[3]) + (ma[2]-ma[1])*(ma[2]-ma[1]));

  // the "mean eigenvalue"
  var JK = (J + K) / 2;

  // check if the image is (almost) a circle
  if (D < epsilon * JK) {
    // if it is
    this.rx = this.ry = Math.sqrt(JK);
    this.ax = 0;
    return this;
  }

  // if it is not a circle
  var L = ma[0]*ma[1] + ma[2]*ma[3];

  D = Math.sqrt(D);

  // {l1,l2} = the two eigen values of ma * transpose(ma)
  var l1 = JK + D/2,
      l2 = JK - D/2;
  // the x - axis - rotation angle is the argument of the l1 - eigenvector
  /*eslint-disable indent*/
  this.ax = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ?
    90
  :
    Math.atan(Math.abs(L) > Math.abs(l1 - K) ?
      (l1 - J) / L
    :
      L / (l1 - K)
    ) * 180 / Math.PI;
  /*eslint-enable indent*/

  // if ax > 0 => rx = sqrt(l1), ry = sqrt(l2), else exchange axes and ax += 90
  if (this.ax >= 0) {
    // if ax in [0,90]
    this.rx = Math.sqrt(l1);
    this.ry = Math.sqrt(l2);
  } else {
    // if ax in ]-90,0[ => exchange axes
    this.ax += 90;
    this.rx = Math.sqrt(l2);
    this.ry = Math.sqrt(l1);
  }

  return this;
};

// Check if the ellipse is (almost) degenerate, i.e. rx = 0 or ry = 0
//
Ellipse.prototype.isDegenerate = function () {
  return (this.rx < epsilon * this.ry || this.ry < epsilon * this.rx);
};

module.exports = Ellipse;


/***/ }),

/***/ "./node_modules/svgpath/lib/matrix.js":
/*!********************************************!*\
  !*** ./node_modules/svgpath/lib/matrix.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";


// combine 2 matrixes
// m1, m2 - [a, b, c, d, e, g]
//
function combine(m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
}


function Matrix() {
  if (!(this instanceof Matrix)) { return new Matrix(); }
  this.queue = [];   // list of matrixes to apply
  this.cache = null; // combined matrix cache
}


Matrix.prototype.matrix = function (m) {
  if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0) {
    return this;
  }
  this.cache = null;
  this.queue.push(m);
  return this;
};


Matrix.prototype.translate = function (tx, ty) {
  if (tx !== 0 || ty !== 0) {
    this.cache = null;
    this.queue.push([ 1, 0, 0, 1, tx, ty ]);
  }
  return this;
};


Matrix.prototype.scale = function (sx, sy) {
  if (sx !== 1 || sy !== 1) {
    this.cache = null;
    this.queue.push([ sx, 0, 0, sy, 0, 0 ]);
  }
  return this;
};


Matrix.prototype.rotate = function (angle, rx, ry) {
  var rad, cos, sin;

  if (angle !== 0) {
    this.translate(rx, ry);

    rad = angle * Math.PI / 180;
    cos = Math.cos(rad);
    sin = Math.sin(rad);

    this.queue.push([ cos, sin, -sin, cos, 0, 0 ]);
    this.cache = null;

    this.translate(-rx, -ry);
  }
  return this;
};


Matrix.prototype.skewX = function (angle) {
  if (angle !== 0) {
    this.cache = null;
    this.queue.push([ 1, 0, Math.tan(angle * Math.PI / 180), 1, 0, 0 ]);
  }
  return this;
};


Matrix.prototype.skewY = function (angle) {
  if (angle !== 0) {
    this.cache = null;
    this.queue.push([ 1, Math.tan(angle * Math.PI / 180), 0, 1, 0, 0 ]);
  }
  return this;
};


// Flatten queue
//
Matrix.prototype.toArray = function () {
  if (this.cache) {
    return this.cache;
  }

  if (!this.queue.length) {
    this.cache = [ 1, 0, 0, 1, 0, 0 ];
    return this.cache;
  }

  this.cache = this.queue[0];

  if (this.queue.length === 1) {
    return this.cache;
  }

  for (var i = 1; i < this.queue.length; i++) {
    this.cache = combine(this.cache, this.queue[i]);
  }

  return this.cache;
};


// Apply list of matrixes to (x,y) point.
// If `isRelative` set, `translate` component of matrix will be skipped
//
Matrix.prototype.calc = function (x, y, isRelative) {
  var m;

  // Don't change point on empty transforms queue
  if (!this.queue.length) { return [ x, y ]; }

  // Calculate final matrix, if not exists
  //
  // NB. if you deside to apply transforms to point one-by-one,
  // they should be taken in reverse order

  if (!this.cache) {
    this.cache = this.toArray();
  }

  m = this.cache;

  // Apply matrix to point
  return [
    x * m[0] + y * m[2] + (isRelative ? 0 : m[4]),
    x * m[1] + y * m[3] + (isRelative ? 0 : m[5])
  ];
};


module.exports = Matrix;


/***/ }),

/***/ "./node_modules/svgpath/lib/path_parse.js":
/*!************************************************!*\
  !*** ./node_modules/svgpath/lib/path_parse.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";



var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

var SPECIAL_SPACES = [
  0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
  0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF
];

function isSpace(ch) {
  return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) || // Line terminators
    // White spaces
    (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
    (ch >= 0x1680 && SPECIAL_SPACES.indexOf(ch) >= 0);
}

function isCommand(code) {
  /*eslint-disable no-bitwise*/
  switch (code | 0x20) {
    case 0x6D/* m */:
    case 0x7A/* z */:
    case 0x6C/* l */:
    case 0x68/* h */:
    case 0x76/* v */:
    case 0x63/* c */:
    case 0x73/* s */:
    case 0x71/* q */:
    case 0x74/* t */:
    case 0x61/* a */:
    case 0x72/* r */:
      return true;
  }
  return false;
}

function isArc(code) {
  return (code | 0x20) === 0x61;
}

function isDigit(code) {
  return (code >= 48 && code <= 57);   // 0..9
}

function isDigitStart(code) {
  return (code >= 48 && code <= 57) || /* 0..9 */
          code === 0x2B || /* + */
          code === 0x2D || /* - */
          code === 0x2E;   /* . */
}


function State(path) {
  this.index  = 0;
  this.path   = path;
  this.max    = path.length;
  this.result = [];
  this.param  = 0.0;
  this.err    = '';
  this.segmentStart = 0;
  this.data   = [];
}

function skipSpaces(state) {
  while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) {
    state.index++;
  }
}


function scanFlag(state) {
  var ch = state.path.charCodeAt(state.index);

  if (ch === 0x30/* 0 */) {
    state.param = 0;
    state.index++;
    return;
  }

  if (ch === 0x31/* 1 */) {
    state.param = 1;
    state.index++;
    return;
  }

  state.err = 'SvgPath: arc flag can be 0 or 1 only (at pos ' + state.index + ')';
}


function scanParam(state) {
  var start = state.index,
      index = start,
      max = state.max,
      zeroFirst = false,
      hasCeiling = false,
      hasDecimal = false,
      hasDot = false,
      ch;

  if (index >= max) {
    state.err = 'SvgPath: missed param (at pos ' + index + ')';
    return;
  }
  ch = state.path.charCodeAt(index);

  if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
    index++;
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  // This logic is shamelessly borrowed from Esprima
  // https://github.com/ariya/esprimas
  //
  if (!isDigit(ch) && ch !== 0x2E/* . */) {
    state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
    return;
  }

  if (ch !== 0x2E/* . */) {
    zeroFirst = (ch === 0x30/* 0 */);
    index++;

    ch = (index < max) ? state.path.charCodeAt(index) : 0;

    if (zeroFirst && index < max) {
      // decimal number starts with '0' such as '09' is illegal.
      if (ch && isDigit(ch)) {
        state.err = 'SvgPath: numbers started with `0` such as `09` are illegal (at pos ' + start + ')';
        return;
      }
    }

    while (index < max && isDigit(state.path.charCodeAt(index))) {
      index++;
      hasCeiling = true;
    }
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  if (ch === 0x2E/* . */) {
    hasDot = true;
    index++;
    while (isDigit(state.path.charCodeAt(index))) {
      index++;
      hasDecimal = true;
    }
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  if (ch === 0x65/* e */ || ch === 0x45/* E */) {
    if (hasDot && !hasCeiling && !hasDecimal) {
      state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      return;
    }

    index++;

    ch = (index < max) ? state.path.charCodeAt(index) : 0;
    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      index++;
    }
    if (index < max && isDigit(state.path.charCodeAt(index))) {
      while (index < max && isDigit(state.path.charCodeAt(index))) {
        index++;
      }
    } else {
      state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      return;
    }
  }

  state.index = index;
  state.param = parseFloat(state.path.slice(start, index)) + 0.0;
}


function finalizeSegment(state) {
  var cmd, cmdLC;

  // Process duplicated commands (without comand name)

  // This logic is shamelessly borrowed from Raphael
  // https://github.com/DmitryBaranovskiy/raphael/
  //
  cmd   = state.path[state.segmentStart];
  cmdLC = cmd.toLowerCase();

  var params = state.data;

  if (cmdLC === 'm' && params.length > 2) {
    state.result.push([ cmd, params[0], params[1] ]);
    params = params.slice(2);
    cmdLC = 'l';
    cmd = (cmd === 'm') ? 'l' : 'L';
  }

  if (cmdLC === 'r') {
    state.result.push([ cmd ].concat(params));
  } else {

    while (params.length >= paramCounts[cmdLC]) {
      state.result.push([ cmd ].concat(params.splice(0, paramCounts[cmdLC])));
      if (!paramCounts[cmdLC]) {
        break;
      }
    }
  }
}


function scanSegment(state) {
  var max = state.max,
      cmdCode, is_arc, comma_found, need_params, i;

  state.segmentStart = state.index;
  cmdCode = state.path.charCodeAt(state.index);
  is_arc = isArc(cmdCode);

  if (!isCommand(cmdCode)) {
    state.err = 'SvgPath: bad command ' + state.path[state.index] + ' (at pos ' + state.index + ')';
    return;
  }

  need_params = paramCounts[state.path[state.index].toLowerCase()];

  state.index++;
  skipSpaces(state);

  state.data = [];

  if (!need_params) {
    // Z
    finalizeSegment(state);
    return;
  }

  comma_found = false;

  for (;;) {
    for (i = need_params; i > 0; i--) {
      if (is_arc && (i === 3 || i === 4)) scanFlag(state);
      else scanParam(state);

      if (state.err.length) {
        return;
      }
      state.data.push(state.param);

      skipSpaces(state);
      comma_found = false;

      if (state.index < max && state.path.charCodeAt(state.index) === 0x2C/* , */) {
        state.index++;
        skipSpaces(state);
        comma_found = true;
      }
    }

    // after ',' param is mandatory
    if (comma_found) {
      continue;
    }

    if (state.index >= state.max) {
      break;
    }

    // Stop on next segment
    if (!isDigitStart(state.path.charCodeAt(state.index))) {
      break;
    }
  }

  finalizeSegment(state);
}


/* Returns array of segments:
 *
 * [
 *   [ command, coord1, coord2, ... ]
 * ]
 */
module.exports = function pathParse(svgPath) {
  var state = new State(svgPath);
  var max = state.max;

  skipSpaces(state);

  while (state.index < max && !state.err.length) {
    scanSegment(state);
  }

  if (state.err.length) {
    state.result = [];

  } else if (state.result.length) {

    if ('mM'.indexOf(state.result[0][0]) < 0) {
      state.err = 'SvgPath: string should start with `M` or `m`';
      state.result = [];
    } else {
      state.result[0][0] = 'M';
    }
  }

  return {
    err: state.err,
    segments: state.result
  };
};


/***/ }),

/***/ "./node_modules/svgpath/lib/svgpath.js":
/*!*********************************************!*\
  !*** ./node_modules/svgpath/lib/svgpath.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// SVG Path transformations library
//
// Usage:
//
//    SvgPath('...')
//      .translate(-150, -100)
//      .scale(0.5)
//      .translate(-150, -100)
//      .toFixed(1)
//      .toString()
//




var pathParse      = __webpack_require__(/*! ./path_parse */ "./node_modules/svgpath/lib/path_parse.js");
var transformParse = __webpack_require__(/*! ./transform_parse */ "./node_modules/svgpath/lib/transform_parse.js");
var matrix         = __webpack_require__(/*! ./matrix */ "./node_modules/svgpath/lib/matrix.js");
var a2c            = __webpack_require__(/*! ./a2c */ "./node_modules/svgpath/lib/a2c.js");
var ellipse        = __webpack_require__(/*! ./ellipse */ "./node_modules/svgpath/lib/ellipse.js");


// Class constructor
//
function SvgPath(path) {
  if (!(this instanceof SvgPath)) { return new SvgPath(path); }

  var pstate = pathParse(path);

  // Array of path segments.
  // Each segment is array [command, param1, param2, ...]
  this.segments = pstate.segments;

  // Error message on parse error.
  this.err      = pstate.err;

  // Transforms stack for lazy evaluation
  this.__stack    = [];
}

SvgPath.from = function (src) {
  if (typeof src === 'string') return new SvgPath(src);

  if (src instanceof SvgPath) {
    // Create empty object
    var s = new SvgPath('');

    // Clone properies
    s.err = src.err;
    s.segments = src.segments.map(function (sgm) { return sgm.slice(); });
    s.__stack = src.__stack.map(function (m) {
      return matrix().matrix(m.toArray());
    });

    return s;
  }

  throw new Error('SvgPath.from: invalid param type ' + src);
};


SvgPath.prototype.__matrix = function (m) {
  var self = this, i;

  // Quick leave for empty matrix
  if (!m.queue.length) { return; }

  this.iterate(function (s, index, x, y) {
    var p, result, name, isRelative;

    switch (s[0]) {

      // Process 'assymetric' commands separately
      case 'v':
        p      = m.calc(0, s[1], true);
        result = (p[0] === 0) ? [ 'v', p[1] ] : [ 'l', p[0], p[1] ];
        break;

      case 'V':
        p      = m.calc(x, s[1], false);
        result = (p[0] === m.calc(x, y, false)[0]) ? [ 'V', p[1] ] : [ 'L', p[0], p[1] ];
        break;

      case 'h':
        p      = m.calc(s[1], 0, true);
        result = (p[1] === 0) ? [ 'h', p[0] ] : [ 'l', p[0], p[1] ];
        break;

      case 'H':
        p      = m.calc(s[1], y, false);
        result = (p[1] === m.calc(x, y, false)[1]) ? [ 'H', p[0] ] : [ 'L', p[0], p[1] ];
        break;

      case 'a':
      case 'A':
        // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]

        // Drop segment if arc is empty (end point === start point)
        /*if ((s[0] === 'A' && s[6] === x && s[7] === y) ||
            (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
          return [];
        }*/

        // Transform rx, ry and the x-axis-rotation
        var ma = m.toArray();
        var e = ellipse(s[1], s[2], s[3]).transform(ma);

        // flip sweep-flag if matrix is not orientation-preserving
        if (ma[0] * ma[3] - ma[1] * ma[2] < 0) {
          s[5] = s[5] ? '0' : '1';
        }

        // Transform end point as usual (without translation for relative notation)
        p = m.calc(s[6], s[7], s[0] === 'a');

        // Empty arcs can be ignored by renderer, but should not be dropped
        // to avoid collisions with `S A S` and so on. Replace with empty line.
        if ((s[0] === 'A' && s[6] === x && s[7] === y) ||
            (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
          result = [ s[0] === 'a' ? 'l' : 'L', p[0], p[1] ];
          break;
        }

        // if the resulting ellipse is (almost) a segment ...
        if (e.isDegenerate()) {
          // replace the arc by a line
          result = [ s[0] === 'a' ? 'l' : 'L', p[0], p[1] ];
        } else {
          // if it is a real ellipse
          // s[0], s[4] and s[5] are not modified
          result = [ s[0], e.rx, e.ry, e.ax, s[4], s[5], p[0], p[1] ];
        }

        break;

      case 'm':
        // Edge case. The very first `m` should be processed as absolute, if happens.
        // Make sense for coord shift transforms.
        isRelative = index > 0;

        p = m.calc(s[1], s[2], isRelative);
        result = [ 'm', p[0], p[1] ];
        break;

      default:
        name       = s[0];
        result     = [ name ];
        isRelative = (name.toLowerCase() === name);

        // Apply transformations to the segment
        for (i = 1; i < s.length; i += 2) {
          p = m.calc(s[i], s[i + 1], isRelative);
          result.push(p[0], p[1]);
        }
    }

    self.segments[index] = result;
  }, true);
};


// Apply stacked commands
//
SvgPath.prototype.__evaluateStack = function () {
  var m, i;

  if (!this.__stack.length) { return; }

  if (this.__stack.length === 1) {
    this.__matrix(this.__stack[0]);
    this.__stack = [];
    return;
  }

  m = matrix();
  i = this.__stack.length;

  while (--i >= 0) {
    m.matrix(this.__stack[i].toArray());
  }

  this.__matrix(m);
  this.__stack = [];
};


// Convert processed SVG Path back to string
//
SvgPath.prototype.toString = function () {
  var elements = [], skipCmd, cmd;

  this.__evaluateStack();

  for (var i = 0; i < this.segments.length; i++) {
    // remove repeating commands names
    cmd = this.segments[i][0];
    skipCmd = i > 0 && cmd !== 'm' && cmd !== 'M' && cmd === this.segments[i - 1][0];
    elements = elements.concat(skipCmd ? this.segments[i].slice(1) : this.segments[i]);
  }

  return elements.join(' ')
    // Optimizations: remove spaces around commands & before `-`
    //
    // We could also remove leading zeros for `0.5`-like values,
    // but their count is too small to spend time for.
    .replace(/ ?([achlmqrstvz]) ?/gi, '$1')
    .replace(/ \-/g, '-')
    // workaround for FontForge SVG importing bug
    .replace(/zm/g, 'z m');
};


// Translate path to (x [, y])
//
SvgPath.prototype.translate = function (x, y) {
  this.__stack.push(matrix().translate(x, y || 0));
  return this;
};


// Scale path to (sx [, sy])
// sy = sx if not defined
//
SvgPath.prototype.scale = function (sx, sy) {
  this.__stack.push(matrix().scale(sx, (!sy && (sy !== 0)) ? sx : sy));
  return this;
};


// Rotate path around point (sx [, sy])
// sy = sx if not defined
//
SvgPath.prototype.rotate = function (angle, rx, ry) {
  this.__stack.push(matrix().rotate(angle, rx || 0, ry || 0));
  return this;
};


// Skew path along the X axis by `degrees` angle
//
SvgPath.prototype.skewX = function (degrees) {
  this.__stack.push(matrix().skewX(degrees));
  return this;
};


// Skew path along the Y axis by `degrees` angle
//
SvgPath.prototype.skewY = function (degrees) {
  this.__stack.push(matrix().skewY(degrees));
  return this;
};


// Apply matrix transform (array of 6 elements)
//
SvgPath.prototype.matrix = function (m) {
  this.__stack.push(matrix().matrix(m));
  return this;
};


// Transform path according to "transform" attr of SVG spec
//
SvgPath.prototype.transform = function (transformString) {
  if (!transformString.trim()) {
    return this;
  }
  this.__stack.push(transformParse(transformString));
  return this;
};


// Round coords with given decimal precition.
// 0 by default (to integers)
//
SvgPath.prototype.round = function (d) {
  var contourStartDeltaX = 0, contourStartDeltaY = 0, deltaX = 0, deltaY = 0, l;

  d = d || 0;

  this.__evaluateStack();

  this.segments.forEach(function (s) {
    var isRelative = (s[0].toLowerCase() === s[0]);

    switch (s[0]) {
      case 'H':
      case 'h':
        if (isRelative) { s[1] += deltaX; }
        deltaX = s[1] - s[1].toFixed(d);
        s[1] = +s[1].toFixed(d);
        return;

      case 'V':
      case 'v':
        if (isRelative) { s[1] += deltaY; }
        deltaY = s[1] - s[1].toFixed(d);
        s[1] = +s[1].toFixed(d);
        return;

      case 'Z':
      case 'z':
        deltaX = contourStartDeltaX;
        deltaY = contourStartDeltaY;
        return;

      case 'M':
      case 'm':
        if (isRelative) {
          s[1] += deltaX;
          s[2] += deltaY;
        }

        deltaX = s[1] - s[1].toFixed(d);
        deltaY = s[2] - s[2].toFixed(d);

        contourStartDeltaX = deltaX;
        contourStartDeltaY = deltaY;

        s[1] = +s[1].toFixed(d);
        s[2] = +s[2].toFixed(d);
        return;

      case 'A':
      case 'a':
        // [cmd, rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        if (isRelative) {
          s[6] += deltaX;
          s[7] += deltaY;
        }

        deltaX = s[6] - s[6].toFixed(d);
        deltaY = s[7] - s[7].toFixed(d);

        s[1] = +s[1].toFixed(d);
        s[2] = +s[2].toFixed(d);
        s[3] = +s[3].toFixed(d + 2); // better precision for rotation
        s[6] = +s[6].toFixed(d);
        s[7] = +s[7].toFixed(d);
        return;

      default:
        // a c l q s t
        l = s.length;

        if (isRelative) {
          s[l - 2] += deltaX;
          s[l - 1] += deltaY;
        }

        deltaX = s[l - 2] - s[l - 2].toFixed(d);
        deltaY = s[l - 1] - s[l - 1].toFixed(d);

        s.forEach(function (val, i) {
          if (!i) { return; }
          s[i] = +s[i].toFixed(d);
        });
        return;
    }
  });

  return this;
};


// Apply iterator function to all segments. If function returns result,
// current segment will be replaced to array of returned segments.
// If empty array is returned, current regment will be deleted.
//
SvgPath.prototype.iterate = function (iterator, keepLazyStack) {
  var segments = this.segments,
      replacements = {},
      needReplace = false,
      lastX = 0,
      lastY = 0,
      countourStartX = 0,
      countourStartY = 0;
  var i, j, newSegments;

  if (!keepLazyStack) {
    this.__evaluateStack();
  }

  segments.forEach(function (s, index) {

    var res = iterator(s, index, lastX, lastY);

    if (Array.isArray(res)) {
      replacements[index] = res;
      needReplace = true;
    }

    var isRelative = (s[0] === s[0].toLowerCase());

    // calculate absolute X and Y
    switch (s[0]) {
      case 'm':
      case 'M':
        lastX = s[1] + (isRelative ? lastX : 0);
        lastY = s[2] + (isRelative ? lastY : 0);
        countourStartX = lastX;
        countourStartY = lastY;
        return;

      case 'h':
      case 'H':
        lastX = s[1] + (isRelative ? lastX : 0);
        return;

      case 'v':
      case 'V':
        lastY = s[1] + (isRelative ? lastY : 0);
        return;

      case 'z':
      case 'Z':
        // That make sence for multiple contours
        lastX = countourStartX;
        lastY = countourStartY;
        return;

      default:
        lastX = s[s.length - 2] + (isRelative ? lastX : 0);
        lastY = s[s.length - 1] + (isRelative ? lastY : 0);
    }
  });

  // Replace segments if iterator return results

  if (!needReplace) { return this; }

  newSegments = [];

  for (i = 0; i < segments.length; i++) {
    if (typeof replacements[i] !== 'undefined') {
      for (j = 0; j < replacements[i].length; j++) {
        newSegments.push(replacements[i][j]);
      }
    } else {
      newSegments.push(segments[i]);
    }
  }

  this.segments = newSegments;

  return this;
};


// Converts segments from relative to absolute
//
SvgPath.prototype.abs = function () {

  this.iterate(function (s, index, x, y) {
    var name = s[0],
        nameUC = name.toUpperCase(),
        i;

    // Skip absolute commands
    if (name === nameUC) { return; }

    s[0] = nameUC;

    switch (name) {
      case 'v':
        // v has shifted coords parity
        s[1] += y;
        return;

      case 'a':
        // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        // touch x, y only
        s[6] += x;
        s[7] += y;
        return;

      default:
        for (i = 1; i < s.length; i++) {
          s[i] += i % 2 ? x : y; // odd values are X, even - Y
        }
    }
  }, true);

  return this;
};


// Converts segments from absolute to relative
//
SvgPath.prototype.rel = function () {

  this.iterate(function (s, index, x, y) {
    var name = s[0],
        nameLC = name.toLowerCase(),
        i;

    // Skip relative commands
    if (name === nameLC) { return; }

    // Don't touch the first M to avoid potential confusions.
    if (index === 0 && name === 'M') { return; }

    s[0] = nameLC;

    switch (name) {
      case 'V':
        // V has shifted coords parity
        s[1] -= y;
        return;

      case 'A':
        // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        // touch x, y only
        s[6] -= x;
        s[7] -= y;
        return;

      default:
        for (i = 1; i < s.length; i++) {
          s[i] -= i % 2 ? x : y; // odd values are X, even - Y
        }
    }
  }, true);

  return this;
};


// Converts arcs to cubic bézier curves
//
SvgPath.prototype.unarc = function () {
  this.iterate(function (s, index, x, y) {
    var new_segments, nextX, nextY, result = [], name = s[0];

    // Skip anything except arcs
    if (name !== 'A' && name !== 'a') { return null; }

    if (name === 'a') {
      // convert relative arc coordinates to absolute
      nextX = x + s[6];
      nextY = y + s[7];
    } else {
      nextX = s[6];
      nextY = s[7];
    }

    new_segments = a2c(x, y, nextX, nextY, s[4], s[5], s[1], s[2], s[3]);

    // Degenerated arcs can be ignored by renderer, but should not be dropped
    // to avoid collisions with `S A S` and so on. Replace with empty line.
    if (new_segments.length === 0) {
      return [ [ s[0] === 'a' ? 'l' : 'L', s[6], s[7] ] ];
    }

    new_segments.forEach(function (s) {
      result.push([ 'C', s[2], s[3], s[4], s[5], s[6], s[7] ]);
    });

    return result;
  });

  return this;
};


// Converts smooth curves (with missed control point) to generic curves
//
SvgPath.prototype.unshort = function () {
  var segments = this.segments;
  var prevControlX, prevControlY, prevSegment;
  var curControlX, curControlY;

  // TODO: add lazy evaluation flag when relative commands supported

  this.iterate(function (s, idx, x, y) {
    var name = s[0], nameUC = name.toUpperCase(), isRelative;

    // First command MUST be M|m, it's safe to skip.
    // Protect from access to [-1] for sure.
    if (!idx) { return; }

    if (nameUC === 'T') { // quadratic curve
      isRelative = (name === 't');

      prevSegment = segments[idx - 1];

      if (prevSegment[0] === 'Q') {
        prevControlX = prevSegment[1] - x;
        prevControlY = prevSegment[2] - y;
      } else if (prevSegment[0] === 'q') {
        prevControlX = prevSegment[1] - prevSegment[3];
        prevControlY = prevSegment[2] - prevSegment[4];
      } else {
        prevControlX = 0;
        prevControlY = 0;
      }

      curControlX = -prevControlX;
      curControlY = -prevControlY;

      if (!isRelative) {
        curControlX += x;
        curControlY += y;
      }

      segments[idx] = [
        isRelative ? 'q' : 'Q',
        curControlX, curControlY,
        s[1], s[2]
      ];

    } else if (nameUC === 'S') { // cubic curve
      isRelative = (name === 's');

      prevSegment = segments[idx - 1];

      if (prevSegment[0] === 'C') {
        prevControlX = prevSegment[3] - x;
        prevControlY = prevSegment[4] - y;
      } else if (prevSegment[0] === 'c') {
        prevControlX = prevSegment[3] - prevSegment[5];
        prevControlY = prevSegment[4] - prevSegment[6];
      } else {
        prevControlX = 0;
        prevControlY = 0;
      }

      curControlX = -prevControlX;
      curControlY = -prevControlY;

      if (!isRelative) {
        curControlX += x;
        curControlY += y;
      }

      segments[idx] = [
        isRelative ? 'c' : 'C',
        curControlX, curControlY,
        s[1], s[2], s[3], s[4]
      ];
    }
  });

  return this;
};


module.exports = SvgPath;


/***/ }),

/***/ "./node_modules/svgpath/lib/transform_parse.js":
/*!*****************************************************!*\
  !*** ./node_modules/svgpath/lib/transform_parse.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";



var Matrix = __webpack_require__(/*! ./matrix */ "./node_modules/svgpath/lib/matrix.js");

var operations = {
  matrix: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true
};

var CMD_SPLIT_RE    = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/;
var PARAMS_SPLIT_RE = /[\s,]+/;


module.exports = function transformParse(transformString) {
  var matrix = new Matrix();
  var cmd, params;

  // Split value into ['', 'translate', '10 50', '', 'scale', '2', '', 'rotate',  '-45', '']
  transformString.split(CMD_SPLIT_RE).forEach(function (item) {

    // Skip empty elements
    if (!item.length) { return; }

    // remember operation
    if (typeof operations[item] !== 'undefined') {
      cmd = item;
      return;
    }

    // extract params & att operation to matrix
    params = item.split(PARAMS_SPLIT_RE).map(function (i) {
      return +i || 0;
    });

    // If params count is not correct - ignore command
    switch (cmd) {
      case 'matrix':
        if (params.length === 6) {
          matrix.matrix(params);
        }
        return;

      case 'scale':
        if (params.length === 1) {
          matrix.scale(params[0], params[0]);
        } else if (params.length === 2) {
          matrix.scale(params[0], params[1]);
        }
        return;

      case 'rotate':
        if (params.length === 1) {
          matrix.rotate(params[0], 0, 0);
        } else if (params.length === 3) {
          matrix.rotate(params[0], params[1], params[2]);
        }
        return;

      case 'translate':
        if (params.length === 1) {
          matrix.translate(params[0], 0);
        } else if (params.length === 2) {
          matrix.translate(params[0], params[1]);
        }
        return;

      case 'skewX':
        if (params.length === 1) {
          matrix.skewX(params[0]);
        }
        return;

      case 'skewY':
        if (params.length === 1) {
          matrix.skewY(params[0]);
        }
        return;
    }
  });

  return matrix;
};


/***/ }),

/***/ "./node_modules/transformation-matrix/src/applyToPoint.js":
/*!****************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/applyToPoint.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyToPoint": () => (/* binding */ applyToPoint),
/* harmony export */   "applyToPoints": () => (/* binding */ applyToPoints)
/* harmony export */ });
/**
 * Calculate a point transformed with an affine matrix
 * @param matrix {Matrix} Affine Matrix
 * @param  point {Point} Point
 * @returns {Point} Point
 */
function applyToPoint (matrix, point) {
  return Array.isArray(point)
    ? [
        matrix.a * point[0] + matrix.c * point[1] + matrix.e,
        matrix.b * point[0] + matrix.d * point[1] + matrix.f
      ]
    : {
        x: matrix.a * point.x + matrix.c * point.y + matrix.e,
        y: matrix.b * point.x + matrix.d * point.y + matrix.f
      }
}

/**
 * Calculate an array of points transformed with an affine matrix
 * @param matrix {Matrix} Affine Matrix
 * @param points {Point[]} Array of point
 * @returns {Point[]} Array of point
 */
function applyToPoints (matrix, points) {
  return points.map(point => applyToPoint(matrix, point))
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/fromDefinition.js":
/*!******************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/fromDefinition.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromDefinition": () => (/* binding */ fromDefinition)
/* harmony export */ });
/* harmony import */ var _fromObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fromObject */ "./node_modules/transformation-matrix/src/fromObject.js");
/* harmony import */ var _translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./translate */ "./node_modules/transformation-matrix/src/translate.js");
/* harmony import */ var _scale__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scale */ "./node_modules/transformation-matrix/src/scale.js");
/* harmony import */ var _rotate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rotate */ "./node_modules/transformation-matrix/src/rotate.js");
/* harmony import */ var _skew__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./skew */ "./node_modules/transformation-matrix/src/skew.js");
/* harmony import */ var _shear__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shear */ "./node_modules/transformation-matrix/src/shear.js");







/**
 * Converts array of matrix descriptor to array of matrix
 * @param definitionOrArrayOfDefinition {Object[]} Array of object describing the matrix
 * @returns {Matrix[]} Array of matrix
 *
 * @example
 * > fromDefinition([
 *  { type: 'matrix', a:1, b:2, c:3, d:4, e:5, f:6 },
 *  { type: 'translate', tx: 10, ty: 20 },
 *  { type: 'scale', sx: 2, sy: 4 },
 *  { type: 'rotate', angle: 90, cx: 50, cy: 25 },
 *  { type: 'skewX', angle: 45 },
 *  { type: 'skewY',  angle: 45 },
 *  { type: 'shear', shx: 10, shy: 20}
 * ])
 *
 * [
 *  { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 },
 *  { a: 1, c: 0, e: 10, b: 0, d: 1, f: 20 },
 *  { a: 2, c: 0, e: 0, b: 0, d: 4, f: 0 },
 *  { a: 6.123, c: -1, e: 0, b: 1, d: 6.123, f: 0 },
 *  { a: 1, c: 0.99.., e: 0, b: 0, d: 1, f: 0 },
 *  { a: 1, c: 0, e: 0, b: 0.99, d: 1, f: 0 },
 *  { a: 1, c: 10, e: 0, b: 20, d: 1, f: 0 }
 * ]
 **/
function fromDefinition (definitionOrArrayOfDefinition) {
  return Array.isArray(definitionOrArrayOfDefinition)
    ? definitionOrArrayOfDefinition.map(mapper)
    : mapper(definitionOrArrayOfDefinition)

  function mapper (descriptor) {
    switch (descriptor.type) {
      case 'matrix':
        if ('a' in descriptor &&
          'b' in descriptor &&
          'c' in descriptor &&
          'd' in descriptor &&
          'e' in descriptor &&
          'f' in descriptor
        ) {
          return (0,_fromObject__WEBPACK_IMPORTED_MODULE_0__.fromObject)(descriptor)
        } else {
          throw new Error('MISSING_MANDATORY_PARAM')
        }

      case 'translate':
        if (!('tx' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM')

        if ('ty' in descriptor) return (0,_translate__WEBPACK_IMPORTED_MODULE_1__.translate)(descriptor.tx, descriptor.ty)

        return (0,_translate__WEBPACK_IMPORTED_MODULE_1__.translate)(descriptor.tx)

      case 'scale':
        if (!('sx' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM')

        if ('sy' in descriptor) return (0,_scale__WEBPACK_IMPORTED_MODULE_2__.scale)(descriptor.sx, descriptor.sy)

        return (0,_scale__WEBPACK_IMPORTED_MODULE_2__.scale)(descriptor.sx)

      case 'rotate':
        if (!('angle' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM')

        if ('cx' in descriptor && 'cy' in descriptor) {
          return (0,_rotate__WEBPACK_IMPORTED_MODULE_3__.rotateDEG)(descriptor.angle, descriptor.cx, descriptor.cy)
        }
        return (0,_rotate__WEBPACK_IMPORTED_MODULE_3__.rotateDEG)(descriptor.angle)

      case 'skewX':
        if (!('angle' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM')
        return (0,_skew__WEBPACK_IMPORTED_MODULE_4__.skewDEG)(descriptor.angle, 0)

      case 'skewY':
        if (!('angle' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM')
        return (0,_skew__WEBPACK_IMPORTED_MODULE_4__.skewDEG)(0, descriptor.angle)

      case 'shear':
        if (!('shx' in descriptor && 'shy' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM')
        return (0,_shear__WEBPACK_IMPORTED_MODULE_5__.shear)(descriptor.shx, descriptor.shy)

      default:
        throw new Error('UNSUPPORTED_DESCRIPTOR')
    }
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/fromObject.js":
/*!**************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/fromObject.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromObject": () => (/* binding */ fromObject)
/* harmony export */ });
/**
 * Extract an affine matrix from an object that contains a,b,c,d,e,f keys
 * Any value could be a float or a string that contains a float
 * @param object {Object} Object that contains a,b,c,d,e,f keys
 * @return {Matrix} Affine Matrix
 */
function fromObject (object) {
  return {
    a: parseFloat(object.a),
    b: parseFloat(object.b),
    c: parseFloat(object.c),
    d: parseFloat(object.d),
    e: parseFloat(object.e),
    f: parseFloat(object.f)
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/fromString.js":
/*!**************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/fromString.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromString": () => (/* binding */ fromString)
/* harmony export */ });
/**
 * @ignore
 * @type {RegExp}
 */
const matrixRegex = /^matrix\(\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*\)$/i

/**
 * Parse a string formatted as matrix(a,b,c,d,e,f)
 * @param string {string} String with an affine matrix
 * @returns {Matrix} Affine Matrix
 *
 * @example
 * > fromString('matrix(1,2,3,4,5,6)')
 * {a: 1, b: 2, c: 3, d: 4, c: 5, e: 6}
 */
function fromString (string) {
  const parsed = string.match(matrixRegex)
  if (parsed === null || parsed.length < 7) throw new Error(`'${string}' is not a matrix`)
  return {
    a: parseFloat(parsed[1]),
    b: parseFloat(parsed[2]),
    c: parseFloat(parsed[3]),
    d: parseFloat(parsed[4]),
    e: parseFloat(parsed[5]),
    f: parseFloat(parsed[6])
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/fromTransformAttribute.autogenerated.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/fromTransformAttribute.autogenerated.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyntaxError": () => (/* binding */ peg$SyntaxError),
/* harmony export */   "parse": () => (/* binding */ peg$parse),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated by PEG.js v0.11.0-master.b7b87ea, https://pegjs.org/

function peg$subclass(child, parent) {
  function C() { this.constructor = child; }
  C.prototype = parent.prototype;
  child.prototype = new C();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = "SyntaxError";

  // istanbul ignore next
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found, location) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },

    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part)
          ? classEscape(part[0]) + "-" + classEscape(part[1])
          : classEscape(part);
      });

      return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
    },

    any: function() {
      return "any character";
    },

    end: function() {
      return "end of input";
    },

    other: function(expectation) {
      return expectation.description;
    },

    not: function(expectation) {
      return "not " + describeExpectation(expectation.expected);
    }
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/"/g,  "\\\"")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/\]/g, "\\]")
      .replace(/\^/g, "\\^")
      .replace(/-/g,  "\\-")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = expected.map(describeExpectation);
    var i, j;

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== undefined ? options : {};

  var peg$FAILED = {};

  var peg$startRuleFunctions = { transformList: peg$parsetransformList };
  var peg$startRuleFunction = peg$parsetransformList;

  var peg$c0 = "matrix";
  var peg$c1 = "(";
  var peg$c2 = ")";
  var peg$c3 = "translate";
  var peg$c4 = "scale";
  var peg$c5 = "rotate";
  var peg$c6 = "skewX";
  var peg$c7 = "skewY";
  var peg$c8 = ",";
  var peg$c9 = ".";

  var peg$r0 = /^[eE]/;
  var peg$r1 = /^[+\-]/;
  var peg$r2 = /^[0-9]/;
  var peg$r3 = /^[ \t\r\n]/;

  var peg$e0 = peg$literalExpectation("matrix", false);
  var peg$e1 = peg$literalExpectation("(", false);
  var peg$e2 = peg$literalExpectation(")", false);
  var peg$e3 = peg$literalExpectation("translate", false);
  var peg$e4 = peg$literalExpectation("scale", false);
  var peg$e5 = peg$literalExpectation("rotate", false);
  var peg$e6 = peg$literalExpectation("skewX", false);
  var peg$e7 = peg$literalExpectation("skewY", false);
  var peg$e8 = peg$literalExpectation(",", false);
  var peg$e9 = peg$otherExpectation("fractionalConstant");
  var peg$e10 = peg$classExpectation(["e", "E"], false, false);
  var peg$e11 = peg$classExpectation(["+", "-"], false, false);
  var peg$e12 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e13 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false);

  var peg$f0 = function(ts) { return ts; };
  var peg$f1 = function(t, ts) { return t.concat(ts) };
  var peg$f2 = function(a, b, c, d, e, f) {
        return [{type: 'matrix', a: a, b: b, c: c, d: d, e: e, f: f}];
      };
  var peg$f3 = function(tx, ty) {
        var t = {type: 'translate', tx: tx};
        if (ty) t.ty = ty;
        return [t];
      };
  var peg$f4 = function(sx, sy) {
        var s = {type:'scale', sx: sx};
        if (sy) s.sy = sy;
        return [s];
      };
  var peg$f5 = function(angle, c) {
        var r = {type:'rotate', angle: angle};
        if (c) {
          r.cx = c[0];
          r.cy = c[1];
        }
        return [r];
      };
  var peg$f6 = function(angle) {
        return [{type: 'skewX', angle: angle}];
      };
  var peg$f7 = function(angle) {
        return [{type: 'skewY', angle: angle}];
      };
  var peg$f8 = function(f) { return parseFloat(f.join("")); };
  var peg$f9 = function(i) { return parseInt(i.join("")); };
  var peg$f10 = function(n) { return n; };
  var peg$f11 = function(n1, n2) { return [n1, n2]; };
  var peg$f12 = function(ds) { return ds.join(""); };
  var peg$f13 = function(f, e) { return [f, e || null].join("")};
  var peg$f14 = function(d, e) { return [d, e].join("")};
  var peg$f15 = function(d1, d2) { return [d1 ? d1.join("") : null, ".", d2.join("")].join(""); };
  var peg$f16 = function(d) { return d.join(""); };
  var peg$f17 = function(s, d) { return ['e', s, d.join("")].join("") };

  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$expected = [];
  var peg$silentFails = 0;

  var peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return [peg$savedPos, peg$currPos];
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  var peg$VALIDFILENAME = typeof options.filename === "string" && options.filename.length > 0;
  function peg$computeLocation(startPos, endPos) {
    var loc = {};

    if ( peg$VALIDFILENAME ) loc.filename = options.filename;

    var startPosDetails = peg$computePosDetails(startPos);
    loc.start = {
      offset: startPos,
      line: startPosDetails.line,
      column: startPosDetails.column
    };

    var endPosDetails = peg$computePosDetails(endPos);
    loc.end = {
      offset: endPos,
      line: endPosDetails.line,
      column: endPosDetails.column
    };

    return loc;
  }

  function peg$begin() {
    peg$expected.push({ pos: peg$currPos, variants: [] });
  }

  function peg$expect(expected) {
    var top = peg$expected[peg$expected.length - 1];

    if (peg$currPos < top.pos) { return; }

    if (peg$currPos > top.pos) {
      top.pos = peg$currPos;
      top.variants = [];
    }

    top.variants.push(expected);
  }

  function peg$end(invert) {
    var expected = peg$expected.pop();
    var top = peg$expected[peg$expected.length - 1];
    var variants = expected.variants;

    if (top.pos !== expected.pos) { return; }

    if (invert) {
      variants = variants.map(function(e) {
        return e.type === "not" ? e.expected : { type: "not", expected: e };
      });
    }

    Array.prototype.push.apply(top.variants, variants);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found, location),
      expected,
      found,
      location
    );
  }

  function peg$buildError() {
    var expected = peg$expected[0];
    var failPos = expected.pos;

    return peg$buildStructuredError(
      expected.variants,
      failPos < input.length ? input.charAt(failPos) : null,
      failPos < input.length
        ? peg$computeLocation(failPos, failPos + 1)
        : peg$computeLocation(failPos, failPos)
    );
  }

  function peg$parsetransformList() {
    var s0, s1, s2, s3, s4;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsewsp();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parsewsp();
    }
    s2 = peg$parsetransforms();
    if (s2 === peg$FAILED) {
      s2 = null;
    }
    s3 = [];
    s4 = peg$parsewsp();
    while (s4 !== peg$FAILED) {
      s3.push(s4);
      s4 = peg$parsewsp();
    }
    peg$savedPos = s0;
    s0 = peg$f0(s2);

    return s0;
  }

  function peg$parsetransforms() {
    var s0, s1, s2, s3;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = peg$parsetransform();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsecommaWsp();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsecommaWsp();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsetransforms();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f1(s1, s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsetransform();
    }

    return s0;
  }

  function peg$parsetransform() {
    var s0;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$parsematrix();
    if (s0 === peg$FAILED) {
      s0 = peg$parsetranslate();
      if (s0 === peg$FAILED) {
        s0 = peg$parsescale();
        if (s0 === peg$FAILED) {
          s0 = peg$parserotate();
          if (s0 === peg$FAILED) {
            s0 = peg$parseskewX();
            if (s0 === peg$FAILED) {
              s0 = peg$parseskewY();
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsematrix() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    rule$expects(peg$e0);
    if (input.substr(peg$currPos, 6) === peg$c0) {
      s1 = peg$c0;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      rule$expects(peg$e1);
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c1;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parsewsp();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsewsp();
        }
        s5 = peg$parsenumber();
        if (s5 !== peg$FAILED) {
          s6 = peg$parsecommaWsp();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsenumber();
            if (s7 !== peg$FAILED) {
              s8 = peg$parsecommaWsp();
              if (s8 !== peg$FAILED) {
                s9 = peg$parsenumber();
                if (s9 !== peg$FAILED) {
                  s10 = peg$parsecommaWsp();
                  if (s10 !== peg$FAILED) {
                    s11 = peg$parsenumber();
                    if (s11 !== peg$FAILED) {
                      s12 = peg$parsecommaWsp();
                      if (s12 !== peg$FAILED) {
                        s13 = peg$parsenumber();
                        if (s13 !== peg$FAILED) {
                          s14 = peg$parsecommaWsp();
                          if (s14 !== peg$FAILED) {
                            s15 = peg$parsenumber();
                            if (s15 !== peg$FAILED) {
                              s16 = [];
                              s17 = peg$parsewsp();
                              while (s17 !== peg$FAILED) {
                                s16.push(s17);
                                s17 = peg$parsewsp();
                              }
                              rule$expects(peg$e2);
                              if (input.charCodeAt(peg$currPos) === 41) {
                                s17 = peg$c2;
                                peg$currPos++;
                              } else {
                                s17 = peg$FAILED;
                              }
                              if (s17 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s0 = peg$f2(s5, s7, s9, s11, s13, s15);
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsetranslate() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    rule$expects(peg$e3);
    if (input.substr(peg$currPos, 9) === peg$c3) {
      s1 = peg$c3;
      peg$currPos += 9;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      rule$expects(peg$e1);
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c1;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parsewsp();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsewsp();
        }
        s5 = peg$parsenumber();
        if (s5 !== peg$FAILED) {
          s6 = peg$parsecommaWspNumber();
          if (s6 === peg$FAILED) {
            s6 = null;
          }
          s7 = [];
          s8 = peg$parsewsp();
          while (s8 !== peg$FAILED) {
            s7.push(s8);
            s8 = peg$parsewsp();
          }
          rule$expects(peg$e2);
          if (input.charCodeAt(peg$currPos) === 41) {
            s8 = peg$c2;
            peg$currPos++;
          } else {
            s8 = peg$FAILED;
          }
          if (s8 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f3(s5, s6);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsescale() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    rule$expects(peg$e4);
    if (input.substr(peg$currPos, 5) === peg$c4) {
      s1 = peg$c4;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      rule$expects(peg$e1);
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c1;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parsewsp();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsewsp();
        }
        s5 = peg$parsenumber();
        if (s5 !== peg$FAILED) {
          s6 = peg$parsecommaWspNumber();
          if (s6 === peg$FAILED) {
            s6 = null;
          }
          s7 = [];
          s8 = peg$parsewsp();
          while (s8 !== peg$FAILED) {
            s7.push(s8);
            s8 = peg$parsewsp();
          }
          rule$expects(peg$e2);
          if (input.charCodeAt(peg$currPos) === 41) {
            s8 = peg$c2;
            peg$currPos++;
          } else {
            s8 = peg$FAILED;
          }
          if (s8 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f4(s5, s6);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parserotate() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    rule$expects(peg$e5);
    if (input.substr(peg$currPos, 6) === peg$c5) {
      s1 = peg$c5;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      rule$expects(peg$e1);
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c1;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parsewsp();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsewsp();
        }
        s5 = peg$parsenumber();
        if (s5 !== peg$FAILED) {
          s6 = peg$parsecommaWspTwoNumbers();
          if (s6 === peg$FAILED) {
            s6 = null;
          }
          s7 = [];
          s8 = peg$parsewsp();
          while (s8 !== peg$FAILED) {
            s7.push(s8);
            s8 = peg$parsewsp();
          }
          rule$expects(peg$e2);
          if (input.charCodeAt(peg$currPos) === 41) {
            s8 = peg$c2;
            peg$currPos++;
          } else {
            s8 = peg$FAILED;
          }
          if (s8 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f5(s5, s6);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseskewX() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    rule$expects(peg$e6);
    if (input.substr(peg$currPos, 5) === peg$c6) {
      s1 = peg$c6;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      rule$expects(peg$e1);
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c1;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parsewsp();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsewsp();
        }
        s5 = peg$parsenumber();
        if (s5 !== peg$FAILED) {
          s6 = [];
          s7 = peg$parsewsp();
          while (s7 !== peg$FAILED) {
            s6.push(s7);
            s7 = peg$parsewsp();
          }
          rule$expects(peg$e2);
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c2;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
          }
          if (s7 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f6(s5);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseskewY() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    rule$expects(peg$e7);
    if (input.substr(peg$currPos, 5) === peg$c7) {
      s1 = peg$c7;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsewsp();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsewsp();
      }
      rule$expects(peg$e1);
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c1;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parsewsp();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsewsp();
        }
        s5 = peg$parsenumber();
        if (s5 !== peg$FAILED) {
          s6 = [];
          s7 = peg$parsewsp();
          while (s7 !== peg$FAILED) {
            s6.push(s7);
            s7 = peg$parsewsp();
          }
          rule$expects(peg$e2);
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c2;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
          }
          if (s7 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f7(s5);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsenumber() {
    var s0, s1, s2, s3;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parsesign();
    if (s2 === peg$FAILED) {
      s2 = null;
    }
    s3 = peg$parsefloatingPointConstant();
    if (s3 !== peg$FAILED) {
      s2 = [s2, s3];
      s1 = s2;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f8(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parsesign();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      s3 = peg$parseintegerConstant();
      if (s3 !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f9(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parsecommaWspNumber() {
    var s0, s1, s2;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = peg$parsecommaWsp();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenumber();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f10(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecommaWspTwoNumbers() {
    var s0, s1, s2, s3, s4;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = peg$parsecommaWsp();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenumber();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecommaWsp();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsenumber();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f11(s2, s4);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecommaWsp() {
    var s0, s1, s2, s3, s4;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsewsp();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsewsp();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomma();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      s3 = [];
      s4 = peg$parsewsp();
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$parsewsp();
      }
      s1 = [s1, s2, s3];
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsecomma();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsewsp();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsewsp();
        }
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parsecomma() {
    var s0;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    rule$expects(peg$e8);
    if (input.charCodeAt(peg$currPos) === 44) {
      s0 = peg$c8;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseintegerConstant() {
    var s0, s1;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = peg$parsedigitSequence();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f12(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsefloatingPointConstant() {
    var s0, s1, s2;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    s1 = peg$parsefractionalConstant();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseexponent();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      peg$savedPos = s0;
      s0 = peg$f13(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsedigitSequence();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseexponent();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f14(s1, s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parsefractionalConstant() {
    var s0, s1, s2, s3;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    rule$expects(peg$e9);
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parsedigitSequence();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (input.charCodeAt(peg$currPos) === 46) {
      s2 = peg$c9;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parsedigitSequence();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f15(s1, s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsedigitSequence();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c9;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f16(s1);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }
    peg$silentFails--;

    return s0;
  }

  function peg$parseexponent() {
    var s0, s1, s2, s3;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = peg$currPos;
    rule$expects(peg$e10);
    if (peg$r0.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsesign();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      s3 = peg$parsedigitSequence();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f17(s2, s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsesign() {
    var s0;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    rule$expects(peg$e11);
    if (peg$r1.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedigitSequence() {
    var s0, s1;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    s0 = [];
    s1 = peg$parsedigit();
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parsedigit();
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedigit() {
    var s0;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    rule$expects(peg$e12);
    if (peg$r2.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsewsp() {
    var s0;

    var rule$expects = function (expected) {
      if (peg$silentFails === 0) peg$expect(expected);
    }

    rule$expects(peg$e13);
    if (peg$r3.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  peg$begin();
  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$expect(peg$endExpectation());
    }

    throw peg$buildError();
  }
}



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
});


/***/ }),

/***/ "./node_modules/transformation-matrix/src/fromTransformAttribute.js":
/*!**************************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/fromTransformAttribute.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromTransformAttribute": () => (/* binding */ fromTransformAttribute)
/* harmony export */ });
/* harmony import */ var _fromTransformAttribute_autogenerated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fromTransformAttribute.autogenerated */ "./node_modules/transformation-matrix/src/fromTransformAttribute.autogenerated.js");


/**
 * Parser for SVG Trasform Attribute http://www.w3.org/TR/SVG/coords.html#TransformAttribute <br/>
 * Warning: This should be considered BETA until it is released a stable version of pegjs.
 * @param transformString {string} Transform string as defined by w3 Consortium
 * @returns {MatrixDescriptor[]} Array of MatrixDescriptor
 *
 * @example
 * > fromTransformAttribute('translate(-10,-10) scale(2,2) translate(10,10)')
 * [
 *  { type: 'translate', tx: -10, ty: -10},
 *  { type: 'scale', sx: 2, sy: 2 },
 *  { type: 'translate', tx: 10, ty: 10}
 * ]
 *
 * > compose(fromDefinition(fromTransformAttribute('translate(-10, -10) scale(10, 10)')))
 * { a: 10, c: 0, e: -10, b: 0, d: 10, f: -10 }
 */
function fromTransformAttribute (transformString) {
  return (0,_fromTransformAttribute_autogenerated__WEBPACK_IMPORTED_MODULE_0__.parse)(transformString)
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/fromTriangles.js":
/*!*****************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/fromTriangles.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromTriangles": () => (/* binding */ fromTriangles)
/* harmony export */ });
/* harmony import */ var _inverse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inverse */ "./node_modules/transformation-matrix/src/inverse.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transform */ "./node_modules/transformation-matrix/src/transform.js");
/* harmony import */ var _smoothMatrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./smoothMatrix */ "./node_modules/transformation-matrix/src/smoothMatrix.js");




/**
 * Returns a matrix that transforms a triangle t1 into another triangle t2, or throws an exception if it is impossible.
 * @param t1 {Point[]} Array of points containing the three points for the first triangle
 * @param t2 {Point[]} Array of points containing the three points for the second triangle
 * @returns {Matrix} Matrix which transforms t1 to t2
 * @throws Exception if the matrix becomes not invertible
 */
function fromTriangles (t1, t2) {
  // point p = first point of the triangle
  const px1 = t1[0].x != null ? t1[0].x : t1[0][0]
  const py1 = t1[0].y != null ? t1[0].y : t1[0][1]
  const px2 = t2[0].x != null ? t2[0].x : t2[0][0]
  const py2 = t2[0].y != null ? t2[0].y : t2[0][1]

  // point q = second point of the triangle
  const qx1 = t1[1].x != null ? t1[1].x : t1[1][0]
  const qy1 = t1[1].y != null ? t1[1].y : t1[1][1]
  const qx2 = t2[1].x != null ? t2[1].x : t2[1][0]
  const qy2 = t2[1].y != null ? t2[1].y : t2[1][1]

  // point r = third point of the triangle
  const rx1 = t1[2].x != null ? t1[2].x : t1[2][0]
  const ry1 = t1[2].y != null ? t1[2].y : t1[2][1]
  const rx2 = t2[2].x != null ? t2[2].x : t2[2][0]
  const ry2 = t2[2].y != null ? t2[2].y : t2[2][1]

  const r1 = {
    a: px1 - rx1,
    b: py1 - ry1,
    c: qx1 - rx1,
    d: qy1 - ry1,
    e: rx1,
    f: ry1
  }
  const r2 = {
    a: px2 - rx2,
    b: py2 - ry2,
    c: qx2 - rx2,
    d: qy2 - ry2,
    e: rx2,
    f: ry2
  }

  const inverseR1 = (0,_inverse__WEBPACK_IMPORTED_MODULE_0__.inverse)(r1)
  const affineMatrix = (0,_transform__WEBPACK_IMPORTED_MODULE_1__.transform)([r2, inverseR1])

  // round the matrix elements to smooth the finite inversion
  return (0,_smoothMatrix__WEBPACK_IMPORTED_MODULE_2__.smoothMatrix)(affineMatrix)
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/identity.js":
/*!************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/identity.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "identity": () => (/* binding */ identity)
/* harmony export */ });
/**
 * Identity matrix
 * @returns {Matrix} Affine Matrix
 */
function identity () {
  return {
    a: 1,
    c: 0,
    e: 0,
    b: 0,
    d: 1,
    f: 0
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/transformation-matrix/src/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyToPoint": () => (/* reexport safe */ _applyToPoint__WEBPACK_IMPORTED_MODULE_0__.applyToPoint),
/* harmony export */   "applyToPoints": () => (/* reexport safe */ _applyToPoint__WEBPACK_IMPORTED_MODULE_0__.applyToPoints),
/* harmony export */   "fromObject": () => (/* reexport safe */ _fromObject__WEBPACK_IMPORTED_MODULE_1__.fromObject),
/* harmony export */   "fromString": () => (/* reexport safe */ _fromString__WEBPACK_IMPORTED_MODULE_2__.fromString),
/* harmony export */   "identity": () => (/* reexport safe */ _identity__WEBPACK_IMPORTED_MODULE_3__.identity),
/* harmony export */   "inverse": () => (/* reexport safe */ _inverse__WEBPACK_IMPORTED_MODULE_4__.inverse),
/* harmony export */   "isAffineMatrix": () => (/* reexport safe */ _isAffineMatrix__WEBPACK_IMPORTED_MODULE_5__.isAffineMatrix),
/* harmony export */   "rotate": () => (/* reexport safe */ _rotate__WEBPACK_IMPORTED_MODULE_6__.rotate),
/* harmony export */   "rotateDEG": () => (/* reexport safe */ _rotate__WEBPACK_IMPORTED_MODULE_6__.rotateDEG),
/* harmony export */   "scale": () => (/* reexport safe */ _scale__WEBPACK_IMPORTED_MODULE_7__.scale),
/* harmony export */   "shear": () => (/* reexport safe */ _shear__WEBPACK_IMPORTED_MODULE_8__.shear),
/* harmony export */   "skew": () => (/* reexport safe */ _skew__WEBPACK_IMPORTED_MODULE_9__.skew),
/* harmony export */   "skewDEG": () => (/* reexport safe */ _skew__WEBPACK_IMPORTED_MODULE_9__.skewDEG),
/* harmony export */   "toCSS": () => (/* reexport safe */ _toString__WEBPACK_IMPORTED_MODULE_10__.toCSS),
/* harmony export */   "toSVG": () => (/* reexport safe */ _toString__WEBPACK_IMPORTED_MODULE_10__.toSVG),
/* harmony export */   "toString": () => (/* reexport safe */ _toString__WEBPACK_IMPORTED_MODULE_10__.toString),
/* harmony export */   "compose": () => (/* reexport safe */ _transform__WEBPACK_IMPORTED_MODULE_11__.compose),
/* harmony export */   "transform": () => (/* reexport safe */ _transform__WEBPACK_IMPORTED_MODULE_11__.transform),
/* harmony export */   "translate": () => (/* reexport safe */ _translate__WEBPACK_IMPORTED_MODULE_12__.translate),
/* harmony export */   "fromTriangles": () => (/* reexport safe */ _fromTriangles__WEBPACK_IMPORTED_MODULE_13__.fromTriangles),
/* harmony export */   "smoothMatrix": () => (/* reexport safe */ _smoothMatrix__WEBPACK_IMPORTED_MODULE_14__.smoothMatrix),
/* harmony export */   "fromDefinition": () => (/* reexport safe */ _fromDefinition__WEBPACK_IMPORTED_MODULE_15__.fromDefinition),
/* harmony export */   "fromTransformAttribute": () => (/* reexport safe */ _fromTransformAttribute__WEBPACK_IMPORTED_MODULE_16__.fromTransformAttribute)
/* harmony export */ });
/* harmony import */ var _applyToPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyToPoint */ "./node_modules/transformation-matrix/src/applyToPoint.js");
/* harmony import */ var _fromObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fromObject */ "./node_modules/transformation-matrix/src/fromObject.js");
/* harmony import */ var _fromString__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fromString */ "./node_modules/transformation-matrix/src/fromString.js");
/* harmony import */ var _identity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./identity */ "./node_modules/transformation-matrix/src/identity.js");
/* harmony import */ var _inverse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./inverse */ "./node_modules/transformation-matrix/src/inverse.js");
/* harmony import */ var _isAffineMatrix__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isAffineMatrix */ "./node_modules/transformation-matrix/src/isAffineMatrix.js");
/* harmony import */ var _rotate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./rotate */ "./node_modules/transformation-matrix/src/rotate.js");
/* harmony import */ var _scale__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scale */ "./node_modules/transformation-matrix/src/scale.js");
/* harmony import */ var _shear__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shear */ "./node_modules/transformation-matrix/src/shear.js");
/* harmony import */ var _skew__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./skew */ "./node_modules/transformation-matrix/src/skew.js");
/* harmony import */ var _toString__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./toString */ "./node_modules/transformation-matrix/src/toString.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./transform */ "./node_modules/transformation-matrix/src/transform.js");
/* harmony import */ var _translate__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./translate */ "./node_modules/transformation-matrix/src/translate.js");
/* harmony import */ var _fromTriangles__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./fromTriangles */ "./node_modules/transformation-matrix/src/fromTriangles.js");
/* harmony import */ var _smoothMatrix__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./smoothMatrix */ "./node_modules/transformation-matrix/src/smoothMatrix.js");
/* harmony import */ var _fromDefinition__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./fromDefinition */ "./node_modules/transformation-matrix/src/fromDefinition.js");
/* harmony import */ var _fromTransformAttribute__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./fromTransformAttribute */ "./node_modules/transformation-matrix/src/fromTransformAttribute.js");



















/***/ }),

/***/ "./node_modules/transformation-matrix/src/inverse.js":
/*!***********************************************************!*\
  !*** ./node_modules/transformation-matrix/src/inverse.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inverse": () => (/* binding */ inverse)
/* harmony export */ });
/**
 * Calculate a matrix that is the inverse of the provided matrix
 * @param matrix {Matrix} Affine Matrix
 * @returns {Matrix} Inverted Affine Matrix
 */
function inverse (matrix) {
  // http://www.wolframalpha.com/input/?i=Inverse+%5B%7B%7Ba,c,e%7D,%7Bb,d,f%7D,%7B0,0,1%7D%7D%5D

  const { a, b, c, d, e, f } = matrix

  const denom = a * d - b * c

  return {
    a: d / denom,
    b: b / -denom,
    c: c / -denom,
    d: a / denom,
    e: (d * e - c * f) / -denom,
    f: (b * e - a * f) / denom
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/isAffineMatrix.js":
/*!******************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/isAffineMatrix.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isAffineMatrix": () => (/* binding */ isAffineMatrix)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/transformation-matrix/src/utils.js");


/**
 * Check if the object contain an affine matrix
 * @param object {Object} Generic Plain Object
 * @return {boolean} True if is an object and contains an affine matrix
 */

function isAffineMatrix (object) {
  return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isObject)(object) &&
    'a' in object &&
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumeric)(object.a) &&
    'b' in object &&
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumeric)(object.b) &&
    'c' in object &&
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumeric)(object.c) &&
    'd' in object &&
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumeric)(object.d) &&
    'e' in object &&
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumeric)(object.e) &&
    'f' in object &&
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumeric)(object.f)
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/rotate.js":
/*!**********************************************************!*\
  !*** ./node_modules/transformation-matrix/src/rotate.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "rotateDEG": () => (/* binding */ rotateDEG)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/transformation-matrix/src/utils.js");
/* harmony import */ var _translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./translate */ "./node_modules/transformation-matrix/src/translate.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transform */ "./node_modules/transformation-matrix/src/transform.js");




const { cos, sin, PI } = Math
/**
 * Calculate a rotation matrix
 * @param angle {number} Angle in radians
 * @param [cx] {number} If (cx,cy) are supplied the rotate is about this point
 * @param [cy] {number} If (cx,cy) are supplied the rotate is about this point
 * @returns {Matrix} Affine Matrix
 */
function rotate (angle, cx, cy) {
  const cosAngle = cos(angle)
  const sinAngle = sin(angle)
  const rotationMatrix = {
    a: cosAngle,
    c: -sinAngle,
    e: 0,
    b: sinAngle,
    d: cosAngle,
    f: 0
  }
  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(cx) || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(cy)) {
    return rotationMatrix
  }

  return (0,_transform__WEBPACK_IMPORTED_MODULE_2__.transform)([
    (0,_translate__WEBPACK_IMPORTED_MODULE_1__.translate)(cx, cy),
    rotationMatrix,
    (0,_translate__WEBPACK_IMPORTED_MODULE_1__.translate)(-cx, -cy)
  ])
}

/**
 * Calculate a rotation matrix with a DEG angle
 * @param angle {number} Angle in degree
 * @param [cx] {number} If (cx,cy) are supplied the rotate is about this point
 * @param [cy] {number} If (cx,cy) are supplied the rotate is about this point
 * @returns {Matrix} Affine Matrix
 */
function rotateDEG (angle, cx = undefined, cy = undefined) {
  return rotate(angle * PI / 180, cx, cy)
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/scale.js":
/*!*********************************************************!*\
  !*** ./node_modules/transformation-matrix/src/scale.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scale": () => (/* binding */ scale)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/transformation-matrix/src/utils.js");
/* harmony import */ var _translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./translate */ "./node_modules/transformation-matrix/src/translate.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transform */ "./node_modules/transformation-matrix/src/transform.js");




/**
 * Calculate a scaling matrix
 * @param sx {number} Scaling on axis x
 * @param [sy = sx] {number} Scaling on axis y (default sx)
 * @param [cx] {number} If (cx,cy) are supplied the scaling is about this point
 * @param [cy] {number} If (cx,cy) are supplied the scaling is about this point
 * @returns {Matrix} Affine Matrix
 */
function scale (sx, sy = undefined, cx = undefined, cy = undefined) {
  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(sy)) sy = sx

  const scaleMatrix = {
    a: sx,
    c: 0,
    e: 0,
    b: 0,
    d: sy,
    f: 0
  }

  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(cx) || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(cy)) {
    return scaleMatrix
  }

  return (0,_transform__WEBPACK_IMPORTED_MODULE_2__.transform)([
    (0,_translate__WEBPACK_IMPORTED_MODULE_1__.translate)(cx, cy),
    scaleMatrix,
    (0,_translate__WEBPACK_IMPORTED_MODULE_1__.translate)(-cx, -cy)
  ])
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/shear.js":
/*!*********************************************************!*\
  !*** ./node_modules/transformation-matrix/src/shear.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shear": () => (/* binding */ shear)
/* harmony export */ });
/**
 * Calculate a shear matrix
 * @param shx {number} Shear on axis x
 * @param shy {number} Shear on axis y
 * @returns {Matrix} Affine Matrix
 */
function shear (shx, shy) {
  return {
    a: 1,
    c: shx,
    e: 0,
    b: shy,
    d: 1,
    f: 0
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/skew.js":
/*!********************************************************!*\
  !*** ./node_modules/transformation-matrix/src/skew.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "skew": () => (/* binding */ skew),
/* harmony export */   "skewDEG": () => (/* binding */ skewDEG)
/* harmony export */ });
// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skew
const { tan } = Math

/**
 * Calculate a skew matrix
 * @param ax {number} Skew on axis x
 * @param ay {number} Skew on axis y
 * @returns {Matrix} Affine Matrix
 */
function skew (ax, ay) {
  return {
    a: 1,
    c: tan(ax),
    e: 0,
    b: tan(ay),
    d: 1,
    f: 0
  }
}

/**
 * Calculate a skew matrix using DEG angles
 * @param ax {number} Skew on axis x
 * @param ay {number} Skew on axis y
 * @returns {Matrix} Affine Matrix
 */
function skewDEG (ax, ay) {
  return skew(ax * Math.PI / 180, ay * Math.PI / 180)
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/smoothMatrix.js":
/*!****************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/smoothMatrix.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "smoothMatrix": () => (/* binding */ smoothMatrix)
/* harmony export */ });
/**
 * Rounds all elements of the given matrix using the given precision
 * @param matrix {Matrix} An affine matrix to round
 * @param [precision] {number} A precision to use for Math.round. Defaults to 10000000000 (meaning which rounds to the 10th digit after the comma).
 * @returns {Matrix} The rounded Affine Matrix
 */
function smoothMatrix (matrix, precision = 10000000000) {
  return {
    a: Math.round(matrix.a * precision) / precision,
    b: Math.round(matrix.b * precision) / precision,
    c: Math.round(matrix.c * precision) / precision,
    d: Math.round(matrix.d * precision) / precision,
    e: Math.round(matrix.e * precision) / precision,
    f: Math.round(matrix.f * precision) / precision
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/toString.js":
/*!************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/toString.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toCSS": () => (/* binding */ toCSS),
/* harmony export */   "toSVG": () => (/* binding */ toSVG),
/* harmony export */   "toString": () => (/* binding */ toString)
/* harmony export */ });
/**
 * Serialize an affine matrix to a string that can be used with CSS or SVG
 * @param matrix {Matrix} Affine Matrix
 * @returns {string} String that contains an affine matrix formatted as matrix(a,b,c,d,e,f)
 */
function toCSS (matrix) {
  return toString(matrix)
}

/**
 * Serialize an affine matrix to a string that can be used with CSS or SVG
 * @param matrix {Matrix} Affine Matrix
 * @returns {string} String that contains an affine matrix formatted as matrix(a,b,c,d,e,f)
 */
function toSVG (matrix) {
  return toString(matrix)
}

/**
 * Serialize an affine matrix to a string that can be used with CSS or SVG
 * @param matrix {Matrix} Affine Matrix
 * @returns {string} String that contains an affine matrix formatted as matrix(a,b,c,d,e,f)
 */
function toString (matrix) {
  return `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/transform.js":
/*!*************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/transform.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "transform": () => (/* binding */ transform),
/* harmony export */   "compose": () => (/* binding */ compose)
/* harmony export */ });
/**
 * Merge multiple matrices into one
 * @param matrices {...Matrix | Matrix[]} Matrices listed as separate parameters or in an array
 * @returns {Matrix} Affine Matrix
 */
function transform (...matrices) {
  matrices = Array.isArray(matrices[0]) ? matrices[0] : matrices

  const multiply = (m1, m2) => {
    return {
      a: m1.a * m2.a + m1.c * m2.b,
      c: m1.a * m2.c + m1.c * m2.d,
      e: m1.a * m2.e + m1.c * m2.f + m1.e,
      b: m1.b * m2.a + m1.d * m2.b,
      d: m1.b * m2.c + m1.d * m2.d,
      f: m1.b * m2.e + m1.d * m2.f + m1.f
    }
  }

  switch (matrices.length) {
    case 0:
      throw new Error('no matrices provided')

    case 1:
      return matrices[0]

    case 2:
      return multiply(matrices[0], matrices[1])

    default: {
      const [m1, m2, ...rest] = matrices
      const m = multiply(m1, m2)
      return transform(m, ...rest)
    }
  }
}

/**
 * Merge multiple matrices into one
 * @param matrices {...Matrix | Matrix[]} Matrices listed as separate parameters or in an array
 * @returns {Matrix} Affine Matrix
 */
function compose (...matrices) {
  return transform(...matrices)
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/translate.js":
/*!*************************************************************!*\
  !*** ./node_modules/transformation-matrix/src/translate.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "translate": () => (/* binding */ translate)
/* harmony export */ });
/**
 * Calculate a translate matrix
 * @param tx {number} Translation on axis x
 * @param [ty = 0] {number} Translation on axis y
 * @returns {Matrix} Affine Matrix
 */
function translate (tx, ty = 0) {
  return {
    a: 1,
    c: 0,
    e: tx,
    b: 0,
    d: 1,
    f: ty
  }
}


/***/ }),

/***/ "./node_modules/transformation-matrix/src/utils.js":
/*!*********************************************************!*\
  !*** ./node_modules/transformation-matrix/src/utils.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isUndefined": () => (/* binding */ isUndefined),
/* harmony export */   "isNumeric": () => (/* binding */ isNumeric),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "matchesShape": () => (/* binding */ matchesShape)
/* harmony export */ });
function isUndefined (val) {
  return typeof val === 'undefined'
}

function isNumeric (n) {
  return typeof n === 'number' &&
    !Number.isNaN(n) &&
    Number.isFinite(n)
}

function isObject (obj) {
  return typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj)
}

function matchesShape (obj, keys) {
  return keys.every(key => key in obj)
}


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v1.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v1.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__.default.test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Circle": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Circle),
/* harmony export */   "EAdaptMode": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.EAdaptMode),
/* harmony export */   "ERepetitionType": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ERepetitionType),
/* harmony export */   "Group": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Group),
/* harmony export */   "Line": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Line),
/* harmony export */   "Lissajous": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Lissajous),
/* harmony export */   "PHI": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.PHI),
/* harmony export */   "PI2": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.PI2),
/* harmony export */   "Polygon": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Polygon),
/* harmony export */   "Rect": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Rect),
/* harmony export */   "Rose": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Rose),
/* harmony export */   "Scene": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Scene),
/* harmony export */   "SceneChild": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.SceneChild),
/* harmony export */   "Shape": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Shape),
/* harmony export */   "ShapeBase": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBase),
/* harmony export */   "ShapeBuffer": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeBuffer),
/* harmony export */   "ShapeLoop": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeLoop),
/* harmony export */   "ShapePrimitive": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapePrimitive),
/* harmony export */   "ShapeRecursive": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.ShapeRecursive),
/* harmony export */   "Spiral": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Spiral),
/* harmony export */   "SuperShape": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.SuperShape),
/* harmony export */   "Triangle": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Triangle),
/* harmony export */   "Vec2": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.Vec2),
/* harmony export */   "angle2FromRepetition": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.angle2FromRepetition),
/* harmony export */   "angleFromRepetition": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.angleFromRepetition),
/* harmony export */   "clamp": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.clamp),
/* harmony export */   "distanceFromRepetition": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.distanceFromRepetition),
/* harmony export */   "lerp": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.lerp),
/* harmony export */   "log": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.log),
/* harmony export */   "noise": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.noise),
/* harmony export */   "now": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.now),
/* harmony export */   "pmod": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.pmod),
/* harmony export */   "relativeClamp": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.relativeClamp),
/* harmony export */   "toDegrees": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toDegrees),
/* harmony export */   "toRadians": () => (/* reexport safe */ _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__.toRadians),
/* harmony export */   "DrawerCanvas": () => (/* reexport safe */ _services_drawers_drawer_canvas_DrawerCanvas__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "Animation": () => (/* reexport safe */ _services_animation_Simple__WEBPACK_IMPORTED_MODULE_2__.default),
/* harmony export */   "Easings": () => (/* reexport safe */ _services_animation_Easings__WEBPACK_IMPORTED_MODULE_3__.default),
/* harmony export */   "SceneUtilities": () => (/* reexport safe */ _services_scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_4__.default),
/* harmony export */   "DrawerSVG": () => (/* reexport safe */ _services_drawers_drawer_svg_DrawerSVG__WEBPACK_IMPORTED_MODULE_5__.default),
/* harmony export */   "Renderer": () => (/* reexport safe */ _services_renderer_Renderer__WEBPACK_IMPORTED_MODULE_6__.default),
/* harmony export */   "JSONImporter": () => (/* reexport safe */ _services_importers_JSONImporter__WEBPACK_IMPORTED_MODULE_7__.default),
/* harmony export */   "JSONExporter": () => (/* reexport safe */ _services_exporters_JSONExporter__WEBPACK_IMPORTED_MODULE_8__.default),
/* harmony export */   "GCODEExporter": () => (/* reexport safe */ _services_exporters_GCODEExporter__WEBPACK_IMPORTED_MODULE_9__.default),
/* harmony export */   "SVGExporter": () => (/* reexport safe */ _services_exporters_SVGExporter__WEBPACK_IMPORTED_MODULE_10__.default),
/* harmony export */   "SVGImporter": () => (/* reexport safe */ _services_importers_SVGImporter__WEBPACK_IMPORTED_MODULE_11__.default)
/* harmony export */ });
/* harmony import */ var _urpflanze_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urpflanze/core */ "./node_modules/@urpflanze/core/dist/index.js");
/* harmony import */ var _services_drawers_drawer_canvas_DrawerCanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/drawers/drawer-canvas/DrawerCanvas */ "./dist/services/drawers/drawer-canvas/DrawerCanvas.js");
/* harmony import */ var _services_animation_Simple__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/animation/Simple */ "./dist/services/animation/Simple.js");
/* harmony import */ var _services_animation_Easings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/animation/Easings */ "./dist/services/animation/Easings.js");
/* harmony import */ var _services_scene_utilities_SceneUtilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/scene-utilities/SceneUtilities */ "./dist/services/scene-utilities/SceneUtilities.js");
/* harmony import */ var _services_drawers_drawer_svg_DrawerSVG__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/drawers/drawer-svg/DrawerSVG */ "./dist/services/drawers/drawer-svg/DrawerSVG.js");
/* harmony import */ var _services_renderer_Renderer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/renderer/Renderer */ "./dist/services/renderer/Renderer.js");
/* harmony import */ var _services_importers_JSONImporter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./services/importers/JSONImporter */ "./dist/services/importers/JSONImporter.js");
/* harmony import */ var _services_exporters_JSONExporter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./services/exporters/JSONExporter */ "./dist/services/exporters/JSONExporter.js");
/* harmony import */ var _services_exporters_GCODEExporter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./services/exporters/GCODEExporter */ "./dist/services/exporters/GCODEExporter.js");
/* harmony import */ var _services_exporters_SVGExporter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./services/exporters/SVGExporter */ "./dist/services/exporters/SVGExporter.js");
/* harmony import */ var _services_importers_SVGImporter__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./services/importers/SVGImporter */ "./dist/services/importers/SVGImporter.js");












//# sourceMappingURL=index.js.map
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=urpflanze.js.map