import { InlineTaggableNode, defaultOptions, Options } from "./options";
import type {
  CompileContext,
  Token,
  HtmlExtension,
} from "micromark-util-types";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    taggable: "taggable";
    taggableMarker: "taggableMarker";
    taggableValue: "taggableValue";
  }
}

declare module "micromark-util-types" {
  interface CompileData {
    taggableStack: InlineTaggableNode;
  }
}

export function html(opts: Options = defaultOptions): HtmlExtension {
  opts = opts ? opts : defaultOptions;
  if (opts.allowEmail == undefined) opts.allowEmail = false;
  const markers: Array<string> = [];
  const typeMap = new Map<string, string>();
  const urlResolverMap = new Map<string, (string: string) => string>();
  const cls = opts.classes ? opts.classes : ["micromark-taggable"];
  const clsMap = new Map<string, Array<string>>();

  for (const i of opts.rules) {
    markers.push(i.marker);
    typeMap.set(i.marker, i.type);
    urlResolverMap.set(i.marker, i.toUrl);
    if (i.classes) {
      clsMap.set(i.marker, i.classes);
    }
  }

  function enterTaggable(this: CompileContext): undefined {
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

  function exitTaggableMarker(this: CompileContext, token: Token): undefined {
    const marker = this.sliceSerialize(token);
    const current: InlineTaggableNode = this.getData("taggableStack");
    current.data.marker = marker;
  }

  function exitTaggableValue(this: CompileContext, token: Token): undefined {
    const value = this.sliceSerialize(token);
    const current = this.getData("taggableStack");
    current.value = value;
  }

  function exitTaggable(this: CompileContext): undefined {
    const taggable = this.getData("taggableStack");

    const marker = taggable.data.marker;
    const value = taggable.value;

    this.tag(
      '<a href="' +
        urlResolverMap.get(marker)!(value) +
        '" class="' +
        cls.join(" ") +
        (clsMap.get(marker) ? " " + clsMap.get(marker)!.join(" ") : "") +
        '">',
    );
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
