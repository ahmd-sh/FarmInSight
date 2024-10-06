import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { Link } from '@mui/material';
import userSettings from '@/config/userSettings';

const WEATHER_API_URL = `https://api.meteomatics.com/${getLastMonthRange()}/precip_24h:mm/${userSettings.locationLat},${userSettings.locationLong}/json`;

// Helper function to get the date range for the last month
function getLastMonthRange() {
  const today = new Date();
  const end = today.toISOString().split('T')[0]; // Current date in YYYY-MM-DD
  const start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0]; // Date one month ago
  return `${start}T00:00:00Z--${end}T00:00:00Z:P1D`; // Return range with daily intervals (P1D)
}

// Helper function to get an array of days in the last month
function getDaysInMonth() {
  const days = [];
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get last day of previous month
  const totalDays = lastMonth.getDate();

  for (let i = 1; i <= totalDays; i++) {
    days.push(i.toString());
  }

  return days;
}

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

export default function SessionsChart() {
  const theme = useTheme();
  const [rainfallData, setRainfallData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const daysInMonth = getDaysInMonth(); // Now showing days instead of months

  React.useEffect(() => {
    fetch(WEATHER_API_URL, {
      headers: {
        Authorization: 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_METEOMATICS_USERNAME}:${process.env.NEXT_PUBLIC_METEOMATICS_PASSWORD}`),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let precipitationData = data.data[0].coordinates[0].dates.map(date => date.value);

        // Ensure the data is only for the last month (slice if necessary)
        if (precipitationData.length > daysInMonth.length) {
          precipitationData = precipitationData.slice(-daysInMonth.length);
        }

        setRainfallData(precipitationData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Rainfall
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
              {rainfallData.length ? `${Math.round(rainfallData.reduce((total, value) => total + value, 0))} mm` : 'N/A'}
            </Typography>
          <Chip size="small" color="success" label="+3% MoM" />
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Total rainfall for the last month
        </Typography>
        <Link href="https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDE_06/summary?keywords=%22IMERG%20Early%22" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary' }}>
          Courtesy of NASA IMERG
        </Link>
      </Stack>
      <LineChart
        colors={colorPalette}
        xAxis={[
          {
            scaleType: 'point',
            data: daysInMonth,
            tickInterval: (index, i) => (i + 1) % 1 === 0,
          },
        ]}
        series={[
          {
            id: 'rainfall-mm',
            label: 'Rainfall (mm)',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: rainfallData.length === daysInMonth.length ? rainfallData : Array(daysInMonth.length).fill(0),
          },
        ]}
        height={250}
        margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
        grid={{ horizontal: true }}
        sx={{
          '& .MuiAreaElement-series-rainfall-mm': {
            fill: "url('#rainfall-mm')",
          },
        }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      >
        <AreaGradient color={theme.palette.primary.light} id="rainfall-mm" />
      </LineChart>
    </CardContent>
    </Card >
  );
}
