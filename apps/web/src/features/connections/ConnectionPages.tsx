import { useMemo, useState } from 'react';
import { Chip, Field, Meter, Note, PageHeader, Panel, Row, Stat, StatGrid, Toggle } from '../../components/ui';
import { Link } from '../../router';
import { useDemo } from '../../app/demo';
import type { DemoState } from '../../app/demo';
import { useToast } from '../../app/toast';
import { APPS, DEVICES, SAFETY_NOTES } from '../../content';
import type { DeviceDef } from '../../content';

/** What each device *would* read, per type. Nothing is read in this demo. */
const DEVICE_FIELDS: Record<DeviceDef['type'], string[]> = {
  watch: ['Activity', 'Heart rate', 'Sleep'],
  ring: ['Sleep stages', 'Temperature', 'Resting heart rate'],
  band: ['Steps', 'Workouts', 'Basic sleep'],
  scale: ['Weight', 'Body composition'],
  phone: ['Steps', 'Workouts'],
};

/** Example read/write surfaces per app. Not every app supports every field. */
const APP_FIELDS: Record<string, { reads: string[]; writes: string[] }> = {
  'app-apple': { reads: ['Steps', 'Workouts', 'Sleep', 'Hydration', 'Nutrition'], writes: ['Hydration', 'Nutrition'] },
  'app-healthconnect': { reads: ['Steps', 'Workouts', 'Sleep', 'Hydration', 'Nutrition'], writes: ['Hydration', 'Nutrition'] },
  'app-google': { reads: ['Steps', 'Workouts', 'Sleep'], writes: ['Nutrition'] },
  'app-samsung': { reads: ['Steps', 'Workouts', 'Sleep'], writes: ['Hydration'] },
  'app-garmin': { reads: ['Steps', 'Workouts', 'Heart rate'], writes: [] },
  'app-strava': { reads: ['Workouts', 'Routes'], writes: ['Workouts'] },
  'app-oura': { reads: ['Sleep', 'Temperature', 'Resting heart rate'], writes: [] },
  'app-whoop': { reads: ['Strain', 'Recovery', 'Sleep'], writes: [] },
};

export function ConnectionDevices() {
  const { state, update } = useDemo();
  const { toast } = useToast();

  const setConnected = (id: string, name: string, next: boolean) => {
    update((prev) => ({ connections: { ...prev.connections, [id]: next ? 'connected' : 'available' } }));
    toast(next ? `${name} marked as connected in this demo.` : `${name} disconnected.`, 'info');
  };

  const connectedCount = DEVICES.filter((device) => state.connections[device.id] === 'connected').length;

  return (
    <div className="page">
      <PageHeader
        kicker="Connections / Devices"
        title="Watches, rings and bands"
        blurb="Choose what Nurture could read — if and when real permissions exist."
        actions={
          <Link className="button button--ghost button--small" to="/app/connections/apps">
            Connected apps
          </Link>
        }
      />

      <Note tone="warn">
        Nothing is actually connected in this demo. No watch, ring, band, scale or phone sensor is accessed, and no
        health data leaves this page.
      </Note>

      <Panel title="Available devices" subtitle={`${connectedCount} of ${DEVICES.length} marked as connected (demo only).`}>
        <ul className="list">
          {DEVICES.map((device) => {
            const connected = state.connections[device.id] === 'connected';
            return (
              <li className="list__item" key={device.id}>
                <span className="list__main">
                  <span className="list__title">{device.name}</span>
                  <span className="list__meta">{device.note}</span>
                  <span className="list__meta">
                    {connected ? 'Last sync: simulated — no data was read.' : 'Last sync: — not connected.'}
                  </span>
                  <Row>
                    {DEVICE_FIELDS[device.type].map((field) => (
                      <Chip key={field} tone="quiet">
                        Reads: {field}
                      </Chip>
                    ))}
                  </Row>
                </span>
                <Toggle
                  label={connected ? 'Connected' : 'Connect'}
                  checked={connected}
                  onChange={(next) => setConnected(device.id, device.name, next)}
                />
              </li>
            );
          })}
        </ul>
      </Panel>

      <Note tone="quiet">{SAFETY_NOTES.device}</Note>
    </div>
  );
}

export function ConnectionApps() {
  const { state, update } = useDemo();
  const { toast } = useToast();

  const setConnected = (id: string, name: string, next: boolean) => {
    update((prev) => ({ connections: { ...prev.connections, [id]: next ? 'connected' : 'available' } }));
    toast(next ? `${name} marked as connected in this demo.` : `${name} disconnected.`, 'info');
  };

  const connectedCount = APPS.filter((app) => state.connections[app.id] === 'connected').length;

  return (
    <div className="page">
      <PageHeader
        kicker="Connections / Apps"
        title="Health apps and platforms"
        blurb="Pick which apps Nurture could exchange with. Nothing is exchanged in this demo."
        actions={
          <Link className="button button--ghost button--small" to="/app/connections/devices">
            Devices
          </Link>
        }
      />

      <Panel title="Permission summary" subtitle="A count of what you have marked as connected.">
        <StatGrid>
          <Stat label="Apps connected" value={connectedCount} unit={`of ${APPS.length}`} hint="Demo selection only" />
        </StatGrid>
        <Meter value={connectedCount} max={APPS.length} label="Apps marked connected" />
      </Panel>

      <Panel title="Available apps" subtitle="Read and write fields are examples of what an integration could exchange.">
        <ul className="list">
          {APPS.map((app) => {
            const connected = state.connections[app.id] === 'connected';
            const fields = APP_FIELDS[app.id] ?? { reads: [], writes: [] };
            return (
              <li className="list__item" key={app.id}>
                <span className="list__main">
                  <span className="list__title">{app.name}</span>
                  <span className="list__meta">{app.note}</span>
                  <span className="list__meta">Reads: {fields.reads.length > 0 ? fields.reads.join(', ') : 'nothing'}</span>
                  <span className="list__meta">
                    Writes: {fields.writes.length > 0 ? fields.writes.join(', ') : 'nothing (read-only)'}
                  </span>
                </span>
                <Toggle
                  label={connected ? 'Connected' : 'Connect'}
                  checked={connected}
                  onChange={(next) => setConnected(app.id, app.name, next)}
                />
              </li>
            );
          })}
        </ul>
      </Panel>

      <Note tone="warn">
        Not every app supports every data type, and some fields are one-way only. A read permission never implies a
        write.
      </Note>
      <Note tone="quiet">{SAFETY_NOTES.device}</Note>
    </div>
  );
}


function looksLikeDemoExport(value: unknown): value is Partial<DemoState> {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.version === 'number' &&
    Array.isArray(record.meals) &&
    typeof record.preferences === 'object' &&
    record.preferences !== null
  );
}

export function ConnectionImportExport() {
  const { state, update, reset, today } = useDemo();
  const { toast } = useToast();
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const exportJson = useMemo(() => JSON.stringify(state, null, 2), [state]);

  const download = () => {
    try {
      const blob = new Blob([exportJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `nurture-demo-${today}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast('Demo data downloaded as a JSON file.');
    } catch {
      toast('Download is not available in this browser. Use “Copy JSON” instead.', 'warn');
    }
  };

  const copy = () => {
    const fallback = () => toast('Copying is not available here. Select the JSON below and copy it manually.', 'warn');
    if (!navigator.clipboard) {
      fallback();
      return;
    }
    navigator.clipboard.writeText(exportJson).then(
      () => toast('Demo JSON copied to your clipboard.'),
      () => fallback(),
    );
  };

  const applyImport = () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setError('That is not valid JSON. Paste a Nurture demo export and try again.');
      return;
    }
    if (!looksLikeDemoExport(parsed)) {
      setError('That JSON does not look like a Nurture demo export. It should include a version, meals and preferences.');
      return;
    }
    update(parsed);
    setError('');
    setRaw('');
    toast('Demo data imported from your JSON.');
  };

  const clearAll = () => {
    reset();
    setConfirming(false);
    toast('Everything in this demo was deleted. You are back to the starting sample.', 'info');
  };

  return (
    <div className="page">
      <PageHeader
        kicker="Connections / Import & export"
        title="Your data, portable and deletable"
        blurb="Export the demo as JSON, import it back, or delete everything."
        actions={
          <Link className="button button--ghost button--small" to="/app/connections/apps">
            Connected apps
          </Link>
        }
      />

      <Panel title="Export my demo data" subtitle="Everything in this demo, as a single JSON file.">
        <Row>
          <button type="button" className="button" onClick={download}>
            Export my demo data
          </button>
          <button type="button" className="button button--ghost" onClick={copy}>
            Copy JSON
          </button>
        </Row>
        <textarea value={exportJson} readOnly aria-label="Demo data as JSON" />
        <Note tone="quiet">
          This is your browser session only. Exporting downloads a file to your device — nothing is uploaded.
        </Note>
      </Panel>


      <Panel title="Import a previous export" subtitle="Paste JSON you exported earlier from this demo.">
        <Field label="Paste exported JSON" hint="It must be a Nurture demo export.">
          <textarea
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            placeholder='{"version": 1, ... }'
            aria-label="Paste exported JSON"
          />
        </Field>
        {error ? <Note tone="warn">{error}</Note> : null}
        <Row>
          <button type="button" className="button" onClick={applyImport}>
            Import JSON
          </button>
        </Row>
        <Note tone="quiet">Importing replaces the current demo data with the contents of the file.</Note>
      </Panel>

      <Panel title="Delete everything in this demo" className="panel--clay">
        {confirming ? (
          <>
            <Note tone="warn">
              This clears every demo entry and preference in this browser session. This cannot be undone.
            </Note>
            <Row>
              <button type="button" className="button" onClick={clearAll}>
                Yes, delete everything
              </button>
              <button type="button" className="button button--ghost" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </Row>
          </>
        ) : (
          <Row>
            <button type="button" className="button" onClick={() => setConfirming(true)}>
              Delete everything in this demo
            </button>
          </Row>
        )}
      </Panel>

      <Panel title="What this means in the real product">
        <ul className="list">
          <li className="list__item list__item--plain">
            <span className="list__main">
              <span className="list__title">Export</span>
              <span className="list__meta">You can download a portable copy of your health data at any time, in a common format.</span>
            </span>
          </li>
          <li className="list__item list__item--plain">
            <span className="list__main">
              <span className="list__title">Deletion</span>
              <span className="list__meta">You can delete your account and its data, and exports let you keep a copy before you go.</span>
            </span>
          </li>
          <li className="list__item list__item--plain">
            <span className="list__main">
              <span className="list__title">Control</span>
              <span className="list__meta">Access, correction and deletion are your rights, and they are not tied to staying a customer.</span>
            </span>
          </li>
        </ul>
        <Note tone="quiet">
          In this demo there is no account and no server, so export and deletion act on your browser session only.
        </Note>
      </Panel>
    </div>
  );
}

