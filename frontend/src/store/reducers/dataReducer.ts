
const initialState = {
  habits: null,
  today: null,
  user: null,
  loading: false,
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
      const newData = action.payload;
      return {
        ...state,
        loading: false,
        data: newData,
        error: null,
      };
    case 'FETCH_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
      const removeData = state.data.filter(
        (item: TaskType) => item.id !== action.payload
      );

      const removedNewObject = {
        ...state,
        loading: false,
        data: removeData,
        error: null,
        blockedHours: [],
      };
      !isDemo && saveStateToLocalStorage('plannerState', removedNewObject);

      return removedNewObject;
    default:
      return state;
  }
};

export default dataReducer;
