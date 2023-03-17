import hljs from 'highlight.js'

import bash from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import nginx from 'highlight.js/lib/languages/nginx'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import xml from 'highlight.js/lib/languages/xml'
import shell from 'highlight.js/lib/languages/shell'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('nginx', nginx)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('xml', xml)
// hljs.registerLanguage('htmlbars', htmlbars)
hljs.registerLanguage('shell', shell)

const MarkdownIt = require('markdown-it')
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const code = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value

        return `<pre class="hljs"><code data-codeblock>${code}</code></pre>`
      } catch (err) {
        console.log(err)
      }

      const code: string = md.utils.escapeHtml(str)
      return `<pre class="hljs"><code  data-codeblock>${code}</code></pre>`
    }
  }
}).use(require('markdown-it-mark'))
export function parseMarkdownFile (file: string) {
  // file = file.replaceAll(/(\*\*.*==.*==.*\*\*)([^\s])/g, '$1 $2')
  file = file.replaceAll(/\*\*\s+(.*)\*\*/g, '**$1**')
  file = file.replaceAll(/\*\*(.*)\s+\*\*/g, '**$1**')
  // file = file.replaceAll(/([^\s\n]*)(==.*==)([^\s\n]*)/g, '$1 ==$2== $3')
  file = file.replaceAll(/([^\s\n]*)(\*\*.*\*\*)([^\s\n]*)/g, '$1 ==$2== $3')
  file = file.replaceAll(/(<img.*?)src="(.*?)"(.*?>)/g, '$1src="" data-src="$2"$3')
  const htmlStr = md.render(file)
  return htmlStr
}
