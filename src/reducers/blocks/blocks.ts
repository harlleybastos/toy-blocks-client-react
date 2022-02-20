import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/configureStore";
import { ShapeBlock } from "../../types/Blocks";
import { Node } from "../../types/Node";
import initialStateBlock from "./initialState";

export const checkBlockStatus = createAsyncThunk(
  "block/checkBlockStatus",
  async (node: Node) => {
    const response = await fetch(`${node.url}/api/v1/blocks`);
    const { data } = await response.json();
    return { data, url: node.url };
  }
);

export const checkBlocksStatus = createAsyncThunk(
  "block/checkBlocksStatus",
  async (nodes: Node[], thunkAPI) => {
    const { dispatch } = thunkAPI;
    for (const node of nodes) {
      if (node.online) {
        dispatch(checkBlockStatus(node));
      }
    }
  }
);

export const blockSlice = createSlice({
  name: "blocks",
  initialState: initialStateBlock() as ShapeBlock[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkBlockStatus.pending, (state, action) => {
      state.push({ isError: false, isLoading: true, data: [] });
    });
    builder.addCase(checkBlockStatus.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(checkBlockStatus.rejected, (state, action) => {
      state.push({ isError: true, isLoading: false, data: [] });
    });
  },
});

export const selectBlocks = (state: RootState) => state;

export default blockSlice.reducer;
