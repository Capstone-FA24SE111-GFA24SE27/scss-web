import { roles } from "@/shared/constants";
import { Article, CalendarMonth, EventSeat, Home, Mail, NotStarted, SupportAgent, Archive, SvgIconComponent, TagFaces, Campaign, QuestionAnswer, Assignment, Forum, Class, SupervisedUserCircle, AccountBox, EmojiPeople, Event, LocalOffer, Face, Groups2, PeopleAlt } from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';

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
                    icon: CalendarMonth,
                    name: 'Calendar',
                    route: 'calendar',
                },
                {
                    icon: Article,
                    name: 'Appointments',
                    route: 'activity'
                },
                {
                    icon: QuestionAnswer,
                    name: 'Q&A',
                    route: 'qna',
                },

            ]
        },
        // {
        //     name: 'Resources',
        //     description: 'Resources for students',
        //     route: 'resources',
        //     items: [
        //         {
        //             icon: Campaign,
        //             name: 'Events',
        //             route: 'events'
        //         },
        //         {
        //             icon: Article,
        //             name: 'Articles',
        //             route: 'article'
        //         },
        //         {
        //             icon: NotStarted,
        //             name: 'Videos',
        //             route: 'videos'
        //         },

        //     ]
        // }
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
            name: "Q&A",
            description: "Questions and answer",
            route: 'qna',
            items: [
                {
                    icon: Assignment,
                    name: 'Question Board',
                    route: 'question-board'
                },
                {
                    icon: Class,
                    name: 'My Q&A',
                    route: 'my-qna'
                },
                {
                    icon: Forum,
                    name: 'Conversations',
                    route: 'conversations'
                },
            ]
        },
        {
            name: "Students",
            description: "Student documents",
            route: 'students',
            items: [
                {
                    icon: Groups2,
                    name: 'Student List',
                    route: 'student-list'
                },
                {
                    icon: PeopleAlt,
                    name: 'My Students',
                    route: 'my-students'
                },
            ]
        },
        // {
        //     name: 'Resources',
        //     description: 'Resources for students & couselors',
        //     route: 'resources',
        //     items: [
        //         {
        //             icon: EventSeat,
        //             name: 'Workshops',
        //             route: 'workshops'
        //         },
        //         {
        //             icon: Article,
        //             name: 'Articles',
        //             route: 'article'
        //         },
        //         {
        //             icon: NotStarted,
        //             name: 'Videos',
        //             route: 'videos'
        //         },
        //     ]
        // }
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

const managerNavigation: NavigationOptions = {
    list: [
        {
            name: "Dashboard",
            description: "Data visualization & analytics",
            route: 'management',
            items: [
                {
                    icon: Archive,
                    name: 'Home',
                    route: 'home'
                },
                {
                    icon: TagFaces,
                    name: 'Analytics',
                    route: 'analytics'
                },
            ]
        },
        {
            name: "Management",
            description: "Manage counselors and students",
            route: 'management',
            items: [
                {
                    icon: SupportAgent,
                    name: 'Counselors',
                    route: 'counselors'
                },
                {
                    icon: Face,
                    name: 'Students',
                    route: 'students'
                },
            ]
        },
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

const adminNavigation: NavigationOptions = {
    list: [
        {
            name: "Accounts",
            description: "Manage users' accounts",
            route: 'accounts',
            items: [
                {
                    icon: SupervisedUserCircle,
                    name: 'Manager',
                    route: 'managers'
                },
                {
                    icon: AccountBox,
                    name: 'Counselor',
                    route: 'counselors'
                },
                {
                    icon: EmojiPeople,
                    name: 'Support Staff',
                    route: 'staffs'
                },
                {
                    icon: BadgeIcon,
                    name: 'Student',
                    route: 'students'
                },
            ]
        },
        {
            name: "Resources",
            description: "Manage system's resources",
            route: 'resources',
            items: [
                {
                    icon: Event,
                    name: 'Holiday',
                    route: 'holidays'
                },
                {
                    icon: LocalOffer,
                    name: 'Problem Tag',
                    route: 'tags'
                },
                
            ]
        },
    ],
    shortcuts: [
       
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

const supportStaffNavigation: NavigationOptions = {
    list: [
        {
            name: "Q&A",
            description: "Questions and answer",
            route: 'qna',
            items: [
                {
                    icon: QuestionAnswer,
                    name: 'Q&A',
                    route: '',
                },
            ]
        },
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
    [roles.ACADEMIC_COUNSELOR]: counselorNavigation,
    [roles.NON_ACADEMIC_COUNSELOR]: counselorNavigation,
    [roles.MANAGER]: managerNavigation,
    [roles.ADMIN]: adminNavigation,
    [roles.SUPPORT_STAFF]: supportStaffNavigation,

}
