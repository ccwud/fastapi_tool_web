import Home from '../views/Home.vue'
import ChineseConverter from '../views/ChineseConverter.vue'
import Translator from '../views/Translator.vue'
import DesEncryption from '../views/DesEncryption.vue'
import MarkdownConverter from '../views/MarkdownConverter.vue'
import ApiDocsToMarkdown from '../views/ApiDocsToMarkdown.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import SqlCompressor from '../views/SqlCompressor.vue'
import JavaToJson from '../views/JavaToJson.vue'
import UnicodeConverter from '../views/UnicodeConverter.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chinese-converter',
    name: 'ChineseConverter',
    component: ChineseConverter
  },
  {
    path: '/translator',
    name: 'Translator',
    component: Translator
  },
  {
    path: '/des-encryption',
    name: 'DesEncryption',
    component: DesEncryption
  },
  {
    path: '/markdown-converter',
    name: 'MarkdownConverter',
    component: MarkdownConverter
  },
  {
    path: '/api-docs-to-markdown',
    name: 'ApiDocsToMarkdown',
    component: ApiDocsToMarkdown
  },
  {
    path: '/json-formatter',
    name: 'JsonFormatter',
    component: JsonFormatter
  },
  {
    path: '/sql-compressor',
    name: 'SqlCompressor',
    component: SqlCompressor
  },
  {
    path: '/java-to-json',
    name: 'JavaToJson',
    component: JavaToJson
  },
  {
    path: '/unicode-converter',
    name: 'UnicodeConverter',
    component: UnicodeConverter
  }
]

export default routes
