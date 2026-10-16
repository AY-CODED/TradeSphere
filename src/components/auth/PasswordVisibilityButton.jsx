import { Eye, EyeOff } from 'lucide-react';

const PasswordVisibilityButton = ({ visible, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`${visible ? 'Hide' : 'Show'} ${label}`}
    aria-pressed={visible}
    className="absolute inset-y-0 right-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-emerald-700"
  >
    {visible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
    {visible ? 'Hide' : 'Show'}
  </button>
);

export default PasswordVisibilityButton;
