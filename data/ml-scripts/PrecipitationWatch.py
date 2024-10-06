import pandas as pd
from prophet import Prophet
import pickle

# Load the data
file_path = "../data-assets/precipitation_tn_2000_2024.csv"
data = pd.read_csv(file_path)

# Transform the dataset into a time series format
data_long = data.melt(id_vars=["Year"], var_name="Month", value_name="Precipitation")
data_long["Date"] = pd.to_datetime(data_long["Year"].astype(str) + "-" + data_long["Month"] + "-01")
data_long = data_long.sort_values("Date")

# Replace non-numeric values ('M') with NaN and remove them
data_long["Precipitation"] = pd.to_numeric(data_long["Precipitation"], errors='coerce')
prophet_data = data_long[["Date", "Precipitation"]].rename(columns={"Date": "ds", "Precipitation": "y"}).dropna()

# Initialize and fit the Prophet model
model = Prophet()
model.fit(prophet_data)

# Create a dataframe for future dates (November 2024 and next 6 months)
future_dates = model.make_future_dataframe(periods=7, freq='M', include_history=True)

# Make predictions
forecast = model.predict(future_dates)

# Filter only the forecasted values for the next 7 months
next_7_months = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(7)

# Save the forecasted values to a text file
with open("../data-assets/nashville_precipitation_forecast.txt", "w") as file:
    file.write("Date, Predicted Precipitation, Lower Bound, Upper Bound\n")
    for index, row in next_7_months.iterrows():
        file.write(f"{row['ds'].strftime('%Y-%m')}, {row['yhat'] * 0.0254:.4f}, {row['yhat_lower'] * 0.0254:.4f}, {row['yhat_upper'] * 0.0254:.4f}\n")

# Save the model using pickle
with open("../data-assets/nashville_precipitation_model.pkl", "wb") as model_file:
    pickle.dump(model, model_file)

print("Forecast saved to '../data-assets/nashville_precipitation_forecast.txt'")
print("Model saved as '../data-assets/nashville_precipitation_model.pkl'")
