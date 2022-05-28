# BackEnd Code By: Nguyễn Tiến Tài

## WebSite: https://messagesfree.herokuapp.com/

## Tài Khoản Donate li Cf để có động lực code cho anh em tham khảo 😄😄

![giphy](https://3.bp.blogspot.com/-SzGvXn2sTmw/V6k-90GH3ZI/AAAAAAAAIsk/Q678Pil-0kITLPa3fD--JkNdnJVKi_BygCLcB/s1600/cf10-fbc08%2B%25281%2529.gif)

## Mk: NGUYEN TIEN TAI

## STK: 1651002972052

## Chi Nhánh: NGAN HANG TMCP AN BINH (ABBANK)

## SUPORT CONTACT:https://profile-forme.surge.sh/
 
## 1. API Backend

## Authentication

- Đăng ký tài khoản: post --> http://localhost:5000/api/auth/register

- Đăng nhập tài khoản ( Online ) : post --> http://localhost:5000/api/auth/login

- Logout tài khoản ( Office ):post -->http://localhost:5000/api/auth/logout

- Search tài khoản người khác trừ chính mình: post -->http://localhost:5000/api/auth/

## Upload Video,Image,Pdf Clound

- Upload Image and Video: post --> http://localhost:5000/api/upload/uploadImg

- Upload Pdf : post --> http://localhost:5000/api/upload/files

- Xóa ảnh -->   post --> http://localhost:5000/api/upload/destroyImg

## Group

- Tạo Group : post --> http://localhost:5000/api/group/create

- Đổi tên Group : put --> http://localhost:5000/api/group/rename

- Thêm Người dùng vào  Group : put --> http://localhost:5000/api/group/groupadd

- Xóa người dùng ra khỏi group và người dùng rời nhóm: put --> http://localhost:5000/api/group/groupremove

- Lấy tất cả tin nhắn người dùng ở phần Chát đang chát với mình: get -->http://localhost:5000/api/group/fetch

- Chấp nhận người dùng vào Group: post -->http://localhost:5000/api/group/access

## Message

- Lấy tất cả 1 của người dùng đang chat với mình khi trỏ vào : get --> http://localhost:5000/api/message/:chatId

- Gửi tin nhắn đến người đó : post --> http://localhost:5000/api/message/send

- Chọn Icon cho tin nhắn: post -->http://localhost:5000/api/message/icon/:id
