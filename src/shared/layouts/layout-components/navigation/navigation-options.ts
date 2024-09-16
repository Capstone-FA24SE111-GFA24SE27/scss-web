import { roles } from "@/shared/constants";
import { Article, BackupTable, CalendarMonth, EventSeat, Home, Mail, NotStarted, SupportAgent, SvgIconComponent } from '@mui/icons-material';

export const navigationOptions: RoleBasedNavigation = {
    [roles.STUDENT]: {
        list: [
            {
                icon: Home,
                name: 'Home',
            },
            {
                icon: SupportAgent,
                name: 'Counselors',
            },
            {
                icon: BackupTable,
                name: 'Resources',
                nestedItems: [
                    { icon: Article, name: 'Articles' },
                    { icon: NotStarted, name: 'Videos' },
                    { icon: EventSeat, name: 'Workshops' },
                ]
            },
            {
                icon: CalendarMonth,
                name: 'Calendar',
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
        ]
    }
}


interface NestedItem {
    icon: SvgIconComponent;
    name: string;
}

// Define a type for the menu items
interface MenuItem {
    icon: SvgIconComponent;
    name: string;
    nestedItems?: NestedItem[]; // Optional nested items
}

// Define a type for the shortcuts
interface Shortcut {
    icon: SvgIconComponent;
    name: string;
}

// Define a type for the role-specific navigation options
interface NavigationOptions {
    list: MenuItem[];
    shortcuts: Shortcut[];
}

// Define a type for the roles object
interface RoleBasedNavigation {
    [key: string]: NavigationOptions; // This allows any string to be used as a role key
}