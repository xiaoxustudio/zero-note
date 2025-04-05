import { FileConfig } from '@renderer/types'
import { EditorCodeBlockConfigToString, GlobalConfig } from '.'
import { domToJpeg, domToPng, domToSvg, domToWebp, Options } from 'modern-screenshot'

export function toHtmlStr(item: FileConfig, content: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css">
    <script src="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
    <title>${item.title}</title>
    <style>
    pre{
     background: #2e2b29;
      border-radius: 0.5rem;
      color: white;
      font-family: JetBrainsMono, monospace;
      margin: 1.5rem 0;
      padding: 0.75rem 1rem;
      white-space: pre-wrap;
      position: relative;
      }
      pre:hover code[class^='language-']::after {
          opacity: 1;
      }
     code[class^='language-'] {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
      }
      code[class^='language-']::after {
        transition: opacity 0.15s linear;
        content: attr(data-lang);
        position: absolute;
        color: white;
        right: 0.5em;
        top: 0.5em;
        opacity: .3;
      }
    /* Code styling */
    ${EditorCodeBlockConfigToString(GlobalConfig[0].content)}
      </style>
  </head>
  <body>
  <h1>${item.title}</h1>
  ${content}
  <script>
    hljs.highlightAll();
  </script>
  </body>
  </html>`
}

export async function HtmltoImage(dom: HTMLElement, config: Options, suffix = 'png') {
  let dataUrl = ''
  switch (suffix) {
    case 'png':
      dataUrl = await domToPng(dom, config)
      break
    case 'jpeg':
      dataUrl = await domToJpeg(dom, config)
      break
    case 'svg':
      dataUrl = await domToSvg(dom, config)
      break
    case 'webp':
      dataUrl = await domToWebp(dom, config)
      break
  }
  return dataUrl
}
