import { IRoomType } from "../pages/admin/pages/RoomsPage";

export interface ICommonContext {
  loginPage: any;
  setLoginPage: any;
  signup: any;
  setSignup: any;
  socket: any;
  rooms: any;
  setRooms: any;
  currentRoom: any;
  setCurrentRoom: Function;
  members: any;
  setMembers: any;
  messages: any;
  setMessages: any;
  privateMemberMessages: any;
  setPrivateMemberMessages: any;
  newMessages: any;
  setNewMessages: any;
  showTabs: any;
  setShowTabs: any;
  createRoomShow: any;
  setCreateRoomShow: any;
  showSideBar: any;
  setShowSideBar: Function;
  fullScreen: boolean;
  setFullScreen: Function;
  createPublicUserShow: boolean;
  setCreatePublicUserShow: Function;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Function;
  joinRoomShow: any;
  setJoinRoomShow: Function;
  leaveRoomShow: boolean;
  setLeaveRoomShow: Function;
  joinRoomData: IRoomType;
  setJoinRoomData: Function;
  leaveRoomData: IRoomType;
  setLeaveRoomData: Function;
}
