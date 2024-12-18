import { Literal } from "unist";
import * as unist from "unist";
import { Data } from "mdast";

export const defaultOptions: Options = {
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

export interface Rules {
  marker: string;
  type: string;
  toUrl: (arg: string) => string;
  classes?: Array<string>;
}
export interface Taggable extends Literal {
  type: "taggable";
  ctx: string;
  marker: string;
  value: string;
  url: string | undefined;
}

export interface Options {
  classes: Array<string>;
  rules: Array<Rules>;
  allowEmail?: boolean;
}

export interface InlineTaggableData {
  marker: string;
  type: string;
  url: string;
}

export interface InlineTaggableNode extends unist.Literal {
  type: "taggable";
  value: string;
  data: Data & InlineTaggableData;
}

declare module "mdast" {
  interface PhrasingContentMap {
    inlineTaggableNode: InlineTaggableNode;
  }

  interface RootContentMap {
    inlineTaggableNode: InlineTaggableNode;
  }
}
