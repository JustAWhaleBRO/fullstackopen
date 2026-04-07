import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const RenderCountry = ({ country }) => {
    const [weather, setWeather] = useState(null)
    const capital = country.capital?.[0]

    useEffect(() => {
        setWeather(null)
        if (!capital) return

        weatherService
            .getWeather(capital)
            .then(setWeather)
            .catch(e => {
                console.error('Error fetching weather: ' + e)
            })        
    }, [capital])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>
                Capital {capital}<br/>
                Area {country.area}
            </p>
            <h2>Languages</h2>
            <ul>
                {Object.entries(country.languages).map(([code, name]) => (
                        <li key={code}>
                            {name}
                        </li>
                    ))}
            </ul>
            {<div>
                <img
                    src={country.flags.png}
                    width={200}
                />
            </div>
            }
            <h2>Weather in {capital}</h2>
            {weather ? (
                <>
                    <p>Temperature {weather.temperature} Celsius</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        width={100}
                    />
                    <p>Wind {weather.wind} m/s</p>
                </>
            ) : (
                <p>Loading weather...</p>
            )}
        </div>
    )
}

const RenderCountries = ({ countries }) => {
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        setSelectedCountry(null)
    }, [countries])

    const listCountries = selectedCountry
        ? countries.filter(country =>
            country.name.common !== selectedCountry.name.common
          )
        : countries

    if (countries.length === 0) {
        return <div>No matching countries</div>
    }
    if (countries.length === 1) {
        return <RenderCountry country={countries[0]} />
    }
    if (countries.length <= 10) {
        return (
            <div>
                {selectedCountry && (
                    <RenderCountry country={selectedCountry} />
                )}
                {listCountries.map(country => (
                    <div key={country.name.common}>
                        {country.name.common}
                        <button
                            type="button"
                            onClick={() => setSelectedCountry(country)}
                        >
                            Show
                        </button>
                    </div>
                ))}
            </div>
        )
    }
    return <div>Too many matches, specify another filter</div>
}

export default RenderCountries
