import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formValidation } from '../utils/register';

function Register() {

    const { register,error,setError,isLoading } = useAuth();
    const [cpasswd, setCPasswd] = useState("")
    const [userInfo, setUserInfo] = useState({
        name: '',
        email : '',
        password: ''
    })

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]:e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validate = formValidation(userInfo,cpasswd)
        if(!validate.valid){
            setError(validate.message)
            return
        }

        const res = await register(userInfo)

        return {success : true}
    }

    if(isLoading) return <p>Loading...</p>
  return (
    <div>
        <h3>Register</h3>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name='name'
                value={userInfo.name}
                onChange={handleChange}
                placeholder='Name'
            />
            <input
                type="email"
                name='email'
                value={userInfo.email}
                onChange={handleChange}
                placeholder='Example@email.com'
            />
            <input
                type="password"
                name='password'
                value={userInfo.password}
                onChange={handleChange}
                placeholder='Password'
            />
            <input 
                type="password"
                value={cpasswd}
                onChange={(e) => setCPasswd(e.target.value)}
                placeholder='Confirm Password' 
            />

            {error && <p>{error}</p>}

            <button type='submit'>Register</button>
        </form>
    </div>
  )
}

export default Register