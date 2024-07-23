# 🌍 GlobeWeather: Interactive Weather Experience

GlobeWeather is an immersive web application that combines a 3D globe with real-time weather data, offering users a unique and interactive way to explore weather conditions around the world.

## ✨ Features

- **Interactive 3D Globe**: Click anywhere on the globe to get weather information.
- **Real-time Weather Data**: Fetches current weather conditions using the Tomorrow.io API.
- **Location Search**: Find and zoom to any location on Earth.
- **Dynamic Weather Icons**: Visual representation of weather conditions.
- **Responsive Design**: Adapts to various screen sizes for optimal viewing.
- **Atmospheric Effects**: Beautiful globe rendering with atmosphere and auto-rotation.
- **Temperature-based Backgrounds**: Background color changes based on temperature.

## 🚀 Quick Start

1. Clone the repository:
   ```bash
     git clone https://github.com/Anik2812/weather-app.git
   ```
2. Open `index.html` in your web browser.

## 🛠 Technologies Used

- HTML5, CSS3, JavaScript
- Three.js for 3D rendering
- Globe.gl for globe visualization
- GSAP for smooth animations
- Tomorrow.io API for weather data
- OpenCage Geocoding API for location search

## 📊 API Usage

- **Tomorrow.io**: Used for fetching weather data. You'll need to sign up for an API key.
- **OpenCage Geocoding**: Used for location search and reverse geocoding. Sign up for an API key.

Replace the API keys in `script.js` with your own:

```javascript
const apiKey = 'YOUR_TOMORROW_IO_API_KEY';
const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=YOUR_OPENCAGE_API_KEY`;
```


## 🎨 Customization

* Modify styles.css to change the look and feel.
* Adjust globe properties in script.js for different visual effects.
* Add more weather data points by expanding the Tomorrow.io API call.


## 📷 Screenshots

![Screenshot 2024-07-08 233939](https://github.com/user-attachments/assets/1e923776-35ee-4a66-89d8-42d92ad8fae2)

![Screenshot 2024-07-08 233909](https://github.com/user-attachments/assets/27da054a-e8f0-4462-bab1-04b5e3bd2475)



## 🙏 Acknowledgements

* Three.js
* Globe.gl
* Tomorrow.io
* OpenCage Geocoding
* Font Awesome


---
<div align="center">
  Made by Anik
</div>
