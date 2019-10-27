import compact from "lodash/compact";
import flatten from "lodash/flatten";
import uniq from "lodash/uniq";
import messageControl from "remark-message-control";
import remarkParse from "remark-parse";
import remark2retext from "remark-retext";
import english from "retext-english";
import equality from "retext-equality";
import unified from "unified";
import vfile, { VFile } from "vfile";

import allPresets from "./presets";

export type ReillySettings = {
  presets?: (keyof typeof allPresets)[];
  enable?: string[];
  ignore?: string[];
};

const reilly = async (
  text: string,
  { presets = [], enable = [], ignore = [] }: ReillySettings = {}
): Promise<VFile> => {
  if (presets && presets.length > 0) {
    const presetObjects = presets.map(preset => allPresets[preset]);

    enable = uniq(
      compact([
        ...flatten(presetObjects.map(preset => preset.enable)),
        ...enable
      ])
    );

    ignore = uniq(
      compact([
        ...flatten(presetObjects.map(preset => preset.ignore)),
        ...ignore
      ])
    );
  }

  const processor = unified()
    .use(remarkParse)
    .use(
      remark2retext,
      unified()
        .use(english)
        .use(equality, { ignore })
    )
    .use(messageControl, {
      name: "reilly",
      reset: enable && enable.length > 0,
      enable,
      source: ["retext-equality"]
    });

  const file = vfile(text);
  const tree = processor.parse(file);

  await processor.run(tree, file);

  return file;
};

export default reilly;
