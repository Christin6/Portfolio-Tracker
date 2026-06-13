import { toggleCurrentCurrency, useCurrentCurrency } from './stores/useCurrencyStore'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './Dashboard.css'
import PortfolioSummary from './components/PortfolioSummary'
import MainContent from './components/MainContent'
import StockSearchBar from './components/StockSearchBar'

import loginService from './services/login'
import signupService from './services/signup'
import userStockService from './services/userStock'
import {
  getPasswordChecks,
  getUsernameError,
  isLoginFormValid,
  isSignupFormValid,
  PASSWORD_REQUIREMENTS,
} from './helpers/authValidation'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    }
  }
})

function App() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [user, setUser] = useState(null)
  const [loginPageActive, setLoginPageActive] = useState(true)
  const [authError, setAuthError] = useState('')

  const currentCurrency = useCurrentCurrency()

  const usernameError = getUsernameError(username)
  const passwordChecks = getPasswordChecks(password)
  const confirmPassError =
    confirmPass.length > 0 && confirmPass !== password
      ? "Passwords don't match"
      : ''

  const loginValid = isLoginFormValid(username, password)
  const signupValid = isSignupFormValid(username, name, password, confirmPass)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      userStockService.setToken(user.token)
    }
  }, [])

  const clearAuthForm = () => {
    setUsername('')
    setPassword('')
    setConfirmPass('')
    setName('')
    setAuthError('')
  }

  const switchToLogin = () => {
    clearAuthForm()
    setLoginPageActive(true)
  }

  const switchToSignup = () => {
    clearAuthForm()
    setLoginPageActive(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginValid) return

    setAuthError('')
    try {
      const user = await loginService.login({ username: username.trim(), password })
      setUser(user)
      clearAuthForm()
      userStockService.setToken(user.token)
      window.localStorage.setItem('loggedAppUser', JSON.stringify(user))
    } catch (err) {
      setAuthError(err.message || 'Unable to log in. Please try again.')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!signupValid) return

    try {
      await signupService.signup(username, name, password) // no name field in your form
      switchToLogin()
    } catch (err) {
      if (err.message.includes('already taken')) {
        setAuthError('Username already taken') // use authError state instead
      } else {
        setAuthError('Signup failed, please try again')
      }
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
  }

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

  const loginForm = () => (
    <div className="auth-page">
      <div>
        <form className="card auth-form" onSubmit={handleLogin} noValidate>
          <h1>Login</h1>
          {authError && <p className="status-text status-text--error status-text--field">{authError}</p>}
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
          {usernameError && <p className="status-text status-text--error status-text--field">{usernameError}</p>}
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
          <button type="submit" disabled={!loginValid}>Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button type="button" className="page-status-button" onClick={switchToSignup}>Register</button>
        </p>
      </div>
    </div>
  )

  const signupForm = () => (
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
          {usernameError && <p className="status-text status-text--error status-text--field">{usernameError}</p>}
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
          {confirmPassError && <p className="status-text status-text--error status-text--field">{confirmPassError}</p>}
          <button type="submit" disabled={!signupValid}>Sign Up</button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="page-status-button" onClick={switchToLogin}>Login</button>
        </p>
      </div>
    </div>
  )

  const dashboard = () => (
    <div className="dashboard">
      <ToastContainer />

      <div className="header">
        <StockSearchBar />
        <button className="currency-toggle" onClick={toggleCurrentCurrency}>
          {currentCurrency}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <PortfolioSummary
        formatPercent={formatPercent}
      />

      <MainContent
        formatPercent={formatPercent}
      />
    </div>
  )

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent?.toFixed(2)}%`
  }

  return (
    <QueryClientProvider client={queryClient}>
      {(!user && loginPageActive) && loginForm()}
      {(!user && !loginPageActive) && signupForm()}
      {user && dashboard()}
    </QueryClientProvider>
  )
}

export default App
