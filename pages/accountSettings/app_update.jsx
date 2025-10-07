import { useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Device } from '@capacitor/device';
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
  
  const apkUrl =
    'https://pro-app-storage.s3.amazonaws.com/builds/a41668d5-47ce-44e3-a46a-ad7047f15d19-release.apk?AWSAccessKeyId=ASIAUUWEHETWYYI7UXEO&Signature=RrT9v8Urd7KIemgD1mZpe6f5rU4%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEAkaCXVzLXdlc3QtMiJIMEYCIQDlndwpSp2jhyt5Tp%2FK5k0e7DFPCoOycmSMo8eiRKxUSgIhAIXbXGKIHT5ySMm1Rl70VpobsrNuZw2ijzV3pqznuhrPKqQECKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMzE5MzEyODMxNzI1IgwfIjpVEqeAxNpuVp0q%2BAOR2NmCkWMmp5Wv0kUy8XbhGslsGGeMH8WBzgnepQFOMJ%2Ba7v9FmDs7sIN%2Fj%2BJPJ1SrseH9%2BsZGvY9x32tp6mJ842Adq5bJ8gtcpnZ3BJQj%2FNeV7ER9MI2saoO8A%2FkbLvAt8LxIFcKOGVacgM6lzFD5yz%2FLIQoGnAfZAza%2FDx5lWhZkUIO8u%2BeywKPM3OR%2B7w6LkhU%2BuhWk%2FVruxnO33lzOBBJc%2Fpv94xW%2F4RCgJPeUGBxD75Se3YJHan9uFLlsn5p6LouyU6990Wpw%2B%2F2D4kQvdOZbj%2F5mfxBICWoM%2F4xqLfiaNYU0euz2M0ixzhz4X74DpACE2Q19b1EJxdYUFI4tFWy9Nxk2T0jwAhjKkvvM53oI%2BWqGzIT5Tz25epncjbMU96PGiwdBfAAYvCxk0Oi7ebCN1kot6TjXB69Fnthq5Px5ffob7BP%2F1tVL5uw4TjaPACM00yCbLNKvKR4PZTuzBfkoc7rKP3wavOuVMlXRur9EZoL5GnUYHGvSiOacuvCzsGdo8uOU8VlgEaDuWndPLOjmaPFHKhqViD%2F9nFIEO2Yidt48BOY8YJZHDJpD3lsfYniFyswZawAzidOVKajKwLXznrHvd26qr8Ws5qzxjTZLZ4ehFoAZ7idE%2B5MJEYGRoVzU3TAqfDJ8vE510kjjRd22B7nW4rYwkK6TxwY6pQEVFcdK4N7Uc8ckKR2HCIDEEHN3gOWgghMrNG6zjd8pQuNgwKcyoVzjtn4SeWjRnmz8ifDUn1fQEuDXdK1EppEZW0RcgDkUtq0SJu2EAl3a2vD90lYisljXUZZtCUv%2BDQTV1D8rG0Dh%2BQ6dhl56YnwXr%2B%2BVwkH30HDUElUKexZo4wmRyN6w1wMRRQWaVZgQ%2BY0hcqhNiw%2BIxZ6qD4DUhsEWOcVx3Wc%3D&Expires=1759833499';

  const handleDownload = async () => {
    if (!confirm('A new version is available. Keep the app open while it downloads.')) return;
    setDownloading(true);
    try {
      await downloadAndInstallApk(apkUrl, setProgress);
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className={styles.body}>
      <Header
        leftIcon={<ChevronLeft style={{ padding: '10px' }} onClick={() => router.back()} />}
        text={t('header.update')}
        isTransparent={true}
        blur={'10px'}
        rightIcons={<CheckCircle2 />}
      />

      <div className={styles.updateMsg}>
        <strong className={styles.updateTitle}>App update available</strong>
        <small className={styles.msg}>
          A new app update is available. Read below to know what's new in Notr.
        </small>
      </div>

      <div className={styles.updateNote}>
        <span className={styles.updateDate}>
          <Rocket size={20} /> Version 1.0.5 - October 2025
        </span>

        <small>Highlights</small>

        <ul className={styles.ul}>
          <li>
            Enhanced search experience
            <small>
              Post discovery just got smarter — you can now search posts using keywords in notes.
            </small>
          </li>
          <li>
            Performance & stability improvement
            <small>
              Core optimizations make the app smoother, reduce memory usage, and improve responsiveness.
            </small>
          </li>
          <li>
            Refined user interface
            <small>Subtle design enhancements for a more polished look.</small>
          </li>
        </ul>

        <small>Bug fixes</small>

        <ul className={styles.ul}>
          <li>Fixed rare crash when loading user profiles.</li>
          <li>Corrected issue where search results weren’t updated in real time.</li>
          <li>Improved offline draft saving for notes.</li>
        </ul>
      </div>

      <small className={styles.msg}>This version will be obsolete in 3 days.</small>

      <button
        onClick={handleDownload}
        className={styles.downloadButton}
        disabled={downloading}
      >
        {downloading ? `Downloading... ${progress}%` : 'Download update'}
      </button>

      {downloading && (
        <div style={{ marginTop: 10, width: '100%', background: '#ddd', borderRadius: 5 }}>
          <div
            style={{
              width: `${progress}%`,
              height: 8,
              background: '#4caf50',
              borderRadius: 5,
              transition: 'width 0.2s',
            }}
          />
        </div>
      )}
    </div>
  );
}

/* -----------------------------
   DOWNLOAD & INSTALL APK WITH PROGRESS
--------------------------------*/
async function downloadAndInstallApk(apkUrl, setProgress) {
  try {
    console.log('Starting APK download:', apkUrl);

    // Fetch with native Http plugin for progress
    // Using XMLHttpRequest for progress in JS
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', apkUrl);
      xhr.responseType = 'blob';

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = async () => {
        if (xhr.status !== 200) return reject(new Error('Download failed'));

        const blob = xhr.response;
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Convert to base64
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64Data = btoa(binary);

        const filePath = 'notr_update.apk';
        await Filesystem.writeFile({
          path: filePath,
          data: base64Data,
          directory: Directory.External,
        });

        const fileUri = await Filesystem.getUri({
          path: filePath,
          directory: Directory.External,
        });

        await FileOpener.open({
          filePath: fileUri.uri,
          mimeType: 'application/vnd.android.package-archive',
        });

        resolve();
      };

      xhr.onerror = () => reject(new Error('Network error during download'));
      xhr.send();
    });
  } catch (err) {
    console.error('APK download/install failed:', err);
    throw err;
  }
}