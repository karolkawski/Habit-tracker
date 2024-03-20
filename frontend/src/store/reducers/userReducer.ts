const initialState = {
  user: undefined,
  loading: false,
  error: null,
  token: undefined,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TOKEN_REQUEST':
      return;
    case 'FETCH_TOKEN_SUCCESS':
      const token = action.payload;
      return {
        ...state,
        token,
      };

    case 'REMOVE_TOKEN_SUCCESS':
      return {
        ...state,
        token: undefined,
      };
    case 'FETCH_USER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_USER_SUCCESS':
      if (state.user && !state.loading) {
        return;
      }
      const user = action.payload;
      return {
        ...state,
        loading: false,
        error: null,
        user,
      };
    case 'FETCH_USER_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default userReducer;
