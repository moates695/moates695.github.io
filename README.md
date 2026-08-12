# moates695.github.io

A page for my projects, visit it [here](https://moates.com.au).

## Environment

Both defaults point at production, so a plain `npm start` talks to the live
services and no `.env` is needed to work on the site.

| Variable | Default | Purpose |
| --- | --- | --- |
| `REACT_APP_CHAT_API_BASE` | `https://chat.moates.com.au` | "Ask about Marcus" chat backend |
| `REACT_APP_ARB_API_BASE` | `https://arb.moates.com.au` | Arbitrage live feed |
| `REACT_APP_STATS_API_BASE` | `https://stats.moates.com.au` | Analytics collector |
| `REACT_APP_STATS_DEV` | unset | Set to `1` to collect analytics from localhost |

## Analytics

GitHub Pages has no server logs, so `src/middleware/analytics.ts` beacons page
views and clicks to the collector (`moates_stats` in the `moates_mcp` repo). It
is designed to fail silently and can never affect the page: see the header
comment in that file, and the tests alongside it.

Links to other hosts are recorded automatically. To record a click on anything
else, add a `data-track` attribute:

```tsx
<Button data-track="featured-cta:/gym-junkie">Explore Gym Junkie</Button>
```

Collection is skipped on localhost (unless `REACT_APP_STATS_DEV=1`) and when the
browser sends Do Not Track. No raw IP addresses are stored; the collector keeps
a salted daily hash and the visitor's city, and nothing that identifies a person.
