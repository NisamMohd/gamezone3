import api from "../services/api"

export const isUserExist = async (email) => {
    const res = await api.get(`/users?email=${email}`)
    const data = res.data
    if(data.length > 0){
        return {
            userExist: true,
            message : "Email already exists...!"
        }
    }

    return {userExist : false}
};
