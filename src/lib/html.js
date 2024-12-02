import { defaultOptions } from "./options";

export function html(opts) {
  opts = opts ? opts : defaultOptions;
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
    let stack = this.getData("taggableStack");
    if (!stack) {
      this.setData("taggableStack", (stack = []));
    }

    stack.push({});
  }

  function top(stack) {
    return stack.at(-1);
  }

  function exitTaggableMarker(token) {
    const marker = this.sliceSerialize(token);
    const current = top(this.getData("taggableStack"));
    current.marker = marker;
  }

  function exitTaggableValue(token) {
    const value = this.sliceSerialize(token);
    const current = top(this.getData("taggableStack"));
    current.value = value;
  }

  function exitTaggable() {
    const taggable = this.getData("taggableStack").pop();

    const marker = taggable.marker;
    const value = taggable.value;

    this.tag(
      '<a href="' +
        urlResolverMap.get(marker)(value) +
        '" class="' +
        cls.join(" ") +
        (clsMap.get(marker) ? " " + clsMap.get(marker).join(" ") : "") +
        '">',
    );
    this.raw(marker + value);
    this.tag("</a>");
  }

  return {
    enter: {
      //@ts-expect-error
      taggable: enterTaggable,
    },
    exit: {
      //@ts-expect-error
      taggableMarker: exitTaggableMarker,
      taggableValue: exitTaggableValue,
      taggable: exitTaggable,
    },
  };
}
