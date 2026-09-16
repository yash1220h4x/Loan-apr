import React, { useState } from 'react';
import { VERIFIED_NBFCS } from '../data/nbfcs';
import { X, Search, Building2, CheckCircle2, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

interface NbfcLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNbfc: (name: string) => void;
  selectedLender: string;
}

export const NbfcLookupModal: React.FC<NbfcLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectNbfc,
  selectedLender
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = VERIFIED_NBFCS.filter(item => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.license.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                RBI-Registered NBFC Index
              </h3>
              <p className="text-xs text-slate-500">
                Sample verified Non-Banking Financial Companies registered under Section 45-IA of the RBI Act
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by brand (e.g. KreditBee, Tata, Muthoot) or corporate name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* List of NBFCs */}
        <div className="p-4 overflow-y-auto space-y-2.5 max-h-[50vh]">
          {filtered.length > 0 ? (
            filtered.map((nbfc) => {
              const isCurrent =
                selectedLender.toLowerCase() === nbfc.name.toLowerCase() ||
                selectedLender.toLowerCase() === nbfc.brand.toLowerCase();

              return (
                <div
                  key={nbfc.name}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-indigo-50/70 border-indigo-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {nbfc.brand}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        RBI Registered
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium">{nbfc.name}</div>
                    <div className="text-2xs text-slate-400">{nbfc.license}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectNbfc(nbfc.name);
                      onClose();
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
                    }`}
                  >
                    {isCurrent ? 'Selected' : 'Use in Audit'}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No matching entities found in sample index.</p>
              <p className="text-xs text-slate-400">
                If the entity claims to be an NBFC, check the official RBI list at rbi.org.in or ask for their exact Certificate of Registration (CoR) number.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href="https://www.rbi.org.in/scripts/BS_NBFCList.aspx"
            target="_blank"
            rel="noreferrer"
            className="text-2xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Official RBI Complete NBFC Directory</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
