export const fetchDataRequest = () => ({
  type: 'FETCH_DATA_REQUEST',
});

export const fetchDataSuccess = (data) => ({
  type: 'FETCH_DATA_SUCCESS',
  payload: data,
});

export const fetchTodaySuccess = (data) => ({
  type: 'FETCH_TODAY_SUCCESS',
  payload: data,
});

export const fetchDataError = (error: string) => ({
  type: 'FETCH_DATA_ERROR',
  payload: error,
});
