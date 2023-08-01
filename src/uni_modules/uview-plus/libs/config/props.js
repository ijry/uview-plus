/**
 * 此文件的作用为统一配置所有组件的props参数
 * 借此用户可以全局覆盖组件的props默认值
 * 无需在每个引入组件的页面中都配置一次
 */
import config from './config'

import ActionSheet from './props/actionSheet'
import Album from './props/album'
import Alert from './props/alert'
import Avatar from './props/avatar'
import AvatarGroup from './props/avatarGroup'
import Backtop from './props/backtop'
import Badge from './props/badge'
import Button from './props/button'
import Calendar from './props/calendar'
import CarKeyboard from './props/carKeyboard'
import Cell from './props/cell'
import CellGroup from './props/cellGroup'
import Checkbox from './props/checkbox'
import CheckboxGroup from './props/checkboxGroup'
import CircleProgress from './props/circleProgress'
import Code from './props/code'
import CodeInput from './props/codeInput'
import Col from './props/col'
import Collapse from './props/collapse'
import CollapseItem from './props/collapseItem'
import ColumnNotice from './props/columnNotice'
import CountDown from './props/countDown'
import CountTo from './props/countTo'
import DatetimePicker from './props/datetimePicker'
import Divider from './props/divider'
import Empty from './props/empty'
import Form from './props/form'
import GormItem from './props/formItem'
import Gap from './props/gap'
import Grid from './props/grid'
import GridItem from './props/gridItem'
import Icon from './props/icon'
import Image from './props/image'
import IndexAnchor from './props/indexAnchor'
import IndexList from './props/indexList'
import Input from './props/input'
import Keyboard from './props/keyboard'
import Line from './props/line'
import LineProgress from './props/lineProgress'
import Link from './props/link'
import List from './props/list'
import ListItem from './props/listItem'
import LoadingIcon from './props/loadingIcon'
import LoadingPage from './props/loadingPage'
import Loadmore from './props/loadmore'
import Modal from './props/modal'
import Navbar from './props/navbar'
import NoNetwork from './props/noNetwork'
import NoticeBar from './props/noticeBar'
import Notify from './props/notify'
import NumberBox from './props/numberBox'
import NumberKeyboard from './props/numberKeyboard'
import Overlay from './props/overlay'
import Parse from './props/parse'
import Picker from './props/picker'
import Popup from './props/popup'
import Radio from './props/radio'
import RadioGroup from './props/radioGroup'
import Rate from './props/rate'
import ReadMore from './props/readMore'
import Row from './props/row'
import RowNotice from './props/rowNotice'
import ScrollList from './props/scrollList'
import Search from './props/search'
import Section from './props/section'
import Skeleton from './props/skeleton'
import Slider from './props/slider'
import StatusBar from './props/statusBar'
import Steps from './props/steps'
import StepsItem from './props/stepsItem'
import Sticky from './props/sticky'
import Subsection from './props/subsection'
import SwipeAction from './props/swipeAction'
import SwipeActionItem from './props/swipeActionItem'
import Swiper from './props/swiper'
import SwipterIndicator from './props/swipterIndicator'
import Switch from './props/switch'
import Tabbar from './props/tabbar'
import TabbarItem from './props/tabbarItem'
import Tabs from './props/tabs'
import Tag from './props/tag'
import Text from './props/text'
import Textarea from './props/textarea'
import Toast from './props/toast'
import Toolbar from './props/toolbar'
import Tooltip from './props/tooltip'
import Transition from './props/transition'
import Upload from './props/upload'

const {
    color
} = config

export default {
    ...ActionSheet,
    ...Album,
    ...Alert,
    ...Avatar,
    ...AvatarGroup,
    ...Backtop,
    ...Badge,
    ...Button,
    ...Calendar,
    ...CarKeyboard,
    ...Cell,
    ...CellGroup,
    ...Checkbox,
    ...CheckboxGroup,
    ...CircleProgress,
    ...Code,
    ...CodeInput,
    ...Col,
    ...Collapse,
    ...CollapseItem,
    ...ColumnNotice,
    ...CountDown,
    ...CountTo,
    ...DatetimePicker,
    ...Divider,
    ...Empty,
    ...Form,
    ...GormItem,
    ...Gap,
    ...Grid,
    ...GridItem,
    ...Icon,
    ...Image,
    ...IndexAnchor,
    ...IndexList,
    ...Input,
    ...Keyboard,
    ...Line,
    ...LineProgress,
    ...Link,
    ...List,
    ...ListItem,
    ...LoadingIcon,
    ...LoadingPage,
    ...Loadmore,
    ...Modal,
    ...Navbar,
    ...NoNetwork,
    ...NoticeBar,
    ...Notify,
    ...NumberBox,
    ...NumberKeyboard,
    ...Overlay,
    ...Parse,
    ...Picker,
    ...Popup,
    ...Radio,
    ...RadioGroup,
    ...Rate,
    ...ReadMore,
    ...Row,
    ...RowNotice,
    ...ScrollList,
    ...Search,
    ...Section,
    ...Skeleton,
    ...Slider,
    ...StatusBar,
    ...Steps,
    ...StepsItem,
    ...Sticky,
    ...Subsection,
    ...SwipeAction,
    ...SwipeActionItem,
    ...Swiper,
    ...SwipterIndicator,
    ...Switch,
    ...Tabbar,
    ...TabbarItem,
    ...Tabs,
    ...Tag,
    ...Text,
    ...Textarea,
    ...Toast,
    ...Toolbar,
    ...Tooltip,
    ...Transition,
    ...Upload
}
