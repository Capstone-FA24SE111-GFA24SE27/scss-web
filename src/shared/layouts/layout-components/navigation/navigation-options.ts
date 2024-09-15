import { roles } from "@/shared/constants"
import { CalendarMonth, Drafts, Inbox, Mail, StarBorder, SupportAgent, BackupTable, Article, NotStarted, EventSeat, Home} from '@mui/icons-material';

export const navigationOptions = {
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

type NavigationOption = {

}