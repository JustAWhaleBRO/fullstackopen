import { useState, useImperativeHandle } from 'react'

const Togglable = ({ buttonLabel, children, ref }) => {
    const [visibility, setVisibility] = useState(false)

    const hideWhenVisible = { display: visibility ? 'none' : '' }
    const shownWhenHidden = { display: visibility ? '' : 'none' }

    const toggleVisibility = () => {
        setVisibility(!visibility)
    }

    useImperativeHandle(ref, () => {
        return { toggleVisibility }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{buttonLabel}</button>
            </div>
            <div style={shownWhenHidden}>
                {children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    )
}

export default Togglable
