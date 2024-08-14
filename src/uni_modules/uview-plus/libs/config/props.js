/**
 * 此文件的作用为统一配置所有组件的props参数
 * 借此用户可以全局覆盖组件的props默认值
 * 无需在每个引入组件的页面中都配置一次
 */
import config from './config'

import ActionSheet from '../../components/u-action-sheet/actionSheet'
import Album from '../../components/u-album/album'
import Alert from '../../components/u-alert/alert'
import Avatar from '../../components/u-avatar/avatar'
import AvatarGroup from '../../components/u-avatar-group/avatarGroup'
import Backtop from '../../components/u-back-top/backtop'
import Badge from '../../components/u-badge/badge'
import Button from '../../components/u-button/button'
import Calendar from '../../components/u-calendar/calendar'
import CarKeyboard from '../../components/u-car-keyboard/carKeyboard'
import Cell from '../../components/u-cell/cell'
import CellGroup from '../../components/u-cell-group/cellGroup'
import Checkbox from '../../components/u-checkbox/checkbox'
import CheckboxGroup from '../../components/u-checkbox-group/checkboxGroup'
import CircleProgress from '../../components/u-circle-progress/circleProgress'
import Code from '../../components/u-code/code'
import CodeInput from '../../components/u-code-input/codeInput'
import Col from '../../components/u-col/col'
import Collapse from '../../components/u-collapse/collapse'
import CollapseItem from '../../components/u-collapse-item/collapseItem'
import ColumnNotice from '../../components/u-column-notice/columnNotice'
import CountDown from '../../components/u-count-down/countDown'
import CountTo from '../../components/u-count-to/countTo'
import DatetimePicker from '../../components/u-datetime-picker/datetimePicker'
import Divider from '../../components/u-divider/divider'
import Empty from '../../components/u-empty/empty'
import Form from '../../components/u-form/form'
import GormItem from '../../components/u-form-item/formItem'
import Gap from '../../components/u-gap/gap'
import Grid from '../../components/u-grid/grid'
import GridItem from '../../components/u-grid-item/gridItem'
import Icon from '../../components/u-icon/icon'
import Image from '../../components/u-image/image'
import IndexAnchor from '../../components/u-index-anchor/indexAnchor'
import IndexList from '../../components/u-index-list/indexList'
import Input from '../../components/u-input/input'
import Keyboard from '../../components/u-keyboard/keyboard'
import Line from '../../components/u-line/line'
import LineProgress from '../../components/u-line-progress/lineProgress'
import Link from '../../components/u-link/link'
import List from '../../components/u-list/list'
import ListItem from '../../components/u-list-item/listItem'
import LoadingIcon from '../../components/u-loading-icon/loadingIcon'
import LoadingPage from '../../components/u-loading-page/loadingPage'
import Loadmore from '../../components/u-loadmore/loadmore'
import Modal from '../../components/u-modal/modal'
import Navbar from '../../components/u-navbar/navbar'
import NoNetwork from '../../components/u-no-network/noNetwork'
import NoticeBar from '../../components/u-notice-bar/noticeBar'
import Notify from '../../components/u-notify/notify'
import NumberBox from '../../components/u-number-box/numberBox'
import NumberKeyboard from '../../components/u-number-keyboard/numberKeyboard'
import Overlay from '../../components/u-overlay/overlay'
import Parse from '../../components/u-parse/parse'
import Picker from '../../components/u-picker/picker'
import Popup from '../../components/u-popup/popup'
import Radio from '../../components/u-radio/radio'
import RadioGroup from '../../components/u-radio-group/radioGroup'
import Rate from '../../components/u-rate/rate'
import ReadMore from '../../components/u-read-more/readMore'
import Row from '../../components/u-row/row'
import RowNotice from '../../components/u-row-notice/rowNotice'
import ScrollList from '../../components/u-scroll-list/scrollList'
import Search from '../../components/u-search/search'
import Section from '../../components/u-section/section'
import Skeleton from '../../components/u-skeleton/skeleton'
import Slider from '../../components/u-slider/slider'
import StatusBar from '../../components/u-status-bar/statusBar'
import Steps from '../../components/u-steps/steps'
import StepsItem from '../../components/u-steps-item/stepsItem'
import Sticky from '../../components/u-sticky/sticky'
import Subsection from '../../components/u-subsection/subsection'
import SwipeAction from '../../components/u-swipe-action/swipeAction'
import SwipeActionItem from '../../components/u-swipe-action-item/swipeActionItem'
import Swiper from '../../components/u-swiper/swiper'
import SwipterIndicator from '../../components/u-swiper-indicator/swipterIndicator'
import Switch from '../../components/u-switch/switch'
import Tabbar from '../../components/u-tabbar/tabbar'
import TabbarItem from '../../components/u-tabbar-item/tabbarItem'
import Tabs from '../../components/u-tabs/tabs'
import Tag from '../../components/u-tag/tag'
import Text from '../../components/u-text/text'
import Textarea from '../../components/u-textarea/textarea'
import Toast from '../../components/u-toast/toast'
import Toolbar from '../../components/u-toolbar/toolbar'
import Tooltip from '../../components/u-tooltip/tooltip'
import Transition from '../../components/u-transition/transition'
import Upload from '../../components/u-upload/upload'

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
