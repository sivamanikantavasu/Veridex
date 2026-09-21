import React from 'react'
import PublicLayout from '../../layouts/PublicLayout.jsx'

const sections = [
  {
    id: '1',
    title: '1. Definitions',
    body: [
      '"Platform" means the Veridex digital publishing and rights management service, including all web applications, APIs, and ancillary tools operated by Veridex Ltd.',
      '"Content" means any text, data, images, or multimedia made available through the Platform under licence from the original rights holders.',
      '"Subscriber" means any individual or organisation that has entered into a valid subscription agreement with Veridex Ltd.',
      '"Entitlement" means the specific permission granted to a Subscriber to access a defined set of Content items, subject to the restrictions set out in the applicable subscription tier.',
    ],
  },
  {
    id: '2',
    title: '2. Acceptance of terms',
    body: [
      'By registering an account, completing a subscription purchase, or accessing any Content through the Platform, you confirm that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.',
      'If you are accepting on behalf of an organisation, you represent that you have authority to bind that organisation. References to "you" include both individual users and the organisations they represent.',
      'Veridex Ltd reserves the right to amend these terms at any time. Subscribers will be notified of material changes at least 30 days in advance via the email address associated with their account.',
    ],
  },
  {
    id: '3',
    title: '3. Licence grant and restrictions',
    body: [
      'Subject to payment of applicable fees, Veridex Ltd grants you a limited, non-exclusive, non-transferable, revocable licence to access and read Content through the Platform for personal, non-commercial, or internal institutional research purposes.',
      'You may not: (a) download, copy, or redistribute Content beyond what is explicitly permitted by your subscription tier; (b) use automated tools, scrapers, or bots to access Content; (c) circumvent, disable, or interfere with any access controls, watermarks, session limits, or rights-management technology embedded in the Platform; (d) share login credentials with third parties; or (e) sublicence, sell, or transfer access to Content.',
      'Institutional subscribers are responsible for ensuring that all authorised users within their organisation comply with these terms. Breach by any authorised user is treated as breach by the subscribing institution.',
    ],
  },
  {
    id: '4',
    title: '4. Content rights and third-party licences',
    body: [
      'All Content on the Platform remains the intellectual property of the original rights holders. Veridex Ltd is a distributor and access manager, not a rights holder, except in respect of the Platform software itself.',
      'Your subscription grants you a right to read Content as described in your tier. It does not transfer any copyright, database rights, or other intellectual property rights to you.',
      'Some Content may be subject to additional publisher-specific restrictions (e.g. embargo periods, subject-area limits, or concurrent-access caps). These are disclosed at the item level within the Platform.',
    ],
  },
  {
    id: '5',
    title: '5. Account security and session management',
    body: [
      'You are responsible for maintaining the confidentiality of your account credentials. You must notify Veridex Ltd immediately at shivamanikantavasu@gmail.com if you suspect unauthorised access to your account.',
      'The Platform enforces concurrent-session limits as defined by your subscription tier. Attempting to exceed these limits may result in automatic session termination and, in repeated cases, temporary account suspension.',
      'All access events are logged to an immutable audit trail. Veridex Ltd may use this data for security investigation, compliance reporting, and improvement of the Platform.',
    ],
  },
  {
    id: '6',
    title: '6. Payment, renewal, and cancellation',
    body: [
      'Subscription fees are billed in advance on a monthly or annual basis, as selected at checkout. All fees are exclusive of applicable taxes.',
      'Annual subscriptions renew automatically unless cancelled at least 14 days before the renewal date. Monthly subscriptions renew automatically unless cancelled before the next billing date.',
      'Refunds are available within 7 days of initial purchase for monthly plans and within 30 days for annual plans, provided that fewer than 20 Content items have been accessed during the period.',
    ],
  },
  {
    id: '7',
    title: '7. Limitation of liability',
    body: [
      'To the fullest extent permitted by applicable law, Veridex Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or Content.',
      'The Platform is provided "as is" and Veridex Ltd makes no warranties, express or implied, regarding the completeness, accuracy, reliability, or availability of the Platform or its Content.',
      'In no event shall Veridex Ltd\'s total aggregate liability exceed the subscription fees paid by you in the 12 months preceding the claim.',
    ],
  },
  {
    id: '8',
    title: '8. Governing law',
    body: [
      'These Terms are governed by and construed in accordance with the laws of England and Wales, without regard to conflict-of-law principles.',
      'Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales, except where applicable consumer protection law requires otherwise.',
    ],
  },
]

export default function TermsPage() {
  return (
    <PublicLayout showBack>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-brass)', marginBottom: '12px' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Last updated: 1 September 2025 · Effective: 1 October 2025</p>
        </div>

        {/* Table of contents */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: '0 0 14px' }}>Contents</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sections.map((s) => (
              <a key={s.id} href={`#section-${s.id}`} style={{ fontSize: '14px', color: 'var(--burgundy-300)', textDecoration: 'none' }}>{s.title}</a>
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
            Questions about these terms? Contact us at <span style={{ color: 'var(--burgundy-300)' }}>shivamanikantavasu@gmail.com</span>. For privacy questions see our <a href="/Veridex/Privacy" style={{ color: 'var(--burgundy-300)' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}

