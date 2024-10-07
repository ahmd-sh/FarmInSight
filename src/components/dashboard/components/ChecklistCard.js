import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function ChecklistCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Example checklist items (you can modify these as per your requirements)
  const [checkedItems, setCheckedItems] = React.useState({
    item1: false,
    item2: false,
    item3: false,
  });

  // Handle checkbox toggle
  const handleToggle = (item) => {
    setCheckedItems({ ...checkedItems, [item]: !checkedItems[item] });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <AssignmentIcon />
        <Typography variant="h6" gutterBottom>
          Thunderstorm Preparedness
        </Typography>
        {/* Checklist items */}
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.item1}
              onChange={() => handleToggle('item1')}
            />
          }
          label="Gather tractors to rain shed"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.item2}
              onChange={() => handleToggle('item2')}
            />
          }
          label="Seal silo reserve doors"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.item3}
              onChange={() => handleToggle('item3')}
            />
          }
          label="Buckle heavy equipment"
        />
      </CardContent>
    </Card>
  );
}
