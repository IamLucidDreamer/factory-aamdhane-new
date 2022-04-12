import {
  DashboardOutlined,
  UserOutlined,
  BuildOutlined,
  MessageOutlined,
  PicRightOutlined,
  SettingOutlined,
  LogoutOutlined,
  SwitcherOutlined,
  BellOutlined,
} from '@ant-design/icons';

export const SidebarData = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: DashboardOutlined,
    link: '/',
  },

  {
    key: 'factory',
    title: 'Factory Page',
    icon: BuildOutlined,
    link: '/factory',
    // isPermissionBased: true,
  },
  {
    key: 'jobPosts',
    title: 'Job Posts ',
    icon: SwitcherOutlined,
    link: '/jobs',
    // isPermissionBased: true,
  },
  {
    key: 'jobApplications',
    title: 'Manage Applications',
    icon: PicRightOutlined,
    link: '/approval',
    // isPermissionBased: true,
  },
  {
    key: 'labor',
    title: 'Workers',
    icon: UserOutlined,
    link: '/labor',
    // isPermissionBased: true,
  },

  {
    key: 'complaints',
    title: 'Complaints',
    icon: BellOutlined,
    link: '/complaints',
    // isPermissionBased: true,
  },

  {
    key: 'support',
    title: 'Settings',
    icon: SettingOutlined,
    link: '/support',
  },
  {
    key: 'support',
    title: 'Support',
    icon: MessageOutlined,
    link: '/support',
  },

  {
    key: 'logout',
    title: 'Logout',
    icon: LogoutOutlined,
    link: '/logout',
  },
];
