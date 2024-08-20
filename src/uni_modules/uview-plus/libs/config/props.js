/**
 * 此文件的作用为统一配置所有组件的props参数
 * 借此用户可以全局覆盖组件的props默认值
 * 无需在每个引入组件的页面中都配置一次
 */
import config from './config'

import ActionSheet from '../../components/up-action-sheet/actionSheet'
import Album from '../../components/up-album/album'
import Alert from '../../components/up-alert/alert'
import Avatar from '../../components/up-avatar/avatar'
import AvatarGroup from '../../components/up-avatar-group/avatarGroup'
import Backtop from '../../components/up-back-top/backtop'
import Badge from '../../components/up-badge/badge'
import Button from '../../components/up-button/button'
import Calendar from '../../components/up-calendar/calendar'
import CarKeyboard from '../../components/up-car-keyboard/carKeyboard'
import Cell from '../../components/up-cell/cell'
import CellGroup from '../../components/up-cell-group/cellGroup'
import Checkbox from '../../components/up-checkbox/checkbox'
import CheckboxGroup from '../../components/up-checkbox-group/checkboxGroup'
import CircleProgress from '../../components/up-circle-progress/circleProgress'
import Code from '../../components/up-code/code'
import CodeInput from '../../components/up-code-input/codeInput'
import Col from '../../components/up-col/col'
import Collapse from '../../components/up-collapse/collapse'
import CollapseItem from '../../components/up-collapse-item/collapseItem'
import ColumnNotice from '../../components/up-column-notice/columnNotice'
import CountDown from '../../components/up-count-down/countDown'
import CountTo from '../../components/up-count-to/countTo'
import DatetimePicker from '../../components/up-datetime-picker/datetimePicker'
import Divider from '../../components/up-divider/divider'
import Empty from '../../components/up-empty/empty'
import Form from '../../components/up-form/form'
import GormItem from '../../components/up-form-item/formItem'
import Gap from '../../components/up-gap/gap'
import Grid from '../../components/up-grid/grid'
import GridItem from '../../components/up-grid-item/gridItem'
import Icon from '../../components/up-icon/icon'
import Image from '../../components/up-image/image'
import IndexAnchor from '../../components/up-index-anchor/indexAnchor'
import IndexList from '../../components/up-index-list/indexList'
import Input from '../../components/up-input/input'
import Keyboard from '../../components/up-keyboard/keyboard'
import Line from '../../components/up-line/line'
import LineProgress from '../../components/up-line-progress/lineProgress'
import Link from '../../components/up-link/link'
import List from '../../components/up-list/list'
import ListItem from '../../components/up-list-item/listItem'
import LoadingIcon from '../../components/up-loading-icon/loadingIcon'
import LoadingPage from '../../components/up-loading-page/loadingPage'
import Loadmore from '../../components/up-loadmore/loadmore'
import Modal from '../../components/up-modal/modal'
import Navbar from '../../components/up-navbar/navbar'
import NoNetwork from '../../components/up-no-network/noNetwork'
import NoticeBar from '../../components/up-notice-bar/noticeBar'
import Notify from '../../components/up-notify/notify'
import NumberBox from '../../components/up-number-box/numberBox'
import NumberKeyboard from '../../components/up-number-keyboard/numberKeyboard'
import Overlay from '../../components/up-overlay/overlay'
import Parse from '../../components/up-parse/parse'
import Picker from '../../components/up-picker/picker'
import Popup from '../../components/up-popup/popup'
import Radio from '../../components/up-radio/radio'
import RadioGroup from '../../components/up-radio-group/radioGroup'
import Rate from '../../components/up-rate/rate'
import ReadMore from '../../components/up-read-more/readMore'
import Row from '../../components/up-row/row'
import RowNotice from '../../components/up-row-notice/rowNotice'
import ScrollList from '../../components/up-scroll-list/scrollList'
import Search from '../../components/up-search/search'
import Section from '../../components/up-section/section'
import Skeleton from '../../components/up-skeleton/skeleton'
import Slider from '../../components/up-slider/slider'
import StatusBar from '../../components/up-status-bar/statusBar'
import Steps from '../../components/up-steps/steps'
import StepsItem from '../../components/up-steps-item/stepsItem'
import Sticky from '../../components/up-sticky/sticky'
import Subsection from '../../components/up-subsection/subsection'
import SwipeAction from '../../components/up-swipe-action/swipeAction'
import SwipeActionItem from '../../components/up-swipe-action-item/swipeActionItem'
import Swiper from '../../components/up-swiper/swiper'
import SwipterIndicator from '../../components/up-swiper-indicator/swipterIndicator'
import Switch from '../../components/up-switch/switch'
import Tabbar from '../../components/up-tabbar/tabbar'
import TabbarItem from '../../components/up-tabbar-item/tabbarItem'
import Tabs from '../../components/up-tabs/tabs'
import Tag from '../../components/up-tag/tag'
import Text from '../../components/up-text/text'
import Textarea from '../../components/up-textarea/textarea'
import Toast from '../../components/up-toast/toast'
import Toolbar from '../../components/up-toolbar/toolbar'
import Tooltip from '../../components/up-tooltip/tooltip'
import Transition from '../../components/up-transition/transition'
import Upload from '../../components/up-upload/upload'

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
