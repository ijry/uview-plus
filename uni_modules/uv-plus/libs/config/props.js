/**
 * 此文件的作用为统一配置所有组件的props参数
 * 借此用户可以全局覆盖组件的props默认值
 * 无需在每个引入组件的页面中都配置一次
 */
import config from './config.js'

import ActionSheet from '../../components/up-action-sheet/actionSheet.js'
import Album from '../../components/up-album/album.js'
import Alert from '../../components/up-alert/alert.js'
import Avatar from '../../components/up-avatar/avatar.js'
import AvatarGroup from '../../components/up-avatar-group/avatarGroup.js'
import Backtop from '../../components/up-back-top/backtop.js'
import Badge from '../../components/up-badge/badge.js'
import Button from '../../components/up-button/button.js'
import Calendar from '../../components/up-calendar/calendar.js'
import CarKeyboard from '../../components/up-car-keyboard/carKeyboard.js'
import Cell from '../../components/up-cell/cell.js'
import CellGroup from '../../components/up-cell-group/cellGroup.js'
import Checkbox from '../../components/up-checkbox/checkbox.js'
import CheckboxGroup from '../../components/up-checkbox-group/checkboxGroup.js'
import CircleProgress from '../../components/up-circle-progress/circleProgress.js'
import Code from '../../components/up-code/code.js'
import CodeInput from '../../components/up-code-input/codeInput.js'
import Col from '../../components/up-col/col.js'
import Collapse from '../../components/up-collapse/collapse.js'
import CollapseItem from '../../components/up-collapse-item/collapseItem.js'
import ColumnNotice from '../../components/up-column-notice/columnNotice.js'
import CountDown from '../../components/up-count-down/countDown.js'
import CountTo from '../../components/up-count-to/countTo.js'
import DatetimePicker from '../../components/up-datetime-picker/datetimePicker.js'
import Divider from '../../components/up-divider/divider.js'
import Empty from '../../components/up-empty/empty.js'
import Form from '../../components/up-form/form.js'
import GormItem from '../../components/up-form-item/formItem.js'
import Gap from '../../components/up-gap/gap.js'
import Grid from '../../components/up-grid/grid.js'
import GridItem from '../../components/up-grid-item/gridItem.js'
import Icon from '../../components/up-icon/icon.js'
import Image from '../../components/up-image/image.js'
import IndexAnchor from '../../components/up-index-anchor/indexAnchor.js'
import IndexList from '../../components/up-index-list/indexList.js'
import Input from '../../components/up-input/input.js'
import Keyboard from '../../components/up-keyboard/keyboard.js'
import Line from '../../components/up-line/line.js'
import LineProgress from '../../components/up-line-progress/lineProgress.js'
import Link from '../../components/up-link/link.js'
import List from '../../components/up-list/list.js'
import ListItem from '../../components/up-list-item/listItem.js'
import LoadingIcon from '../../components/up-loading-icon/loadingIcon.js'
import LoadingPage from '../../components/up-loading-page/loadingPage.js'
import Loadmore from '../../components/up-loadmore/loadmore.js'
import Modal from '../../components/up-modal/modal.js'
import Navbar from '../../components/up-navbar/navbar.js'
import NoNetwork from '../../components/up-no-network/noNetwork.js'
import NoticeBar from '../../components/up-notice-bar/noticeBar.js'
import Notify from '../../components/up-notify/notify.js'
import NumberBox from '../../components/up-number-box/numberBox.js'
import NumberKeyboard from '../../components/up-number-keyboard/numberKeyboard.js'
import Overlay from '../../components/up-overlay/overlay.js'
import Parse from '../../components/up-parse/parse.js'
import Picker from '../../components/up-picker/picker.js'
import Popup from '../../components/up-popup/popup.js'
import Radio from '../../components/up-radio/radio.js'
import RadioGroup from '../../components/up-radio-group/radioGroup.js'
import Rate from '../../components/up-rate/rate.js'
import ReadMore from '../../components/up-read-more/readMore.js'
import Row from '../../components/up-row/row.js'
import RowNotice from '../../components/up-row-notice/rowNotice.js'
import ScrollList from '../../components/up-scroll-list/scrollList.js'
import Search from '../../components/up-search/search.js'
import Section from '../../components/up-section/section.js'
import Skeleton from '../../components/up-skeleton/skeleton.js'
import Slider from '../../components/up-slider/slider.js'
import StatusBar from '../../components/up-status-bar/statusBar.js'
import Steps from '../../components/up-steps/steps.js'
import StepsItem from '../../components/up-steps-item/stepsItem.js'
import Sticky from '../../components/up-sticky/sticky.js'
import Subsection from '../../components/up-subsection/subsection.js'
import SwipeAction from '../../components/up-swipe-action/swipeAction.js'
import SwipeActionItem from '../../components/up-swipe-action-item/swipeActionItem.js'
import Swiper from '../../components/up-swiper/swiper.js'
import SwipterIndicator from '../../components/up-swiper-indicator/swipterIndicator.js'
import Switch from '../../components/up-switch/switch.js'
import Tabbar from '../../components/up-tabbar/tabbar.js'
import TabbarItem from '../../components/up-tabbar-item/tabbarItem.js'
import Tabs from '../../components/up-tabs/tabs.js'
import Tag from '../../components/up-tag/tag.js'
import Text from '../../components/up-text/text.js'
import Textarea from '../../components/up-textarea/textarea.js'
import Toast from '../../components/up-toast/toast.js'
import Toolbar from '../../components/up-toolbar/toolbar.js'
import Tooltip from '../../components/up-tooltip/tooltip.js'
import Transition from '../../components/up-transition/transition.js'
import Upload from '../../components/up-upload/upload.js'

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
