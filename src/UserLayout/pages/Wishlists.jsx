import React,{useEffect} from 'react'
import { useAuth } from "../context/AuthContext";
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist } from '../redux/features/thunks/wishlistThunk';
import { IndianRupee } from 'lucide-react';


function Wishlists() {
  const { user } = useAuth();
  const { items, loading, error } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch();

  useEffect(() => {
    if(user){
      dispatch(fetchWishlist(user.id))
    }
  }, [user,dispatch,items])

  if(loading){
    <div>
      <p>
        Loading Wishlists...
      </p>
    </div>
  }
  return (
    <div>Wishlists</div>
  )
}

export default Wishlists