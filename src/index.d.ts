import { Extension, HtmlExtension } from "micromark-util-types";

declare function syntax(opts?: Options): Extension[];
declare function html(opts?: Options): HtmlExtension;

declare interface Options {
  classes?: string[];
  rules: {
    classes?: string[];
    marker: string;
    toUrl: (val: string) => string;
    type: string;
  }[];
  emailAllowed?: boolean;
}
