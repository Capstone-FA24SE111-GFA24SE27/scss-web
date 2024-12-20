import { roles } from "@/shared/constants";
import { Article, CalendarMonth, EventSeat, Home, Mail, NotStarted, SupportAgent, Archive, SvgIconComponent, TagFaces, Campaign, QuestionAnswer, Assignment, Forum, Class, SupervisedUserCircle, AccountBox, EmojiPeople, Event, LocalOffer, Face, Groups2, PeopleAlt, Settings, AssignmentLate, Description, Schedule, Monitor, Plagiarism, Inventory, Quiz, Dashboard, Analytics, TableChart, ViewList } from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import { Actor } from "@/shared/components";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BookmarkIcon from '@mui/icons-material/Bookmark';

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
    route?: string;
}

interface UserMenu {
    icon?: SvgIconComponent;
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
                    icon: SupportAgent,
                    name: 'Counseling',
                    route: 'counseling'
                },
                {
                    icon: QuestionAnswer,
                    name: 'Question & Answer',
                    route: 'qna',
                },
                // {
                //     icon: CalendarMonth,
                //     name: 'Schedule',
                //     route: 'calendar',
                // },
                // {
                //     icon: Article,
                //     name: 'Appointments',
                //     route: 'activity'
                // },
            ]
        },
        {
            name: "Activities",
            description: "Student schedule and history tracking",
            route: 'services',
            items: [
                {
                    icon: CalendarMonth,
                    name: 'Schedule',
                    route: 'calendar',
                },
                {
                    icon: Article,
                    name: 'Appointments',
                    route: 'activity'
                },


            ]
        },
    ],
    shortcuts: [
        {
            icon: Home,
            name: 'Home',
            route: ''
        },
        {
            icon: CalendarMonth,
            name: 'Schedule',
            route: 'services/calendar',
        },
        {
            icon: Forum,
            name: 'Messages',
            route: 'services/qna/conversations',
        },
    ],
    userMenu: [
        {
            icon: AccountBox,
            name: 'Profile',
            route: 'profile'
        },
        // {
        //     icon: Settings,
        //     name: 'Activity',
        //     route: 'activity'
        // },
        {
            icon: Settings,
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
                    icon: Description,
                    name: 'Appointments',
                    route: 'appointments'
                },
                {
                    icon: CalendarMonth,
                    name: 'Schedule',
                    route: 'calendar',
                },
            ]
        },
        {
            name: "Questions and Answers",
            description: "Questions and answers",
            route: 'qna',
            items: [
                {
                    icon: Class,
                    name: 'Asked Questions',
                    route: 'my-qna'
                },
                {
                    icon: Assignment,
                    name: 'FAQs',
                    route: 'faq'
                },
                {
                    icon: Quiz,
                    name: 'Public Q&As',
                    route: 'public-qna'
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
                    icon: PeopleAlt,
                    name: 'Student List',
                    route: 'student-list'
                },
                {
                    icon: AssignmentLate,
                    name: 'Student Demands',
                    route: 'student-demands'
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
            icon: Home,
            name: 'Home',
            route: ''
        },
        {
            icon: CalendarMonth,
            name: 'Schedule',
            route: 'counseling/calendar',
        },
    ],
    userMenu: [
        {
            icon: AccountBox,
            name: 'Profile',
            route: 'profile'
        },
        // {
        //     icon: Settings,
        //     name: 'Activity',
        //     route: 'activity'
        // },
        {
            icon: Settings,
            name: 'Settings',
            route: 'settings'
        },
    ]
}

const managerNavigation: NavigationOptions = {
    list: [
        {
            name: "Overall",
            description: "Data visualization & analytics",
            route: 'overall',
            items: [
                {
                    icon: Dashboard,
                    name: 'Dashboard',
                    route: 'dashboard'
                },
                // {
                //     icon: Description,
                //     name: 'Analytics',
                //     route: 'analytics'
                // },
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
                    route: 'counselors',
                    children: [
                        {
                            icon: Analytics,
                            name: 'Overview',
                            route: 'overview',
                        },
                        {
                            icon: ViewList,
                            name: 'Counselors Table',
                            route: 'table',
                        }

                    ]
                },
                {
                    icon: Face,
                    name: 'Students',
                    route: 'students',
                    children: [
                        {
                            icon: Analytics,
                            name: 'Overview',
                            route: 'overview',
                        },
                        {
                            icon: ViewList,
                            name: 'Students Table',
                            route: 'table',
                        }

                    ]
                },
                {
                    icon: EmojiPeople,
                    name: 'Support Staffs',
                    route: 'support-staffs',
                    children: [
                        {
                            icon: Analytics,
                            name: 'Overview',
                            route: 'overview',
                        },
                        {
                            icon: ViewList,
                            name: 'Support Staffs Table',
                            route: 'table',
                        }

                    ]
                },
            ]
        },
    ],
    shortcuts: [
        // {
        //     icon: CalendarMonth,
        //     name: 'Schedule',
        // },
        // {
        //     icon: Mail,
        //     name: 'Mail',
        // },
    ],
    userMenu: [
        {
            icon: AccountBox,
            name: 'Profile',
            route: 'profile'
        },
        {
            icon: Settings,
            name: 'Settings',
            route: 'settings'
        },
    ]
}

const adminNavigation: NavigationOptions = {
    list: [
        {
            name: "Overall",
            description: "Data visualization & analytics",
            route: '',
            items: [
                {
                    icon: Dashboard,
                    name: 'Dashboard',
                    route: 'dashboard'
                },
                {
                    icon: Analytics,
                    name: 'Overview',
                    route: 'overview',
                },
            ]
        },
        {
            name: "Accounts",
            description: "Manage users' accounts",
            route: 'accounts',
            items: [
                {
                    icon: AccountCircleIcon,
                    name: 'Accounts List',
                    route: 'table'
                },
                {
                    icon: PersonAddIcon,
                    name: 'Create Account',
                    route: 'create'
                },

            ]
        },
        // {
        //     name: "Management",
        //     description: "Manage profiles",
        //     route: 'profiles',
        //     items: [
        //         // {
        //         //     icon: SupervisedUserCircle,
        //         //     name: 'Manager',
        //         //     route: 'managers'
        //         // },
        //         {
        //             icon: AccountBox,
        //             name: 'Counselor',
        //             route: 'counselors'
        //         },
        //         // {
        //         //     icon: EmojiPeople,
        //         //     name: 'Support Staff',
        //         //     route: 'staffs'
        //         // },
        //         {
        //             icon: BadgeIcon,
        //             name: 'Student',
        //             route: 'students'
        //         },
        //     ]
        // },
        {
            name: "Resources",
            description: "Manage system's resources",
            route: 'resources',
            items: [
                // {
                //     icon: Event,
                //     name: 'Holiday',
                //     route: 'holidays'
                // },
                {
                    icon: LocalOffer,
                    name: 'Problem Tag',
                    route: 'tags'
                },
                {
                    icon: Schedule,
                    name: 'Counseling Time Slots',
                    route: 'slots'
                },
            ]
        },
    ],
    shortcuts: [

    ],
    userMenu: [
        {
            icon: AccountBox,
            name: 'Profile',
            route: 'profile'
        },
        {
            icon: Settings,
            name: 'Settings',
            route: 'settings'
        },
    ]
}

const supportStaffNavigation: NavigationOptions = {
    list: [
        // {
        //     name: "Questions",
        //     description: "Manage Q&A",
        //     route: '',
        //     items: [
        //         {
        //             icon: QuestionAnswer,
        //             name: 'Question List',
        //             route: 'questions',
        //         },
        //     ]
        // },
        {
            name: "Demand",
            description: "Manage demands",
            route: '',
            items: [
                {
                    icon: BookmarkIcon,
                    name: 'Followed Students',
                    route: 'students/followed',
                },
                {
                    icon: FmdBadIcon,
                    name: 'Demand',
                    route: 'demand',
                },
            ]
        },
        {
            name: "Student",
            description: "Find students",
            route: 'students',
            items: [
                {
                    icon: PeopleAlt,
                    name: 'Students List',
                    route: 'list'
                },
                {
                    icon: FmdBadIcon,
                    name: 'Recommended Students',
                    route: 'recommended',
                },


            ]
        },
    ],
    shortcuts: [
        // {
        //     icon: CalendarMonth,
        //     name: 'Calendar',
        // },
        // {
        //     icon: Mail,
        //     name: 'Mail',
        // },
    ],
    userMenu: [
        {
            icon: AccountBox,
            name: 'Profile',
            route: 'profile'
        },
        {
            icon: Settings,
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
