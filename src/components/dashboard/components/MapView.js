import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { Link } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function MapView() {
  const theme = useTheme();

  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1));
  };

  // Calculate the date and time for one day ago as the latest day is not available
  const oneDayAgo = dayjs().subtract(1, 'day').utc().format('YYYY-MM-DDTHH:mm:ss[Z]');

  // Construct the dynamic URL with the updated TIME parameter
  // Ideally, we can embed the map in the web app instead of a snapshot, but waiting on
  // NASA WorldView to approve our request for embedding it
  const imageUrl = `https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&TIME=${oneDayAgo}&BBOX=32.2525,-93.0701,37.7923,-79.9083&CRS=EPSG:4326&LAYERS=BlueMarble_NextGeneration,IMERG_Precipitation_Rate,Coastlines_15m,Reference_Features_15m,Reference_Labels_15m&WRAP=x,none,x,x,x&FORMAT=image/jpeg&WIDTH=1498&HEIGHT=630&ts=${Date.now()}`;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Precipitation in North America
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Link href="https://worldview.earthdata.nasa.gov/" sx={{ color: 'text.secondary' }} target="_blank" rel="noopener noreferrer">
            Courtesy of NASA WorldView
          </Link>
        </Stack>
        <Box sx={{ position: 'relative', overflow: 'hidden', mt: 2 }}>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <IconButton
              size="small"
              onClick={handleZoomIn}
              aria-label="zoom in"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                marginBottom: 1,
              }}
            >
              <Add fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleZoomOut}
              aria-label="zoom out"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.7)',
              }}
            >
              <Remove fontSize="small" />
            </IconButton>
          </Box>
          <Link href="https://worldview.earthdata.nasa.gov/?v=-89.62272800861004,33.99372515187752,-84.1390141499997,37.099399044057925&ics=true&ici=1&icd=5&l=Reference_Labels_15m,Reference_Features_15m,Coastlines_15m,IMERG_Precipitation_Rate,BlueMarble_NextGeneration,Land_Water_Map&lg=true&s=-86.712,35.927&t=2024-10-05-T20%3A10%3A47Z" target="_blank" rel="noopener noreferrer" underline="none">
            <Box
              component="img"
              src={imageUrl}
              alt="Precipitation Map"
              sx={{
                width: '100%',
                height: 'auto',
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease',
              }}
            />
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
