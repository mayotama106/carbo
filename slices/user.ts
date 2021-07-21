import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    set: (state, action) => state = action.payload,
  },
})

export const { set } = userSlice.actions
export default userSlice.reducer