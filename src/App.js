import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./App.css";

function App() {
  // Set Form Input
  const [isForm, setIsForm] = useState([]);
  const onChangeInput = (name, value) => {
    setIsForm({
      ...isForm,
      [name]: value,
    });
  };

  // Set file input
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  // Show preview image after upload the image
  const previewImage = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          alt="img"
          src={file.preview}
          className="min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px]"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  // Setting up the canvas
  let canvas = document.getElementById("myCanvas");
  // Get the 2D Context from the canvas
  let ctx = canvas?.getContext("2d");
  // Some image URL..
  let imageUrl = `${files[0]?.preview}`;

  // Add Text to the canvas
  let textToWriteDear = `${isForm?.dearName}`;
  let textToWriteMessage = `${isForm?.messageTo}`;
  let textToWriteFrom = `${isForm?.fromName}`;

  // Add Text Style to the canvas
  let textStyleOptions = {
    fontSize: 25,
    textColor: "black",
    textAlign: "left",
  };

  // To Break Lines
  function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];
    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  // Load image on the canvas
  let img = new Image();

  // Setting up a function with the code to run after the image is loaded
  img.onload = () => {
    // Once the image is loaded, we will get the width & height of the image
    let loadedImageWidth = img.width;
    let loadedImageHeight = img.height;

    // Set the canvas to the same size as the image.
    canvas.width = loadedImageWidth;
    canvas.height = loadedImageHeight;

    // Draw the image on to the canvas.
    ctx.drawImage(img, 0, 0);

    // Set all the properties of the text based on the input params
    ctx.font = `${textStyleOptions.fontSize}px ${textStyleOptions.fontFamily}`;
    ctx.fillStyle = textStyleOptions.textColor;
    ctx.textAlign = textStyleOptions.textAlign;

    // Setting this so that the postion of the text can be set
    ctx.textBaseline = "top";
  };

  img.src = imageUrl;

  // Download button function
  const download_image = async () => {
    // Write text into the canvas
    ctx.fillText(textToWriteDear, 300, 200 , 320);

    let arrayOfLines = getLines(ctx, textToWriteMessage, 350);
    
    // Set line height as a little bit bigger than the font size
    let lineheight = textStyleOptions.fontSize + 10;
    
    // Loop over each of the lines and write it over the canvas and break the lines
    for (let i = 0; i < arrayOfLines.length; i++) {
      ctx.fillText(arrayOfLines[i], 200, 250 + ( i * lineheight ) );
    }

    ctx.fillText(textToWriteFrom, 280, 360, 320);

    const imageLink = document.createElement("a");
    const canvasDownload = document.getElementById("myCanvas");
    imageLink.download = "card.png";
    imageLink.href = canvasDownload.toDataURL("image/png", 1);

    await imageLink.click();

    // Clear the image preview, canvas, and form text
    await ctx.clearRect(0, 0, canvas.width, canvas.height);
    await setFiles([]);
    await setIsForm([]);
  };

  return (
    <div className="App">
      <div className="bg-gray-200 w-screen h-screen">
        <main className="container mx-auto border rounded-md bg-white lg:w-2/4 w-3/4 px-2">
          <div className="flex justify-start w-full border-b-2 border-gray-200 font-sans py-5 pl-3">
            <h1 className="font-semibold text-2xl ">Gift Card</h1>
          </div>
          <div className="grid my-3 mx-2">
            <div className="mb-3 ">
              <div className="flex gap-2 justify-center my-3">
                <ul>{previewImage}</ul>
              </div>
              <div className="flex">
                <label className="text-sm font-bold" htmlFor="fileUpload">
                  File Upload
                </label>
              </div>
              <div {...getRootProps({ className: "dropzone" })}>
                <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <span className="flex flex-col py-5 justify-items-center items-center space-x-2">
                    <FaCloudUploadAlt />
                    <span className="font-bold text-gray-600">
                      Browse Files
                    </span>
                    <span className="text-gray-600">
                      Drag and drop files here
                    </span>
                  </span>
                  <div>
                    <input
                      type="file"
                      className="hidden"
                      name="files"
                      {...getInputProps()}
                    />
                  </div>
                </label>
              </div>
            </div>
            <div className="grid mb-3 justify-items-start">
              <div className="flex">
                <label className="text-sm font-bold" htmlFor="dearName">
                  Dear
                </label>
              </div>
              <input
                type="text"
                id="dearName"
                name="dearName"
                className="w-30 border border-gray-300 focus:outline-none rounded"
                value={isForm?.dearName || ""}
                onChange={(e) => onChangeInput("dearName", e?.target?.value)}
              />
            </div>
            <div className="grid mb-3 justify-items-start">
              <div className="flex">
                <label className="text-sm font-bold" htmlFor="messageTo">
                  Message
                </label>
              </div>
              <input
                type="text"
                id="messageTo"
                name="messageTo"
                className="w-30 border border-gray-300 focus:outline-none rounded"
                value={isForm?.messageTo || ""}
                onChange={(e) => onChangeInput("messageTo", e?.target?.value)}
              />
            </div>
            <div className="grid mb-3 justify-items-start">
              <div className="flex">
                <label className="text-sm font-bold" htmlFor="fromName">
                  From
                </label>
              </div>
              <input
                type="text"
                id="fromName"
                name="fromName"
                className="w-30 border border-gray-300 focus:outline-none rounded"
                value={isForm?.fromName || ""}
                onChange={(e) => onChangeInput("fromName", e?.target?.value)}
              />
            </div>
          </div>
          <div>
            <button
              className="border-2 rounded my-5 w-28"
              onClick={(e) => download_image()}
            >
              Download
            </button>
          </div>

          <div>
            <canvas
              id="myCanvas"
              width="200"
              height="200"
              className="hidden"
            ></canvas>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
