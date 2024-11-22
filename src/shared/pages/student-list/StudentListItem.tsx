import React from 'react';
import {
  Avatar,
  Typography,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItemButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import { EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import { Student } from '@shared/types';
import { useParams } from 'react-router-dom';
import { NavLinkAdapter } from '@/shared/components';

type StudentListItemPropsType = {
  student: Student;
};

/**
 * The student list item.
 */
function StudentListItem(props: StudentListItemPropsType) {
  const { student } = props;
  const { id } = useParams();
  console.log(student)

  // Separate and prioritize tags with `contained: true`
  const containedTags = student.behaviorTagList?.filter(tag => tag.contained).map(tag => ({ ...tag, color: 'success.main' })) || [];
  const otherTags = student.behaviorTagList?.filter(tag => !tag.contained) || [];

  // Combine contained and other tags, then slice to get the first 3 displayed tags and the rest as hidden
  const displayedTags = [...containedTags, ...otherTags].slice(0, 3);
  const hiddenTags = [...containedTags, ...otherTags].slice(3);

  // Group tags by category
  const groupedTags = student.behaviorTagList?.reduce((acc, tag) => {
    const { category, contained, problemTagName, number, source } = tag;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ problemTagName, number, source, contained });
    return acc;
  }, {} as { [category: string]: { problemTagName: string; number: number; source: string; contained: boolean }[] }) || [];

  // Render tags grouped by category
  const renderTagGroup = (category: string, tags: { problemTagName: string; number: number; source: string; contained: boolean }[]) => {
    const isHighlighted = tags.some(tag => tag.contained);

    return (
      <Box className="flex flex-col gap-4">
        <Typography variant="subtitle2" className={`font-semibold mt-8 ${isHighlighted ? 'text-text-primary' : 'text-text-disabled'}`}>
          {category}
        </Typography>
        <div className="flex flex-wrap">
          {tags.map(tag => (
            <Tooltip key={tag.problemTagName} title={tag.source || 'Unknown source'} arrow placement="top-start">
              <Chip
                label={`${tag.problemTagName} x ${tag.number}`}
                size="small"
                className="m-2"
                color={tag.contained ? 'success' : undefined}
              />
            </Tooltip>
          ))}
        </div>
      </Box>
    );
  };

  return (
    <>
      <ListItemButton
        selected={student?.id === Number(id)}
        className="p-8 flex gap-24 items-start px-24 py-16"
        sx={{ bgcolor: 'background.paper' }}
        component={NavLinkAdapter}
        to={`student/${student.profile.id}`}
      >
        <ListItemAvatar>
          <Avatar alt={student.profile.fullName} src={student.profile.avatarLink} className="size-80" />
        </ListItemAvatar>
        <Box className="flex flex-col gap-8 justify-between">
          <ListItemText
            classes={{ root: 'm-0', primary: 'font-semibold leading-5 truncate text-lg' }}
            primary={`${student.profile.fullName}`}
            secondary={student.studentCode}
          />
          <div className="flex items-center gap-16">
            <div className="flex items-center w-120">
              <LocalPhoneOutlined fontSize="small" />
              <div className="ml-8 text-text-secondary leading-6">{student.profile.phoneNumber}</div>
            </div>
            <div className="flex items-center">
              <EmailOutlined fontSize="small" />
              <div className="ml-8 text-text-secondary leading-6">{student.email}</div>
            </div>
          </div>
          <div className="flex items-center flex-wrap">
            {/* Only show tags grouped by category when hovered */}
            <Tooltip
              title={
                <div>
                  {Object.entries(groupedTags).map(([category, tags]) => renderTagGroup(category, tags))}
                </div>
              }
              arrow
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'white',
                    color: 'black',
                    border: '1px solid #ccc',
                    maxWidth: '100rem',
                  },
                },
              }}
            >
              <div className="flex flex-wrap">
                {/* Display displayedTags first */}
                {displayedTags.map(tag => (
                  <Tooltip key={tag.problemTagName} title={tag.source || 'Unknown source'} arrow placement="top-start">
                    <Chip
                      label={`${tag.problemTagName} x ${tag.number}`}
                      size="small"
                      className="m-2"
                      color={tag.contained ? 'success' : undefined}
                    />
                  </Tooltip>
                ))}
                {/* Show "+x" for the rest of the tags in the group */}
                {hiddenTags.length > 0 && <Chip label={`+${hiddenTags.length}`} size="small" className="m-2" />}
              </div>
            </Tooltip>
          </div>
        </Box>
      </ListItemButton>
      <Divider />
    </>
  );
}

export default StudentListItem;
