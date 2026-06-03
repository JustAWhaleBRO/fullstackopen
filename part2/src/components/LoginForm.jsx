const loginForm = ({
    handleLogin,
    username,
    setUsername,
    password,
    setPassword
}) => (
    <form onSubmit={handleLogin}>
        <div>
            <label>
                username
                <input
                    type="text"
                    value={username}
                    onChange={setUsername}
                />
            </label>
        </div>
        <div>
            <label>
                password
                <input
                    type="password"
                    value={password}
                    onChange={setPassword}
                />
            </label>
        </div>
        <button type="submit">login</button>
    </form>
)

export default loginForm
