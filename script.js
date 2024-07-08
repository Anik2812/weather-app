document.addEventListener('DOMContentLoaded', (event) => {
    const globeContainer = document.getElementById('globe');

    // Initialize the globe
    const globe = Globe({
        waitForGlobeReady: true,
        animateIn: true
    })
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .showAtmosphere(true)
    .atmosphereColor('lightskyblue')
    .atmosphereAltitude(0.25);

    // Set initial size
    globe.width(globeContainer.offsetWidth);
    globe.height(globeContainer.offsetHeight);

    // Render the globe
    globe(globeContainer);

    // Add auto-rotation after the globe is ready
    globe.onGlobeReady(() => {
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.5;
        globe.pointOfView({ altitude: 4 }, 5000);
    });

    // Adjust globe size on window resize
    window.addEventListener('resize', () => {
        globe.width(globeContainer.offsetWidth);
        globe.height(globeContainer.offsetHeight);
    });

    async function getWeather(lat, lon) {
        const apiKey = 'S8TjFek3N2Hl2sxk7jdsarUZQMj2NLyx';
        const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,weatherCode&timesteps=current&units=metric&apikey=${apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    function getWeatherDescription(weatherCode) {
        const weatherCodes = {
            0: "Unknown",
            1000: "Clear, Sunny",
            1100: "Mostly Clear",
            1101: "Partly Cloudy",
            1102: "Mostly Cloudy",
            1001: "Cloudy",
            2000: "Fog",
            2100: "Light Fog",
            4000: "Drizzle",
            4001: "Rain",
            4200: "Light Rain",
            4201: "Heavy Rain",
            5000: "Snow",
            5001: "Flurries",
            5100: "Light Snow",
            5101: "Heavy Snow",
            6000: "Freezing Drizzle",
            6001: "Freezing Rain",
            6200: "Light Freezing Rain",
            6201: "Heavy Freezing Rain",
            7000: "Ice Pellets",
            7101: "Heavy Ice Pellets",
            7102: "Light Ice Pellets",
            8000: "Thunderstorm"
        };
        return weatherCodes[weatherCode] || "Unknown";
    }

    function getWeatherIcon(weatherCode) {
        const iconMap = {
            1000: '☀️', 1100: '🌤️', 1101: '⛅', 1102: '🌥️', 1001: '☁️',
            2000: '🌫️', 2100: '🌫️', 4000: '🌧️', 4001: '🌧️', 4200: '🌦️',
            4201: '🌧️', 5000: '🌨️', 5001: '🌨️', 5100: '🌨️', 5101: '🌨️',
            6000: '🌨️', 6001: '🌨️', 6200: '🌨️', 6201: '🌨️', 7000: '🌨️',
            7101: '🌨️', 7102: '🌨️', 8000: '⛈️'
        };
        return iconMap[weatherCode] || '❓';
    }

    function updateWeatherInfo(data, lat, lon) {
        const currentWeather = data.data.timelines[0].intervals[0].values;
        const temp = currentWeather.temperature;
        const weatherCode = currentWeather.weatherCode;

        document.getElementById('location').textContent = `Location: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        document.getElementById('temperature').textContent = `Temperature: ${temp}°C`;
        document.getElementById('description').textContent = `Description: ${getWeatherDescription(weatherCode)}`;
        document.getElementById('weather-icon').textContent = getWeatherIcon(weatherCode);

        // Update background color based on temperature
        let backgroundColor;
        if (temp < 0) backgroundColor = 'linear-gradient(to bottom, #1e3c72, #2a5298)';
        else if (temp < 10) backgroundColor = 'linear-gradient(to bottom, #2c3e50, #3498db)';
        else if (temp < 20) backgroundColor = 'linear-gradient(to bottom, #2980b9, #6dd5fa)';
        else if (temp < 30) backgroundColor = 'linear-gradient(to bottom, #ff7e5f, #feb47b)';
        else backgroundColor = 'linear-gradient(to bottom, #ff4e50, #f9d423)';
        
        document.getElementById('background').style.background = backgroundColor;
    }

    // Add a marker when clicking on the globe
    let marker = null;
    globe.onGlobeClick(async ({ lat, lng, x, y }) => {
        if (marker) globe.customLayerData([]);

        
        marker = globe.customLayerData([{ lat, lng }])
            .customThreeObject(d => new THREE.Mesh(
                new THREE.SphereGeometry(0.5),
                new THREE.MeshLambertMaterial({ color: 'red' })
            ))
            .customThreeObjectUpdate((obj, d) => {
                Object.assign(obj.position, globe.getCoords(d.lat, d.lng, 0.5));
            });

        const weatherData = await getWeather(lat, lng);
        if (weatherData) {
            updateWeatherInfo(weatherData, lat, lng);
        }
    });

    // Initial weather data (New York City coordinates)
    getWeather(40.7128, -74.0060).then(data => {
        if (data) {
            updateWeatherInfo(data, 40.7128, -74.0060);
        }
    });
});