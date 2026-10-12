import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png';

const AuthShell = ({ children, heading, description }) => (
  <main className="min-h-screen bg-[#f3f6fb] px-4 py-6 sm:px-6">
    <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col">
      <Link to="/" aria-label="TradeSphere home" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to marketplace
      </Link>
      <Link to="/" aria-label="TradeSphere home" className="mt-8 inline-flex w-fit">
        <img src={Logo} alt="TradeSphere" className="h-10 w-auto object-contain" />
      </Link>
      <div className="my-auto py-10">
        <header className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Welcome to TradeSphere</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{heading}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
        </header>
        {children}
        <p className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-700" />
          Your account is protected with secure session-based sign in.
        </p>
      </div>
      <p className="pb-2 text-center text-xs text-slate-500">© {new Date().getFullYear()} TradeSphere</p>
    </section>
  </main>
);

export default AuthShell;
