import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { customerList } from "../redux/thunks/customerThunk"

function UserManagment() {
    const { items, loading } = useSelector((state) => state.users)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(customerList())
    },[])
  return (
    <div>
        {items.map((item) => (
            <span key={item.id}>{item.name}</span>
))}
    </div>
  )
}

export default UserManagment