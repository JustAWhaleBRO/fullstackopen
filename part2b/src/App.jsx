import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import RenderCountries from './components/renderCountries'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [matchingCountries, setMatchingCountries] = useState([])

  useEffect(() => {
    countriesService.getAll().then(resp => {
      setCountries(resp)
    })
    .catch(error => {
      console.error('Error fetching countries:', error)
    })
  }, [])

  const handleSearch = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    setMatchingCountries(
      countries.filter(country =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      )
    )
  }

  return (
    <div>
      <form>
        find countries
        <input value={searchTerm} onChange={handleSearch} />
      </form>
      <RenderCountries countries={matchingCountries} />
    </div>
  )
}

export default App