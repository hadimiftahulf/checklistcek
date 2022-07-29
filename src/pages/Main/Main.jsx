import React, {useEffect} from 'react'
import axios from 'axios'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import {withRouter} from 'react-router-dom'

import {useCookies} from 'react-cookie'
import FormDialog from './FormDialog'
function Main() {
  const [cookies, setCookie] = useCookies(['token'])
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState({
    open: false,
    data: null,
    action: null,
  })
  const [refresh, setRefresh] = React.useState(false)

  useEffect(() => {
    if (
      cookies.token === undefined ||
      cookies.token === null ||
      cookies.token === ''
    ) {
      this.props.history.push('/')
    }
    if (refresh) {
      axios
        .get(`http://94.74.86.174:8080/api/checklist`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then(({data}) => {
          setData(data.data)
        })
        .catch((error) => {})
      setRefresh(false)
    }
  }, [refresh, open])

  const loadData = () => {
    setRefresh(true)
  }
  const onDelete = (id) => {
    let type = 'checklist'

    axios
      .delete(`http://94.74.86.174:8080/api/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((response) => {
        loadData()
      })
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen({
            ...open,
            open: true,
            action: 'Add',
          })
        }}
      >
        Add Checklist
      </Button>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setOpen({
                          ...open,
                          open: false,
                          data: row,
                          action: 'Edit',
                        })
                      }}
                    >
                      Detail
                    </Button>{' '}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        onDelete(row.id)
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormDialog
        open={open.open}
        handleClose={() => {
          setOpen({
            ...open,
            open: false,
          })
        }}
        data={open.data}
        action={open.action}
        token={cookies.token}
        loadData={loadData}
      />
    </>
  )
}

export default withRouter(Main)
