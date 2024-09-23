import { roles } from "@/shared/constants";
import { Article, BackupTable, CalendarMonth, EventSeat, Home, Mail, NotStarted, SupportAgent, Archive, SvgIconComponent, TagFaces } from '@mui/icons-material';

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

interface NavigationOptions {
    list: SubList[];
    shortcuts: Shortcut[];
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
                    icon: Article,
                    name: 'Articles',
                    route: 'article'
                },
                {
                    icon: NotStarted,
                    name: 'Videos',
                    route: 'videos'
                },
                {
                    icon: EventSeat,
                    name: 'Workshops',
                    route: 'workshops'
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
                    icon: Article,
                    name: 'Articles',
                    route: 'article'
                },
                {
                    icon: NotStarted,
                    name: 'Videos',
                    route: 'videos'
                },
                {
                    icon: EventSeat,
                    name: 'Workshops',
                    route: 'workshops'
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
    ]
}


export const roleBasedNavigation: RoleBasedNavigation = {
    [roles.STUDENT]: studentNavigation,
    [roles.COUNSELOR]: counselorNavigation,
}
