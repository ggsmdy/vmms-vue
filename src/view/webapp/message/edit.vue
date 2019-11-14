<template>
  <div class="editor-wrapper">
    <Row>
      <Form :model="formItem" :label-width="80">
        <FormItem label="主标题">
              <i-input v-model="formItem.title" placeholder="编写主标题..."></i-input>
        </FormItem>
        <FormItem label="副标题">
              <i-input v-model="formItem.subtitle" placeholder="编写副标题..."></i-input>
        </FormItem>
        <FormItem label="正文">
            <div id="editorId"></div>
        </FormItem>
      </Form>
    </Row>
    <!-- <div id="editorId"></div> -->
    <Row>
      <i-col span="5" offset="19">
        <Button style="margin: 10px 10px;float:right" type="error" @click="handleCancel">返回</Button>
        <Button style="margin: 10px 10px; float:right" type="info" @click="handleConfirm">确认</Button>
      </i-col>
      <!-- <i-col span="1"><Button style="margin: 10px 0;" type="error">返回</Button></i-col> -->
    </Row>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import baseURL from '_conf/url'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
import { editMessage, getMessageDetail } from '@/api/member'
export default {
  name: 'editMessage',
  data () {
    return {
      valueType: 'html',
      changeInterval: 300,
      cache: true,
      editor: null,
      formItem: {
        id: '',
        title: '',
        subtitle: '',
        content: ''
      }
    }
  },
  methods: {
    handleCancel () {
      this.$router.push({
        name: 'messageList'
      })
    },
    handleConfirm () {
      editMessage(this.formItem.id, this.formItem).then(res => {
        this.$Message.success('修改成功')
      })
      this.$router.push({
        name: 'messageList'
      })
    }
  },
  mounted () {
    this.formItem.id = this.$router.currentRoute.params.msgId
    getMessageDetail(this.formItem.id).then(res => {
      this.formItem.title = res.title
      this.formItem.subtitle = res.subtitle
      this.formItem.content = res.content
      if (this.formItem.content) this.editor.txt.html(this.formItem.content)
    })
    this.editor = new Editor('#editorId')
    this.editor.customConfig.onchange = (html) => {
      this.formItem.content = html
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    this.editor.customConfig.uploadImgServer = baseURL + '/v1/message/upload/'
    this.editor.customConfig.uploadImgHeaders = {
      'Authorization': 'Token ' + Cookies.get(TOKEN_KEY)
    }
    this.editor.customConfig.withCredentials = true
    this.editor.customConfig.uploadImgHooks = {
      customInsert: function (insertImg, result, editor) {
        var url = baseURL + result.url
        insertImg(url)
      }
    }
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      // 'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    let html = localStorage.editorCache
    if (html) this.editor.txt.html(html)
  }
}
</script>

<style>

</style>
