import userSettings from "./userSettings";

const dataModelValues = {
  // Predicted values for next 12 months via custom DroughtWatch ML model
  droughtWatchPrediction: {
    d2_data: [16.507959, 10.725609, 6.642226, 5.546951, 4.947237, 4.956888, 5.467674, 8.441383, 6.377078, 8.597903, 11.699514],
  },

  // Predicted values for next 7 months via custom PrecipitationWatch ML model
  // TODO: these values should include water factors such as humidity levels
  waterNaturalSourcesPrediction: {
    data: [0.0904, 0.1053, 0.1104, 0.1044, 0.1304, 0.1091, 0.1326],
  },

  droughtHistoricalValues: {
    d0_data: [96.85, 98.51, 89.304, 57.945, 44.21, 21.35, 9.87, 11.8025, 64.71, 57.16, 93.055, 63.77],
    d1_data: [92.945, 92.175, 73.886, 30.88, 18.77, 2.696, 1.2225, 0.6, 40.554, 21.8825, 74.655, 18.87],
    d2_data: [79.185, 68.685, 50.348, 7.3825, 2.85, 0.0, 0.0, 0.0, 13.664, 3.415, 36.9775, 1.78],
  },

  // Sample values for crop health predictions based on environmental factors
  cropHealthPrediction: {
    data: [90, 91, 88, 62, 88, 81, 48, 74, 84, 86, 86, 98],
  },

  // Water consumption levels adjusted over crop lifecycle
  // These are calculated values based on the crops selected
  peakWaterConsumptionCalculated: 99,
  currentCycleWaterConsumption: [99, 95, 95, 95, 90, 88, 88],
};

export default dataModelValues;
