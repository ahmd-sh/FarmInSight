import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { orange, red, yellow } from '@mui/material/colors';
import dataModelValues from '@/config/dataModelValues';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function getMonthsInYear() {
  const months = [];
  const date = new Date();
  date.setMonth(date.getMonth() - 11); // Start 12 months ago
  for (let i = 0; i < 12; i++) {
    const monthName = date.toLocaleDateString('en-US', {
      month: 'short',
      timeZone: 'UTC', // Ensures consistent month names regardless of locale
    });
    months.push(monthName);
    date.setMonth(date.getMonth() + 1); // Move to the next month
  }
  return months;
}

export default function DroughtHistorical() {
  const data = getMonthsInYear(); // Use months instead of days

  const colorPalette = [yellow[500], orange[500], red[500]];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Drought Historical
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          ></Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Droughts over the last 12 months
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}  // Updated color palette
          xAxis={[
            {
              scaleType: 'point',
              data,
              tickInterval: (index, i) => (i + 1) % 1 === 0, // Show every month
            },
          ]}
          series={[
            {
              id: 'd0',
              label: 'D0 (Abnormally Dry)',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: dataModelValues.droughtHistoricalValues.d0_data,
            },
            {
              id: 'd1',
              label: 'D1 (Moderate Drought)',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: dataModelValues.droughtHistoricalValues.d1_data,
            },
            {
              id: 'd2',
              label: 'D2 (Severe Drought)',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: dataModelValues.droughtHistoricalValues.d2_data,
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-d2': {
              fill: "url('#d2')",
            },
            '& .MuiAreaElement-series-d1': {
              fill: "url('#d1')",
            },
            '& .MuiAreaElement-series-d0': {
              fill: "url('#d0')",
            },
          }}
          slotProps={{
            legend: {
              hidden: false,
              labelStyle: {
                fontSize: 12,
              },
            },
          }}
        >
          <AreaGradient color={red[500]} id="d2" />     {/* Updated to red */}
          <AreaGradient color={orange[500]} id="d1" />  {/* Updated to orange */}
          <AreaGradient color={yellow[500]} id="d0" />  {/* Updated to yellow */}
        </LineChart>
      </CardContent>
    </Card>
  );
}
