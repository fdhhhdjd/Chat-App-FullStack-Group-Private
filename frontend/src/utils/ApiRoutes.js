export const host = "http://localhost:5000";
//!register
export const RegisterRoute = `${host}/api/auth/register`;

//!login
export const LoginRoute = `${host}/api/auth/login`;

////!logout
export const LogoutRoute = `${host}/logout`;

//!Search User
export const SearchRoute = `${host}/api/auth?search=`;

//* Message

//!Fetch Chat Group
export const FetchChatRoute = `${host}/api/group/fetch`;

//!Get Message
export const GetMessageRoute = `${host}/api/message/getmessage`;

//!Send Message
export const SendMessageRoute = `${host}/api/message/send`;
