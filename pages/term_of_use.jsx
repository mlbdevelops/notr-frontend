import Header from '../components/header.jsx';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function TermsOfUse() {
  const router = useRouter();
  return (
    <div style={{margin: '70px 0' }}>
      <Header 
        text='Term of use'
        leftIcon={
          <ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>
        }
        isTransparent={true}
        blur={'10px'}
      />
      
      <div 
        style={{ maxWidth: '800px', margin : '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#d0d0d0', padding: '0 20px', }}
      >
      
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Terms of Use</h1>
      <p style={{ fontSize: '1rem', marginBottom: '2rem' }}><strong>Effective Date:</strong> September 26, 2025.</p>

      <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
        Welcome to <strong>Notr</strong> (“we,” “our,” or “us”). By accessing or using Notr (the “Service”), you agree to comply with and be bound by these Terms of Use.
      </p>

      {/* 1. Acceptance of Terms */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        By using Notr, you accept and agree to these Terms of Use and our Privacy Policy. If you do not agree, do not use our Service.
      </p>

      {/* 2. Eligibility */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Eligibility</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        You must be at least 13 years old to use the Service. By using Notr, you represent and warrant that you meet this age requirement.
      </p>

      {/* 3. Account Registration */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Account Registration</h2>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li>You may be required to create an account to access certain features.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You are responsible for all activities under your account.</li>
      </ul>

      {/* 4. User Content */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. User Content</h2>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li>You retain ownership of any content you post (notes, posts, comments, media).</li>
        <li>By posting content, you grant Notr a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content as necessary to operate the Service.</li>
        <li>You are solely responsible for your content and the consequences of sharing it.</li>
      </ul>

      {/* 5. Prohibited Conduct */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Prohibited Conduct</h2>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li>Post content that is illegal, harmful, offensive, or infringes on others’ rights.</li>
        <li>Harass, abuse, or harm other users.</li>
        <li>Attempt to interfere with the Service, including hacking or distributing malware.</li>
        <li>Use the Service for unauthorized commercial purposes.</li>
      </ul>

      {/* 6. Social Features */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Social Features</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        Connections, posts, and interactions may be visible to other users based on your privacy settings. Notr does not guarantee privacy or confidentiality of content shared with others.
      </p>

      {/* 7. Intellectual Property */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>7. Intellectual Property</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        The Notr app, design, and all associated materials are owned by Notr or our licensors. You may not copy, modify, or distribute our software or content without permission.
      </p>

      {/* 8. Termination */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>8. Termination</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        We may suspend or terminate your account for violations of these Terms or abusive behavior. You may delete your account at any time.
      </p>

      {/* 9. Disclaimers */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>9. Disclaimers</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        The Service is provided “as is” and “as available.” We do not guarantee uninterrupted access, accuracy, or reliability of the Service. You use the Service at your own risk.
      </p>

      {/* 10. Limitation of Liability */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>10. Limitation of Liability</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        Notr shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Maximum liability is limited to the amount you paid, if any, for using the Service.
      </p>

      {/* 11. Changes to Terms */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>11. Changes to Terms</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        We may update these Terms of Use at any time. Continued use of the Service constitutes acceptance of updated terms.
      </p>

      {/* 12. Governing Law */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>12. Governing Law</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        These Terms are governed by the laws of Democratic Republic of Congo (DRC). Any disputes will be resolved in the appropriate courts of that jurisdiction.
      </p>

      {/* 13. Contact */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>13. Contact</h2>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        For questions about these Terms, please contact us at:  
        <br />
        <strong>Email:</strong> <a href="mailto:notr73442@gmail.com">notr73442@gmail.com</a>
      </p>
      </div>
    </div>
  );
};
