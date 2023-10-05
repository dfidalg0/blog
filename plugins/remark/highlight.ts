import type { Html, Root, RootContent } from 'mdast';
import { getHighlightHtml } from '../../src/utils/highlight';

async function visit(node: Root | RootContent) {
  if (node.type === 'code') {
    const htmlNode = node as never as Html;

    htmlNode.type = 'html';

    const content = await getHighlightHtml(node.value, node.lang);

    htmlNode.value = content;
  }

  if (!('children' in node)) return;

  node.children.forEach(visit);
}

export function RemarkHighlight() {
  return visit;
}
