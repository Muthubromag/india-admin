import {createSlice} from "@reduxjs/toolkit"
const keySlice=createSlice({
    name:"keySlice",
    initialState: {
        key: sessionStorage.getItem("selectedKey") || "1",
      },
    reducers:{
        changeSideKey:(state,action)=>{
            state.key=action.payload
        }
    }
})

export const {changeSideKey} = keySlice.actions
export default keySlice.reducer