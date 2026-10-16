const AuthField = ({ id, label, type = 'text', value, onChange, autoComplete, placeholder, error, trailing, inputMode }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/15 ${trailing ? 'pr-20' : ''} ${error ? 'border-rose-500' : 'border-slate-300'}`}
      />
      {trailing}
    </div>
    {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-700">{error}</p>}
  </div>
);

export default AuthField;
