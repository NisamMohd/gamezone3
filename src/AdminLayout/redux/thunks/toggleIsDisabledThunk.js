import { createAsyncThunk } from "@reduxjs/toolkit";
import { toggleDisableProduct } from "../../utils/productDisable";

export const toggleDisable = createAsyncThunk(
    "adminProducts/toggleDisable",
    async (item) => {
        return await toggleDisableProduct(item)
    }
)