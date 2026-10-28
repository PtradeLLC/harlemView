import React, { useState } from 'react';
import { X, ExternalLink, Compass, SplitSquareVertical } from 'lucide-react';

interface Props {
  currentNodeId: string;
  onClose: () => void;
}

export const RealStreetViewModal: React.FC<Props> = ({ currentNodeId, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>(
    currentNodeId === 'node_malcolm_x'
      ? 'malcolm_x'
      : currentNodeId === 'node_brownstone_stoop'
      ? 'astor_row'
      : 'apollo_125'
  );

  const realLocations: Record<
    string,
    { title: string; address: string; coordinates: string; embedUrl: string }
  > = {
    apollo_125: {
      title: 'Apollo Theater Corridor (253 W 125th St)',
      address: '253 W 125th St, New York, NY 10027',
      coordinates: '40.8096, -73.9501',
      embedUrl:
        'https://maps.google.com/maps?q=Apollo+Theater+253+W+125th+St+New+York&t=&z=17&ie=UTF8&iwloc=&output=embed',
    },
    malcolm_x: {
      title: 'Malcolm X Blvd (Lenox Ave) & 125th St',
      address: 'Malcolm X Blvd & W 125th St, New York, NY 10027',
      coordinates: '40.8080, -73.9455',
      embedUrl:
        'https://maps.google.com/maps?q=Malcolm+X+Blvd+and+W+125th+St+New+York&t=&z=17&ie=UTF8&iwloc=&output=embed',
    },
    astor_row: {
      title: 'Historic Astor Row Brownstones (W 130th St)',
      address: 'Astor Row, 130 W 130th St, New York, NY 10027',
      coordinates: '40.8115, -73.9463',
      embedUrl:
        'https://maps.google.com/maps?q=Astor+Row+130+W+130th+St+New+York&t=&z=18&ie=UTF8&iwloc=&output=embed',
    },
    marcus_garvey: {
      title: 'Marcus Garvey Park & Watchtower',
      address: '631 Mount Morris Park W, New York, NY 10027',
      coordinates: '40.8044, -73.9439',
      embedUrl:
        'https://maps.google.com/maps?q=Marcus+Garvey+Park+New+York&t=&z=17&ie=UTF8&iwloc=&output=embed',
    },
    strivers_row: {
      title: "Historic Strivers' Row (W 138th St)",
      address: '201 W 138th St, New York, NY 10030',
      coordinates: '40.8178, -73.9442',
      embedUrl:
        'https://maps.google.com/maps?q=Strivers+Row+New+York&t=&z=18&ie=UTF8&iwloc=&output=embed',
    },
    mintons: {
      title: "Minton's Playhouse (W 118th St)",
      address: '206 W 118th St, New York, NY 10026',
      coordinates: '40.8048, -73.9535',
      embedUrl:
        'https://maps.google.com/maps?q=Mintons+Playhouse+206+W+118th+St+New+York&t=&z=18&ie=UTF8&iwloc=&output=embed',
    },
  };

  const current = realLocations[selectedLocation] || realLocations.apollo_125;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Real Google Maps & Street View Harlem
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Live Satellite & Street View
                </span>
              </div>
              <p className="text-xs text-slate-400">Compare real-world Harlem with the Eco-Futuristic World Model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location selector strip */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            {Object.entries(realLocations).map(([key, loc]) => (
              <button
                key={key}
                onClick={() => setSelectedLocation(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedLocation === key
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
              >
                {loc.title.split('(')[0]}
              </button>
            ))}
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap"
          >
            Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Comparison Notice & Embedded Map */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          <iframe
            title={current.title}
            src={current.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full filter contrast-105"
          />

          {/* World Model Contrast Callout Pill */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md p-3.5 rounded-xl bg-slate-950/90 border border-slate-700 shadow-2xl backdrop-blur-md text-xs text-slate-200">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
              <SplitSquareVertical className="w-4 h-4 text-amber-400" />
              <span>World Model Transformation</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In the World Model, this real Harlem corridor is transformed with towering Canary date palms, permeable
              rainwater limestone pavers, autonomous whisper sweepers, and art-deco pneumatic smart waste hubs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
