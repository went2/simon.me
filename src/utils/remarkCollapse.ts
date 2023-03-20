import { toString } from "mdast-util-to-string";
import heading from "./mdHeadingRange";

function defaultSummarizer(str: any) {
  return str;
}

function isString(str: any) {
  return typeof str === "string";
}

function isFunction(fn: any) {
  return typeof fn === "function";
}

function collapse(opts: any) {
  if (opts == null || opts.test == null)
    throw new Error("options.test must be given");

  const summarizer =
    opts.summary == null
      ? defaultSummarizer
      : isString(opts.summary)
      ? () => opts.summary
      : opts.summary;

  if (!isFunction(summarizer))
    throw new Error("options.summary must be function");

  return function (node: any) {
    heading(node, opts.test, function (start: any, nodes: any, end: any) {
      return [
        start,
        {
          type: "paragraph",
          children: [
            {
              type: "html",
              value: "<details>",
            },
            {
              type: "html",
              value: "<summary>",
            },
            {
              type: "text",
              value: summarizer(toString(start)),
            },
            {
              type: "html",
              value: "</summary>",
            },
          ],
        },
        ...nodes,
        {
          type: "paragraph",
          children: [
            {
              type: "html",
              value: "</details>",
            },
          ],
        },
        end,
      ];
    });
  };
}

export default collapse;
