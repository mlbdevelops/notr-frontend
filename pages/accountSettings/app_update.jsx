import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';
import Header from '../../components/header.jsx';
import { useRouter } from 'next/router';
import { ChevronLeft, CheckCircle2, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/update.module.scss';
import { FileOpener } from '@capacitor-community/file-opener';

export default function AppUpdate() {
  const router = useRouter();
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [updateNote, setReleaseNote] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState('•••');

  const apkUrl =
    'https://your-s3-apk-url.apk'; // <-- Make sure to replace with a valid APK URL

  const apkFileName = 'notr_update.apk';

  useEffect(() => {
    const getNote = async () => {
      const response = await fetch('https://notrbackend.vercel.app/notr/app/version');
      if (response.ok) {
        const data = await response.json();
        setReleaseNote(data);
      }
    };
    getNote();
  }, []);

  const handleDownload = async () => {
    if (Capacitor.isNativePlatform()) {
      await Toast.show({
        text: 'Please keep the app open while downloading...',
        duration: 'long',
        position: 'bottom',
      });
      
      await Toast.show({
        text: 'Make sure "Install unknown apps" permission is enabled for this app.',
        duration: 'long',
      });
      
    } else {
      if (!confirm('Keep the app open while downloading the update.')) return;
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
          <Rocket color="#6a69fe" size={20} /> Version 1.0.5 - October 2025{' '}
          <Rocket color="#6a69fe" size={20} />
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
        <div
          style={{
            marginTop: 20,
            width: '85%',
            maxWidth: 300,
            background: '#dddddd',
            borderRadius: 10,
            padding: 1,
          }}
        >
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

// ✅ Download and install APK
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

      try {
        const blob = xhr.response;
        const arrayBuffer = await blob.arrayBuffer();
        const base64Data = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Save APK inside app sandbox
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Data,
        });

        const fileUri = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });

        // Open APK installer
        await FileOpener.open({
          filePath: fileUri.uri,
          contentType: 'application/vnd.android.package-archive',
        });

        resolve();
      } catch (e) {
        reject(e);
      }
    };

    xhr.onerror = () => reject(new Error('Network error during download'));
    xhr.send();
  });
}