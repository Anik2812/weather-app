document.addEventListener('DOMContentLoaded', (event) => {
    const globeContainer = document.getElementById('globe');
    const removeMarkerBtn = document.getElementById('remove-marker');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Initialize the globe
    const globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // More colorful globe image
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
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.pointOfView({ altitude: 2.5 });

    // Adjust globe size on window resize
    window.addEventListener('resize', () => {
        globe.width(globeContainer.offsetWidth);
        globe.height(globeContainer.offsetHeight);
    });

    async function getWeather(lat, lon) {
        const apiKey = 'Your_api_here';
        const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,weatherCode&timesteps=current&units=metric&apikey=${apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
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

    function updateWeatherInfo(data, locationName) {
        if (data && data.data && data.data.timelines && data.data.timelines[0].intervals) {
            const currentWeather = data.data.timelines[0].intervals[0].values;
            const temp = currentWeather.temperature;
            const weatherCode = currentWeather.weatherCode;

            gsap.to("#weather-info", {duration: 0.5, opacity: 0, onComplete: () => {
                document.getElementById('location').textContent = `Location: ${locationName}`;
                document.getElementById('temperature').textContent = `Temperature: ${temp}°C`;
                document.getElementById('description').textContent = `Description: ${getWeatherDescription(weatherCode)}`;
                document.getElementById('weather-icon').textContent = getWeatherIcon(weatherCode);
                gsap.to("#weather-info", {duration: 0.5, opacity: 1});
            }});

            // Update background color based on temperature
            let backgroundColor;
            if (temp < 0) backgroundColor = 'linear-gradient(to bottom, #1e3c72, #2a5298)';
            else if (temp < 10) backgroundColor = 'linear-gradient(to bottom, #2c3e50, #3498db)';
            else if (temp < 20) backgroundColor = 'linear-gradient(to bottom, #2980b9, #6dd5fa)';
            else if (temp < 30) backgroundColor = 'linear-gradient(to bottom, #ff7e5f, #feb47b)';
            else backgroundColor = 'linear-gradient(to bottom, #ff4e50, #f9d423)';
            
            gsap.to("#background", {duration: 1, background: backgroundColor});
        } else {
            console.error('Invalid weather data structure:', data);
        }
    }

    // Add a marker when clicking on the globe
    let marker = null;
    function addMarker(lat, lng) {
        if (marker) {
            globe.customLayerData([]);
        }
        
        marker = [{ lat, lng }];
        globe.customLayerData(marker)
            .customThreeObject(d => {
                const geometry = new THREE.SphereGeometry(0.5);
                const material = new THREE.MeshBasicMaterial({ color: 'red' });
                return new THREE.Mesh(geometry, material);
            })
            .customThreeObjectUpdate((obj, d) => {
                Object.assign(obj.position, globe.getCoords(d.lat, d.lng, 1.01));
            });

        removeMarkerBtn.style.display = 'block';
    }

    globe.onGlobeClick(async ({ lat, lng }) => {
        addMarker(lat, lng);
        const locationName = await getLocationName(lat, lng);
        const weatherData = await getWeather(lat, lng);
        if (weatherData) {
            updateWeatherInfo(weatherData, locationName);
        }
    });

    removeMarkerBtn.addEventListener('click', () => {
        globe.customLayerData([]);
        marker = null;
        removeMarkerBtn.style.display = 'none';
    });

    // Search functionality
    async function searchLocation(query) {
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=c55a115f1434458c8d869daa31888048`;
        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                const locationName = data.results[0].formatted;
                globe.pointOfView({ lat, lng, altitude: 2.5 }, 1000);
                addMarker(lat, lng);
                const weatherData = await getWeather(lat, lng);
                if (weatherData) {
                    updateWeatherInfo(weatherData, locationName);
                }
            } else {
                alert('Location not found');
            }
        } catch (error) {
            console.error('Error searching location:', error);
        }
    }

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchLocation(query);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchLocation(query);
            }
        }
    });

    async function getLocationName(lat, lng) {
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=c55a115f1434458c8d869daa31888048`;
        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].formatted;
            }
        } catch (error) {
            console.error('Error getting location name:', error);
        }
        return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
    }
});
