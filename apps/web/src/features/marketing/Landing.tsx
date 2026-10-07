import { useState } from 'react';
import { Link } from '../../router';
import { Brand } from '../../components/Brand';
import { PAGE_COUNT } from '../../catalog';

const STEPS = [
  {
    num: '01 / START',
    title: 'Share your starting point',
    body: 'Your goal, your real schedule, the food you actually eat, the equipment you have, and the thing that usually makes a plan fall apart.',
  },
  {
    num: '02 / LIVE',
    title: 'See one clear day',
    body: 'A realistic next action, plus meals, movement, water and rest in a single plan you can rearrange in seconds.',
  },
  {
    num: '03 / GROW',
    title: 'Adapt as life changes',
    body: 'A weekly review that explains what it noticed and proposes one small change — then waits for your approval.',
  },
];

const FAQ = [
  {
    q: 'Is this a real account?',
    a: 'No. This is an interactive frontend demo. Nothing is uploaded, no account is created, and no health data is connected. Everything you do here stays in this browser session and disappears when you reset the demo.',
  },
  {
    q: 'Will it make a plan for me?',
    a: 'You can set a goal and see a starter plan shaped around it, plus a 100-day journey, a weekly view and a daily rhythm. The plan is editable, and any change the coach proposes shows its reasoning first.',
  },
  {
    q: 'Can it diagnose a health problem?',
    a: 'No, and it never will. Nurture is an adult wellness coach for organising food, movement and rest. Anything that looks medical — pain, fainting, an eating-disorder history, pregnancy, a prescribed diet — is pointed to a qualified clinician or registered dietitian.',
  },
  {
    q: 'Can I connect my watch or fitness app?',
    a: 'The Connections screens show exactly which fields would be read and written for Apple Health, Android Health Connect, Google Health, Samsung Health, Garmin, Strava, Oura and WHOOP. In this demo nothing is actually connected — no sensor is accessed at all.',
  },
  {
    q: 'How accurate is the photo food logging?',
    a: 'A photo cannot see cooking oil, sauces, hidden ingredients or exact portion mass, so every estimate is an editable draft with a confidence label. You confirm or correct it before it is saved. It is a shortcut for logging, not a measurement.',
  },
];

export function Landing() {
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`site-nav${navOpen ? ' site-nav--open' : ''}`}>
        <Brand />
        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={navOpen}
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setNavOpen((open) => !open)}
        >
          {navOpen ? '×' : '☰'}
        </button>
        <nav className="site-nav__links" aria-label="Main navigation">
          <a href="#how" onClick={() => setNavOpen(false)}>How it works</a>
          <a href="#spaces" onClick={() => setNavOpen(false)}>What you get</a>
          <a href="#journey" onClick={() => setNavOpen(false)}>The journey</a>
          <a href="#questions" onClick={() => setNavOpen(false)}>Questions</a>
          <Link to="/login" onClick={() => setNavOpen(false)}>Log in</Link>
        </nav>
        <div className="site-nav__cta">
          <Link className="button button--small" to="/register">Start your day</Link>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero__copy">
            <p className="kicker">Wellness, one day at a time</p>
            <h1 className="hero__title">
              Feel better starts with <em>your next good step.</em>
            </h1>
            <p className="hero__lede">
              Food, movement, rest and real life — gently brought together in one plan that moves with you. No crowded
              dashboard. No starting over after a hard week.
            </p>
            <div className="hero__actions">
              <Link className="button" to="/register">Create your demo plan</Link>
              <Link className="button button--ghost" to="/app">Explore the demo</Link>
            </div>
            <div className="hero__trust">
              <div className="hero__avatars" aria-hidden="true">
                <span>A</span>
                <span>J</span>
                <span>M</span>
              </div>
              <p className="muted">Made for real people, not perfect days.</p>
            </div>
          </div>

          <div className="hero__visual">
            <div className="phone" aria-label="Illustration of a personalised day plan">
              <div className="phone__bar">
                <span>Wednesday, Oct 7</span>
                <span className="phone__dots">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <p className="phone__greeting">Good morning, Alex.</p>
              <div className="phone__card">
                <p className="kicker">Your next good step</p>
                <strong>A 20-minute walk</strong>
                <span className="muted">Whenever works for you today.</span>
              </div>
              <div className="phone__rows">
                <div className="phone__row"><span>Breakfast that lasts</span><span>08:30</span></div>
                <div className="phone__row"><span>Water with lunch</span><span>13:00</span></div>
                <div className="phone__row"><span>Wind down</span><span>21:30</span></div>
              </div>
            </div>
            <div className="float-card float-card--food">
              <strong>Food that fits</strong>
              <span className="muted">One meal at a time</span>
            </div>
            <div className="float-card float-card--move">
              <strong>Take a breath</strong>
              <span className="muted">Walk at your pace</span>
            </div>
          </div>
        </section>

        <div className="marquee">
          <span>Food</span>
          <span>Movement</span>
          <span>Rest</span>
          <span>Water</span>
          <span>Recipes</span>
          <span>Yoga</span>
          <span>Progress</span>
          <span>{PAGE_COUNT} connected screens</span>
        </div>

        <section className="section" id="how">
          <div className="section__head">
            <p className="kicker">The idea</p>
            <h2>A whole plan, built around a whole person.</h2>
            <p className="section__lede">
              Tell Nurture where you want to go and get a calmer way to move through each day. The plan adapts to
              travel, illness, a busy week or a change in budget — without guilt and without starting over.
            </p>
          </div>
          <div className="steps">
            {STEPS.map((step) => (
              <article className="step-card" key={step.num}>
                <p className="step-card__num">{step.num}</p>
                <h3>{step.title}</h3>
                <p className="muted">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--alt" id="spaces">
          <div className="section__head">
            <p className="kicker">The spaces</p>
            <h2>Everything in its place. Nothing in your way.</h2>
            <p className="section__lede">Start with the next step. Go deeper when you want the details.</p>
          </div>
          <div className="spaces">
            <article className="space-card space-card--food">
              <p className="kicker">Food</p>
              <h3>Eat with more ease.</h3>
              <p className="muted">
                A food diary, photo estimates you can edit, recipes, a meal planner, a grocery list and water — all in
                one place.
              </p>
              <Link className="link-button" to="/app/food/diary">Open the food diary</Link>
            </article>
            <article className="space-card space-card--move">
              <p className="kicker">Move</p>
              <h3>Your pace is enough.</h3>
              <p className="muted">
                Strength sessions you can actually finish, an exercise library, yoga and mobility flows, walks and a
                history of everything you moved.
              </p>
              <Link className="link-button" to="/app/move/workouts">See today’s movement</Link>
            </article>
            <article className="space-card space-card--coach">
              <p className="kicker">Coach</p>
              <h3>Feel supported.</h3>
              <p className="muted">
                A guide that helps you decide what comes next, explains its reasoning, and hands you to a professional
                when a question is medical.
              </p>
              <Link className="link-button" to="/app/coach/chat">Talk it through</Link>
            </article>
          </div>
        </section>

        <section className="section" id="journey">
          <div className="journey">
            <div className="stack">
              <p className="kicker">Your journey · 100 days</p>
              <h2>A goal can be big. Today can be simple.</h2>
              <p className="section__lede">
                Imagine a 100-day goal that starts from your actual schedule, energy and food habits. Progress becomes
                easier to see when every part of the day belongs to the same story.
              </p>
              <ul className="journey__list">
                <li>Daily actions you can change at any time</li>
                <li>Food, movement, rest and water in one rhythm</li>
                <li>Progress measured in abilities and habits, not just a number</li>
                <li>A restart that works after a hard week instead of a broken streak</li>
              </ul>
              <div className="row">
                <Link className="button" to="/register">See the demo journey</Link>
                <Link className="button button--ghost" to="/app/plan/journey">Open the journey</Link>
              </div>
            </div>
            <div className="panel panel--ink">
              <p className="kicker">How adaptation works</p>
              <h3 style={{ color: 'inherit' }}>Nothing changes without you.</h3>
              <ul className="stack stack--tight" style={{ marginTop: 12 }}>
                <li>1 · Nurture notices a pattern in what actually happened.</li>
                <li>2 · It explains the pattern in plain language.</li>
                <li>3 · It proposes one small change, and shows why.</li>
                <li>4 · You accept, decline or edit it. Only then does the plan move.</li>
              </ul>
              <p className="muted" style={{ marginTop: 12 }}>
                Your data stays yours: export it, correct it, or delete it at any time.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--alt" id="questions">
          <div className="section__head">
            <p className="kicker">Good to know</p>
            <h2>Questions before you begin?</h2>
          </div>
          <div className="faq">
            {FAQ.map((item, index) => {
              const open = openFaq === index;
              return (
                <div className="faq__item" key={item.q}>
                  <button type="button" className="faq__q" aria-expanded={open} onClick={() => setOpenFaq(open ? -1 : index)}>
                    <span>{item.q}</span>
                    <span aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  {open ? <p className="faq__a">{item.a}</p> : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="cta-band">
            <p className="kicker" style={{ color: 'rgba(247,244,236,0.6)' }}>Your next good step</p>
            <h2 style={{ color: 'inherit' }}>Ready to begin where you are?</h2>
            <p className="muted" style={{ maxWidth: '52ch' }}>
              Take a look around. No perfect routine required — and no account to create.
            </p>
            <div className="row">
              <Link className="button" to="/register">Create a demo plan</Link>
              <Link className="button button--ghost" to="/app">Explore the demo</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="stack stack--tight">
          <Brand />
          <p className="muted">Gentle structure for a healthier everyday.</p>
        </div>
        <nav aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#spaces">What you get</a>
          <a href="#questions">Questions</a>
          <Link to="/login">Demo log in</Link>
          <Link to="/app">Open the app</Link>
        </nav>
        <p className="muted">© 2026 Nurture · Frontend concept demo</p>
      </footer>
    </div>
  );
}
