import { markdownLineEnding } from "micromark-util-character";
import { codes } from "micromark-util-symbol";

const defaultRules = [
  {
    marker: "#",
    type: "tag",
    toUrl: (argument) => `/tags/${argument}`,
    classes: ["tag"],
  },
  {
    marker: "@",
    type: "mention",
    toUrl: (argument) => `/users/${argument}`,
    classes: ["mention"],
  },
];

export function syntax(options) {
  options = options ? options : {};
  const rules = options.rules || defaultRules;
  const markers = [];
  const typeMap = new Map();
  const emailAllowed = options.emailAllowed || false;

  for (const i of rules) {
    markers.push(i.marker);
    typeMap.set(i.marker, i.type);
  }

  function tokenize(effects, ok, nok) {
    return start;

    function start(code) {
      if (markdownLineEnding(code) || code === codes.eof) {
        return nok(code);
      }

      effects.enter("taggable");
      effects.enter("taggableMarker");
      return consumeMarker;
    }

    function consumeMarker(code) {
      if (!typeMap.has(String.fromCodePoint(code))) {
        return nok(code);
      }

      effects.consume(code);

      effects.exit("taggableMarker");
      effects.enter("taggableValue");

      return consumeValue;
    }

    function consumeValue(code) {
      if (
        markdownLineEnding(code) ||
        code === codes.eof ||
        !(emailAllowed
          ? /[\p{L}\p{M}@.]/u.test(String.fromCodePoint(code))
          : /[\p{L}\p{M}]/u.test(String.fromCodePoint(code)))
      ) {
        effects.exit("taggableValue");
        effects.exit("taggable");
        return ok(code);
      }

      effects.consume(code);
      return consumeValue;
    }
  }

  const extensions = [];

  for (const i of markers) {
    const text = {};
    text[i.codePointAt(0)] = { tokenize };
    extensions.push({
      text,
    });
  }

  return extensions;
}
