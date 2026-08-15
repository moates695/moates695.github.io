import Box from '@mui/material/Box';
import { Link as RouterLink, useLocation } from 'react-router';
import { MONO } from '../styles/tokens';

export const breadcrumbNameMap: { [key: string]: string } = {
  '/woodchuck': 'Woodchuck',
  '/woodchuck/design': 'Design',
  '/woodchuck/changes': 'Changes',
  '/woodchuck/privacy': 'Privacy Policy',
  '/woodchuck/roadmap': 'Roadmap',
  '/woodchuck/releases': 'Releases',
  '/poppycock': 'Poppycock',
  '/poppycock/design': 'Design',
  '/poppycock/changes': 'Changes',
  '/poppycock/privacy': 'Privacy Policy',
  '/poppycock/roadmap': 'Roadmap',
  '/poppycock/releases': 'Releases',
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
  '/other/mcp-server': 'Marcus MCP Server',
  '/other/trading-strategies': 'Trading Strategies',
  '/other/authenticator': 'Authenticator',
  '/other/event-picker': 'Event Picker',
  '/small-projects': 'Small Projects',
  '/about': 'Resume',
  '/projects': 'Projects',
  '/contact': 'Contact',
  '/stats': 'Site Stats',
};

/** Label of the final breadcrumb crumb for a path (the current page's name). */
export function lastCrumbLabel(pathname: string): string {
  const pathnames = pathname.split('/').filter((x) => x);
  if (pathnames.length === 0) return 'home';
  const to = `/${pathnames.join('/')}`;
  return breadcrumbNameMap[to] ?? pathnames[pathnames.length - 1];
}

// A navigation trail, deliberately styled apart from the `// LABEL` section
// eyebrows: natural label case + tight tracking + no leading `//`, so a path
// (Home / Woodchuck / Changes) never reads like a section marker (// FEATURES).
const crumbSx = {
  fontFamily: MONO,
  fontSize: 12,
  letterSpacing: '0.02em',
  lineHeight: 1.6,
};

// Every project detail page lives under the Projects page in the trail, so a
// user can always step back to the full project list. The URL roots stay flat
// (/woodchuck, /gym-junkie, /other/mcp-server) for stable external links; only
// the breadcrumb inserts the Projects crumb. `/other/*` pages fold straight into
// Projects (the bare "Other Projects" crumb is dropped) since /other redirects
// to /projects anyway.
const PROJECT_ROOTS = new Set(['woodchuck', 'poppycock', 'gym-junkie', 'small-projects']);

export default function PageLinks() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const crumb = (index: number) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    return { label: breadcrumbNameMap[to] ?? pathnames[index], to };
  };

  const crumbs = [{ label: 'Home', to: '/' }];
  const first = pathnames[0];
  if (first === 'other') {
    // Fold /other/* into Projects, skipping the "Other Projects" crumb itself.
    crumbs.push({ label: 'Projects', to: '/projects' });
    for (let i = 1; i < pathnames.length; i++) crumbs.push(crumb(i));
  } else {
    if (PROJECT_ROOTS.has(first)) crumbs.push({ label: 'Projects', to: '/projects' });
    for (let i = 0; i < pathnames.length; i++) crumbs.push(crumb(i));
  }

  return (
    <Box
      component="nav"
      aria-label="breadcrumb"
      sx={{
        ...crumbSx,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        columnGap: 0.75,
        maxWidth: '100%',
        overflowX: 'auto',
        // keep the trail on one line without pushing the page wider
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {crumbs.map((crumb, index) => {
        const last = index === crumbs.length - 1;
        return (
          <Box key={crumb.to} sx={{ display: 'flex', alignItems: 'center', columnGap: 0.75, flexShrink: 0 }}>
            {last ? (
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {crumb.label}
              </Box>
            ) : (
              <Box
                component={RouterLink}
                to={crumb.to}
                sx={{
                  ...crumbSx,
                  color: 'text.disabled',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {crumb.label}
              </Box>
            )}
            {!last && (
              <Box component="span" sx={{ color: 'text.disabled' }}>
                /
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
