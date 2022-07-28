import MarkdownEditor from '@uiw/react-markdown-editor';
import React from 'react';
import './text-editor.css';
import { useState, useEffect, useRef } from 'react';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
}

const code = `# title\n\nHello World!\n\n`;
const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const [markdownVal, setMarkdownVal] = useState(code);
  const ref = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useActions();

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
        <div className="card-content">
          <MarkdownEditor
            value={cell.content }
            onChange={(value) => {
              updateCell(cell.id, value);
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)} className="text-editor card">
      <div className="card-content">
        <MarkdownEditor
          value={cell.content || 'click to edit'}
          visible={true}
          onChange={(value) => {
            updateCell(cell.id, value);
          }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
