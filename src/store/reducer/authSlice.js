import { createSlice, createSelector } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import FirebaseData from "../../utils/Firebase";
import { store } from "../store";
import { apiCallBegan } from "../actions/apiActions";
import { user_signupApi } from "@/utils/api";



const initialState = {
  user: null,
  loading: false,
  error: null,
  data:null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequested: (state) => {
      state.loading = true;
    },
    authSuccess: (state, action) => {
      state.user = action;
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogout: (auth) => {
      auth = initialState;
      return auth;
    },
    userUpdateData: (auth, action) => {
      auth.data = action.payload;
    },
    signupRequested: (auth, action) => {
      auth.loading = true;
    },
    signupSucess: (auth, action) => {
      auth.data = action.payload;
      auth.loading = true;
    },
    signupFailure: (auth, action) => {
      auth.loading = false;
    },
  },
});

export const { authRequested, authSuccess, authFailure, userLogout, userUpdateData, signupRequested, signupSucess, signupFailure } = authSlice.actions;

// Selector para obtener el usuario del estado
export const selectUser = (state) => state.auth?.user;

export default authSlice.reducer;

// Thunks
export const loginUser = (email, password) => async (dispatch) => {
  const { authentication } = FirebaseData();
  dispatch(authRequested());
  try {
    const userCredential = await signInWithEmailAndPassword(authentication, email, password);
    dispatch(authSuccess(userCredential.user));
  } catch (error) {
    dispatch(authFailure(error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
  const { authentication } = FirebaseData();
  dispatch(authRequested());
  try {
    await signOut(authentication);
    dispatch(userLogout());
  } catch (error) {
    dispatch(authFailure(error.message));
  }
};

// Observer to keep user logged in
export const observeAuthState = () => (dispatch) => {
  const { authentication } = FirebaseData();
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      dispatch(authSuccess(user));
    } else {
      dispatch(userLogout());
    }
  });
};


export const signupLoaded = (name, email, mobile, type, address, firebase_id, logintype, profile, fcm_id, cargo,city,state,country, cedula, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...user_signupApi(name, email, mobile, type, address, firebase_id, logintype, profile, fcm_id, cargo, city, state, country, cedula),
            displayToast: false,
            onStartDispatch: signupRequested.type,
            onSuccessDispatch: signupSucess.type,
            onErrorDispatch: signupFailure.type,
            onStart,
            onSuccess,
            onError,
        })
    );
};



export const loadUpdateData = (data) => {
    store.dispatch(updateDataSuccess({ data }));
};
export const loadUpdateUserData = (data) => {
    store.dispatch(userUpdateData({ data }));
};
export const logoutSuccess = (logout) => {
    store.dispatch(userLogout({ logout }));
};

// Slecttors

export const userSignUpData = createSelector(
    (state) => state.auth,
    (auth) => auth
);
