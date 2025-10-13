import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import styles from '../styles/qrcode.module.scss'

function qrCode() {
  const qrRef = useRef();
  
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const size = canvas.width;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext("2d");
    ctx.fillStyle = "#1d1d1d";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(canvas, 0, 0);
    const borderWidth = 10;
    ctx.strokeStyle = "#262626";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);
    const url = tempCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };
  
  return (
    <div>
      <h1>QR Code</h1>
      <div ref={qrRef}>
        <div>
          <QRCodeCanvas style={{border: '1px solid #262626', borderRadius: 10, margin: 0, padding: 10, backgroundColor: '1d1d1d',}} value="tempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.widthtempCanvas.width" size={256} />
        </div>
      </div>
      <button onClick={downloadQRCode}>Download QR Code</button>
    </div>
  );
}

export default qrCode;