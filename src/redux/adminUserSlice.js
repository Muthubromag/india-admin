import {createSlice} from "@reduxjs/toolkit"
import Cookies from "js-cookie"
const userSlice=createSlice({
    name:"userSlice",
    initialState:{user:Cookies.get("token")},
    reducers:{
        changeUserValues:(state,action)=>{
            state.user=action.payload
        }
    }
})

export const {changeUserValues} = userSlice.actions
export default userSlice.reducer