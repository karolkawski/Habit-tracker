export const fetchSettingsRequest = () => ({
  type: 'FETCH_SETTINGS_REQUEST',
});

export const fetchSettingsSuccess = (data) => ({
  type: 'FETCH_SETTINGS_SUCCESS',
  payload: data,
});

export const fetchSettingsError = (error: string) => ({
  type: 'FETCH_SETTINGS_ERROR',
  payload: error,
});
