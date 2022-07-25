import React from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';

import reportWebVitals from './reportWebVitals';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
const App = () => {
  const [input, setInput] = useState('');
 
  const ref = useRef<any>();
  const iframe = useRef<any>()

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      // loader: 'jsx', // telling esbuild what kind of code we are transpiling
      // target: 'es2015',
    });

    //setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')

    console.log(result);
  };
  //event object coming from the parent property
  const html = `
     <html>
     <body>
        <div id="root">
        <script>
            window.addEventListener('message', (event)=> {
              try{
                eval(event.data)

              }catch(err){
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color:red">' + err + '</div>'
                throw err

              }

            }, false)
        </script>
        </div>
     </body>
     </html>
    `;
  return (
    <div>
      <CodeEditor
        initialValue="const a = 1"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <div>
        <iframe
          title="code preview"
          ref={iframe}
          sandbox="allow-scripts"
          srcDoc={html}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
