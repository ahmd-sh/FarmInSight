import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import WeatherCard from './WeatherCard';
import MapView from './MapView';
import DroughtHistorical from '@/components/dashboard/components/DroughtHistorical';
import userSettings from '@/config/userSettings';
import dataModelValues from '@/config/dataModelValues';

const data = [
  {
    title: 'DroughtWatch Risk Prediction',
    value: 'D2 (Severe Drought)',
    interval: 'Next 12 months',
    trend: 'down',
    data: dataModelValues.droughtWatchPrediction.d2_data,
  },
  {
    title: 'Crop Expected Health',
    value: '95%',
    interval: '(Future Work) Based on precipitation, soil moisture, and humidity data',
    trend: 'up',
    data: dataModelValues.cropHealthPrediction.data,
  },
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h1" variant="h3" sx={{ mb: 4, mt: 2 }}>
        Showing Data For: <u>{userSettings.locationString}</u>
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <WeatherCard />
        </Grid>
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <DroughtHistorical />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <MapView />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
