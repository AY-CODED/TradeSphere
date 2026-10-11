import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, Check, FileText, Landmark, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';

const steps = [
  { label: 'Personal information', icon: UserRound },
  { label: 'Business information', icon: Building2 },
  { label: 'Identity verification', icon: ShieldCheck },
  { label: 'Bank information', icon: Landmark },
  { label: 'Review & submit', icon: FileText },
];

const fieldsByStep = [
  [
    { name: 'firstName', label: 'First name', placeholder: 'e.g. Samuel' },
    { name: 'lastName', label: 'Last name', placeholder: 'e.g. Kojo' },
    { name: 'email', label: 'Work email', placeholder: 'samuel.k@company.com', type: 'email' },
    { name: 'phone', label: 'Phone number', placeholder: '24 123 4567', prefix: '+233' },
    { name: 'address', label: 'Full address', placeholder: 'Apartment, street name, area', wide: true },
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

  return (
    <main className="min-h-[70vh] bg-[#f3f6fb] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Account setup</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Business verification</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Complete your verification to start trading on the TradeSphere ecosystem.
          </p>
        </div>

        <ol aria-label="Verification progress" className="relative mb-8 grid grid-cols-5">
          <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-4 h-px bg-slate-300" />
          {steps.map(({ label, icon: Icon }, index) => (
            <li key={label} className="relative z-10 flex flex-col items-center px-1 text-center">
              <button
                type="button"
                aria-current={activeStep === index ? 'step' : undefined}
                onClick={() => { setActiveStep(index); setSubmitted(false); }}
                className={`grid h-8 w-8 place-items-center rounded-full border bg-[#f3f6fb] transition-colors sm:h-9 sm:w-9 ${
                  index <= activeStep ? 'border-emerald-700 text-emerald-700' : 'border-slate-300 text-slate-500'
                }`}
              >
                {index < activeStep ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </button>
              <span className={`mt-2 max-w-24 text-[8px] font-bold uppercase tracking-wide sm:max-w-none sm:text-[10px] ${
                index === activeStep ? 'text-emerald-800' : 'text-slate-500'
              }`}>
                {label}
              </span>
            </li>
          ))}
        </ol>

        {submitted ? (
          <section role="status" className="rounded-md border border-emerald-200 bg-white px-6 py-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-6 w-6" /></span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Verification submitted</h2>
            <p className="mt-2 text-sm text-slate-500">Your business details have been saved for review.</p>
            <button type="button" onClick={() => { setSubmitted(false); setActiveStep(0); }} className="mt-6 text-sm font-semibold text-emerald-700 hover:underline">
              Review submitted details
            </button>
          </section>
        ) : (
          <form onSubmit={continueStep} className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-7">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">{activeStep + 1}</span>
              <h2 className="text-sm font-semibold text-slate-800 sm:text-base">{steps[activeStep].label.replace('&', 'and')}</h2>
            </div>

            {activeStep < fieldsByStep.length ? (
              <div className="p-5 sm:px-7 sm:py-6">
                <h3 className="mb-4 border-b border-slate-200 pb-3 text-sm font-semibold text-slate-700">
                  {activeStep === 0 ? 'Identity details' : steps[activeStep].label}
                </h3>
                <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                  {fieldsByStep[activeStep].map(({ name, label, placeholder, type = 'text', prefix, wide }) => (
                    <label key={name} className={`block text-xs font-medium text-slate-700 ${wide ? 'sm:col-span-2' : ''}`}>
                      {label}
                      <span className={`mt-1.5 flex h-10 overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15`}>
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
                  <section key={step.label} className="rounded-md border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-sm font-semibold text-slate-800">{step.label}</h3>
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

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-[#f8fafd] px-5 py-4 sm:px-7">
              <p className="text-[10px] text-slate-500">All changes are saved on this device.</p>
              <div className="ml-auto flex items-center gap-4">
                {activeStep > 0 && (
                  <button type="button" onClick={() => setActiveStep((step) => step - 1)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous
                  </button>
                )}
                <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800">
                  {activeStep === steps.length - 1 ? 'Submit verification' : 'Continue to next step'}
                  {activeStep === steps.length - 1 ? <LockKeyhole className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
          <span className="inline-flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Trusted partner</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> GDPR compliant</span>
          <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3 w-3" /> Secure submission</span>
        </div>
      </div>
    </main>
  );
};

export default BusinessVerification;
