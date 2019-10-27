import messageControl from "remark-message-control";
import remarkParse from "remark-parse";
import remark2retext from "remark-retext";
import english from "retext-english";
import equality from "retext-equality";
import unified from "unified";
import vfile, { VFile } from "vfile";

export type RobinSettings = {
  enable?: string[];
};

const robin = async (
  text: string,
  { enable = [] }: RobinSettings = {}
): Promise<VFile> => {
  const processor = unified()
    .use(remarkParse)
    .use(
      remark2retext,
      unified()
        .use(english)
        .use(equality)
    )
    .use(messageControl, {
      name: "robin",
      reset: enable && enable.length > 0,
      enable,
      source: ["retext-equality"]
    });

  const file = vfile(text);
  const tree = processor.parse(file);

  await processor.run(tree, file);

  return file;
};

export default robin;
