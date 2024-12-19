'use strict';

var micromarkUtilSymbol = require('micromark-util-symbol');
var micromarkUtilCharacter = require('micromark-util-character');

const defaultOptions = {
    classes: ["micromark-taggable"],
    rules: [
        {
            marker: "#",
            type: "tag",
            toUrl: (val) => `/tags/${val}`,
            classes: ["tag"],
        },
        {
            marker: "@",
            type: "mention",
            toUrl: (val) => `/users/${val}`,
            classes: ["mention"],
        },
    ],
    allowEmail: false,
};

function syntax(opts = defaultOptions) {
    if (opts.allowEmail == undefined)
        opts.allowEmail = false;
    const rules = opts.rules;
    let valueCursor = 0;
    const markers = [];
    const typeMap = new Map();
    const allowEmail = opts.allowEmail;
    for (const i of rules) {
        markers.push(i.marker);
        typeMap.set(i.marker, i.type);
    }
    function tokenize(effects, ok, nok) {
        return start;
        function start(code) {
            if (!code || micromarkUtilCharacter.markdownLineEnding(code) || code === micromarkUtilSymbol.codes.eof) {
                return nok(code);
            }
            effects.enter("taggable");
            effects.enter("taggableMarker");
            return consumeMarker(code);
        }
        function consumeMarker(code) {
            if (!code || !typeMap.has(String.fromCodePoint(code))) {
                return nok(code);
            }
            effects.consume(code);
            effects.exit("taggableMarker");
            effects.enter("taggableValue");
            return consumeValue;
        }
        function consumeValue(code) {
            if (!code ||
                micromarkUtilCharacter.markdownLineEnding(code) ||
                code === micromarkUtilSymbol.codes.eof ||
                !(allowEmail
                    ? /[\p{L}\p{M}@.]/u.test(String.fromCodePoint(code))
                    : /[\p{L}\p{M}]/u.test(String.fromCodePoint(code)))) {
                if (valueCursor < 1) {
                    return nok(code);
                }
                else {
                    effects.exit("taggableValue");
                    effects.exit("taggable");
                    return ok(code);
                }
            }
            valueCursor++;
            effects.consume(code);
            return consumeValue;
        }
    }
    // Marker-hooks
    const text = {};
    for (const i of markers) {
        text[i.codePointAt(0)] = { tokenize: tokenize };
    }
    return { text };
}

function html(opts = defaultOptions) {
    opts = opts ? opts : defaultOptions;
    if (opts.allowEmail == undefined)
        opts.allowEmail = false;
    const markers = [];
    const typeMap = new Map();
    const urlResolverMap = new Map();
    const cls = opts.classes ? opts.classes : ["micromark-taggable"];
    const clsMap = new Map();
    for (const i of opts.rules) {
        markers.push(i.marker);
        typeMap.set(i.marker, i.type);
        urlResolverMap.set(i.marker, i.toUrl);
        if (i.classes) {
            clsMap.set(i.marker, i.classes);
        }
    }
    function enterTaggable() {
        this.setData("taggableStack", {
            type: "taggable",
            value: "",
            data: {
                marker: "",
                type: "",
                url: "",
            },
        });
    }
    function exitTaggableMarker(token) {
        const marker = this.sliceSerialize(token);
        const current = this.getData("taggableStack");
        current.data.marker = marker;
    }
    function exitTaggableValue(token) {
        const value = this.sliceSerialize(token);
        const current = this.getData("taggableStack");
        current.value = value;
    }
    function exitTaggable() {
        const taggable = this.getData("taggableStack");
        const marker = taggable.data.marker;
        const value = taggable.value;
        this.tag('<a href="' +
            urlResolverMap.get(marker)(value) +
            '" class="' +
            cls.join(" ") +
            (clsMap.get(marker) ? " " + clsMap.get(marker).join(" ") : "") +
            '">');
        this.raw(marker + value);
        this.tag("</a>");
    }
    return {
        enter: {
            taggable: enterTaggable,
        },
        exit: {
            taggableMarker: exitTaggableMarker,
            taggableValue: exitTaggableValue,
            taggable: exitTaggable,
        },
    };
}

exports.defaultOptions = defaultOptions;
exports.html = html;
exports.syntax = syntax;
//# sourceMappingURL=index.cjs.js.map
