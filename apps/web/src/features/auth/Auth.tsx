import { useState, type FormEvent } from 'react';
import { Link, navigate } from '../../router';
import { Brand } from '../../components/Brand';
import { useDemo } from '../../app/demo';
import { useToast } from '../../app/toast';

/**
 * Demo sign-in and sign-up.
 *
 * There is no backend and no authentication. Details are validated in this
 * browser only so the flow feels real, then the demo opens with your name.
 */
export function Auth({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  const { setName } = useDemo();
  const { toast } = useToast();

  const [name, setLocalName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const enter = (displayName: string) => {
    setName(displayName);
    toast(isLogin ? `Welcome back, ${displayName}. This is a local demo.` : `Demo plan ready, ${displayName}.`);
    navigate('/app');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const emailLooksReal = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
    if (!emailLooksReal) {
      setError('Enter an email-shaped value so the demo can continue. Nothing is sent anywhere.');
      return;
    }
    if (password.length < 6) {
      setError('Use at least six characters. This demo never stores or checks a real password.');
      return;
    }
    if (!isLogin && name.trim().length < 2) {
      setError('Add a first name so the demo can greet you. It stays in this browser session only.');
      return;
    }

    const fallback = email.trim().split('@')[0] || 'Friend';
    const display = isLogin ? fallback : name.trim();
    enter(display.charAt(0).toUpperCase() + display.slice(1));
  };

  return (
    <div className="auth">
      <aside className="auth__aside">
        <Brand />
        <div className="stack">
          <p className="kicker" style={{ color: 'rgba(247,244,236,0.6)' }}>
            {isLogin ? 'Welcome back' : 'A gentler start'}
          </p>
          <p className="auth__quote">
            {isLogin
              ? 'Your next good step is already waiting.'
              : 'One thoughtful step is enough to begin.'}
          </p>
        </div>
        <ul className="auth__points">
          <li>No account is created and nothing is uploaded.</li>
          <li>Everything stays in this browser session.</li>
          <li>No AI model or health device is connected yet.</li>
        </ul>
      </aside>

      <main className="auth__main">
        <div className="auth__card">
          <div className="stack stack--tight">
            <p className="kicker">{isLogin ? 'Demo log in' : 'Demo registration'}</p>
            <h1 style={{ fontSize: '2rem' }}>{isLogin ? 'Come on in.' : 'Start where you are.'}</h1>
            <p className="muted">
              {isLogin
                ? 'This is a demo sign-in. Details are checked in this browser only and no account is verified.'
                : 'Tell the demo your first name and it will greet you by it. Nothing is sent anywhere.'}
            </p>
          </div>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {!isLogin ? (
              <label className="field">
                <span className="field__label">First name</span>
                <input
                  type="text"
                  value={name}
                  autoComplete="given-name"
                  onChange={(event) => setLocalName(event.target.value)}
                  placeholder="Alex"
                />
              </label>
            ) : null}

            <label className="field">
              <span className="field__label">Email address</span>
              <input
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least six characters"
              />
            </label>

            <div className="auth__row">
              <button type="button" className="link-button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
              <span className="muted">Never stored or checked</span>
            </div>

            {error ? <p className="note note--warn">{error}</p> : null}

            <button type="submit" className="button button--block">
              {isLogin ? 'Enter demo with these details' : 'Create my demo plan'}
            </button>

            <button type="button" className="button button--ghost button--block" onClick={() => enter('Alex')}>
              Explore with the sample profile
            </button>
          </form>

          <p className="auth__alt">
            {isLogin ? (
              <>
                New to Nurture? <Link to="/register">Create a demo profile</Link>
              </>
            ) : (
              <>
                Already exploring? <Link to="/login">Use the demo log in</Link>
              </>
            )}
          </p>
          <p className="auth__alt">
            <Link to="/">Back to the overview</Link>
          </p>
          <p className="muted">No real authentication, health data or AI is connected yet.</p>
        </div>
      </main>
    </div>
  );
}
