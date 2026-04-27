import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link, { LinkProps } from '@mui/material/Link';
import { ListItemProps } from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
  useLocation,
} from 'react-router';

interface ListItemLinkProps extends ListItemProps {
  to: string;
  open?: boolean;
}

const breadcrumbNameMap: { [key: string]: string } = {
  '/finska': 'Finska',
  '/finska/design': 'Design',
  '/finska/changes': 'Changes',
  '/finska/privacy': 'Privacy Policy',
  '/finska/roadmap': 'Roadmap',
  '/finska/releases': 'Releases',
  '/gym-junkie': 'Gym Junkie',
  '/gym-junkie/details': 'Details',
  '/gym-junkie/details/workout-logging': 'Workout Logging',
  '/gym-junkie/details/exercise-library': 'Exercise Library',
  '/gym-junkie/details/rest-timer-heart-rate': 'Rest Timer & Heart Rate',
  '/gym-junkie/details/muscle-targets': 'Muscle Targets',
  '/gym-junkie/details/muscle-heatmap': 'Muscle Heatmap',
  '/gym-junkie/details/exercise-stats': 'Exercise Stats',
  '/gym-junkie/details/distributions': 'Distributions',
  '/gym-junkie/details/history-calendar': 'History & Calendar',
  '/gym-junkie/details/friends': 'Friends & Leaderboards',
  '/gym-junkie/details/strava': 'Strava Sharing',
  '/gym-junkie/changes': 'Changes',
  '/gym-junkie/privacy': 'Privacy Policy',
  '/gym-junkie/delete-me': 'Delete Account',
  '/gym-junkie/data-export': 'Data Export',
  '/gym-junkie/roadmap': 'Roadmap',
  '/gym-junkie/releases': 'Releases',
  '/other': 'Other Projects',
  '/other/downer-helper': 'Downer Helper',
  '/other/cellular-tracking': 'Cellular Tracking',
  '/other/postgres-deploy': 'Postgres Deploy',
  '/about': 'About',
  '/contact': 'Contact'
};

function ListItemLink(props: ListItemLinkProps) {
  const { to, open, ...other } = props;
  const primary = breadcrumbNameMap[to];

  let icon = null;
  if (open != null) {
    icon = open ? <ExpandLess /> : <ExpandMore />;
  }

  return (
    <li>
      <ListItemButton component={RouterLink as any} to={to} {...other}>
        <ListItemText primary={primary} />
        {icon}
      </ListItemButton>
    </li>
  );
}

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
  return <Link {...props} component={RouterLink as any} />;
}

export default function PageLinks() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/">
        Home
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography key={to} sx={{ color: 'text.primary' }}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="inherit" to={to} key={to}>
            {breadcrumbNameMap[to]}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
}