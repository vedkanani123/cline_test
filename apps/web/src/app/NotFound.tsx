import { Link } from '../router';
import { Brand } from '../components/Brand';

export function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound__card">
        <Brand />
        <p className="kicker">A different path</p>
        <h1>We couldn’t find that page.</h1>
        <p className="page-head__blurb">Let’s get you back to a good place.</p>
        <div className="notfound__actions">
          <Link className="button" to="/">
            Go home
          </Link>
          <Link className="button button--ghost" to="/app">
            Open Today
          </Link>
        </div>
      </div>
    </main>
  );
}
