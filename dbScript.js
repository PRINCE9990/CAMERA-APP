let req = indexedDB.open("Camera", 1);
let body = document.querySelector("body");
let db;
req.addEventListener("success", function () {
  db = req.result;
  alert("db was opened successfully");
});
req.addEventListener("upgradeneeded", function () {
  let accessToDB = req.result;
  accessToDB.createObjectStore("Gallery", { keyPath: "mId" });
});
req.addEventListener("error", function () {
  console.log("error");
});

function addMedia(media, type) {
  if (!db) return;
  let obj = { mId: Date.now(), media, type };
  let tx = db.transaction("Gallery", "readwrite"); //mujhe transaction krni h yani maine kuch likhna h db m to mujhe access do database ka aur mujhe likhna h isliye readwrite agr akela pdna hota to readonly
  let gallery = tx.objectStore("Gallery");
  gallery.add(obj);
}
function deleteMedia(id) {
  if (!db) return;
  let tx = db.transaction("Gallery", "readwrite"); //mujhe transaction krni h yani maine kuch likhna h db m to mujhe access do database ka aur mujhe likhna h isliye readwrite agr akela pdna hota to readonly
  let gallery = tx.objectStore("Gallery");//kdhgkjdh
  gallery.delete(Number(id));
}
function viewMedia() {
  let tx = db.transaction("Gallery", "readonly");
  let gallery = tx.objectStore("Gallery");
  let cReq = gallery.openCursor();

  cReq.addEventListener("success", function () {
    let cursor = cReq.result;
    if (cursor) {
      let mo = cursor.value;
      let div = document.createElement("div");
      div.classList.add("media-container");
      let linkForDownloadBtn;
      if (mo.type == "video") {
        let url = window.URL.createObjectURL(mo.media);
        linkForDownloadBtn = url
        div.innerHTML = `<div class="media">
          <video src = "${url}" autoplay loop controls muted ></video>              
          </div>
          <button class="download">Download</button>
          <button class="delete" data-id = "${mo.mId}">Delete</button>`;
      } else {
        linkForDownloadBtn = mo.media
        div.innerHTML = `<div class="media">
        <img src = "${mo.media}"/>              
        </div>
        <button class="download">Download</button>
        <button class="delete" data-id = "${mo.mId}">Delete</button>`;
      }
      let downloadBtn = div.querySelector(".download");
      downloadBtn.addEventListener("click", function () {
        let a = document.createElement("a");
        a.href = linkForDownloadBtn;
        if(mo.type == "video"){
          a.download = "video.mp4";
        }else{
          a.download = "img.png"
        }
        a.click();
        a.remove();
      });
      let deleteBtn = div.querySelector(".delete");
      deleteBtn.addEventListener("click", function (e) {
        let id = e.currentTarget.getAttribute("data-id")
        deleteMedia(id)
        e.currentTarget.parentElement.remove()
        
        
      })
      body.append(div);
      cursor.continue();
    }
  });
}
