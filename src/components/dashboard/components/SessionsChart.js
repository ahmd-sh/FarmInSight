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

const WEATHER_API_URL = `https://api.meteomatics.com/${getLast12MonthsRange()}/precip_1h:mm/${userSettings.locationLat},${userSettings.locationLong}/json`;

// Helper function to get the range of the last 12 months
function getLast12MonthsRange() {
  const today = new Date();
  const end = today.toISOString().split('T')[0]; // Current date in YYYY-MM-DD
  const past = new Date(today.setMonth(today.getMonth() - 12)).toISOString().split('T')[0];
  return `${past}T00:00:00Z--${end}T00:00:00Z:P1M`;
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

function getMonthsInYear() {
  const months = [];
  const date = new Date();
  date.setMonth(date.getMonth() - 11);
  for (let i = 0; i < 12; i++) {
    const monthName = date.toLocaleDateString('en-US', {
      month: 'short',
      timeZone: 'UTC', // Ensures consistent month names regardless of locale
    });
    months.push(monthName);
    date.setMonth(date.getMonth() + 1);
  }
  return months;
}

export default function SessionsChart() {
  const theme = useTheme();
  const [rainfallData, setRainfallData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const months = getMonthsInYear();

  React.useEffect(() => {
    fetch(WEATHER_API_URL, {
      headers: {
        Authorization: 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_METEOMATICS_USERNAME}:${process.env.NEXT_PUBLIC_METEOMATICS_PASSWORD}`),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let precipitationData = data.data[0].coordinates[0].dates.map(date => date.value);

        // Ensure the data is only the last 12 months (slice if necessary)
        if (precipitationData.length > 12) {
          precipitationData = precipitationData.slice(-12);
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
              {rainfallData.length ? `${Math.round(rainfallData[rainfallData.length - 1])} mm` : 'N/A'}
            </Typography>
            <Chip size="small" color="success" label="+3% MoM" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Rainfall per month for the last year
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
              data: months,
              tickInterval: (index, i) => (i + 1) % 1 === 0, // Show every month
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
              data: rainfallData.length === 12 ? rainfallData : Array(12).fill(0), // Fallback to zeros if no data
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
    </Card>
  );
}
