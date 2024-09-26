import { roles } from "@/shared/constants";
import { Article, BackupTable, CalendarMonth, EventSeat, Home, Mail, NotStarted, SupportAgent, Archive, SvgIconComponent, TagFaces, Campaign } from '@mui/icons-material';

interface SubList {
    name: string,
    description: string,
    route: string,
    items: MenuItem[]
}

interface MenuItem {
    icon: SvgIconComponent;
    name: string;
    route: string;
    children?: MenuItem[]; // Optional nested items
}

interface Shortcut {
    icon: SvgIconComponent;
    name: string;
}

interface UserMenu {
    name: string;
    route: string;
}
interface NavigationOptions {
    list: SubList[];
    shortcuts: Shortcut[];
    userMenu: UserMenu[];
}

interface RoleBasedNavigation {
    [key: string]: NavigationOptions; // This allows any string to be used as a role key
}

const studentNavigation: NavigationOptions = {
    list: [
        {
            name: "Services",
            description: "Counseling and supporting services",
            route: 'services',
            items: [
                {
                    icon: Home,
                    name: 'Home',
                    route: 'home'
                },
                {
                    icon: SupportAgent,
                    name: 'Counseling',
                    route: 'counseling'
                },
                {
                    icon: Article,
                    name: 'Activity',
                    route: 'activity'
                },
                {
                    icon: CalendarMonth,
                    name: 'Calendar',
                    route: 'calendar',
                },
            ]
        },
        {
            name: 'Resources',
            description: 'Resources for students',
            route: 'resources',
            items: [
                {
                    icon: Campaign,
                    name: 'Events',
                    route: 'events'
                },
                {
                    icon: Article,
                    name: 'Articles',
                    route: 'article'
                },
                {
                    icon: NotStarted,
                    name: 'Videos',
                    route: 'videos'
                },

            ]
        }
    ],
    shortcuts: [
        {
            icon: CalendarMonth,
            name: 'Calendar',
        },
        {
            icon: Mail,
            name: 'Mail',
        },
    ],
    userMenu: [
        {
            name: 'Profile',
            route: 'profile'
        },
        {
            name: 'Activity',
            route: 'activity'
        },
        {
            name: 'Settings',
            route: 'settings'
        },
    ]
}

const counselorNavigation: NavigationOptions = {
    list: [
        {
            name: "Counseling",
            description: "Counseling service",
            route: 'counseling',
            items: [
                {
                    icon: Archive,
                    name: 'Requests',
                    route: 'requests'
                },
                {
                    icon: TagFaces,
                    name: 'Appointments',
                    route: 'appointments'
                },
                {
                    icon: CalendarMonth,
                    name: 'Calendar',
                    route: 'calendar',
                },
            ]
        },
        {
            name: 'Resources',
            description: 'Resources for students & couselors',
            route: 'resources',
            items: [
                {
                    icon: EventSeat,
                    name: 'Workshops',
                    route: 'workshops'
                },
                {
                    icon: Article,
                    name: 'Articles',
                    route: 'article'
                },
                {
                    icon: NotStarted,
                    name: 'Videos',
                    route: 'videos'
                },
            ]
        }
    ],
    shortcuts: [
        {
            icon: CalendarMonth,
            name: 'Calendar',
        },
        {
            icon: Mail,
            name: 'Mail',
        },
    ],
    userMenu: [
        {
            name: 'Profile',
            route: 'profile'
        },
        {
            name: 'Settings',
            route: 'settings'
        },
    ]
}


export const roleBasedNavigation: RoleBasedNavigation = {
    [roles.STUDENT]: studentNavigation,
    [roles.COUNSELOR]: counselorNavigation,
}
