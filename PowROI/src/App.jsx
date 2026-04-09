import { useState, useMemo, useCallback } from 'react';
import _ from 'lodash';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import ResortMap from './components/ResortMap';
import { PASSES, REGIONS, SKILL_LEVELS, RESORTS, CANADIAN_LUMPED } from './data/resorts';

// ─── SCORING ───────────────────────────────────────────────────────────────────
function scorePass(pass, prefs) {
  const passResorts = RESORTS.filter(r => r.passes.includes(pass.id));
  const regionResorts = passResorts.filter(r => r.region === prefs.region);
  const mustHaveMatch = prefs.mustHaveResorts.filter(id =>
    passResorts.some(r => r.id === id)
  ).length;

  const costPerDay = prefs.skiDays > 0 ? pass.price / prefs.skiDays : pass.price;
  const avgDayTicket = passResorts.length > 0
    ? passResorts.reduce((s, r) => s + r.dayTicket, 0) / passResorts.length
    : 150;
  const savings = avgDayTicket - costPerDay;
  const breakEvenDays = avgDayTicket > 0 ? Math.ceil(pass.price / avgDayTicket) : 999;

  let score = 0;
  score += Math.min(savings * 2, 200);
  score += regionResorts.length * 15;
  score += mustHaveMatch * 100;
  score += passResorts.length * 2;
  if (pass.price <= prefs.budget) score += 50;
  if (pass.price > prefs.budget) score -= 100;
  if (prefs.skiStyle === 'weekend') {
    score -= passResorts.filter(r => r.blackout).length * 10;
  }

  return {
    pass, score: Math.round(score),
    costPerDay: Math.round(costPerDay), avgDayTicket: Math.round(avgDayTicket),
    savings: Math.round(savings), breakEvenDays,
    totalResorts: passResorts.length, regionResorts: regionResorts.length,
    mustHaveMatch, passResorts,
  };
}

// ─── CHART DATA ────────────────────────────────────────────────────────────────
function getBreakEvenData(results) {
  return _.range(1, 31).map(d => {
    const row = { days: d };
    results.forEach(r => { row[r.pass.id] = Math.round(r.pass.price / d); });
    row.dayTicket = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.avgDayTicket, 0) / results.length)
      : 150;
    return row;
  });
}

function getSensitivityData(results, prefs) {
  return _.range(Math.max(1, prefs.skiDays - 5), prefs.skiDays + 11).map(d => {
    const row = { days: d, isSelected: d === prefs.skiDays };
    results.forEach(r => {
      const cpd = Math.round(r.pass.price / d);
      row[r.pass.id] = cpd;
      row[`${r.pass.id}_saving`] = r.avgDayTicket - cpd;
    });
    return row;
  });
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function MountainBg() {
  return (
    <svg viewBox="0 0 1200 200" style={{ width: '100%', height: 200, display: 'block', opacity: 0.08 }} preserveAspectRatio="none">
      <polygon points="0,200 150,60 300,200" fill="#1A1A1A" />
      <polygon points="200,200 400,30 600,200" fill="#333" />
      <polygon points="500,200 700,50 900,200" fill="#1A1A1A" />
      <polygon points="800,200 1000,70 1200,200" fill="#333" />
      <polygon points="100,200 350,80 500,200" fill="#555" opacity="0.5" />
      <polygon points="700,200 900,40 1100,200" fill="#555" opacity="0.5" />
    </svg>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '24px 0' }}>
      {_.range(total).map(i => (
        <div key={i} style={{
          width: i === current ? 32 : 10, height: 10, borderRadius: 5,
          background: i <= current ? 'var(--accent)' : 'var(--border)',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  );
}

function PassCard({ result, rank, expanded, onToggle }) {
  const { pass, costPerDay, avgDayTicket, savings, breakEvenDays, totalResorts, regionResorts, mustHaveMatch } = result;
  return (
    <div onClick={onToggle} style={{
      background: 'var(--card)', border: `1px solid ${rank === 1 ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 12, padding: '20px 24px', marginBottom: 12, cursor: 'pointer',
      transition: 'all 0.2s', boxShadow: rank === 1 ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: pass.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
          }}>#{rank}</div>
          <div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600 }}>{pass.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              ${pass.price} · {totalResorts} resorts · {regionResorts} in your region
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>${costPerDay}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>per day</div>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[['Break-even', `${breakEvenDays} days`], ['Avg day ticket', `$${avgDayTicket}`],
              ['Savings/day', `${savings > 0 ? '+' : ''}$${savings}`]].map(([label, val], i) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: i === 2 ? (savings > 0 ? 'var(--positive)' : 'var(--negative)') : 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          {mustHaveMatch > 0 && (
            <div style={{ fontSize: 13, color: 'var(--positive)', background: '#E8F5E9', padding: '8px 12px', borderRadius: 6 }}>
              Includes {mustHaveMatch} of your must-have resort{mustHaveMatch > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ComparisonTable({ results }) {
  const headers = ['Pass', 'Price', 'Cost/Day', 'Break-even', 'Savings/Day', 'Resorts', 'Score'];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--accent)' }}>
            {headers.map(h => (
              <th key={h} style={{ textAlign: h === 'Pass' ? 'left' : 'right', padding: '10px 12px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={r.pass.id} style={{ borderBottom: '1px solid var(--border)', background: i === 0 ? 'var(--accent-light)' : 'transparent' }}>
              <td style={{ padding: 12, fontWeight: 600 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: r.pass.color, marginRight: 8 }} />
                {r.pass.name}
              </td>
              <td style={{ textAlign: 'right', padding: 12 }}>${r.pass.price}</td>
              <td style={{ textAlign: 'right', padding: 12, fontWeight: 700 }}>${r.costPerDay}</td>
              <td style={{ textAlign: 'right', padding: 12 }}>{r.breakEvenDays} days</td>
              <td style={{ textAlign: 'right', padding: 12, color: r.savings > 0 ? 'var(--positive)' : 'var(--negative)', fontWeight: 600 }}>
                {r.savings > 0 ? `+$${r.savings}` : `-$${Math.abs(r.savings)}`}
              </td>
              <td style={{ textAlign: 'right', padding: 12 }}>{r.totalResorts}</td>
              <td style={{ textAlign: 'right', padding: 12 }}>{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BreakEvenChart({ data, results }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
      <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, margin: '0 0 4px 0' }}>Break-even Analysis</h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
        Cost per ski day vs. buying day tickets. Where the line drops below the gray "Day Ticket Avg" line, you start saving.
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="days" label={{ value: 'Ski Days', position: 'insideBottom', offset: -2, style: { fontSize: 12 } }} tick={{ fontSize: 11 }} />
          <YAxis label={{ value: 'Cost / Day ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--border)' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={data[0]?.dayTicket} stroke="var(--text-muted)" strokeDasharray="6 3" label={{ value: 'Day Ticket Avg', position: 'right', style: { fontSize: 11, fill: 'var(--text-muted)' } }} />
          {results.map(r => (
            <Line key={r.pass.id} type="monotone" dataKey={r.pass.id} name={r.pass.name} stroke={r.pass.color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SensitivityPanel({ data, results }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
      <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, margin: '0 0 4px 0' }}>Sensitivity Analysis</h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
        How does your cost per day change if you ski more or fewer days? Your planned days are highlighted.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--accent)' }}>
              <th style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)' }}>Days</th>
              {results.map(r => (
                <th key={r.pass.id} style={{ textAlign: 'right', padding: '8px 10px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: r.pass.color }}>{r.pass.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.days} style={{
                borderBottom: '1px solid var(--border)',
                background: row.isSelected ? 'var(--accent-light)' : 'transparent',
                fontWeight: row.isSelected ? 700 : 400,
              }}>
                <td style={{ padding: '8px 10px' }}>{row.days} {row.isSelected ? '←' : ''}</td>
                {results.map(r => {
                  const saving = row[`${r.pass.id}_saving`];
                  return (
                    <td key={r.pass.id} style={{
                      textAlign: 'right', padding: '8px 10px',
                      color: saving > 0 ? 'var(--positive)' : saving < 0 ? 'var(--negative)' : 'var(--text)',
                    }}>
                      ${row[r.pass.id]}
                      <span style={{ fontSize: 11, marginLeft: 4 }}>({saving > 0 ? '+' : ''}{saving})</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({
    region: 'pnw', skiDays: 10, budget: 1000,
    skillLevel: 'Intermediate', skiStyle: 'mixed',
    mustHaveResorts: [],
    includeTravelCosts: false, travelCostPerTrip: 200, tripsPerSeason: 5,
  });
  const [expandedCard, setExpandedCard] = useState(null);
  const [viewMode, setViewMode] = useState('ranked');
  const [activeTab, setActiveTab] = useState('results');

  const updatePref = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const toggleMustHave = useCallback((id) => {
    setPrefs(p => {
      const c = p.mustHaveResorts;
      if (c.includes(id)) return { ...p, mustHaveResorts: c.filter(r => r !== id) };
      if (c.length >= 3) return p;
      return { ...p, mustHaveResorts: [...c, id] };
    });
  }, []);

  const results = useMemo(() => {
    let scored = PASSES.map(p => scorePass(p, prefs));
    if (prefs.includeTravelCosts) {
      scored = scored.map(r => {
        const total = r.pass.price + (prefs.travelCostPerTrip * prefs.tripsPerSeason);
        const adj = Math.round(total / prefs.skiDays);
        return { ...r, costPerDay: adj, savings: r.avgDayTicket - adj };
      });
    }
    return _.orderBy(scored, ['score'], ['desc']);
  }, [prefs]);

  const breakEvenData = useMemo(() => getBreakEvenData(results), [results]);
  const sensitivityData = useMemo(() => getSensitivityData(results, prefs), [results, prefs]);

  const inputStyle = {
    fontSize: 15, padding: '10px 14px', border: '1px solid var(--border)',
    borderRadius: 8, background: '#fff', color: 'var(--text)', width: '100%',
    outline: 'none', boxSizing: 'border-box',
  };
  const btnPrimary = {
    fontSize: 15, fontWeight: 600, padding: '12px 32px', borderRadius: 8,
    border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer',
  };
  const btnSecondary = {
    ...btnPrimary, background: 'transparent', color: 'var(--accent)',
    border: '1.5px solid var(--accent)',
  };
  const labelStyle = {
    fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: 1.2, color: 'var(--text-muted)', marginBottom: 6, display: 'block',
  };

  const pillBtn = (active) => ({
    fontSize: 13, padding: '8px 16px', flex: 1, borderRadius: 8, cursor: 'pointer',
    border: '1.5px solid var(--accent)', fontWeight: 600,
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--accent)',
  });

  // ─── VIEWS ─────────────────────────────────────────────────────────────────
  if (step === 0) return (
    <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <MountainBg />
      <h1 style={{ fontFamily: 'var(--display)', fontSize: 52, fontWeight: 700, margin: '0 0 8px', letterSpacing: -1 }}>PowROI</h1>
      <p style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--text-muted)', margin: '0 0 8px' }}>Ski Pass Advisor</p>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: '0 0 32px', lineHeight: 1.6 }}>
        Find the best ski pass for your season. Compare costs, run break-even analysis, and make a data-driven decision.
      </p>
      <button style={btnPrimary} onClick={() => setStep(1)}>Start Analysis →</button>
    </div>
  );

  if (step === 1) return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 20 }}>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: '0 0 24px' }}>Your ski profile</h2>

      <label style={labelStyle}>Home Region</label>
      <select value={prefs.region} onChange={e => updatePref('region', e.target.value)} style={{ ...inputStyle, marginBottom: 20 }}>
        {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      <label style={labelStyle}>Estimated Ski Days</label>
      <input type="range" min={1} max={40} value={prefs.skiDays} onChange={e => updatePref('skiDays', parseInt(e.target.value))} style={{ width: '100%', marginBottom: 4 }} />
      <div style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>{prefs.skiDays} days</div>

      <label style={labelStyle}>Budget</label>
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
        <input type="number" value={prefs.budget} onChange={e => updatePref('budget', parseInt(e.target.value) || 0)} style={{ ...inputStyle, paddingLeft: 28 }} />
      </div>

      <label style={labelStyle}>Skill Level</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {SKILL_LEVELS.map(s => <button key={s} onClick={() => updatePref('skillLevel', s)} style={pillBtn(prefs.skillLevel === s)}>{s}</button>)}
      </div>

      <label style={labelStyle}>Typical Schedule</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['weekday', 'Weekdays'], ['weekend', 'Weekends'], ['mixed', 'Both']].map(([v, l]) => (
          <button key={v} onClick={() => updatePref('skiStyle', v)} style={pillBtn(prefs.skiStyle === v)}>{l}</button>
        ))}
      </div>

      <StepIndicator current={0} total={3} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={btnPrimary} onClick={() => setStep(2)}>Next →</button>
      </div>
    </div>
  );

  if (step === 2) return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: '0 0 8px' }}>Pin your must-have resorts</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px' }}>
        Select up to 3 resorts you need access to. These heavily weight the recommendation.
      </p>

      <ResortMap resorts={RESORTS} selected={prefs.mustHaveResorts} onToggle={toggleMustHave} region={prefs.region} />

      {prefs.mustHaveResorts.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {prefs.mustHaveResorts.map(id => {
            const r = RESORTS.find(x => x.id === id);
            return (
              <span key={id} style={{
                fontSize: 13, background: 'var(--accent)', color: '#fff',
                padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {r?.name}
                <span style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => toggleMustHave(id)}>×</span>
              </span>
            );
          })}
        </div>
      )}

      <StepIndicator current={1} total={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button style={btnSecondary} onClick={() => setStep(1)}>← Back</button>
        <button style={btnPrimary} onClick={() => setStep(3)}>Next →</button>
      </div>
    </div>
  );

  if (step === 3) return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 20 }}>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: 32, margin: '0 0 24px' }}>Optional: Travel costs</h2>

      <label style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
        <input type="checkbox" checked={prefs.includeTravelCosts} onChange={e => updatePref('includeTravelCosts', e.target.checked)} style={{ width: 18, height: 18 }} />
        Include estimated travel costs in analysis
      </label>

      {prefs.includeTravelCosts && (
        <div style={{ background: 'var(--accent-light)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <label style={labelStyle}>Cost Per Trip (gas, lodging, food)</label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
            <input type="number" value={prefs.travelCostPerTrip} onChange={e => updatePref('travelCostPerTrip', parseInt(e.target.value) || 0)} style={{ ...inputStyle, paddingLeft: 28 }} />
          </div>
          <label style={labelStyle}>Trips Per Season</label>
          <input type="number" value={prefs.tripsPerSeason} onChange={e => updatePref('tripsPerSeason', parseInt(e.target.value) || 0)} style={inputStyle} />
          <div style={{ fontSize: 14, marginTop: 12 }}>
            Estimated travel total: <strong>${prefs.travelCostPerTrip * prefs.tripsPerSeason}</strong>
          </div>
        </div>
      )}

      <StepIndicator current={2} total={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button style={btnSecondary} onClick={() => setStep(2)}>← Back</button>
        <button style={btnPrimary} onClick={() => setStep(4)}>See Results →</button>
      </div>
    </div>
  );

  // ─── RESULTS ───────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 36, margin: 0 }}>Your Results</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {prefs.skiDays} days · {REGIONS.find(r => r.id === prefs.region)?.name} · ${prefs.budget} budget
          </p>
        </div>
        <button style={btnSecondary} onClick={() => setStep(1)}>← Edit Inputs</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid var(--border)' }}>
        {[['results', 'Recommendations'], ['breakeven', 'Break-even'], ['sensitivity', 'Sensitivity']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            fontSize: 14, fontWeight: 600, padding: '10px 24px', border: 'none', background: 'none',
            borderBottom: activeTab === id ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === id ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', marginBottom: -2,
          }}>{label}</button>
        ))}
      </div>

      {activeTab === 'results' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['ranked', 'Ranked List'], ['compare', 'Comparison Table']].map(([id, label]) => (
              <button key={id} onClick={() => setViewMode(id)} style={{
                fontSize: 13, padding: '6px 16px', borderRadius: 6,
                border: '1px solid var(--border)', cursor: 'pointer',
                background: viewMode === id ? 'var(--accent)' : 'transparent',
                color: viewMode === id ? '#fff' : 'var(--text)',
              }}>{label}</button>
            ))}
          </div>
          {viewMode === 'ranked'
            ? results.map((r, i) => <PassCard key={r.pass.id} result={r} rank={i + 1} expanded={expandedCard === r.pass.id} onToggle={() => setExpandedCard(expandedCard === r.pass.id ? null : r.pass.id)} />)
            : <ComparisonTable results={results} />
          }
          <div style={{ fontSize: 13, color: 'var(--text-muted)', background: 'var(--accent-light)', padding: '12px 16px', borderRadius: 8, marginTop: 16 }}>
            Note: {CANADIAN_LUMPED.name} are also available on select passes. Details coming in V2.
          </div>
        </>
      )}

      {activeTab === 'breakeven' && <BreakEvenChart data={breakEvenData} results={results} />}
      {activeTab === 'sensitivity' && <SensitivityPanel data={sensitivityData} results={results} />}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid var(--border)', marginTop: 40 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Built by{' '}
          <a href="https://sarrahrenfro.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Sarrah Renfro
          </a>
          {' '}· 2025/2026 Season Data · Not financial advice
        </div>
      </footer>
    </div>
  );
}
