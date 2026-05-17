import { Box, Button, Link, Typography } from "@mui/material";
import ShopIcon from "@mui/icons-material/Shop";
import PageLinks from "../../components/PageLinks";
import { woodchuckPlayStoreLink } from "../../middleware/links";
import { buildBulletPoints } from "../../middleware/helpers";
import BottomNavigation from "../../components/BottomNavigation";

export default function WoodchuckOverview() {
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
        Overview
      </Typography>
      <Typography>
        When the sun is out and the weather is good, <Link href="https://en.wikipedia.org/wiki/M%C3%B6lkky" target="_blank" rel="noopener">Finska</Link> (a.k.a. Mölkky) is the game of choice for my family to play.
      </Typography>
      <Typography>
        Throw the log, knock over the numbered pins, land on exactly 50. Easy game - awkward to score once the included cards run out and the notes app takes over.
      </Typography>
      <Typography>
        So I built Woodchuck: a download-and-go mobile scorer for Finska.
      </Typography>
      {buildBulletPoints([
        'On-device only - no sign in, no backend, no tracking',
        'Players or teams, with rotating member throws',
        'Tap the pins you knocked over instead of counting yourself',
        'Tweak target score, reset score, miss limit and more in settings',
        'Light, dark and sand themes',
        'Auto-saves after every throw so you can pick up where you left off',
      ])}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 4 },
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/woodchuck/setup.png"
            alt="setup screen"
            sx={{ width: { xs: 140, sm: 200 }, maxWidth: '42vw', height: 'auto' }}
          />
          <Typography>
            Setup Screen
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/woodchuck/game.png"
            alt="game screen"
            sx={{ width: { xs: 140, sm: 200 }, maxWidth: '42vw', height: 'auto' }}
          />
          <Typography>
            Play Screen
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/woodchuck/settings.png"
            alt="settings screen"
            sx={{ width: { xs: 140, sm: 200 }, maxWidth: '42vw', height: 'auto' }}
          />
          <Typography>
            Settings Screen
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Button
            variant="contained"
            href={woodchuckPlayStoreLink}
            target="_blank"
            rel="noopener"
            startIcon={
              <ShopIcon
                sx={{
                  width: 32,
                  height: 32,
                  marginRight: '10px'
                }}
              />
            }
          >
            Play Store
          </Button>
        </Box>
      </Box>
      {BottomNavigation({
        right: {
          text: 'Design',
          link: '/woodchuck/design'
        }
      })}
    </Box>
  )
}
