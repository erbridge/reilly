declare module "remark-message-control" {
  import { Parser, Plugin, Processor, Transformer } from "unified";

  export type MessageControlSettings = {
    name: string;
    marker?: Function;
    test?: string[];
    known?: string[];
    reset?: boolean;
    enable?: string[];
    disable?: string[];
    source?: string | string[];
  };

  export interface MessageControl extends Plugin<[MessageControlSettings]> {
    (options: MessageControlSettings): Transformer;
  }

  const messageControl: MessageControl;

  export default messageControl;
}

declare module "remark-retext" {
  import { Parser, Plugin, Processor, Transformer } from "unified";

  export type Remark2RetextSettings = {
    ignore?: string[];
    source?: string[];
  };

  export interface Remark2Retext
    extends Plugin<[(Remark2RetextSettings | Processor)?]> {
    (
      destination?: Parser | Processor,
      options?: Remark2RetextSettings
    ): Transformer;
  }

  const remark2retext: Remark2Retext;

  export default remark2retext;
}

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
