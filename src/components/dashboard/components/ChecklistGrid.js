import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChecklistCard from './ChecklistCard';

export default function ChecklistGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 6 }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Your Lists
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <ChecklistCard />
        </Grid>
      </Grid>
    </Box>
  );
}
