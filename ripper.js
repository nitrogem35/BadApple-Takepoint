const sharp = require("sharp");
const fs = require("fs");
const ytdl = require("ytdl-core");
const extractFrames = require("ffmpeg-extract-frames");

const url = "https://www.youtube.com/watch?v=FtutLA63Cp8"; // Currently only works with youtube links.
const fileOutputName = "Bad-Apple";                        // Output name to be appended to all relevant file names.
const framesPerSecond = 0;                                // Defines how many frames should be converted per second of the video. Enter 0 to be the fps of the video.

async function bufferToBlock(imgBuffer){
    // Frame is a list of every pixel in frame. 
    const frame = await sharp(imgBuffer).removeAlpha().threshold().raw().toBuffer();
    let final_string = "";

    // Iterates through each pixel in the frame
    
}

(async function main(){
    try {
        let dir = `./${fileOutputName}-frames`;
        let frames = [];
        let mpegFile = "";

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        if(localFile == ""){
            mpegFile = `${dir}/${fileOutputName}.mp4`;
            console.log("Waiting for video to download...");
            await new Promise((resolve) => {
                ytdl(url).pipe(fs.createWriteStream(mpegFile)).on("close", () => {
                    resolve();
                })
            });
            console.log("Download complete.");
        }
        else {
            mpegFile = localFile
        }

        console.log("Converting video to frames...");
        let options = {input: mpegFile, output: `${dir}/frame-%d.jpg`, fps: framesPerSecond};
        if(framesPerSecond <= 0){
            // When fps is 0 or less, sets it to default
            options = {input: mpegFile, output: `${dir}/frame-%d.jpg`};
        }

        await new Promise((resolve) => {
            extractFrames(options).finally(() => {
                resolve();
            });
        });

        while (fs.existsSync(`${dir}/frame-${i}.jpg`)){
            let imgBuffer = await sharp(`${dir}/frame-${i}.jpg`).resize(450, 253, {kernel: sharp.kernel.nearest}).toBuffer();
        }
    }
    catch(error){
        console.log("Error: ", error);
    }
})();