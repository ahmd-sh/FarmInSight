import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import dataModelValues from '@/config/dataModelValues';
import { Link } from '@mui/material';
import userSettings from '@/config/userSettings';

export default function PageViewsBarChart() {
  const theme = useTheme();

  const waterPredicted = dataModelValues.waterNaturalSourcesPrediction.data.map(val => val * userSettings.farmlandArea / 10);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Monthly water consumption levels
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {(dataModelValues.currentCycleWaterConsumption[0] - waterPredicted[0]).toFixed(2)} Kiloliters Needed This Month
            </Typography>
            <Chip size="small" color="error" label="-8% MoM" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Water required relative to predicted rainwater
          </Typography>
          <Link href="https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDE_06/summary?keywords=%22IMERG%20Early%22" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary' }}>
            Courtesy of NASA IMERG
          </Link>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={[theme.palette.primary.light, theme.palette.grey[700]]}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
            },
          ]}
          series={[
            {
              id: 'water-supply-natural-sources',
              label: 'Rainwater (Predicted)',
              data: waterPredicted,
              stack: 'A',
            },
            {
              id: 'water-needed',
              label: 'Additional Water Needed',
              data: dataModelValues.currentCycleWaterConsumption.map((value, index) => value - waterPredicted[index]),
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: false,
              labelStyle: {
                fontSize: 12,
              }
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
