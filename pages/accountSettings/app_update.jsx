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
  
  const linkForD = 'https://pro-app-storage.s3.amazonaws.com/builds/ffae40c5-f93b-4491-b48b-943bbfa18a2a-release.apk?AWSAccessKeyId=ASIAUUWEHETWWELFZA3G&Signature=KlqXfGK9Nh4cAV2%2BPmrDB4%2FAIIU%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFrP%2FQxCyYPCGkxPQaIFD21ZzyqrDktp53HEidiKAoNAAiB7H4Xtd6p5MWzxQ4phpU1GGlQ6ahjTNffwDmiSbJTTFiqbBAh8EAAaDDMxOTMxMjgzMTcyNSIMGQa1sQER3NGXgbiYKvgDLuVwaP7WvMyawrenLgMhhC6l2iEHjWbfkW4yFlgU%2BU4bEImmeGzmki4F4TakhsUdINZBxmZhp56VDQSzHLOu4COSv%2FnKJlaiRlzqW%2FUd1lSuWgAL22sBrlNHy%2BEjT4ZSnGwtErVL0L4WXEUkihEiTFCp4yuW%2F2eUNMqzvwzDg40VX0zD4%2Bjwq%2FQZXUn4IlU%2Fz1NAwzAd04v2KIyNSq%2FDCw9bgJt%2BTOzQ%2BIjSact0ZQ7x4vS8pDNz2pdK4zRd1lM5b%2BCpdfoDwoJbgn2nmpZ40GGc67ud67Sgbpyoc5%2F672V5HQhP8s80tw8n6EKpaS1kTtwuY%2B%2F8GC1NjHpxxK72QPtrW51bXdrVkN16MGIUr1QxNQBDxjgcN3b5UYwYp7dxyH0ehsGvoGU3QUS7CCKP7Y0fwKhNFlW%2Fgwb2aO4FyINqp%2Fzh8Fc30EyJ2wuo%2BwbFXyisUVEXAHuPUB0Zrv%2Fs0cg9fdUeCxDXkZwZxHxdczIQ1Ls023r0VcRbrMlDLY%2F2Ugdi%2BJdcHD%2Fth5sPaGuvirc%2BcFs4NTkRu2vnpMoX7KAMIwxnBtgTzQ5b%2FwL3%2FYkHWJP12QCbwXmkCg2Dx%2B3EWXzT06062tzCs1Ix5PMg004oEhrdcYSzFGay956t9JPRtTmE6gUwv1oLOXU9okEtGLuuJItVEQG4MMuFi8cGOqcBu3tUBb5atNK6eDNPIHKuwHsTnygnbDiePCUbfOGHu4J3x3sU8LrCgeEAPZejFAzGQ3IjrAnSWgc8ugKzwwGhy8LKYsWydq7vgssLPYf%2FGBvh4NJCGll14qWtBiD4%2FnUE0eFDmapqnipFE5aG8BKZC9sYQQ70ihgyKCTIDdwwiyWAqNp6Hg33%2Bkq7nNvJ8H0Uf39QDD%2FFhlP%2FL%2Fx8U0EXvVvAs3VXBWM%3D&Expires=1759700855'
  
  // Optional: test trigger
  const tata = false;
  if (tata) {
    downloadAndInstallApk('https://d.apkpure.com/b/APK/com.facebook.lite?versionCode=511500560');
  }

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
          A new app update is available, read the section below to know what's new in Notr.
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
              Post discovery just got smarter — you can now search posts using keywords in notes
              for faster, more accurate results.
            </small>
          </li>

          <li>
            Performance & stability improvement
            <small>
              Core optimizations make the app smoother, reduce memory usage, and improve
              responsiveness across all devices.
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
        onClick={() =>
          downloadAndInstallApk(linkForD)
        }
        className={styles.downloadButton}
      >
        Download update
      </button>
    </div>
  );
}

/* -----------------------------
   CHECK FOR UPDATE (Optional)
--------------------------------*/
async function checkForUpdate() {
  try {
    const response = await fetch('https://notrbackend.vercel.app/notr/version.json');
    const data = await response.json();
    const info = await Device.getInfo();
    const currentVersion = info.appVersion || '1.0.0';

    if (currentVersion !== data.latestVersion) {
      if (confirm(`New version ${data.latestVersion} available. Download now?`)) {
        await downloadAndInstallApk(data.apkUrl);
      }
    }
  } catch (err) {
    console.error('Update check failed:', err);
  }
}

/* -----------------------------
   DOWNLOAD & INSTALL APK
--------------------------------*/
async function downloadAndInstallApk(apkUrl) {
  try {
    console.log('Downloading APK from:', apkUrl);

    // Fetch APK as blob
    const response = await fetch(apkUrl);
    const blob = await response.blob();
    
    // Convert blob to Base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // Save APK file
    const filePath = 'notr_update.apk';
    await Filesystem.writeFile({
      path: filePath,
      data: base64Data,
      directory: Directory.External,
    });

    // Get native URI
    const fileUri = await Filesystem.getUri({
      path: filePath,
      directory: Directory.External,
    });

    console.log('Saved APK at:', fileUri.uri);

    // Open APK file to trigger installation prompt
    await FileOpener.open({
      filePath: fileUri.uri,
      mimeType: 'application/vnd.android.package-archive',
    });
    
    console.log('Installation prompt opened.')
  } catch (err) {
    console.error('APK download/install failed:', err);
    alert('Update failed: ' + err.message);
  }
}