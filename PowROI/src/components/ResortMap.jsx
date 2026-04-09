import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { PASSES } from '../data/resorts';

function ResortDot({ resort, isSelected, isRegion, onToggle }) {
  const color = isSelected ? '#1A1A1A' : isRegion ? '#555555' : '#D4CFC7';
  const radius = isSelected ? 9 : isRegion ? 7 : 5;

  return (
    <CircleMarker
      center={[resort.lat, resort.lng]}
      radius={radius}
      pathOptions={{
        fillColor: color,
        fillOpacity: 1,
        color: '#FFFFFF',
        weight: 2,
      }}
      eventHandlers={{ click: () => onToggle(resort.id) }}
    >
      <Popup>
        <div style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 180 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{resort.name}</div>
          <div style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 6 }}>
            ${resort.dayTicket}/day · {resort.skillLevel}
          </div>
          <div style={{ fontSize: 12, color: '#6B6B6B' }}>
            {resort.passes.map(p => PASSES.find(pp => pp.id === p)?.name).join(', ')}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(resort.id); }}
            style={{
              marginTop: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600,
              border: isSelected ? '1px solid #C0392B' : '1px solid #1A1A1A',
              borderRadius: 6, cursor: 'pointer',
              background: isSelected ? '#FFF' : '#1A1A1A',
              color: isSelected ? '#C0392B' : '#FFF',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isSelected ? 'Unpin' : 'Pin as must-have'}
          </button>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default function ResortMap({ resorts, selected, onToggle, region }) {
  const [search, setSearch] = useState('');

  const filteredForList = search
    ? resorts.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div style={{
      background: '#FFF', borderRadius: 12,
      border: '1px solid #E0DDD8', overflow: 'hidden',
    }}>
      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E0DDD8', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search resorts by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: '10px 14px',
            border: '1px solid #E0DDD8', borderRadius: 8, width: '100%',
            boxSizing: 'border-box', outline: 'none', background: '#F0EFED',
          }}
        />
        {search && filteredForList.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 16, right: 16,
            background: '#fff', border: '1px solid #E0DDD8', borderRadius: 8,
            maxHeight: 220, overflowY: 'auto', zIndex: 1000,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            {filteredForList.map(r => (
              <div
                key={r.id}
                onClick={() => { onToggle(r.id); setSearch(''); }}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: 13,
                  borderBottom: '1px solid #E0DDD8',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: selected.includes(r.id) ? '#F0EFED' : 'transparent',
                }}
              >
                <span><strong>{r.name}</strong> · {r.skillLevel}</span>
                <span style={{ color: '#6B6B6B', fontSize: 12 }}>
                  ${r.dayTicket}/day
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[39.5, -98.5]}
        zoom={4}
        minZoom={3}
        maxZoom={10}
        style={{ height: 460, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a>'
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
        />
        {resorts.map(resort => (
          <ResortDot
            key={resort.id}
            resort={resort}
            isSelected={selected.includes(resort.id)}
            isRegion={resort.region === region}
            onToggle={onToggle}
          />
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={{
        padding: '10px 16px', borderTop: '1px solid #E0DDD8',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11, color: '#6B6B6B', flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#555', display: 'inline-block' }} /> Your region
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4CFC7', display: 'inline-block' }} /> Other
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#1A1A1A', display: 'inline-block' }} /> Pinned
          </span>
        </div>
        <span>Click markers or search to pin must-haves (max 3)</span>
      </div>
    </div>
  );
}
