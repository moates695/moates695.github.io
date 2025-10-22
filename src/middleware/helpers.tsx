import { List, ListItem, ListItemIcon, Typography } from "@mui/material";
import { JSX } from "react";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const buildBulletPoints = (points: string[]): JSX.Element => {
  return (
    <List dense sx={{ mt: -1 }}>
      {points.map((text) => (
        <ListItem key={text} sx={{ py: 0 }}>
          <ListItemIcon sx={{ minWidth: 24 }}>
            <FiberManualRecordIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <Typography>
            {text}
          </Typography>
        </ListItem>
      ))}
    </List>
  )
};