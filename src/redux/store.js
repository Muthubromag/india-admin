import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./adminUserSlice"
import sideKeySlice from "./sidekey";


export default configureStore({
    reducer:{
        user:userSlice,
        key:sideKeySlice
        
    }
})