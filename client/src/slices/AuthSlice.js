import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  user: (() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Assurer que les champs existent avec des valeurs par défaut
        return {
          ...user,
          coins: user.coins ?? 0,
          totalScore: user.totalScore ?? 0,
          quizzesCompleted: user.quizzesCompleted ?? 0,
          attemptedQuizzes: user.attemptedQuizzes || user.attemptedQuizes || []
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
      localStorage.setItem("token", value.payload);
    },
    setUser(state, action) {
      // Protection contre les valeurs null/undefined
      if (!action.payload) {
        state.user = null;
        localStorage.removeItem("user");
        return;
      }

      // Assurer que les champs existent avec des valeurs par défaut
      const user = {
        ...action.payload,
        coins: action.payload.coins ?? 0,
        totalScore: action.payload.totalScore ?? 0,
        quizzesCompleted: action.payload.quizzesCompleted ?? 0,
        attemptedQuizzes: action.payload.attemptedQuizzes || action.payload.attemptedQuizes || []
      };
      
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
  },
});

export const { setToken, setUser } = authSlice.actions;

export default authSlice.reducer;