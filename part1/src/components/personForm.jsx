import React from 'react'

const PersonForm = ({
    addNewPerson,
    newName,
    handlePersonChange,
    newNumber,
    handleNumberChange
}) => (
    <form onSubmit={addNewPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
        <div>
          debug: {newName}
        </div>
      </form>
)

export default PersonForm