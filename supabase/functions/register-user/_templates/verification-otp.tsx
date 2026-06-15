import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface Props { fullName: string; verificationCode: string; verificationLink: string; appUrl: string; }

export const VerificationOtpEmail = ({ fullName, verificationCode, verificationLink, appUrl }: Props) => (
  <Html>
    <Head />
    <Preview>Your verification code: {verificationCode}</Preview>
    <Body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>
      <Container style={{ margin: '40px auto', padding: '20px', maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
        <Section style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Heading style={{ fontSize: '24px', color: '#B8860B', margin: '0 0 10px 0' }}>Verify your email</Heading>
        </Section>
        
        <Section style={{ marginBottom: '30px' }}>
          <Text style={{ fontSize: '16px', color: '#333333', margin: '0 0 15px 0' }}>
            Hi {fullName},
          </Text>
          <Text style={{ fontSize: '16px', color: '#333333', margin: '0 0 15px 0' }}>
            Your verification code is:
          </Text>
          <Section style={{ textAlign: 'center', margin: '30px 0' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#B8860B', letterSpacing: '8px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'inline-block' }}>
              {verificationCode}
            </div>
          </Section>
          <Text style={{ fontSize: '16px', color: '#333333', margin: '0 0 15px 0' }}>
            Or click the button below:
          </Text>
        </Section>

        <Section style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link
            href={verificationLink}
            style={{ display: 'inline-block', padding: '14px 40px', backgroundColor: '#B8860B', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}
          >
            Verify Email →
          </Link>
        </Section>

        <Section style={{ borderTop: '1px solid #e0e0e0', paddingTop: '20px', marginTop: '30px' }}>
          <Text style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px 0' }}>
            This code expires in 24 hours. If you didn't request this, ignore this email.
          </Text>
          <Text style={{ fontSize: '14px', color: '#999999', margin: '0' }}>
            © CMPapp. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationOtpEmail