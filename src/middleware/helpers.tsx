import { List, ListItem, ListItemIcon, Typography } from "@mui/material";
import { JSX } from "react";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const buildBulletPoints = (points: string[]): JSX.Element => {
  return (
    <List dense sx={{ mt: -1, width: '100%', overflow: 'hidden' }}>
      {points.map((text) => (
        <ListItem key={text} sx={{ py: 0, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <ListItemIcon sx={{ minWidth: 24, mt: 0.75 }}>
            <FiberManualRecordIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <Typography sx={{ wordBreak: 'break-word' }}>
            {text}
          </Typography>
        </ListItem>
      ))}
    </List>
  )
};