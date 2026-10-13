import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  Check,
  FileText,
  Landmark,
  LockKeyhole,
  Mail,
  Moon,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserRound,
} from 'lucide-react';

const steps = [
  { label: 'Personal information', icon: UserRound },
  { label: 'Business information', icon: Building2 },
  { label: 'Identity verification', icon: ShieldCheck },
  { label: 'Bank information', icon: Landmark },
  { label: 'Review & submit', icon: FileText },
];

const fieldsByStep = [
  [
    { name: 'firstName', label: 'First Name', placeholder: 'e.g. Samuel' },
    { name: 'lastName', label: 'Last Name', placeholder: 'e.g. Kojo' },
    { name: 'email', label: 'Work Email', placeholder: 'samuel.k@company.com', type: 'email' },
    { name: 'phone', label: 'Phone Number', placeholder: '24 123 4567', prefix: '+233' },
    { name: 'address', label: 'Full Address', placeholder: 'Apartment, street name, area', wide: true },
    { name: 'city', label: 'City', placeholder: 'e.g. Accra' },
    { name: 'region', label: 'Region / State', placeholder: 'Greater Accra' },
  ],
  [
    { name: 'businessName', label: 'Registered business name', placeholder: 'Your company name', wide: true },
    { name: 'businessType', label: 'Business type', placeholder: 'e.g. Limited company' },
    { name: 'registrationNumber', label: 'Registration number', placeholder: 'e.g. BN123456' },
    { name: 'businessAddress', label: 'Business address', placeholder: 'Street address', wide: true },
    { name: 'taxNumber', label: 'Tax identification number', placeholder: 'Enter tax ID' },
    { name: 'website', label: 'Business website', placeholder: 'https://example.com' },
  ],
  [
    { name: 'identityType', label: 'Identity document type', placeholder: 'e.g. Passport or national ID' },
    { name: 'identityNumber', label: 'Document number', placeholder: 'Enter document number' },
    { name: 'identityCountry', label: 'Issuing country', placeholder: 'e.g. Ghana' },
    { name: 'identityExpiry', label: 'Expiry date', type: 'date' },
  ],
  [
    { name: 'accountName', label: 'Account holder name', placeholder: 'Name on bank account', wide: true },
    { name: 'bankName', label: 'Bank name', placeholder: 'Enter bank name' },
    { name: 'accountNumber', label: 'Account number', placeholder: 'Enter account number' },
    { name: 'branch', label: 'Branch / routing code', placeholder: 'Enter branch code' },
    { name: 'bankCountry', label: 'Bank country', placeholder: 'e.g. Ghana' },
  ],
];

const emptyDetails = Object.fromEntries(
  fieldsByStep.flat().map(({ name }) => [name, '']),
);

const loadSavedDetails = () => {
  const saved = localStorage.getItem('tradesphere-business-verification');
  return saved ? { ...emptyDetails, ...JSON.parse(saved) } : emptyDetails;
};

const BusinessVerification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [details, setDetails] = useState(loadSavedDetails);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('tradesphere-business-verification', JSON.stringify(details));
  }, [details]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setDetails((current) => ({ ...current, [name]: value }));
  };

  const continueStep = (event) => {
    event.preventDefault();
    if (activeStep < steps.length - 1) {
      setActiveStep((step) => step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const sidebarItems = [
    { label: 'Personal Information', active: activeStep === 0 },
    { label: 'Business Information', active: activeStep === 1 },
    { label: 'Identity Verification', active: activeStep === 2 },
    { label: 'Bank Information', active: activeStep === 3 },
    { label: 'Review & Submit', active: activeStep === 4 },
  ];

  return (
    <main className="min-h-screen bg-[#eef3f6] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[22px] border border-slate-200 bg-[#f6f8fb] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <header className="flex items-center justify-between gap-4 bg-[#f8f9fb] px-5 py-3 shadow-[inset_0_-1px_0_rgba(148,163,184,0.2)] sm:px-7">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-transparent text-lg font-black text-emerald-700">T</div>
            <div className="relative hidden w-[300px] sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                aria-label="Search products and vendors"
                placeholder="Search products, vendors, or services..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-[#eaf4ee] pl-10 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            <a href="/marketplace" className="transition hover:text-emerald-800">Marketplace</a>
            <a href="/account?section=My%20orders" className="transition hover:text-emerald-800">Logistics</a>
            <a href="/vendor-workspace" className="transition hover:text-emerald-800">Vendor workspace</a>
            <a href="mailto:support@tradesphere.africa" className="transition hover:text-emerald-800">Support</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" aria-label="Messages" className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><Mail className="h-4 w-4" /></button>
            <button type="button" aria-label="Cart" className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><ShoppingCart className="h-4 w-4" /></button>
            <button type="button" aria-label="Notifications" className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><Bell className="h-4 w-4" /></button>
            <button type="button" aria-label="Toggle theme" className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><Moon className="h-4 w-4" /></button>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900">Sign in</button>
          </div>
        </header>

        <div className="flex min-h-[880px] flex-col lg:flex-row">
          <aside className="w-full bg-[#0d2136] px-4 py-5 text-slate-200 lg:w-[270px] lg:shrink-0">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#1b3452] text-sm font-black text-white">KYC</div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                <span>Verification</span>
              </div>
            </div>

            <div className="mt-6 space-y-1.5">
              {sidebarItems.map(({ label, active }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveStep(sidebarItems.findIndex((item) => item.label === label))}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${active ? 'bg-emerald-600 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'text-slate-300 hover:bg-[#18314d] hover:text-white'}`}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-current/60 text-[10px] font-bold">
                    {label[0]}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-slate-700 bg-[#112a40] p-3 text-left">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#1d3e5b] text-sm font-bold text-emerald-300">S</div>
                <div>
                  <p className="text-sm font-semibold text-white">Secure verification</p>
                  <p className="text-[11px] text-slate-400">ID, banking, and KYC review</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-[#0a1d2f] p-2 text-[10px] leading-5 text-slate-400">
                <p className="font-semibold uppercase tracking-[0.12em] text-emerald-300">Status</p>
                <p>Application submitted for review.</p>
              </div>
            </div>
          </aside>

          <div className="flex-1 bg-[#f3f6fb] p-5 sm:p-7 lg:p-8">
            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafb] p-3 shadow-sm sm:p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Verification</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Vendor Compliance</h1>
                  <p className="mt-2 text-sm text-slate-500">Complete verification to start trading on the TradeSphere ecosystem.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Compliance Required
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-5">
                {steps.map(({ label, icon: Icon }, index) => {
                  const isComplete = index < activeStep;
                  const isActive = index === activeStep;

                  return (
                    <div key={label} className="flex flex-col items-center text-center">
                      <div className={`grid h-10 w-10 place-items-center rounded-full border ${isComplete ? 'border-emerald-600 bg-emerald-600 text-white' : isActive ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white text-slate-400'}`}>
                        {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <p className={`mt-2 text-[10px] font-bold uppercase tracking-[0.12em] ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {label.split(' ')[0]}
                      </p>
                      <p className={`text-[10px] font-medium ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {label.replace('Information', 'Info').replace('&', 'and')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {submitted ? (
              <section role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-white px-6 py-10 text-center shadow-sm">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-7 w-7" /></span>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">Verification submitted</h2>
                <p className="mt-2 text-sm text-slate-500">Your verification details are saved and under review.</p>
                <button type="button" onClick={() => { setSubmitted(false); setActiveStep(0); }} className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
                  Review information
                </button>
              </section>
            ) : (
              <form onSubmit={continueStep} className="mt-6 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-[#f8fafb] px-5 py-4 sm:px-7">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{activeStep + 1}</span>
                    <h2 className="text-xl font-bold text-slate-900">{steps[activeStep].label}</h2>
                  </div>
                  <button type="button" className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Auto-saved</button>
                </div>

                {activeStep < fieldsByStep.length ? (
                  <div className="px-5 py-5 sm:px-7 sm:py-6">
                    <h3 className="mb-5 border-b border-slate-200 pb-3 text-sm font-bold uppercase tracking-[0.10em] text-slate-600">Identity Details</h3>
                    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                      {fieldsByStep[activeStep].map(({ name, label, placeholder, type = 'text', prefix, wide }) => (
                        <label key={name} className={`block text-xs font-medium text-slate-700 ${wide ? 'sm:col-span-2' : ''}`}>
                          {label}
                          <span className="mt-1.5 flex h-11 overflow-hidden rounded-lg border border-slate-300 bg-white transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
                            {prefix && <span className="grid shrink-0 place-items-center border-r border-slate-300 bg-slate-50 px-3 font-semibold text-slate-700">{prefix}</span>}
                            <input
                              required={activeStep !== 3 || name !== 'branch'}
                              type={type}
                              name={name}
                              value={details[name]}
                              onChange={updateField}
                              placeholder={placeholder}
                              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 p-5 sm:grid-cols-2 sm:px-7 sm:py-6">
                    {steps.slice(0, -1).map((step, index) => (
                      <section key={step.label} className="rounded-xl border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-800">{step.label}</h3>
                          <button type="button" onClick={() => setActiveStep(index)} className="text-xs font-semibold text-emerald-700 hover:underline">Edit</button>
                        </div>
                        <dl className="space-y-2">
                          {fieldsByStep[index].map(({ name, label }) => (
                            <div key={name} className="flex justify-between gap-3 text-xs">
                              <dt className="text-slate-500">{label}</dt>
                              <dd className="text-right font-medium text-slate-800">{details[name] || 'Not provided'}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-4 border-t border-slate-200 bg-[#f8fafb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <p className="text-xs text-slate-500">All changes are auto-saved</p>
                  <div className="flex items-center gap-4">
                    {activeStep > 0 && (
                      <button type="button" onClick={() => setActiveStep((step) => step - 1)} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="h-4 w-4" /> Previous
                      </button>
                    )}
                    <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800">
                      Continue to Next Step
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              <span className="inline-flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> Partner</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> GDPR compliant</span>
              <span className="inline-flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5" /> Secure</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BusinessVerification;
