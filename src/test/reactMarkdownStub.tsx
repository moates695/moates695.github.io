/**
 * Test-only stand-in for react-markdown.
 *
 * react-markdown 10 and its whole remark/unist dependency tree are ESM-only,
 * which CRA's jest cannot load: pointing transformIgnorePatterns at them only
 * moves the failure further down the chain. Nothing is lost by stubbing it,
 * because the suites that reach this are smoke tests that render App and check
 * the page came up, not tests of markdown rendering.
 *
 * Wired up via moduleNameMapper in package.json. Never imported by the site, so
 * it is not part of the bundle.
 */
import { ReactNode } from "react";

export default function ReactMarkdown({ children }: { children?: ReactNode }) {
  return <div data-testid="markdown-stub">{children}</div>;
}
