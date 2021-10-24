import compact from "lodash/compact";
import flatten from "lodash/flatten";
import uniq from "lodash/uniq";
import messageControl from "remark-message-control";
import remarkParse from "remark-parse";
import remark2retext from "remark-retext";
import english from "retext-english";
import equality from "retext-equality";
import { Processor, unified } from "unified";
import { VFile } from "vfile";
import allPresets from "./presets";

export type ReillyPreset = {
  enable?: string[];
  ignore?: string[];
};

export type ReillySettings = ReillyPreset & {
  presets?: (keyof typeof allPresets)[];
};

const parseSettings = ({
  presets = [],
  enable = [],
  ignore = [],
}: ReillySettings = {}): ReillySettings => {
  if (presets && presets.length > 0) {
    const presetObjects = presets.map(
      (preset) => allPresets[preset] as ReillyPreset
    );

    enable = uniq(
      compact([
        ...flatten(presetObjects.map((preset) => preset.enable)),
        ...enable,
      ])
    );

    ignore = uniq(
      compact([
        ...flatten(presetObjects.map((preset) => preset.ignore)),
        ...ignore,
      ])
    );
  }

  return { enable, ignore };
};

const makeMarkdownProcessor = ({
  enable,
  ignore,
}: ReillySettings): Processor => {
  return unified()
    .use(remarkParse)
    .use(remark2retext, unified().use(english).use(equality, { ignore }))
    .use(messageControl, {
      name: "reilly",
      reset: enable && enable.length > 0,
      enable,
      source: ["retext-equality"],
    });
};

const reilly = async (
  text: string,
  settings?: ReillySettings
): Promise<VFile> => {
  const { enable, ignore } = parseSettings(settings);
  const processor = makeMarkdownProcessor({ enable, ignore });
  const file = new VFile(text);
  const tree = processor.parse(file);

  await processor.run(tree, file);

  return file;
};

export default reilly;
