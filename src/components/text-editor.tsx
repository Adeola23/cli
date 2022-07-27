import MarkdownEditor from '@uiw/react-markdown-editor';
import React from 'react';
import './text-editor.css';
import { useState, useEffect, useRef } from 'react';

const code = `# title\n\nHello World!\n\n`;
const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [markdownVal, setMarkdownVal] = useState(code);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  });

  if (editing) {
    return (
      <div ref={ref} className="text-editor card">
        <div className='card-content'>
          <MarkdownEditor
            value={markdownVal}
            onChange={(value) => {
              setMarkdownVal(value);
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)} className="text-editor card">
      <div className='card-content'>
        <MarkdownEditor
          value={markdownVal}
          visible={true}
          onChange={(value) => {
            setMarkdownVal(value);
          }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
