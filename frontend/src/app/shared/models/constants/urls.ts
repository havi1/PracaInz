const BASE_URL = 'http://localhost:5001';

export const ROOMS_URL = BASE_URL + '/api/rooms';
export const ROOMS_TAGS_URL = ROOMS_URL + '/tags';
export const ROOMS_BY_SEARCH_URL = ROOMS_URL + '/search/';
export const ROOMS_BY_TAG_URL = ROOMS_URL + '/tag/';
export const ROOMS_BY_ID_URL = ROOMS_URL + '/';
export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';
export const ROOMS_BY_SORT_URL = BASE_URL + '/api/rooms/sort/';
export const ROOMS_BY_FILTER_URL = BASE_URL + '/api/rooms/filter/';
export const ROOM_RESERVATION = BASE_URL + '/api/reservation/';
export const ROOM_COMMENT = ROOMS_URL + "/comment";
export const USER_AUTH = BASE_URL + '/api/users';
export const USER_GET_ONE = BASE_URL + '/api/users/getOne/'
export const USER_PASSWORD_CHANGE = BASE_URL + '/api/users/changePassword'

