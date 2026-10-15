'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
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
  return (
    <div className={`prose-dark text-xs leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-sm font-extrabold text-cyan-300 mt-4 mb-2 pb-1.5 border-b border-slate-800 flex items-center gap-1.5 tracking-wide">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs font-bold text-slate-100 mt-3.5 mb-1.5 flex items-center gap-1.5 text-cyan-400/90">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold text-cyan-400 mt-3 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-xs text-slate-300 leading-relaxed mb-2.5 font-sans">
              {parseLineBreaks(children)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 space-y-1 my-2 text-xs text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 space-y-1 my-2 text-xs text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-slate-300 pl-1">{parseLineBreaks(children)}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-cyan-500 bg-cyan-950/30 px-3 py-1.5 rounded-r my-2.5 text-xs text-cyan-200/90 font-medium">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="text-slate-100 font-semibold">{parseLineBreaks(children)}</strong>
          ),
          code: ({ inline, className: codeClass, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10.5px] border border-slate-800"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-2.5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/90 p-3 font-mono text-[11px] text-slate-200">
                <code {...props}>{children}</code>
              </div>
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
            <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
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
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownRenderer = React.memo(MarkdownRendererInternal);

