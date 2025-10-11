import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';
import Header from '../../components/header.jsx';
import { useRouter } from 'next/router';
import { ChevronLeft, CheckCircle2, Rocket, Check, ArrowUpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/update.module.scss';
import { FileOpener } from '@capacitor-community/file-opener';
import { useCache } from '../../hooks/notrCachingHook.js';

export default function AppUpdate() {
  const router = useRouter();
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [updateNote, setReleaseNote] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [isNewUpdate, setIsNewUpdate] = useState(false);
  const [androidVersion, setAndroidVersion] = useState(false);
  const [status, setStatus] = useState('•••');
  const [update, setUpdate] = useState({});
  
  useEffect(() => {
    const update = sessionStorage.getItem('isNewUpdate')
    if (update) {
      setIsNewUpdate(true)
    }
  }, [])
  
  useEffect(() => {
    const update = sessionStorage.getItem('update')
    if (update) {
      setUpdate(JSON.parse(update))
    }
  }, [])
  
  const apkUrl = update?.apkUrl
  
  const apkFileName = `notr_release_v${update.latestVersion}.apk`;
  
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const getVersion = async () => {
        const info = await App.getInfo()
        const currentVersion = info.version;
        setAndroidVersion(currentVersion)
      }
      getVersion()
    }
  }, [androidVersion])
  
  const handleDownload = async () => {
    if (Capacitor.isNativePlatform()) {
      await Toast.show({
        text: 'Please keep the app open.',
        duration: 'long',
        position: 'center',
      });
      
    } else {
      if (!confirm('Keep the app open while downloading the update.')) return;
    }
    setDownloading(true);
    setStatus('Starting download...');
    try {
      await downloadAndInstall(apkUrl, apkFileName, setProgress, setStatus);
      setStatus('Successfully downloaded. Approve installation...');
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + err.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };
  
  if (!isNewUpdate) {
    return(
      <div style={{
        marginTop: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
      }}>
        <Header
          leftIcon={<ChevronLeft style={{ padding: 10 }} onClick={() => router.back()} />}
          text={t('header.update')}
          isTransparent
          blur="10px"
          rightIcons={<ArrowUpCircle />}
        />
        <h1 style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          fontWeight: 'bold',
        }}>
          <CheckCircle2 size={50}/>
          You're up to date
        </h1>
        <span style={{
          color: 'darkgray',
          textAlign: 'center',
          width: '90%',
          maxWidth: 500,
          fontSize: 15
        }}>
          Congratulations, you're using the latest version of Notr. Stay tunned for future updates.
        </span>
        {Capacitor.isNativePlatform()? <span style={{color: 'white', position: 'fixed', bottom: 30, }}>
          {androidVersion}
        </span> : ''}
      </div>
    )
  }else{
    return(
      <div className={styles.body}>
        <Header
          leftIcon={<ChevronLeft style={{ padding: 10 }} onClick={() => router.back()} />}
          text={t('header.update')}
          isTransparent
          blur="10px"
          rightIcons={<ArrowUpCircle />}
        />
  
        <div className={styles.updateMsg}>
          <strong className={styles.updateTitle}>App update available</strong>
          <small className={styles.msg}>Read below to see what's new in Notr.</small>
          <p className={styles.updateDate}>
            <Rocket color="#6a69fe" size={20} /> Version {update.latestVersion} - {update.date}
            <Rocket color="#6a69fe" size={20} />
          </p>
        </div>
  
        <div className={styles.updateNote}>
          <small>Highlights</small>
          {update.versionNote.hight.length >= 1?
            update.versionNote.hight.map((note) => (
              <ul className={styles.ul}>
                  <li className={styles.li}>
                    {note.title}
                    <small className={styles.small}>{note.desc}</small>
                  </li>
              </ul>
            ))
          : '-'}
          <small>Bug fixes</small>
          {update.versionNote.fixes.length >= 1? 
            <ul className={styles.ul}>
              {update.versionNote.fixes.map(fixed => (
                <li>
                  {fixed}
                </li>
              ))}
            </ul>
          : '-'}
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
      try {
        const blob = xhr.response;
        const arrayBuffer = await blob.arrayBuffer();
        const base64Data = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Data,
        });
        
        const fileUri = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });
        
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