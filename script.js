let video = document.querySelector("video");
        let recordBtn = document.querySelector("#record");
        let recDiv = recordBtn.querySelector("div")
        let captureBtn = document.querySelector("#capture")
        let capDiv = captureBtn.querySelector("div")
        let mediaRecorder;
        let appliedFilter;
        let zoomInBtn = document.querySelector(".zoom-in")
        let galleryBtn = document.querySelector("#gallery")
        galleryBtn.addEventListener("click",function(){
            location.assign("gallery.html")
        })
        let zoomOutBtn = document.querySelector(".zoom-out")
        let minZoom = 1
        let maxZoom = 3
        let currZoom = 1
        let isRecording = false;
        let chunks = [];
        let filters = document.querySelectorAll(".filter")
        zoomInBtn.addEventListener("click", function () {
            if (currZoom < maxZoom) {
                currZoom = currZoom + 0.1;
                video.style.transform = `scale(${currZoom})`;
                console.log(currZoom);
            }

        })

        zoomOutBtn.addEventListener("click", function () {
            if (currZoom > minZoom) {
                currZoom = currZoom - 0.1;
                video.style.transform = `scale(${currZoom})`
                console.log(currZoom);
            }

        })
        for (let i = 0; i < filters.length; i++) {
            filters[i].addEventListener("click", function (e) {
                removeFilter();
                appliedFilter = e.currentTarget.style.backgroundColor;
                let div = document.createElement("div");
                div.style.backgroundColor = appliedFilter
                div.classList.add("filter-div")
                body.append(div)
                
                
            })
        }
        function removeFilter() {
            let Filter = document.querySelector(".filter-div")
            console.log(Filter, "removed")
            if (Filter) Filter.remove()


        }
        // startBtn.addEventListener("click",function(){
        //     mediaRecorder.start();
        // })
        // stopBtn.addEventListener("click",function(){
        //     mediaRecorder.stop();
        // })
        recordBtn.addEventListener("click", function (e) {
            if (isRecording) {
                mediaRecorder.stop()
                isRecording = false;
                recDiv.classList.remove("record-animation")

            } else {
                mediaRecorder.start()
                appliedFilter = ""
                removeFilter();
                currZoom = 1;
                video.style.transform = `scale(${currZoom})`
                isRecording = true;
                recDiv.classList.add("record-animation")
            }
        })
        captureBtn.addEventListener("click", function () {
            if (isRecording) {
                return
            }
            capDiv.classList.add("capture-animation")
            setTimeout(function () {

                capDiv.classList.remove("capture-animation")

            }, 1000)
            //jo bhi img screen pr dikhara use save krana h
            let canvas = document.createElement("canvas")
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            let tool = canvas.getContext("2d");
            tool.translate(canvas.width / 2, canvas.height / 2);

            tool.scale(currZoom, currZoom);

            tool.translate(-canvas.width / 2, -canvas.height / 2);
            tool.drawImage(video, 0, 0)
            if (appliedFilter) {
                tool.fillRect(0, 0, canvas.width, canvas.height)
                tool.fillStyle = appliedFilter;
            }
            let link = canvas.toDataURL()
            addMedia(link,"image")

            // let a = document.createElement("a");
            // a.href = link
            // a.download = "img.png"
            // a.click()
            // a.remove
        })
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (mediaStream) {

            mediaRecorder = new MediaRecorder(mediaStream);
            mediaRecorder.addEventListener("dataavailable", function (e) {
                chunks.push(e.data);
            })
            mediaRecorder.addEventListener("stop", function (e) {
                let blob = new Blob(chunks, { type: "video/mp4" })
                chunks = [];
                addMedia(blob,"video")
                // let a = document.createElement("a");
                // let url = window.URL.createObjectURL(blob);
                // a.href = url;
                // a.download = "video.mp4";
                // a.click();
                // a.remove();
            })
            video.srcObject = mediaStream;


        })
            .catch(function (err) {
                console.log(err);
            })