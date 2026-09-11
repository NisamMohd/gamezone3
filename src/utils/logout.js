import api from "../services/api";
const userData = localStorage.getItem('gamezone_user');
const user = userData ? JSON.parse(userData) : null;

export const updateStatus = async () => {
    try {
        const res = await api.patch(`/user?${user.id}`,{
            status : "offline"
        })

        return res.data;
    }catch(err){
        console.log(err.message);
    }
}