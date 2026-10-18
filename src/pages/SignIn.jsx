// src/pages/SignIn.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthField from '../components/auth/AuthField';
import AuthShell from '../components/auth/AuthShell';
import PasswordVisibilityButton from '../components/auth/PasswordVisibilityButton';
import { useAuth } from '../hooks/useAuth';
import { normalizeEmail, validateEmail, validatePassword } from '../utils/authValidation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const normalizedEmail = normalizeEmail(email);
    const validationErrors = {
      email: validateEmail(normalizedEmail),
      password: validatePassword(password),
    };
    setErrors(validationErrors);
    setMessage('');
    if (Object.values(validationErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const signedInUser = await login({ email: normalizedEmail, password });
      const defaultPath = signedInUser?.role === 'VENDOR' ? '/vendor-workspace' : '/account';
      const destination = location.state?.from || { pathname: defaultPath };
      navigate(destination, { replace: true });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        ...(error.errors || {}),
      }));
      setMessage(error.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell heading="Sign in to your account" description="Enter your details to continue to your KuroMart workspace.">
      {location.state?.message && (
        <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {location.state.message}
        </p>
      )}
      {message && (
        <div role="alert" aria-live="polite" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {message}
        </div>
      )}
      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          inputMode="email"
          placeholder="Enter your email address"
          error={errors.email}
        />
        <AuthField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password}
          trailing={<PasswordVisibilityButton visible={showPassword} onClick={() => setShowPassword((visible) => !visible)} label="password" />}
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to KuroMart?{' '}
        <Link to="/signup" className="font-bold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-700">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default SignIn;