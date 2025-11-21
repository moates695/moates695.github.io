import { Box, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';

export default function OtherAll() {
  const links = [
    {
      label: 'Cellular Tracking',
      href: '/other/cellular-tracking'
    },
    {
      label: 'Downer Helper',
      href: '/other/downer-helper'
    },
    {
      label: 'Postgres Deploy',
      href: '/other/postgres-deploy'
    }
  ];

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: '10px',
      }}
    >
      <PageLinks />
      <Typography variant="h5">
        Other Projects
      </Typography>
      <Typography>
        Click through to see some of my other coding projects.
      </Typography>

      <List>
        {links.map((link) => (
          <ListItem key={link.href} style={{ display: 'list-item' }}>
            <Link 
              href={link.href} 
            >
              {link.label}
            </Link>
          </ListItem>
        ))}
      </List>

      {BottomNavigation({
        right:  {
          text: 'Cellular Tracking',
          link: '/other/cellular-tracking'
        }
      })}
    </Box>
  )
}