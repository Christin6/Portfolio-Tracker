import { useState } from 'react'
import signupService from '../services/signup'
import {
  getPasswordChecks,
  getUsernameError,
  isSignupFormValid,
  PASSWORD_REQUIREMENTS,
} from '../helpers/authValidation'
import { Link, useNavigate, Navigate } from 'react-router-dom'

const SignupForm = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [authError, setAuthError] = useState('')

    const navigate = useNavigate()

    const usernameError = getUsernameError(username)
    const passwordChecks = getPasswordChecks(password)
    const confirmPassError =
        confirmPass.length > 0 && confirmPass !== password
            ? "Passwords don't match"
            : ''

    const signupValid = isSignupFormValid(username, name, password, confirmPass)

    const passwordRequirementsList = () => (
        <ul className="password-requirements">
            {PASSWORD_REQUIREMENTS.map(({ key, label }) => (
                <li
                    key={key}
                    className={passwordChecks[key] ? 'password-requirement--met' : undefined}
                >
                    {label}
                </li>
            ))}
        </ul>
    )

    const handleSignup = async (e) => {
        e.preventDefault()
        if (!signupValid) return

        try {
            await signupService.signup(username, name, password) // no name field in your form
            navigate('/login')
        } catch (err) {
            if (err.message.includes('already taken')) {
                setAuthError('Username already taken') // use authError state instead
            } else {
                setAuthError('Signup failed, please try again')
            }
        }
    }

    return (
        <div className="auth-page">
            <div>
                <form className="card auth-form" onSubmit={handleSignup} noValidate>
                    <h1>Sign Up</h1>
                    {authError && <p className="status-text status-text--error status-text--field">{authError}</p>}
                    <label className="modal-field">
                        <span>Name</span>
                        <input
                            type="text"
                            value={name}
                            onChange={({ target }) => {
                                setName(target.value)
                                setAuthError('')
                            }}
                            required
                        />
                    </label>
                    <label className="modal-field">
                        <span>Username</span>
                        <input
                            type="text"
                            value={username}
                            onChange={({ target }) => {
                                setUsername(target.value)
                                setAuthError('')
                            }}
                            required
                        />
                    </label>
                    {usernameError &&
                        <p className="status-text status-text--error status-text--field">
                            {usernameError}
                        </p>}
                    <label className="modal-field">
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={({ target }) => {
                                setPassword(target.value)
                                setAuthError('')
                            }}
                            required
                        />
                    </label>
                    {passwordRequirementsList()}
                    <label className="modal-field">
                        <span>Confirm Password</span>
                        <input
                            type="password"
                            value={confirmPass}
                            onChange={({ target }) => {
                                setConfirmPass(target.value)
                                setAuthError('')
                            }}
                            required
                        />
                    </label>
                    {confirmPassError &&
                        <p className="status-text status-text--error status-text--field">
                            {confirmPassError}
                        </p>}
                    <button type="submit" disabled={!signupValid}>Sign Up</button>
                </form>
                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-switch-link">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default SignupForm