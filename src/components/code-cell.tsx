import { useState, useEffect } from 'react';
import bundle from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import {Cell} from '../state'
import {useActions} from '../hooks/use-actions'


interface CodeCellProps{
    cell : Cell
}

const CodeCell: React.FC<CodeCellProps> = ({cell}) => {
 
  const [code, setCode] = useState('');
  const [err, setErr] = useState('')
  const {updateCell} = useActions()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  //event object coming from the parent property

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>

        <Preview code={code} bundlingStat={err}/>
      </div>
    </Resizable>
  );
};

export default CodeCell;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
