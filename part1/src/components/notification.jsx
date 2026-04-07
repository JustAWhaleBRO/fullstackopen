const Notification = ({ notification }) => {
    if (notification === null) {
        return null
    }

    return (
        <div className={notification.type === 'error' 
            ? 'error' : 'success'}>
            {notification.text}    
        </div>
    )
}

export default Notification