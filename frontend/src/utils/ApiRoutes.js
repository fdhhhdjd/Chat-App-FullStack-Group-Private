//* Port
// export const host = "http://localhost:5000";
export const host = "https://messagesfree.herokuapp.com";

//* Authentication
//!register
export const RegisterRoute = `${host}/api/auth/register`;

//!login
export const LoginRoute = `${host}/api/auth/login`;

////!logout
export const LogoutRoute = `${host}/api/auth/logout`;

//!Search User
export const SearchRoute = `${host}/api/auth?search=`;

//* Message
//!All Messages
export const MessageGetAll = `${host}/api/message`;

//! Send Message
export const SendMessage = `${host}/api/message/send`;

//! Update Icon
export const IconMessage = `${host}/api/message/icon`;
// *Group
//!Fetch Chat Group and Private
export const FetchChatRoute = `${host}/api/group/fetch`;

//!Create Group
export const CreateGroupChatRoute = `${host}/api/group/create`;

//! Rename Group
export const RenameGroupChatRoute = `${host}/api/group/rename`;

//! Add User To Group
export const AddUserToGroup = `${host}/api/group/groupadd`;

//! Remove From Group
export const RemoveFromGroup = `${host}/api/group/groupremove`;

//!Access user to Group
export const AccessUserToGroupRoute = `${host}/api/group/access`;

//!Upload Image Or Video
export const UploadVideoOrImage = `${host}/api/upload/uploadImg`;

//!Upload files
export const UploadFile = `${host}/api/upload/files`;
