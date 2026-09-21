import React from 'react'
import PublicLayout from '../../layouts/PublicLayout.jsx'

const sections = [
  {
    id: '1',
    title: '1. Who we are',
    body: [
      'Veridex Ltd ("Veridex", "we", "us", or "our") operates the Veridex digital publishing and rights management platform. Our registered address is Veridex Ltd, 12 Scholars Court, London EC2A 4RQ, United Kingdom.',
      'This Privacy Policy explains how we collect, use, store, and share personal data when you use our platform, and sets out your rights under applicable data protection law including the UK GDPR and the Data Protection Act 2018.',
    ],
  },
  {
    id: '2',
    title: '2. Data we collect',
    body: [
      'Account data: When you register, we collect your full name, email address, and a hashed version of your password. Institutional subscribers may also provide an organisation name and domain.',
      'Usage data: We log every content access event including the item identifier, timestamp, session token, and the IP address from which the request originated. This data forms part of the immutable audit trail required by our publisher licensing agreements.',
      'Payment data: Billing is processed by our payment provider (Stripe). We store only a tokenised reference and the last four digits of your card. We never hold full card numbers.',
      'Device and technical data: We collect browser type, operating system, and device fingerprint to enforce concurrent-session limits and detect anomalous access patterns.',
      'Communications: If you contact us via the contact form or by email, we retain those communications for up to three years.',
    ],
  },
  {
    id: '3',
    title: '3. How we use your data',
    body: [
      'Providing the service: We use your account and usage data to authenticate you, enforce your subscription entitlements, and serve content in accordance with publisher licensing rules.',
      'Security and fraud prevention: Usage logs and device data are analysed to detect credential sharing, bot access, and other abuse. Suspicious sessions are flagged or terminated automatically.',
      'Billing and administration: We use your payment data to process subscription fees, issue invoices, and handle refund requests.',
      'Communications: We send transactional emails (account verification, password reset, subscription renewal reminders). We will only send marketing communications if you have explicitly opted in.',
      'Legal compliance: We may be required to retain or disclose data to comply with a legal obligation, court order, or regulatory requirement.',
    ],
  },
  {
    id: '4',
    title: '4. Legal bases for processing',
    body: [
      'Contract performance: Processing your account, subscription, and access data is necessary to provide the services you have subscribed to.',
      'Legitimate interests: We process usage logs, device data, and security event data on the basis of our legitimate interest in maintaining platform security and meeting our obligations to content rights holders.',
      'Legal obligation: Audit trail retention and certain disclosures are required by our publisher licensing agreements and applicable law.',
      'Consent: Where we send marketing communications or use optional analytics cookies, we rely on your explicit consent, which you may withdraw at any time.',
    ],
  },
  {
    id: '5',
    title: '5. Data retention',
    body: [
      'Account data is retained for the duration of your subscription and for 24 months afterwards, to allow for reactivation and to resolve any billing disputes.',
      'Usage logs (audit trail) are retained for 7 years in accordance with our publisher licensing obligations. These logs cannot be deleted on request as they form part of a contractually required immutable record.',
      'Payment records are retained for 7 years in accordance with financial record-keeping requirements.',
      'Support communications are retained for 3 years from the date of the last message.',
      'Inactive accounts with no subscription history are deleted after 24 months of inactivity.',
    ],
  },
  {
    id: '6',
    title: '6. Data sharing',
    body: [
      'We do not sell personal data to third parties under any circumstances.',
      'We share data with the following categories of processors who act under our instruction and are bound by data processing agreements: cloud infrastructure provider (AWS, EU region), payment processor (Stripe), email delivery provider (Postmark), and error monitoring service (Sentry).',
      'Institutional administrators can view access logs for users within their organisation. This is disclosed to institutional subscribers at the point of sign-up.',
      'We may disclose data to law enforcement or regulatory bodies when required by law or to protect the rights and safety of our users.',
    ],
  },
  {
    id: '7',
    title: '7. Your rights',
    body: [
      'Under UK GDPR you have the right to: access a copy of your personal data; correct inaccurate data; request deletion of data (subject to retention obligations described above); restrict or object to processing; and data portability.',
      'To exercise any of these rights, contact us at shivamanikantavasu@gmail.com. We will respond within 30 days. Where we cannot fulfil a request (e.g. deletion of audit trail data), we will explain the legal basis.',
      'You have the right to lodge a complaint with the Information Commissioner\'s Office (ICO) at ico.org.uk if you believe we have processed your data unlawfully.',
    ],
  },
  {
    id: '8',
    title: '8. Cookies',
    body: [
      'We use strictly necessary cookies to maintain your authenticated session. These cannot be disabled without breaking the service.',
      'We use one analytics cookie (first-party, no cross-site tracking) to measure aggregate usage patterns. This cookie is set only if you accept it via our cookie notice.',
      'We do not use third-party advertising cookies or cross-site tracking technologies.',
    ],
  },
  {
    id: '9',
    title: '9. International transfers',
    body: [
      'All personal data is stored on servers located in the European Economic Area (EEA) or the United Kingdom. We do not transfer personal data to countries outside the UK/EEA except where an adequate level of protection is guaranteed by standard contractual clauses or an adequacy decision.',
    ],
  },
  {
    id: '10',
    title: '10. Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. Material changes will be notified by email at least 14 days before they take effect. The "last updated" date at the top of this page will always reflect the current version.',
      'Continued use of the platform after the effective date of a change constitutes acceptance of the revised policy.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <PublicLayout showBack>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--info)', marginBottom: '12px' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Last updated: 1 September 2025 · Effective: 1 October 2025</p>
        </div>

        {/* Table of contents */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: '0 0 14px' }}>Contents</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sections.map((s) => (
              <a key={s.id} href={`#section-${s.id}`} style={{ fontSize: '14px', color: 'var(--info)', textDecoration: 'none' }}>{s.title}</a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {sections.map((s) => (
            <section key={s.id} id={`section-${s.id}`}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>{s.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {s.body.map((para, i) => (
                  <p key={i} style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div style={{ marginTop: '56px', padding: '20px 24px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
            Privacy questions? Contact us at <span style={{ color: 'var(--info)' }}>shivamanikantavasu@gmail.com</span>. For terms of service see our <a href="/Veridex/Terms" style={{ color: 'var(--burgundy-300)' }}>Terms of Service</a>.
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
