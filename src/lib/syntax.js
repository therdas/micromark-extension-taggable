import { codes } from "micromark-util-symbol";
import { defaultOptions } from "./options";
import { markdownLineEnding } from "micromark-util-character";

export function syntax(opts) {
  opts = opts ? opts : defaultOptions;
  const rules = opts.rules;
  const markers = [];
  const typeMap = new Map();
  const allowEmail = opts.emailAllowed || false;

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
        !(allowEmail
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
