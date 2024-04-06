const initialState = {
  darkMode: false,
  loading: true,
  error: null,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SETTIGS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SETTINGS_SUCCESS':
      if (state.darkMode && !state.loading) {
        return state;
      }
      const darkMode = action.payload;
      return {
        ...state,
        loading: false,
        error: null,
        darkMode,
      };
    case 'FETCH_SETTINGS_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default settingsReducer;
