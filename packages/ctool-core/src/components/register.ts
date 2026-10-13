import Icon from "./ui/Icon.vue";
import UploadFile from "./ui/UploadFile.vue";
import Display from "./Display.vue";
import HeightResize from "./HeightResize.vue";
import Bool from "./ui/Bool.vue";
import Textarea from "./ui/Textarea.vue";
import Select from "./ui/Select.vue";
import Input from "./ui/Input.vue";
import Button from "./ui/Button.vue";
import Dropdown from "./ui/Dropdown.vue";
import Tooltip from "./ui/Tooltip.vue";
import Radio from "./ui/Radio.vue";
import TextInput from "./text/TextInput.vue";
import TextOutput from "./text/TextOutput.vue";
import {App, defineAsyncComponent} from "vue";
import ExtendPage from "./ExtendPage.vue";
import Card from "./ui/Card.vue";
import InputNumber from "./ui/InputNumber.vue";
import Exception from "./Exception.vue";
import Modal from "./Modal.vue";
import Link from "./ui/Link.vue";
import Tabs from "./ui/Tabs.vue";
import HelpTip from "./HelpTip.vue";
import Align from "./Align.vue";
import Checkbox from "./ui/Checkbox.vue";

const SerializeInput = defineAsyncComponent(() => import("./serialize/SerializeInput.vue"));
const SerializeOutput = defineAsyncComponent(() => import("./serialize/SerializeOutput.vue"));
const Editor = defineAsyncComponent(() => import("./editor/Editor.vue"));
const Color = defineAsyncComponent(() => import("./ui/Color.vue"));
const Table = defineAsyncComponent(() => import("./ui/Table.vue"));

const components = {
    // icon
    Icon,
    // 文件上传
    UploadFile,
    // 悬浮展示组件
    Display,
    // 高度自适应
    HeightResize,
    // 是否选中
    Bool,
    // 文本框
    Textarea,
    // 选择框
    Select,
    // 输入框
    Input,
    // 按钮
    Button,
    // 下拉框
    Dropdown,
    // 提示
    Tooltip,
    // 单选
    Radio,
    // 通用数据输入输出组件
    TextInput, TextOutput,
    // 序列化数据输入输出组件
    SerializeInput, SerializeOutput,
    // 代码编辑器
    Editor,
    // tabs
    Tabs,
    // 帮助按钮
    HelpTip,
    // 简单 table
    Table,
    // 颜色选择
    Color,
    // 链接
    Link,
    // Card
    Card,
    // 弹窗
    Modal,
    // 异常提示
    Exception,
    // 数据输入框
    InputNumber,
    // 扩展页面
    ExtendPage,
    // 元素排列
    Align,
    // 多选
    Checkbox,
}


// 组件注册
export default (app: App) => {
    for (let [key, value] of Object.entries(components)) {
        app.component(key, value)
    }
}
