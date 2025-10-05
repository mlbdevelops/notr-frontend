import Header from '../../components/header.jsx';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function app_update(){
  const router = useRouter()
  const { t } = useTranslation()
  return(
    <div>
      <Header
        leftIcon={
          <ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>
        }
        text={t('header.update')}
      />
    </div>
  );
}