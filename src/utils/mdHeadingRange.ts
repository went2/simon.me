import { toString } from "mdast-util-to-string";

var splice = [].splice;

// Search `node` with `options` and invoke `callback`.
function headingRange(node: any, options: any, callback: any) {
  var test = options;
  var children = node.children;
  var index = -1;
  var ignoreFinalDefinitions;
  var depth;
  let start: number;
  let end: number;
  var child;

  // Object, not regex.
  if (test && typeof test === "object" && !("exec" in test)) {
    ignoreFinalDefinitions = test.ignoreFinalDefinitions;
    test = test.test;
  }

  // Transform a string into an applicable expression.
  if (typeof test === "string") {
    test = new RegExp("^(" + test + ")$", "i");
  }

  // Regex.
  if (test && "exec" in test) {
    test = wrapExpression(test);
  }

  if (typeof test !== "function") {
    throw new Error(
      "Expected `string`, `regexp`, or `function` for `test`, not `" +
        test +
        "`"
    );
  }

  // 长度为 2 的数组
  const stack: number[] = [];
  let nodesRanges = [];

  // Find the ranges
  while (++index < children.length) {
    child = children[index];
    if (child.type !== "heading") continue;

    // 判断是否是结束位置的 heading: 最近一个大于等于用户设定 depth 的 heading
    if (depth && child.depth <= depth && stack.length === 1) {
      end = index;
      const rangeInfo = createRangeInfo(stack.pop()!, end);
      nodesRanges.push(rangeInfo);
    }

    if (test(toString(child), child)) {
      if (!depth) depth = child.depth; // 保存用户指定的 depth
      stack.push(index); // 保存开始位置
    }
  }
  nodesRanges.push(createRangeInfo(stack.pop()!, children.length));

  // When we have a starting heading.
  if (depth) {
    if (ignoreFinalDefinitions) {
      while (
        children[end! - 1].type === "definition" ||
        children[end! - 1].type === "footnoteDefinition"
      ) {
        end!--;
      }
    }

    nodesRanges = nodesRanges.map((nodeInfo) => ({
      ...nodeInfo,
      nodes: callback(
        children[nodeInfo.start],
        children.slice(nodeInfo.start + 1, nodeInfo.end),
        children[nodeInfo.end],
        {
          parent: node,
          start: start,
          end: children[end] ? end : null,
        }
      ).filter((node: any) => node !== undefined),
    }));

    let addedOffset;
    for (let i = 0; i < nodesRanges.length; i++) {
      const range = nodesRanges[i];
      const originOffset = range.end - range.start + 1;
      addedOffset = addedOffset || range.nodes.length - originOffset;

      splice.apply(children, [
        range.start + addedOffset * i,
        originOffset,
        ...(range.nodes as never[]),
      ]);
    }

    // if (nodesRanges.length) {
    //   // Ensure no empty nodes are inserted.
    //   // This could be the case if `end` is in `nodes` but no `end` node exists.
    //   result = [];
    //   index = -1;
    //   while (++index < nodes.length) {
    //     if (nodes[index]) result.push(nodes[index]);
    //   }

    //   // @ts-ignore
    //   splice.apply(children, [start, end - start + 1].concat(result));
    // }
  }
}

function createRangeInfo(start: number, end: number) {
  return {
    start,
    end,
  };
}

// Wrap an expression into an assertion function.
function wrapExpression(expression: any) {
  return assertion;

  // Assert `value` matches the bound `expression`.
  function assertion(value: any) {
    return expression.test(value);
  }
}

export default headingRange;
