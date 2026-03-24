import React, { useState } from 'react';
import './CodeSnippet.css';

interface CodeSnippetProps {
  code: string;
  language: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-snippet">
      <div className="code-snippet-header">
        <span className="code-language">{language}</span>
        <button className="copy-button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="code-snippet-body" data-lenis-prevent>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeSnippet;
