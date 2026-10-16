'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Preprocesses markdown text before passing to ReactMarkdown:
 * 1. Converts bracket-style LaTeX delimiters \(...\) and \[...\] to $...$ and $$...$$
 * 2. Detects and wraps naked degree notations (e.g. 16^\circ or 16^\circ02') outside of code blocks
 */
function preprocessMarkdown(content: string): string {
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

/**
 * Recursively scans children inside code or pre elements to render any embedded KaTeX math ($...$ or $$...$$).
 */
function renderChildrenWithMath(children: React.ReactNode): React.ReactNode {
  if (typeof children === 'string') {
    if (!children.includes('$') && !children.includes('\\circ')) {
      return children;
    }

    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    // Matches $$...$$, $...$, or naked degree notations like 16^\circ
    const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$|\b\d+(?:\.\d+)?\s*\^\s*(?:\{?\\circ\}?)(?:\s*\d+['′])?)/g;
    let match: RegExpExecArray | null;

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
          <span
            key={match.index}
            className="inline-katex font-sans align-baseline select-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
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
      <React.Fragment key={i}>{renderChildrenWithMath(c)}</React.Fragment>
    ));
  }

  if (React.isValidElement(children)) {
    const props = children.props as Record<string, any>;
    if (props && props.children) {
      return React.cloneElement(children, {
        ...props,
        children: renderChildrenWithMath(props.children),
      } as any);
    }
  }

  return children;
}

function parseLineBreaks(children: React.ReactNode): React.ReactNode {
  if (typeof children === 'string') {
    if (/<br\s*\/?>/i.test(children)) {
      const parts = children.split(/<br\s*\/?>/gi);
      return parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {part}
        </React.Fragment>
      ));
    }
    return children;
  }
  if (Array.isArray(children)) {
    return children.map((child, idx) => (
      <React.Fragment key={idx}>{parseLineBreaks(child)}</React.Fragment>
    ));
  }
  if (React.isValidElement(children)) {
    const props = children.props as Record<string, any>;
    if (props && props.children) {
      return React.cloneElement(children, {
        ...props,
        children: parseLineBreaks(props.children),
      } as any);
    }
  }
  return children;
}

// Component that preserves horizontal scroll position across re-renders
function ScrollPreservingTable({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollPosRef = React.useRef(0);

  const handleScroll = () => {
    if (containerRef.current) {
      scrollPosRef.current = containerRef.current.scrollLeft;
    }
  };

  React.useLayoutEffect(() => {
    if (containerRef.current && scrollPosRef.current > 0) {
      containerRef.current.scrollLeft = scrollPosRef.current;
    }
  });

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-x-auto my-3 rounded-lg border border-slate-800 bg-slate-950/60 shadow-inner"
    >
      <table className="w-full text-left text-xs border-collapse">
        {children}
      </table>
    </div>
  );
}

function MarkdownRendererInternal({ content, className = '' }: MarkdownRendererProps) {
  const preprocessedContent = React.useMemo(() => preprocessMarkdown(content), [content]);

  return (
    <div className={`prose-dark text-xs sm:text-[13px] leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-sm sm:text-base font-extrabold text-cyan-300 mt-4 mb-2 pb-1.5 border-b border-slate-800 flex items-center gap-1.5 tracking-wide">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 mt-3.5 mb-1.5 flex items-center gap-1.5 text-cyan-400/90">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-[13px] font-bold text-cyan-400 mt-3 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed mb-2.5 font-sans">
              {parseLineBreaks(children)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 space-y-1.5 my-2.5 text-xs sm:text-[13px] text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 space-y-1.5 my-2.5 text-xs sm:text-[13px] text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-slate-200 pl-1">{parseLineBreaks(children)}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-cyan-500 bg-cyan-950/30 px-3 py-2 rounded-r my-2.5 text-xs sm:text-[13px] text-cyan-200/90 font-medium leading-relaxed">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="text-slate-100 font-semibold">{parseLineBreaks(children)}</strong>
          ),
          pre: ({ children, ...props }: any) => (
            <div className="my-2.5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/90 p-3 font-mono text-[11px] text-slate-200">
              <pre {...props}>{renderChildrenWithMath(children)}</pre>
            </div>
          ),
          code: ({ className: codeClass, children, ...props }: any) => {
            const isBlock =
              String(children).includes('\n') || (codeClass && codeClass.includes('language-'));
            if (!isBlock) {
              return (
                <code
                  className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10.5px] border border-slate-800"
                  {...props}
                >
                  {renderChildrenWithMath(children)}
                </code>
              );
            }
            return (
              <code className={codeClass} {...props}>
                {renderChildrenWithMath(children)}
              </code>
            );
          },
          table: ({ children }) => <ScrollPreservingTable>{children}</ScrollPreservingTable>,
          thead: ({ children }) => (
            <thead className="bg-slate-900 border-b border-slate-800 text-cyan-300 font-semibold font-mono text-[10px] tracking-wider uppercase">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="py-2.5 px-3 font-bold border-r border-slate-800/80 last:border-r-0 whitespace-nowrap align-top">
              {parseLineBreaks(children)}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-800/60 font-sans text-xs sm:text-[12.5px]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-900/40 transition-colors">
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="py-2.5 px-3 text-slate-300 border-r border-slate-800/60 last:border-r-0 align-top leading-relaxed">
              {parseLineBreaks(children)}
            </td>
          ),
          hr: () => <hr className="border-slate-800 my-3" />,
        }}
      >
        {preprocessedContent}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownRenderer = React.memo(MarkdownRendererInternal);

