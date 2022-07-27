import { useState, useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  bundlingStat: string;
}

const html = `
     <html>
       <head>
          <style> html{background-color: white;}</style>
       </head>
       
     <body>
        <div id="root">
        <script>
            const handleError=(err)=> {
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color:red">' + err + '</div>'
                throw err

            }
            window.addEventListener('error', (event)=> {
                event.preventDefault()
                handleError(event.error)
            })
            window.addEventListener('message', (event)=> {
              try{
                eval(event.data)

              }catch(err){
                  handleError(err)
              }

            }, false)
        </script>
        </div>
     </body>
     </html>
    `;

const Preview: React.FC<PreviewProps> = ({bundlingStat, code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);
  return (
    <div className="preview-wrapper">
      <iframe
        title="code preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingStat && <div className='preview-error'>{bundlingStat}</div>}
    </div>
  );
};

export default Preview;
