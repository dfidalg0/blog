import type { Root, RootContent } from 'hast';

const GITHUB_PROTO = 'github://';
const GITHUB_BASE_URL = 'https://github.com/dfidalg0/blog/blob/main/';

function resolveGithubProtoLink(href: string) {
  if (!href.startsWith(GITHUB_PROTO)) return href;

  const path = href.slice(GITHUB_PROTO.length);

  return new URL(path, GITHUB_BASE_URL).href;
}

function updateLinks(node: Root | RootContent) {
  if (node.type !== 'element' || node.tagName !== 'a') return;

  const props = (node.properties ??= {});

  let href = String(props.href ?? '');

  href = resolveGithubProtoLink(href);

  if (/^https?:\/\//.test(href)) {
    props.target = '_blank';
    props.rel = 'noopener';
  }

  props.href = href;
}

function visitChildren(node: Root | RootContent) {
  if (!('children' in node)) return;

  for (const child of node.children ?? []) {
    visit(child);
  }
}

function visit(node: Root | RootContent) {
  updateLinks(node);

  visitChildren(node);
}

export function RehypeLinks() {
  return visit;
}
