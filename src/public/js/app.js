const socket = io();

const userinfoDiv = document.getElementById("welcome-userinfo");

function generateUID() {
    let firPart = (Math.random() * 46656) | 0;
    let secPart = (Math.random() * 46656) | 0;
    firPart = ("000" + firPart.toString(36)).slice(-3);
    secPart = ("000" + secPart.toString(36)).slice(-3);
    return firPart + secPart;
}


let roomName;
/** @type {RTCPeerConnection} */

let myUID = generateUID();
let myNickname = "Anonymous_" + myUID;

let removeToast;

function toast(string) {
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 3000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)
    toast.classList.add("reveal"),
        toast.innerText = string
}


/* socketIODiv Form ( JOIN A ROOM ) */
const welcomeDiv = document.getElementById("welcome");
const socketIOForm = document.getElementById("welcome-socketIO__form")
const chatroomInput = socketIOForm.querySelector("input");

function joinChatRoom(roomName) {
    console.log(roomName)
    chatroomInput.value = "";
    window.location = window.location + `chatroom/${roomName}/${myNickname}/`;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    socket.emit("join_chatroom", chatroomInput.value, joinChatRoom); 
}

const socketIOBtn = socketIOForm.querySelector("button");
socketIOBtn.addEventListener("click", handleRoomSubmit);


function showNickChange(new_nickname) {
    toast(`Your nickname is now ${new_nickname}`);
}


function handleSetNickname(event) {
    event.preventDefault();
    const new_nickname = userinfoForm.querySelector("input").value;
    socket.emit("set_nickname", new_nickname, showNickChange);
}

const userinfoForm = document.getElementById("welcome-userinfo__form");
const userinfoBtn = userinfoForm.querySelector("button");
userinfoBtn.addEventListener("click", handleSetNickname);


socket.on("room_change", (publicRooms) => {
    const h4 = document.querySelector("#OpenRoomTitle h4");
    h4.innerText = `Open Rooms ( ${publicRooms.length} )`;
    const roomList = welcomeDiv.querySelector("ul");
    roomList.innerHTML = "";
    if (publicRooms.length === 0) {
      return;
    }
    publicRooms.forEach((publicRoom) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      li.innerText = `[ ${publicRoom.roomName} ] : ${publicRoom.userCount} user(s)`;
      button.addEventListener("click", () => {
        joinRoom(publicRoom.roomName);
      });
      button.innerText = "Join";
      li.appendChild(button);
      roomList.append(li);
    });
  });


/* socketIODiv Form ( JOIN A ROOM ) */
/* webRTCDiv Form ( JOIN A ROOM ) */
const webRTCDiv = document.getElementById("welcome-webRTC");
const webRTCForm = webRTCDiv.querySelector("form");
const vcroomInput = webRTCForm.querySelector("input");
function joinVCRoom(roomName) {
    vcroomInput.value = "";
    window.location = window.location + `vc-room/${roomName}/${myNickname}/`;
}

function handleVCRoomSubmit(event) {
    event.preventDefault();
    socket.emit("join_vcroom", vcroomInput.value, joinVCRoom); 
}

const webRTCBtn = webRTCForm.querySelector("button");
webRTCBtn.addEventListener("click", handleVCRoomSubmit);
