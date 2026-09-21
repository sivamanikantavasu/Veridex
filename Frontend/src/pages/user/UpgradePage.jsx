import React, { useState } from 'react'
import { Check, CreditCard, Lock, ChevronRight, Star } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'
import { changePlan } from '../../api/auth.js'

const PLANS = [
  {
    id: 'reader',
    name: 'Reader',
    price: { monthly: 14, annual: 14 },
    color: 'var(--burgundy-400)',
    features: ['Up to 200 items / month', 'Academic journals', 'Reading history & bookmarks', 'Dark / sepia / light themes'],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    price: { monthly: 34, annual: 34 },
    color: 'var(--burgundy-300)',
    badge: 'Most popular',
    featured: true,
    features: ['Unlimited content access', 'Academic journals', 'Research documents', 'Collections & tagging', 'Reading history & bookmarks'],
  },
  {
    id: 'institution',
    name: 'Institution',
    price: null,
    color: 'var(--accent-brass)',
    features: ['Everything in Scholar', 'Institutional SSO', 'Admin console', 'API access', 'Custom user limits'],
  },
]

const EMPTY_PAYMENT = { name: '', number: '', expiry: '', cvv: '', upi: '' }

function fmtCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function fmtExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

export default function UpgradePage() {
  const { user } = useAuth()
  const [billing, setBilling] = useState('annual')
  const [selected, setSelected] = useState('scholar')
  const [payMethod, setPayMethod] = useState('card') // card | upi | netbanking
  const [payment, setPayment] = useState(EMPTY_PAYMENT)
  const [step, setStep] = useState('plan') // plan | payment | confirm
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k) => (e) => setPayment((p) => ({ ...p, [k]: e.target.value }))

  const plan = PLANS.find((p) => p.id === selected)
  const price = plan?.price ? plan.price[billing] : null

  const handlePay = async () => {
    setProcessing(true)
    const result = await changePlan(selected)
    setProcessing(false)
    if (result.success) setDone(true)
    else window.alert(result.error || 'Plan update failed')
  }

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Upgrade Plan' },
  ]

  if (done) {
    return (
      <UserLayout>
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(78,159,125,0.12)', border: '2px solid rgba(78,159,125,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Check size={32} color="var(--success)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
            You're on {plan.name}!
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 32px' }}>
            Your subscription has been activated. Enjoy unlimited access to scholarly content.
          </p>
          <a href={`/Veridex/User/${user?.name}/${user?.email}/Home`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 28px', background: 'var(--burgundy-600)', border: '1px solid var(--burgundy-500)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Go to Dashboard <ChevronRight size={14} />
          </a>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 4px' }}>
            Upgrade your plan
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Choose a plan and complete payment to unlock more content.</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
          {[['plan', '1', 'Choose plan'], ['payment', '2', 'Payment']].map(([s, n, label], i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, background: step === s ? 'var(--burgundy-600)' : (step === 'payment' && s === 'plan') ? 'var(--success)' : 'var(--bg-elevated)', color: step === s ? 'var(--text-primary)' : (step === 'payment' && s === 'plan') ? 'var(--text-primary)' : 'var(--text-muted)', border: `1px solid ${step === s ? 'var(--burgundy-500)' : 'var(--border-subtle)'}` }}>
                  {step === 'payment' && s === 'plan' ? <Check size={12} /> : n}
                </div>
                <span style={{ fontSize: '13px', fontWeight: step === s ? 600 : 400, color: step === s ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
              </div>
              {i === 0 && <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)', margin: '0 12px', maxWidth: 60 }} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Plan selection ── */}
        {step === 'plan' && (
          <>
            {/* Billing toggle */}
            <div style={{ display: 'inline-flex', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '100px', padding: '3px', alignSelf: 'flex-start' }}>
              {['monthly', 'annual'].map((b) => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: '6px 18px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: billing === b ? 'var(--burgundy-700)' : 'transparent', color: billing === b ? 'var(--text-primary)' : 'var(--text-muted)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--transition)' }}>
                  {b === 'annual' ? 'Annual — save 20%' : 'Monthly'}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {PLANS.map((p) => (
                <button key={p.id} onClick={() => setSelected(p.id)}
                  style={{ textAlign: 'left', cursor: 'pointer', background: selected === p.id ? (p.featured ? 'var(--burgundy-900)' : 'rgba(110,22,48,0.12)') : 'var(--bg-surface)', border: `2px solid ${selected === p.id ? (p.featured ? 'var(--burgundy-400)' : 'var(--burgundy-600)') : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-lg)', padding: '24px', position: 'relative', fontFamily: 'var(--font-sans)', transition: 'all var(--transition)' }}
                >
                  {p.badge && (
                    <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--burgundy-500)', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '3px 12px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                      {p.badge}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: p.color, margin: '0 0 4px' }}>{p.name}</p>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {p.price ? `₹${p.price[billing]}` : 'Custom'}
                        {p.price && <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '3px' }}>/mo</span>}
                      </p>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected === p.id ? 'var(--burgundy-400)' : 'var(--border-strong)'}`, background: selected === p.id ? 'var(--burgundy-500)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                      {selected === p.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-primary)' }} />}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {p.features.map((f) => (
                      <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <Check size={12} color="var(--success)" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {plan?.price ? (
                <button onClick={() => setStep('payment')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--burgundy-600)', border: '1px solid var(--burgundy-500)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Continue to Payment <ChevronRight size={15} />
                </button>
              ) : (
                <a href="/Veridex/Contact" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--accent-brass)', border: '1px solid var(--warning)', color: '#1a0e00', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  Contact Sales <ChevronRight size={15} />
                </a>
              )}
            </div>
          </>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 'payment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'start' }}>
            {/* Left — payment form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Payment method tabs */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '0 0 10px' }}>Payment method</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[['card', '💳 Card'], ['upi', '📱 UPI'], ['netbanking', '🏦 Net Banking']].map(([m, label]) => (
                    <button key={m} onClick={() => setPayMethod(m)}
                      style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 500, background: payMethod === m ? 'var(--burgundy-800)' : 'var(--bg-elevated)', color: payMethod === m ? 'var(--text-primary)' : 'var(--text-muted)', border: `1px solid ${payMethod === m ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--transition)' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card form */}
              {payMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <PField label="Cardholder name" value={payment.name} onChange={set('name')} placeholder="Name on card" />
                  <PField label="Card number" value={fmtCard(payment.number)} onChange={(e) => setPayment((p) => ({ ...p, number: e.target.value.replace(/\s/g, '') }))} placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <PField label="Expiry" value={payment.expiry} onChange={(e) => setPayment((p) => ({ ...p, expiry: fmtExpiry(e.target.value) }))} placeholder="MM/YY" maxLength={5} inputMode="numeric" />
                    <PField label="CVV" value={payment.cvv} onChange={set('cvv')} placeholder="•••" maxLength={4} type="password" inputMode="numeric" />
                  </div>
                </div>
              )}

              {/* UPI form */}
              {payMethod === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <PField label="UPI ID" value={payment.upi} onChange={set('upi')} placeholder="yourname@upi" />
                  <div style={{ padding: '12px 16px', background: 'var(--info-bg)', border: '1px solid rgba(107,143,184,0.25)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--info)', margin: 0, lineHeight: 1.6 }}>
                      A payment request will be sent to your UPI app. Open your app and approve to complete.
                    </p>
                  </div>
                </div>
              )}

              {/* Net banking */}
              {payMethod === 'netbanking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Select your bank</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Canara'].map((bank) => (
                      <button key={bank} style={{ padding: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500, transition: 'all var(--transition)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--burgundy-500)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                      >{bank}</button>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>You will be redirected to your bank to complete the payment.</p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <Lock size={12} color="var(--success)" />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>256-bit SSL encryption. Your payment data is never stored on our servers.</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep('plan')} style={{ padding: '11px 20px', background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Back
                </button>
                <button onClick={handlePay} disabled={processing}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 28px', background: 'var(--burgundy-600)', border: '1px solid var(--burgundy-500)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, cursor: processing ? 'wait' : 'pointer', fontFamily: 'var(--font-sans)', transition: 'background var(--transition)' }}
                  onMouseEnter={(e) => { if (!processing) e.currentTarget.style.background = 'var(--burgundy-700)' }}
                  onMouseLeave={(e) => { if (!processing) e.currentTarget.style.background = 'var(--burgundy-600)' }}
                >
                  <CreditCard size={15} />
                  {processing ? 'Processing…' : `Pay ₹${price} / mo`}
                </button>
              </div>
            </div>

            {/* Right — order summary */}
            <div style={{ minWidth: 220, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', flexShrink: 0 }}>
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '0 0 14px' }}>Order summary</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Star size={14} color={plan.color} />
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{plan.name} plan</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{billing} billing</p>
                </div>
              </div>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 0 12px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>₹{price}/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GST (18%)</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>₹{Math.round(price * 0.18)}/mo</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 0 12px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>₹{Math.round(price * 1.18)}/mo</span>
              </div>
              {billing === 'annual' && (
                <p style={{ fontSize: '11px', color: 'var(--success)', margin: '10px 0 0', textAlign: 'center' }}>
                  You save ₹{(42 - price) * 12}/yr vs monthly
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}

function PField({ label, value, onChange, placeholder, maxLength, type = 'text', inputMode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '5px' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} inputMode={inputMode}
        style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', padding: '9px 12px', fontFamily: 'var(--font-sans)', outline: 'none' }}
      />
    </div>
  )
}
