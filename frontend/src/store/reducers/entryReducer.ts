const initialState = {
  entries: null,
  loading: true,
  error: null,
};

const entryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ENTRY_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_ENTRY_SUCCESS':
      if (state.entries && !state.loading) {
        return;
      }
      const todayEntries = action.payload;
      return {
        ...state,
        loading: false,
        entries: todayEntries,
        error: null,
      };
    case 'FETCH_ENTRY_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ISDONE_ENTRY_SET':
      return { ...state, loading: false, error: action.payload };
    case 'ISUNDONE_ENTRY_SET':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default entryReducer;
