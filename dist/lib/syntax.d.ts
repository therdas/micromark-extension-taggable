import { Options } from "./options";
import { Extension } from "micromark-util-types";
declare module "micromark-util-types" {
    interface TokenTypeMap {
        taggable: "taggable";
        taggableMarker: "taggableMarker";
        taggableValue: "taggableValue";
    }
}
export declare function syntax(opts?: Options): Extension;
