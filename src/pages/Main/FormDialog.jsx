import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import axios from 'axios'

export default function FormDialog({
  open,
  handleClose,
  action,
  token,
  loadData,
}) {
  const [name, setName] = React.useState(null)
  const onSubmit = (e) => {
    e.preventDefault()
    // get our form data out of state
    let type = 'checklist'

    axios
      .post(
        `http://94.74.86.174:8080/api/${type}`,
        {
          name: `${name}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        loadData()
        handleClose()
      })
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{`Form ${action}`}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name Ceklis"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
