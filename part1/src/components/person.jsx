import Reacth from 'react'

const Person = ({ personsToShow, deletePerson }) => (
    <div>
    {personsToShow.map(e => (
        <div key={e.name}>
            {e.name} {e.number}
            <button onClick={() => deletePerson(e.id, e.name)}>
                delete
            </button>
        </div>
    ))}
    </div>
)

export default Person