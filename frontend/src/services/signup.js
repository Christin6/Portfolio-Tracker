const baseUrl = '/api/signup'

const signup = async (username, name, password) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, name, password})
    })
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
    }
    return data
}

export default { signup }