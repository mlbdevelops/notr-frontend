import { useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import Header from '../../components/header.jsx';
import { useRouter } from 'next/router';
import { ChevronLeft, CheckCircle2, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/update.module.scss';

export default function AppUpdate() {
  const router = useRouter();
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState('Idle');

  const apkUrl =
    'https://pro-app-storage.s3.amazonaws.com/builds/d505ed31-6ea2-4651-830f-3a0fa4561daf-release.apk?AWSAccessKeyId=ASIAUUWEHETWW4PPDNAA&Signature=N1PSdFbqNemGjCB4YkGGjzBoeTU%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCICuT8rQdv%2Fr2EPrAVaF3OExAl6cArW02F2T165ZR47qJAiAhRc3sSVrVHWsmqBbOBjTgDoHb%2FS3EdepaKa%2BWUG6R0SqkBAij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDMxOTMxMjgzMTcyNSIM1H%2FMOtyDjPmg1UDfKvgDZd5oihq%2B6EPbE7dFZ05Zwk%2B5J49geuneg3cT5Lo2IQlhV1SH3R5Ez4b%2Fbiq6occcQkGiygjKU5AtRdKX0bvpVrMNxKrxXesae2CPV%2F%2FWsbVG0g2UL4JTW5YR48Rtk%2FT8VXowu%2BNoEu8SuKDVsok%2Byj6KkjOsbPTMj9FzigVzeudbJjCKbMlIOf3O9%2BL%2FCMz6OMXb9UV3gsTdxgVzqr24KD%2F6W3tAlpM3yOmRU58kF2rdLxPcmj3BYYkdBKWdbeux9WAJ3xyb5C4KD4Q0r9pqfVs%2FrUFW2cWayfo9fo4vUA%2F3tZVRMth3HjNbcR0sif7PqvZs2%2B%2BoyVaHSuOQ15MV2PDHVzaltsHfFzwPjDEmK0dyzXHd7dkZXXwVHVXcf%2Br1GjoYyUcfuydqgKTnpfkQ15sMONLo%2BStn8MZF8kFj0UbTbTkfrRKFAoApTn5N97PeCKP%2B0OnRePAvRyvkIF0qgImdJd7qwke7h6AGtq4Ffwbdc8xTRD1NyMHP9P7lFMB4bpejIFeHCSLG%2FjoO0vovOFlIP0SPmSgjXFO3bXPcALDPrK54kTnDQx4CXqbZcmT2j1KUJRnXmhKMZ7STJx7K3uSNXUQn9MFM3lvJbzdaUj5eZ%2FIvQ0EUZiaz8oQ0o8p6kWfTkBQ80d8qAj4NlAtT3G2%2F0X5GFNhEMM%2FEk8cGOqcBjvYNgAVI1XPnReukxW1ZgTVS6N8Cbviu7Jeactg8iRAy66fT%2Byl%2BzFLhybWQXD0%2BrKBfsMm%2BKSnpdJ%2BmO7w1ekrcCNWMrf1pLmT5Jr68yTr6BQzo6cD8wti6NNjqCw6DT4BKs1%2B%2BtN2jEBQMufS7KdsVIeNjzWoipj5HJvXXGPCJSRJvC7yWjYOx331hg89qeBiH43poFzeeOKs96744VJrg0YXCxNc%3D&Expires=1759837876';
  const apkFileName = 'notr_update.apk';

  const handleDownload = async () => {
    if (!confirm('Keep the app open while downloading the update.')) return;
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
      </div>

      <div className={styles.updateNote}>
        <span className={styles.updateDate}>
          <Rocket size={20} /> Version 1.0.5 - October 2025
        </span>
        <small>Highlights</small>
        <ul className={styles.ul}>
          <li>
            Enhanced search experience
            <small>Search posts using keywords in notes.</small>
          </li>
          <li>
            Performance & stability improvement
            <small>Core optimizations make the app smoother.</small>
          </li>
          <li>
            Refined UI
            <small>Subtle design enhancements for a polished look.</small>
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
        <div style={{ marginTop: 20, width: '85%', maxWidth: 300, background: '#ddd', borderRadius: 5 }}>
          <div
            style={{
              width: `${progress}%`,
              height: 10,
              background: '#6b59ff',
              borderRadius: 5,
              transition: 'width 0.2s',
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 12, color: '#555' }}>
        Make sure "Install unknown apps" permission is enabled.
      </div>

      <div style={{ marginTop: 5, fontSize: 12, color: '#555' }}>Status: {status}</div>
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

      // Convert in chunks to avoid memory issues
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