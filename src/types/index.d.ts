declare module "retext-english" {
  import { Parser, Plugin } from "unified";

  export interface English extends Plugin {
    (): void;
    Parser: Parser;
  }

  const parse: English;

  export default parse;
}

declare module "retext-equality" {
  import { Parser, Plugin, Processor, Transformer } from "unified";

  export type EqualitySettings = {
    ignore?: string[];
    noBinary?: boolean;
  };

  export interface Equality extends Plugin<[EqualitySettings?]> {
    (this: Processor, options?: EqualitySettings): Transformer;
  }

  const equality: Equality;

  export default equality;
}
