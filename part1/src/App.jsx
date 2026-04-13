import { useState, useEffect } from 'react'
import Notification from './components/notification'
import Filter from './components/filter'
import PersonForm from './components/personForm'
import Person from './components/person'
import personService from './services/notes'

const App = () => {
  const [persons, setPersons] = useState([])
  const hook = () => {
    console.log('effect')
    personService.getAll().then(
      list => {
        setPersons(list)
      }
    )
  }

  useEffect(hook, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNum] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  const addNewPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = { name: newName, number: newNumber }
        personService.update(existingPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(
              person => person.id !== existingPerson.id
                ? person
                : updatedPerson
            ))
            showNotification(`Updated ${updatedPerson.name}`, 'success')
          })
          .catch(() => {
            showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      personService.create(personObject)
        .then(newPerson => {
          setPersons(persons => persons.concat(newPerson))
          showNotification(`Added ${newPerson.name}`, 'success')
        })
        .catch(err => {
          showNotification(err.response.data.error, 'error')
        })
    }

    setNewName('')
    setNewNum('')
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${name}`, 'success')
        })
        .catch(() => {
          showNotification(`Information of ${name} has already been removed from server`, 'error')
        })
    }
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNum(event.target.value)
  }

  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value)
  }

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const personsToShow = searchTerm === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />

      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />

      <h2>add a new</h2>

      <PersonForm
        addNewPerson={addNewPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Person
        personsToShow={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
