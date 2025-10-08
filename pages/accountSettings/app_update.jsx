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

export default function AppUpdate() {
  const router = useRouter();
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [updateNote, setReleaseNote] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState('•••');

  const apkUrl =
    'https://pro-app-storage.s3.amazonaws.com/builds/2e9b1198-bef1-4207-ac14-a5e97f01e90e-release.apk?AWSAccessKeyId=ASIAUUWEHETWZFVSUM3J&Signature=4NKzuFd6U2HvJT9TROP4KmEg%2BHc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjECwaCXVzLXdlc3QtMiJGMEQCIGP17Ou3BLF6dcIixOrgsmHuWVPaNNW9IQfObUtMjRZcAiBPiUaV%2BJfXfJwqHE3pZGGVmAADKbso%2Fj87XFCn7jhXqyqkBAjF%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDMxOTMxMjgzMTcyNSIMnIYeLXzgP%2BVXQnsgKvgDr2t8A2R985jxTQ%2FI%2BKzenyCNo8o8J8CkthAYk9xf3sPC4uhJjHaHhC2TXrUMnC9GoOcz8vlsE91VhqBV2ORHNFDe7d4vLneDcecyHGD6leOuOn4%2FMapFRXMR4ishIxZpEGkxqMbfFQl2d%2FIcseMCMnT2zt%2FyUBAuaC19M0%2FNL%2BPSDtSuMAUOaQa6%2FRqE3m1UjfY1Yt7rmkLLHgMmjOxwkSyIUMISemMn7rjtgCsMtYqqfnhruHlU1%2BDhMBEPh%2FnfLqprUW65casqRL8cybYrmp9frPPYAXTbchIjmc7eNzJrL2X3590E2q90tX8ju6JRaHd11n4D%2FT3n3VDTRBnF08WG7h5nmiyr3KoeX9mtiAs8OIsM6acSCPFrNiza1DAZop17im0X2hC2jQJf6Gwces2cAsTGV1KSN%2Bp7AVIs9RKdl5kv9bo41uaFiWb9oBUUHBsW%2FbmjdynE7a0Ni0HG2mlSQ8%2BPBtBtft7LdIko1LoBO2VExNiE8ouA8ldY4JNod76JBgT91B2WtCUm0QAaQAQ2%2FQ9idrg9jXxz4zMaZd6DtF015QmIUrwX5tCPlyCE7TLevH%2BZ%2FJxGfqq1SvPjBo32jt7IR4yveFbr9eMGwt%2FK3RQu9%2BRxYxuUcZZNJXlA09WjMX86MAqnqSBj9o3OHuS9%2BjEFWzOAMKaJm8cGOqcB%2BirBalSl67WD6C9NVyGyyyI4xG1FVe4mBLxkQ%2FQTy8zOzBvu22qanngp9%2BYzcfDzProVZMP3Jlo0ofk2mpnkhpSnoAcR1EFuNr9wryu3eR1yf%2F8LVdtQFINX4jmVCmdza%2F7IOBGB9j1qIudVRfDzII7NtJ9EFO29O0XBrxRkyeMCXloGBXrMZks8dI8ZGNuwzrowFVkniZcqiUAT6GC8Kv%2Fm0TznD28%3D&Expires=1759963881';
  
  const apkFileName = 'notr_update.apk';
  
  useEffect(() => {
    const getNote = async () => {
      const response = await fetch('https://notrbackend.vercel.app/notr/app/version');
      const data = await response.json();
      if (res.ok) {
        setReleaseNote(data.note)
      }
    }
  }, [])

  const handleDownload = async () => {
    if (Capacitor.isNativePlatform()) {
      await Toast.show({
        text: 'Keep the app open while downloading the update.',
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