<template>
  <view class="up-markdown" :class="theme">
    <up-parse :content="parsedContent" :previewImg="previewImg"></up-parse>
  </view>
</template>

<script>
import { marked } from './marked.esm.js';

export default {
  name: 'up-markdown',
  props: {
    // markdown内容
    content: {
      type: String,
      default: ''
    },
    // 是否启用图片预览
    previewImg: {
      type: Boolean,
      default: true
    },
    // 是否显示代码块行号
    showLineNumber: {
      type: Boolean,
      default: false
    },
    // 主题样式 'light' | 'dark'
    theme: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {
      parsedContent: ''
    };
  },
  watch: {
    content: {
      handler(newVal) {
        this.parseMarkdown(newVal);
      },
      immediate: true
    }
  },
  methods: {
    // 解析markdown内容
    parseMarkdown(content) {
      if (!content) {
        this.parsedContent = '';
        return;
      }

      // 使用marked解析markdown
      let parsed = marked(content);
      
      // 处理代码块
      parsed = this.handleCodeBlock(parsed);
      
      // 应用主题样式
      parsed = this.applyTheme(parsed);
      
      this.parsedContent = parsed;
    },
    
    // 处理代码块
    handleCodeBlock(html) {
      // 添加代码块样式和行号
      return html.replace(/<pre><code([^>]*)>([^<]+)<\/code><\/pre>/g, (match, lang, code) => {
        const language = lang.match(/class="language-([^"]+)"/);
        const langClass = language ? `language-${language[1]}` : '';
        
        let result = `<pre class="up-markdown-code ${langClass}">`;
        
        if (this.showLineNumber) {
          // 添加行号
          const lines = code.split('\n').filter(line => line.trim() !== '');
          result += '<span class="up-markdown-line-numbers">';
          lines.push('');
          lines.forEach((_, index) => {
            result += `<span class="up-markdown-line-number">${index + 1}</span>`;
          });
          result += '</span>';
        }
        
        result += `<code class='code-lang ${langClass}'>${code}</code></pre>`;
        return result;
      });
    },
    
    // 应用主题样式
    applyTheme(html) {
      // 可以根据theme属性添加不同的样式类
      return html;
    }
  }
};
</script>

<style lang="scss" scoped>
.up-markdown {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  padding: 16px;
  word-wrap: break-word;
  
  /* 标题样式 */
  ::v-deep h1 {
    font-size: 32px;
    margin: 8px 0;
    font-weight: bold;
  }
  
  ::v-deep h2 {
    font-size: 24px;
    margin: 8px 0;
    font-weight: bold;
  }
  
  ::v-deep h3 {
    font-size: 18px;
    margin: 7px 0;
    font-weight: bold;
  }
  
  ::v-deep h4 {
    font-size: 16px;
    margin: 7px 0;
    font-weight: bold;
  }
  
  ::v-deep h5 {
    font-size: 13px;
    margin: 6px 0;
    font-weight: bold;
  }
  
  ::v-deep h6 {
    font-size: 10px;
    margin: 5px 0;
    font-weight: bold;
  }
  
  /* 段落样式 */
  ::v-deep p {
    margin: 16px 0;
  }
  
  /* 链接样式 */
  ::v-deep a {
    color: #007AFF;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* 列表样式 */
  ::v-deep ul,
  ::v-deep ol {
    margin: 16px 0;
    padding-left: 32px;
    
    li {
      margin: 8px 0;
    }
  }
  
  ::v-deep ul li {
    list-style-type: disc;
  }
  
  ::v-deep ol li {
    list-style-type: decimal;
  }
  
  /* 引用样式 */
  ::v-deep blockquote {
    margin: 8px 0;
    padding: 0 10px;
    border-left: 4px solid #ccc;
    color: #666;
  }
  
  /* 代码样式 */
  ::v-deep &-code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 14px;
    background-color: #f6f8fa;
    padding: 3px 6px;
    border-radius: 3px;
    display: flex;
  }
  ::v-deep .code-lang {
    width: 100%;
    overflow-x: auto;
  }
  
  ::v-deep pre {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 14px;
    background-color: #f6f8fa;
    padding: 16px;
    overflow: auto;
    border-radius: 6px;
    margin: 16px 0;
    
    ::v-deep code {
      background: none;
      padding: 0;
    }
  }
  
  /* 表格样式 */
  ::v-deep table {
    border-collapse: collapse;
    margin: 16px 0;
    width: 100%;
    
    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    
    th {
      font-weight: 600;
    }
    
    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }
  
  /* 图片样式 */
  ::v-deep img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #fff;
    margin: 16px 0;
  }
  
  /* 分割线样式 */
  ::v-deep hr {
    height: 1px;
    padding: 0;
    margin: 24px 0;
    background-color: #e1e4e8;
    border: 0;
  }
  
  /* 深色主题 */
  &.dark {
    color: #ccc;
    background-color: #1e1e1e;
    
    ::v-deep &-code {
      background-color: #2d2d2d;
      color: #dcdcdc;
    }
    
    ::v-deep pre {
      background-color: #2d2d2d;
      color: #dcdcdc;
    }

    ::v-deep blockquote {
        margin: 8px 0;
        padding: 0 10px;
        border-left: 4px solid #ccc;
        color: #bbb;
    }
    
    ::v-deep a {
      color: #4da6ff;
    }
  }
}

/* 代码块行号样式 */
::v-deep .up-markdown-line-numbers {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 10px;
  margin-right: 10px;
  border-right: 1px solid #ddd;
  user-select: none;
  
  .up-markdown-line-number {
    color: #999;
    font-size: 14px;
    line-height: 1.6;
  }
}
</style>