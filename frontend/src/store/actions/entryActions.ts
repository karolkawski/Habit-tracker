export const fetchEntryRequest = () => ({
  type: 'FETCH_ENTRY_REQUEST',
});

export const fetchEntrySuccess = (data) => ({
  type: 'FETCH_ENTRY_SUCCESS',
  payload: data,
});

export const fetchEntryError = (error: string) => ({
  type: 'FETCH_ENTRY_ERROR',
  payload: error,
});

export const setIsDoneEntry = (data) => ({
  type: 'ISDONE_ENTRY_SET',
  payload: data,
});

export const setIsUndoneEntry = (data) => ({
  type: 'ISUNDONE_ENTRY_SET',
  payload: data,
});
