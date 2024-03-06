const initialState = {
  habits: null,
  today: null,
  user: null,
  loading: true,
  error: null,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_DATA_SUCCESS':
      if (state.habits && !state.loading) {
        return;
      }
      const newHabits = action.payload;
      return {
        ...state,
        loading: false,
        habits: newHabits,
        error: null,
      };
    case 'FETCH_TODAY_SUCCESS':
      if (state.today && !state.loading) {
        return;
      }
      const newToday = action.payload;
      return {
        ...state,
        today: newToday,
        error: null,
      };
    case 'FETCH_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default dataReducer;
