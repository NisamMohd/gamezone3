import api from "../../services/api";

export const toggleDisableProduct = async (item) => {
    try{
        const res = await api.patch(`/products/${item.id}`,{isDisabled : !item.isDisabled})
        return res.data
    }catch (error){
        throw error
    }
}