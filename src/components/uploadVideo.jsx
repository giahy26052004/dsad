import React, { useState } from "react";
import { BounceLoader, DotLoader } from "react-spinners";
function UploadVideo() {
  const [sourceFile, setSourceFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false); // Đổi từ true thành false để ẩn khi mới tải trang
  const [color, setColor] = useState("#b49c9c");
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const handleSourceChange = (event) => {
    setSourceFile(event.target.files[0]);
  };

  const handleTargetChange = (event) => {
    setTargetFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Hiển thị loader khi bắt đầu upload

    if (!sourceFile || !targetFile) {
      setMessage("Please select both files.");
      setLoading(false); // Ẩn loader khi có lỗi
      return;
    }

    const formData = new FormData();
    formData.append("source", sourceFile);
    formData.append("target", targetFile);

    try {
      const response = await fetch("http://54.153.223.15:5000/process", {
        method: "POST",
        body: formData,
      });

      // Check if response is a file (binary) or JSON
      const contentType = response.headers.get("Content-Type");

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          // Handle JSON response
          const result = await response.json();
          setMessage(`Upload successful: ${JSON.stringify(result)}`);
        } else if (
          contentType &&
          (contentType.includes("video/") || contentType.includes("audio/"))
        ) {
          // Handle binary file response (e.g., video or audio)
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setDownloadUrl(url);
          setMessage("File ready for download.");
        } else {
          setMessage(`Unexpected response type: ${contentType}`);
        }
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Ẩn loader sau khi hoàn thành upload
    }
  };

  return (
    <div className="">
      <div className=" flex justify-center items-center">
        <form onSubmit={handleSubmit}>
          <div className="m-7 mt-3 flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <label
                htmlFor="sourceFile"
                className="text-lg font-semibold mx-2 "
              >
                Select photo:
              </label>
              <input
                type="file"
                id="sourceFile"
                accept="image/*,video/*"
                onChange={handleSourceChange}
                required
                className="file:border ml-[20px] file:border-gray-300 file:py-2 file:px-4 file:rounded-md file:text-sm 
                  file:font-medium file:text-gray-300 hover:file:bg-gray-600"
              />
            </div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="targetFile"
                className="text-lg font-semibold mx-2"
              >
                Select video to:
              </label>
              <input
                type="file"
                id="targetFile"
                accept="image/*,video/*"
                onChange={handleTargetChange}
                required
                className="file:border  file:border-gray-300 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-medium file:text-gray-300 hover:file:bg-gray-600"
              />
            </div>
          </div>

          <div className="w-full h-10 bg-slate-900 rounded-md flex items-center justify-center mr-3   float-right hover:opacity-70 md:w-20 mt-20 md:mt-0">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed" // Màu nền và con trỏ khi bị vô hiệu hóa
                  : "bg-blue-600 hover:bg-blue-700" // Màu nền và hover khi không bị vô hiệu hóa
              }`}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center items-center mt-[-50px]">
        {message && <p>{message}</p>}
        {loading && (
          <div className="flex w-full px-20 pr- items-center justify-between">
            <div className="w-[280px]">
              (This process may take a few minutes )
            </div>
            <div className="flex flex-col">
              <BounceLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <span>Processing...</span>
            </div>
          </div>
        )}
        {downloadUrl && (
          <div className="ml-2">
            <a
              href={downloadUrl}
              download="output_file"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-slate-300 underline bg-slate-600 p-1 rounded-md"
            >
              Link Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadVideo;
