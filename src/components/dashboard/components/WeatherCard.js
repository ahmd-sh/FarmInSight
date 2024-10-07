import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import userSettings from '@/config/userSettings';

const WEATHER_API_URL = `https://api.meteomatics.com/now/t_2m:C,wind_speed_10m:ms,weather_symbol_1h:idx/${userSettings.locationLat},${userSettings.locationLong}/json`;

export default function WeatherCard() {
  const [weatherData, setWeatherData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Fetch weather data from the Meteomatics API
    fetch(WEATHER_API_URL, {
      headers: {
        Authorization: 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_METEOMATICS_USERNAME}:${process.env.NEXT_PUBLIC_METEOMATICS_PASSWORD}`),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const temperature = data.data.find(item => item.parameter === "t_2m:C")?.coordinates[0]?.dates[0]?.value;
        const windspeed = data.data.find(item => item.parameter === "wind_speed_10m:ms")?.coordinates[0]?.dates[0]?.value;
        const weatherSymbol = data.data.find(item => item.parameter === "weather_symbol_1h:idx")?.coordinates[0]?.dates[0]?.value;

        setWeatherData({
          temperature,
          windspeed: windspeed * 3.6, // Convert m/s to km/h
          weatherSymbol,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
            Loading weather...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined" sx={{ height: '100%', backgroundColor: 'azure' }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
            Error loading weather data.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <CloudIcon />
        <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
          Weather in Nashville, TN
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          {weatherData.weatherSymbol === 1 ? "Clear Sky" : "Cloudy"}
        </Typography>
        <Typography variant="h5" sx={{ mb: '8px' }}>
          {Math.round(weatherData.temperature)}°C
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          Wind Speed: {Math.round(weatherData.windspeed)} km/h
        </Typography>
        <Typography sx={{ color: 'text.warning' }}>
          Thunderstorm likely in 6 days.
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          Review your checklists through the Lists section on the left pane.
        </Typography>
      </CardContent>
    </Card>
  );
}
