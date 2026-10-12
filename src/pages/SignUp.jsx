import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from '../components/auth/AuthField';
import AuthShell from '../components/auth/AuthShell';
import PasswordVisibilityButton from '../components/auth/PasswordVisibilityButton';
import { useAuth } from '../hooks/useAuth';
import { normalizeEmail, validateEmail, validatePassword } from '../utils/authValidation';

const SignUp = () => {
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const updateValue = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const normalizedEmail = normalizeEmail(values.email);
    const validationErrors = {
      fullName: values.fullName.trim() ? '' : 'Enter your full name.',
      email: validateEmail(normalizedEmail),
      password: validatePassword(values.password),
      confirmPassword: values.confirmPassword === values.password ? '' : 'Passwords do not match.',
    };
    setErrors(validationErrors);
    setMessage('');
    if (Object.values(validationErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const result = await signup({
        fullName: values.fullName.trim(),
        email: normalizedEmail,
        password: values.password,
      });
      if (result.user) {
        navigate('/account', { replace: true });
      } else {
        navigate('/signin', {
          replace: true,
          state: { message: 'Your account has been created. Sign in to continue.' },
        });
      }
    } catch (error) {
      setErrors((current) => ({
        ...current,
        ...(error.errors || {}),
      }));
      setMessage(error.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell heading="Create your account" description="Join the TradeSphere network and get your business moving.">
      {message && (
        <div role="alert" aria-live="polite" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {message}
        </div>
      )}
      <form onSubmit={submit} noValidate className="space-y-4">
        <AuthField
          id="fullName"
          label="Full name"
          value={values.fullName}
          onChange={updateValue('fullName')}
          autoComplete="name"
          placeholder="Your full name"
          error={errors.fullName}
        />
        <AuthField
          id="email"
          label="Email address"
          type="email"
          value={values.email}
          onChange={updateValue('email')}
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          error={errors.email}
        />
        <AuthField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={updateValue('password')}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password}
          trailing={<PasswordVisibilityButton visible={showPassword} onClick={() => setShowPassword((visible) => !visible)} label="password" />}
        />
        <AuthField
          id="confirmPassword"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={values.confirmPassword}
          onChange={updateValue('confirmPassword')}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          trailing={<PasswordVisibilityButton visible={showConfirmPassword} onClick={() => setShowConfirmPassword((visible) => !visible)} label="password confirmation" />}
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/signin" className="font-bold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-700">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default SignUp;
