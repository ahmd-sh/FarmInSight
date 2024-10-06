import pandas as pd
from prophet import Prophet
import pickle

file_path = "../data-assets/dm_export_20141006_20241006.csv"
data = pd.read_csv(file_path)

# Convert MapDate to datetime and extract year-month
data["MapDate"] = pd.to_datetime(data["MapDate"], format="%Y%m%d")
data["YearMonth"] = data["MapDate"].dt.to_period("M").dt.to_timestamp()

# Aggregate data to get monthly averages for D0, D1, and D2
monthly_data = data.groupby("YearMonth")[["D0", "D1", "D2"]].mean().reset_index()


# Function to create and train a Prophet model, save it, and return predictions
def forecast_and_save_model(
    df, drought_column, months=12, start_date="2024-11-01", model_name=None
):
    # Prepare data for Prophet
    df_prophet = df[["YearMonth", drought_column]].rename(
        columns={"YearMonth": "ds", drought_column: "y"}
    )

    # Create and train the model
    model = Prophet()
    model.fit(df_prophet)

    # Save the model to a file
    if model_name:
        with open(f"../data-assets/{model_name}.pkl", "wb") as file:
            pickle.dump(model, file)

    # Create future dataframe for predictions
    future = model.make_future_dataframe(periods=months, freq="M")

    # Generate forecast
    forecast = model.predict(future)

    # Filter forecasted values for the next 12 months starting from the desired start date
    forecast_filtered = forecast[(forecast["ds"] >= start_date)][["ds", "yhat"]].rename(
        columns={"ds": "Date", "yhat": drought_column}
    )

    return forecast_filtered


# Forecast for each drought level and save models
d0_forecast = forecast_and_save_model(monthly_data, "D0", model_name="d0_model")
d1_forecast = forecast_and_save_model(monthly_data, "D1", model_name="d1_model")
d2_forecast = forecast_and_save_model(monthly_data, "D2", model_name="d2_model")

# Merge forecasts into a single dataframe for columnar format
full_forecast = pd.merge(d0_forecast, d1_forecast, on="Date")
full_forecast = pd.merge(full_forecast, d2_forecast, on="Date")

# Save the combined forecast to a single CSV file
full_forecast.to_csv("drought_forecast_next_12_months.csv", index=False)

# Display the combined forecast for inspection
print("Combined Forecast for Next 12 Months:")
print(full_forecast)
