import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import Header from '../../components/header.jsx';
import { useRouter } from 'next/router';
import { ChevronLeft, CheckCircle2, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/update.module.scss';
import { Capacitor } from '@capacitor/core'
import { Toast } from '@capacitor/toast'
import { App } from '@capacitor/app'

export default function AppUpdate() {
  const router = useRouter();
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [updateNote, setReleaseNote] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState('•••');

  const apkUrl =
    'https://pro-app-storage.s3.amazonaws.com/builds/1a50f630-b841-4c77-96e7-c4a76bc65075-release.apk?AWSAccessKeyId=ASIAUUWEHETWW7D4AI2R&Signature=9z%2B89%2FtpSdqytoCvCVy1hgLiMao%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDYaCXVzLXdlc3QtMiJHMEUCIQCo1yAX10yjCgALFSL0zpxXkzPVTj684fTTGEQRTCvcRQIgTkDXUE3uoMqVOCryUMvZOqJP6fACSQOUsZaWL6Lo%2F%2BMqpAQIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwzMTkzMTI4MzE3MjUiDCjqpCDK%2Bfv4VM5dgSr4A0zOZ57MU%2BrmytdH7MslCBmRLiSIjp5kVmPKoapLUs88uXva%2BBJTGrBeccnav%2FKG0pkBqXv0fDMwK56mV6rarDCz6rcycW%2BzyxPEHYeAPVh4dMfmXYzwRU2X8Q5U0l4lG%2F%2BgnmJWQgp9QRlSc7WZqZgns0CiFyjCBtp%2FCeMuvhPF%2B8EDp7s8%2BqOulu8WAy5GiIIwmLZrtL9fikATcKqdN8zCfGhj%2FiD1tg9FEDWUxF0sWVM0G%2FeT%2FrfINWfd8bi4a0mr5mGZmd7m67TcxOR%2FfuYBVINMX1Bu4a3Flmyn%2BRkhufSrx2WYvqdPgy%2F4g2d7OpWMuC%2BZ%2B4kmSGeCPSI420ZRBaw2pqbPbToM%2BrZBxT4Zxsa41DCoMDi2533OCfXOjtA5t4bGmvWoIz%2F7bTNRXt0oXQxmSEpsk9EuTCm8WS%2FhhoNOiHu2rEAGoOAKtsdYKpxh5QzZy8A0vQKABudquYTps95r3XyDmgtNXwoflGlKQW3PBlOXxh7DFSspvqm3vUb7HEaKoRu0qIyoQfdVL8UDG327igwKZx%2BGIAZU7MYRkPpBnJ8i%2FINmjAFvp56fSzhlrhakW6aEjze30Z0TpRs0oLUHQzNa14n7DNLqEnaMpuhZZXJhpcll1w6MtwHvGeAw%2FmfkagJ%2FmSMgcIjzpfeOTxJq7PNQYTCcpZ3HBjqmAbJwolqFcJAg2deJh3hgpJQ%2F6DklDnk6%2FximcEOuut0y4O%2BFHKNxksHVzqqqogGuDNZyVQJGsGN06nHYUJwV7ryUIqUlGhQedPsitw5t8k3hzP1dnNpLMEdjuSIwRu18FvoR5qf8awDm%2BUakmHDd6T0i4GNDsoMEAodDuUdpIRvwCmk6C2P96w0XLela4USGkMsBBkw8VBQp1hYKOUxZMbUZiw3Cvwg%3D&Expires=1760014376';
  
  const apkFileName = 'notr_update.apk';
  
  useEffect(() => {
    const getNote = async () => {
      const response = await fetch('https://notrbackend.vercel.app/notr/app/version');
      const data = await response.json();
      if (res.ok) {
        setReleaseNote(data)
      }
    }
  }, [])

  const handleDownload = async () => {
    if (Capacitor.isNativePlatform()) {
      await Toast.show({
        text: 'Please keep the app open.',
        duration: 'long',
        position: 'botttom',
      })
    }else{
      if (!confirm('Keep the app open while downloading the update.')) return
    }
    
    setDownloading(true);
    setStatus('Starting download...');
    try {
      await downloadAndInstall(apkUrl, apkFileName, setProgress, setStatus);
      setStatus('Installer launched. Approve installation.');
    } catch (err) {
      console.error(err);
      setStatus('Download failed: ' + err.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };
  
  return (
    <div className={styles.body}>
      <Header
        leftIcon={<ChevronLeft style={{ padding: 10 }} onClick={() => router.back()} />}
        text={t('header.update')}
        isTransparent
        blur="10px"
        rightIcons={<CheckCircle2 />}
      />
      <div className={styles.updateMsg}>
        <strong className={styles.updateTitle}>App update available</strong>
        <small className={styles.msg}>Read below to see what's new in Notr.</small>
        <p className={styles.updateDate}>
          <Rocket color='#6a69fe' size={20} /> Version 1.0.5 - October 2025
          <Rocket color='#6a69fe' size={20} />
        </p>
      </div>

      <div className={styles.updateNote}>
        <small>Highlights</small>
        <ul className={styles.ul}>
          <li className={styles.li}>
            Enhanced search experience
            <small className={styles.small}>Search posts using keywords in notes.</small>
          </li>
          <li className={styles.li}>
            Performance & stability improvement
            <small className={styles.small}>Core optimizations make the app smoother.</small>
          </li>
          <li className={styles.li}>
            Refined UI
            <small className={styles.small}>Subtle design enhancements for a polished look.</small>
          </li>
        </ul>
        <small>Bug fixes</small>
        <ul className={styles.ul}>
          <li>Fixed rare crash when loading profiles</li>
          <li>Search results updated in real time</li>
          <li>Offline draft saving improved</li>
        </ul>
      </div>

      <small className={styles.msg}>This version will be obsolete in 3 days.</small>

      <button onClick={handleDownload} disabled={downloading} className={styles.downloadButton}>
        {downloading ? `Downloading... ${progress}%` : 'Download update'}
      </button>

      {downloading && (
        <div style={{ marginTop: 20, width: '85%', maxWidth: 300, background: '#dddddd', borderRadius: 10, padding: 1, }}>
          <div
            style={{
              width: `${progress}%`,
              height: 10,
              background: '#6b59ff',
              borderRadius: 50,
              transition: 'width 0.2s',
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 12, color: '#555' }}>
        Make sure "Install unknown apps" permission is enabled.
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: 'white' }}>Status: {status}</div>
    </div>
  );
}

async function downloadAndInstall(url, fileName, setProgress, setStatus) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        setStatus(`Downloading... ${percent}%`);
      }
    };

    xhr.onload = async () => {
      if (xhr.status !== 200) return reject(new Error('Download failed'));
      const blob = xhr.response;
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
      }
      const base64Data = btoa(binary);
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.External,
      });
      const fileUri = await Filesystem.getUri({ path: fileName, directory: Directory.External });
      await FileOpener.open({ filePath: fileUri.uri, mimeType: 'application/vnd.android.package-archive' });
      resolve();
    };

    xhr.onerror = () => reject(new Error('Network error during download'));
    xhr.send();
  });
}