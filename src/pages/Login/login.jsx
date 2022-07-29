import React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import {Button, Box, Typography, Tab, Tabs, AppBar} from '@material-ui/core'
import {TextFiledBox} from './LoginStyles'
import axios from 'axios'
import {useCookies} from 'react-cookie'
import {withRouter} from 'react-router-dom'

function TabPanel(props) {
  const {children, value, index, ...other} = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#eff2f4',
    boxShadow: ' 0 3px 6px 0 rgba(0, 0, 0, 0.16)',
  },
}))

const Login = (props) => {
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['token'])
  const [value, setValue] = React.useState(0)
  const [values, setValues] = React.useState({
    username: null,
    password: null,
    email: null,
  })
  const [status, setStatus] = React.useState({
    error: false,
    message: null,
  })
  const handleChange = (event, newValue) => {
    setValue(newValue)
    setValues({
      username: null,
      password: null,
      email: null,
    })
  }
  const handleChangeForm = (name) => (event) => {
    const _value = {
      ...values,
      [name]: event.target.value,
    }
    setValues(_value)
  }
  const onSubmit = (e) => {
    e.preventDefault()
    // get our form data out of state
    let action = value === 0 ? 'login' : 'register'
    if (action === 'login') {
      delete values.email
    }

    axios
      .post(`http://94.74.86.174:8080/api/${action}`, values)
      .then((response) => {
        setStatus({notif: true, message: response.data.message})

        if (action === 'login') {
          setCookie('token', response.data.data.token, {
            path: '/',
          })
          this.props.history.push('/main')
        }
      })
      .catch((error) => {
        setStatus({notif: true, message: error.response.data.errorMessage})
      })
  }
  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          borderRadius: '5px',
          boxShadow: ' 0 3px 6px 0 rgba(0, 0, 0, 0.16)',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
        >
          <Tab label="Login" {...a11yProps(0)} />
          <Tab label="Register" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={value}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px 50px',
            backgroundColor: '#fff',
          }}
        >
          {value === 1 && (
            <TextFiledBox
              id="standard-basic"
              label="Email "
              type="email"
              fullWidth
              value={values.email}
              onChange={handleChangeForm('email')}
            />
          )}

          <TextFiledBox
            id="standard-basic"
            label="Username"
            fullWidth
            value={values.username}
            onChange={handleChangeForm('username')}
          />
          <TextFiledBox
            id="standard-basic"
            label="Password "
            type="password"
            fullWidth
            value={values.password}
            onChange={handleChangeForm('password')}
          />
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {value === 1 ? 'Register' : 'Login'}
          </Button>
          {status.notif && <div>{status.message}</div>}
        </div>
      </TabPanel>
    </div>
  )
}
export default withRouter(Login)
