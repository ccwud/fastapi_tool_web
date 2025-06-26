import Home from '../views/Home.vue'
import ChineseConverter from '../views/ChineseConverter.vue'
import Translator from '../views/Translator.vue'
import DesEncryption from '../views/DesEncryption.vue'
import MarkdownConverter from '../views/MarkdownConverter.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import SqlCompressor from '../views/SqlCompressor.vue'

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
    path: '/json-formatter',
    name: 'JsonFormatter',
    component: JsonFormatter
  },
  {
    path: '/sql-compressor',
    name: 'SqlCompressor',
    component: SqlCompressor
  }
]

export default routes
