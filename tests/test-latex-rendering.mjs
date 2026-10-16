import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';

console.log('Testing MarkdownRenderer KaTeX & LaTeX Rendering Engine...');

function preprocessMarkdown(content) {
  if (!content || typeof content !== 'string') return content;
  let text = content;

  // 1. Convert display math \[ ... \] to $$ ... $$
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, math) => `\n\n$$${math.trim()}$$\n\n`);

  // 2. Convert inline math \( ... \) to $ ... $
  text = text.replace(/\\\(([\s\S]+?)\\\)/g, (_, math) => `$${math.trim()}$`);

  // 3. Wrap naked degree LaTeX (e.g. 16^\circ or 16^\circ05') outside of existing code blocks or math spans
  const segments = text.split(/(`{3}[\s\S]*?`{3}|`[^`\n]+`|\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g);
  for (let i = 0; i < segments.length; i += 2) {
    if (segments[i]) {
      segments[i] = segments[i].replace(
        /\b(\d+(?:\.\d+)?)\s*\^\s*(\{?\\circ\}?)(?:\s*(\d+['′]))?/g,
        (match, deg, circ, min) => `$${deg}^\\circ${min ? min.trim() : ''}$`
      );
    }
  }

  return segments.join('');
}

function renderChildrenWithMath(children) {
  if (typeof children === 'string') {
    if (!children.includes('$') && !children.includes('\\circ')) {
      return children;
    }

    const parts = [];
    let lastIdx = 0;
    const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$|\b\d+(?:\.\d+)?\s*\^\s*(?:\{?\\circ\}?)(?:\s*\d+['′])?)/g;
    let match;

    while ((match = mathRegex.exec(children)) !== null) {
      if (match.index > lastIdx) {
        parts.push(children.slice(lastIdx, match.index));
      }
      const raw = match[0];
      let math = raw;
      let displayMode = false;

      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        math = raw.slice(2, -2).trim();
        displayMode = true;
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        math = raw.slice(1, -1).trim();
      }

      try {
        const html = katex.renderToString(math, {
          displayMode,
          throwOnError: false,
          strict: false,
        });
        parts.push(
          React.createElement('span', {
            key: match.index,
            className: 'inline-katex font-sans align-baseline select-text',
            dangerouslySetInnerHTML: { __html: html },
          })
        );
      } catch {
        parts.push(raw);
      }
      lastIdx = mathRegex.lastIndex;
    }

    if (lastIdx < children.length) {
      parts.push(children.slice(lastIdx));
    }
    return parts.length > 0 ? parts : children;
  }

  if (Array.isArray(children)) {
    return children.map((c, i) => (
      React.createElement(React.Fragment, { key: i }, renderChildrenWithMath(c))
    ));
  }

  if (React.isValidElement(children)) {
    const props = children.props;
    if (props && props.children) {
      return React.cloneElement(children, {
        ...props,
        children: renderChildrenWithMath(props.children),
      });
    }
  }

  return children;
}

function renderMarkdown(content) {
  const preprocessed = preprocessMarkdown(content);
  return renderToString(
    React.createElement(ReactMarkdown, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [[rehypeKatex, { throwOnError: false, strict: false }]],
      components: {
        pre: ({ children, ...props }) =>
          React.createElement(
            'div',
            { className: 'my-2.5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/90 p-3 font-mono text-[11px] text-slate-200' },
            React.createElement('pre', props, renderChildrenWithMath(children))
          ),
        code: ({ className, children, ...props }) => {
          const isBlock = String(children).includes('\n') || (className && className.includes('language-'));
          if (!isBlock) {
            return React.createElement(
              'code',
              { className: 'bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10.5px] border border-slate-800', ...props },
              renderChildrenWithMath(children)
            );
          }
          return React.createElement('code', { className, ...props }, renderChildrenWithMath(children));
        },
      },
      children: preprocessed,
    })
  );
}

// Test 1: KaTeX in regular text
const t1 = 'Transit Mars at $16^\\circ$ to $28^\\circ$ in Cancer.';
const h1 = renderMarkdown(t1);
assert(h1.includes('class="katex"'), 'Must render KaTeX in regular text');
console.log('  ✓ [PASS] Regular text KaTeX math expressions');

// Test 2: Code block with LaTeX expressions (The exact user screenshot bug)
const t2 = `
\`\`\`
PHASE 1: THE DASHA CHIDRA SNAP
Date: October 20, 2026 (Exact)

PHASE 2: THE TRANSIT DECOMPRESSION
Date: November 18-22, 2026
Trigger: Transit Mars clears deep debilitation in Cancer ($16^\\circ$ to $28^\\circ$) + Transit Saturn stations Direct in Pisces ($16^\\circ02')
Effect: The physical friction and operational drag dissolve.
\`\`\`
`;
const h2 = renderMarkdown(t2);
assert(h2.includes('class="katex"'), 'Must render KaTeX inside code blocks');
assert(!h2.includes('$16^\\circ$'), 'Must not leave raw $16^\\circ$ unrendered in code blocks');
console.log('  ✓ [PASS] KaTeX inside code blocks rendered without raw LaTeX artifact');

// Test 3: Bracket delimiters
const t3 = 'Transit Jupiter \\(15^\\circ\\) and Virupas \\[\\text{Virupas} \\ge 390\\]';
const h3 = renderMarkdown(t3);
assert(h3.includes('class="katex"'), 'Must render KaTeX from bracket delimiters');
console.log('  ✓ [PASS] Bracket delimiters \\(...\\) and \\[...] parsed and rendered');

// Test 4: Naked degree notations without dollar signs
const t4 = 'Sun in Leo at 14^\\circ and Moon at 2^\\circ 40\'.';
const h4 = renderMarkdown(t4);
assert(h4.includes('class="katex"'), 'Must render KaTeX from naked degree notations');
console.log('  ✓ [PASS] Naked degree notation (14^\\circ) automatically wrapped and rendered');

console.log('\nAll LaTeX rendering tests passed successfully!\n');
