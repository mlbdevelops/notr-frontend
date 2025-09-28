import Header from '../components/header.jsx';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function PrivacyPolicy() {
  const router = useRouter();
  return (
    <div style={{margin: '70px 0' }}>
      <Header 
        text='Privacy policy'
        leftIcon={
          <ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>
        }
        isTransparent={true}
        blur={'10px'}
      />
      
      <div 
        style={{ maxWidth: '800px', margin : '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#d0d0d0', padding: '0 20px', }}
      >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Privacy Policy</h1>
      <p style={{ fontSize: '1rem', marginBottom: '2rem' }}><strong>Effective Date:</strong>September 26, 2025.</p>

      <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
        Notr (“we,” “our,” or “us”) values your privacy. This Privacy Policy explains how we collect, use, and share information when you use Notr(the “Service”). By using our Service, you agree to the practices described in this policy.
      </p>

      {/* 1. Information We Collect */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        We collect information to provide, maintain, and improve our Service. This includes:
      </p>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>a. Personal Information</h3>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li>Name, email address, profile picture, username, and other profile information you provide.</li>
        <li>Contact information if you choose to connect with other users.</li>
      </ul>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>b. Content You Create</h3>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li>Notes, posts, comments, uploaded media, and any content you share through the app.</li>
      </ul>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>c. Usage Information</h3>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li>Interaction data such as connections, likes, shares, time spent on the app, and preferences.</li>
        <li>Log data, including IP addresses, device information, browser type, and usage patterns.</li>
      </ul>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>d. Cookies and Tracking Technologies</h3>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        We may use cookies or similar technologies to personalize your experience, analyze usage, and improve the Service.
      </p>

      {/* 2. How We Use Your Information */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        We use the information we collect to:
      </p>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li>Provide and personalize the Service.</li>
        <li>Enable social features, including connections, posting, commenting, and sharing.</li>
        <li>Communicate with you about updates, promotions, and notifications.</li>
        <li>Analyze usage trends to improve app functionality and user experience.</li>
        <li>Ensure security, prevent fraud, and comply with legal obligations.</li>
      </ul>

      {/* 3. How We Share Your Information */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. How We Share Your Information</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        We respect your privacy and share your information only in the following ways:
      </p>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>a. With Other Users</h3>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        Content you post or share may be visible to other users depending on your privacy settings.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>b. Service Providers</h3>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        We may share data with vendors or service providers that help us operate the Service (e.g., cloud hosting, analytics).
      </p>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>c. Legal Requirements</h3>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        We may disclose your information to comply with applicable laws, regulations, or legal processes.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>d. Business Transfers</h3>
      <p style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        If we merge, are acquired, or sell assets, user information may be transferred as part of the transaction.
      </p>

      {/* 4. Your Choices */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Your Choices</h2>
      <ul style={{ marginLeft: '20px', marginBottom: '1rem' }}>
        <li><strong>Account Settings:</strong> You can manage your profile information, privacy settings, and visibility of your posts and connections.</li>
        <li><strong>Communication Preferences:</strong> You may opt out of marketing communications.</li>
        <li><strong>Deleting Your Account:</strong> You can request to delete your account and associated data.</li>
      </ul>

      {/* 5. Data Retention */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Data Retention</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        We retain your information for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements. When your information is no longer needed, we securely delete or anonymize it.
      </p>

      {/* 6. Security */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Security</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission or storage is completely secure.
      </p>

      {/* 7. Children’s Privacy */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>7. Children’s Privacy</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        Our Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If we learn we have inadvertently collected data from a child, we will delete it promptly.
      </p>

      {/* 8. Third-Party Links */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>8. Third-Party Links</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        Our app may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. Please review their privacy policies before providing any personal information.
      </p>

      {/* 9. Changes to This Privacy Policy */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>9. Changes to This Privacy Policy</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy in the app or via email. Your continued use of the Service constitutes acceptance of the updated policy.
      </p>

      {/* 10. Contact Us */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>10. Contact Us</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:  
        <br />
        <strong>Email:</strong> <a href="mailto:notr73442@gmail.com">notr73442@gmail.com</a>
      </p>
      </div>
    </div>
  );
};