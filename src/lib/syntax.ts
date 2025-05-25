import { codes } from "micromark-util-symbol";
import { defaultOptions, Options } from "./options";
import { markdownLineEnding } from "micromark-util-character";
import {
  TokenizeContext,
  Effects,
  State,
  Code,
  Extension,
  Construct,
} from "micromark-util-types";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    taggable: "taggable";
    taggableMarker: "taggableMarker";
    taggableValue: "taggableValue";
  }
}

export function syntax(opts: Options = defaultOptions): Extension {
  if (opts.allowEmail == undefined) opts.allowEmail = false;
  const rules = opts.rules;
  let valueCursor = 0;
  const markers = [];
  const typeMap = new Map();
  const allowEmail = opts.allowEmail;

  for (const i of rules) {
    markers.push(i.marker);
    typeMap.set(i.marker, i.type);
  }

  function tokenize(
    this: TokenizeContext,
    effects: Effects,
    ok: State,
    nok: State,
  ): State {
    return start;

    function start(code: Code) {
      if (!code || markdownLineEnding(code) || code === codes.eof) {
        return nok(code);
      }

      effects.enter("taggable");
      effects.enter("taggableMarker");
      return consumeMarker(code);
    }

    function consumeMarker(code: Code) {
      if (!code || !typeMap.has(String.fromCodePoint(code))) {
        return nok(code);
      }

      effects.consume(code);

      effects.exit("taggableMarker");
      effects.enter("taggableValue");

      return consumeValue;
    }

    function consumeValue(code: Code) {
      if (
        !code ||
        markdownLineEnding(code) ||
        code === codes.eof ||
        !(allowEmail
          ? /[\p{L}\p{N}\p{Pd}\p{Pc}\p{M}@.]/u.test(String.fromCodePoint(code))
          : /[\p{L}\p{N}\p{Pd}\p{Pc}\p{M}]/u.test(String.fromCodePoint(code)))
      ) {
        if (valueCursor < 1) {
          return nok(code);
        } else {
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
  const text: { [c: number]: Construct } = {};

  for (const i of markers) {
    text[i.codePointAt(0)!] = { tokenize: tokenize };
  }

  return { text };
}
