import { InlineTaggableNode, Options } from "./options";
import type { HtmlExtension } from "micromark-util-types";
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
export declare function html(opts?: Options): HtmlExtension;
