import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const getWeather = (city) => {
    return axios.get(
        'https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: api_key,
                units: 'metric',
            },
        })
        .then(resp => {
            const data = resp.data
            return {
                temperature: data.main.temp,
                wind: data.wind.speed,
                icon: data.weather[0].icon
            }
        })
}

export default { getWeather }
