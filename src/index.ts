import { myFunction } from "./main";

declare const global: {
  [x: string]: unknown;
};

global.main = myFunction;
