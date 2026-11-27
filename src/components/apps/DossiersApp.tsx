import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Shield,
  X,
} from 'lucide-react';
import { CharacterDossier, CharacterVitalStatus } from '../../types/phone';

interface DossiersAppProps {
  dossiers: CharacterDossier[];
  chapterNumber: number;
  onInspectDossier?: (dossierId: string) => void;
}

type DossierFilter = 'all' | 'party' | 'dorm' | 'dead';

function getStatusLabel(status: CharacterVitalStatus): string {
  if (status === 'dead') return 'DECEASED';
  if (status === 'missing') return 'MISSING';
  if (status === 'detained') return 'DETAINED';
  return 'ALIVE';
}

function getStatusColorClass(status: CharacterVitalStatus): string {
  if (status === 'dead') return 'text-red-400';
  if (status === 'missing') return 'text-amber-400';
  if (status === 'detained') return 'text-orange-400';
  return 'text-emerald-400';
}

export const DossiersApp: React.FC<DossiersAppProps> = ({
  dossiers,
  chapterNumber,
  onInspectDossier,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<DossierFilter>('all');
  const [query, setQuery] = useState('');

  const selected = useMemo(
    () => dossiers.find((d) => d.id === selectedId) ?? null,
    [dossiers, selectedId]
  );

  const filteredDossiers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dossiers.filter((d) => {
      if (filter === 'party' && !d.attendedParty) return false;
      if (
        filter === 'dorm' &&
        !d.role.toLowerCase().includes('dorm 304') &&
        !d.residence.toLowerCase().includes('dorm 304')
      ) {
        return false;
      }
      if (filter === 'dead' && d.status !== 'dead') return false;

      if (!q) return true;
      const haystack = [
        d.name,
        d.role,
        d.residence,
        d.alibi,
        d.interrogationSummary,
        d.detectiveNotes,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [dossiers, filter, query]);

  if (selected) {
    return (
      <div className="flex h-full flex-col bg-[#0c1017] pt-[90px] pb-6 text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#111722] px-3 py-2.5">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="flex min-h-[40px] items-center gap-1 rounded-lg px-2 text-[14px] font-medium text-blue-400 hover:bg-white/5"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Case Files</span>
          </button>
          <span className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase tabular-nums">
            Ch. 0{chapterNumber} · File
          </span>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-4 pb-8">
          {/* Subject Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between gap-2">
              <h1 className="truncate text-[18px] font-bold text-white">
                {selected.name}
              </h1>
              <span
                className={`shrink-0 text-[11px] font-bold tracking-[0.12em] uppercase ${getStatusColorClass(
                  selected.status
                )}`}
              >
                {getStatusLabel(selected.status)}
              </span>
            </div>
            <p className="mt-0.5 text-[13px] text-zinc-300">{selected.role}</p>
            <p className="mt-1 text-[12px] text-zinc-400">
              Age {selected.age} · {selected.residence} ·{' '}
              {selected.attendedParty ? 'Attended Party' : 'Absent from Party'}
            </p>
          </div>

          {/* Structured Police Sections */}
          <div className="mt-4 space-y-4">
            <section className="rounded-xl border border-white/10 bg-[#121823] p-3.5">
              <h2 className="text-[11px] font-bold tracking-[0.12em] text-blue-400 uppercase">
                Stated Alibi
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-100">
                {selected.alibi || 'No official alibi recorded.'}
              </p>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#121823] p-3.5">
              <h2 className="text-[11px] font-bold tracking-[0.12em] text-zinc-400 uppercase">
                Precinct Questioning Summary
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-200">
                {selected.interrogationSummary || 'Pending questioning log.'}
              </p>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#121823] p-3.5">
              <h2 className="text-[11px] font-bold tracking-[0.12em] text-amber-400 uppercase">
                Detective Sanghyeok Notes
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-200">
                {selected.detectiveNotes || 'No private notes recorded yet.'}
              </p>
            </section>

            {selected.updates.length > 0 && (
              <section className="border-t border-white/10 pt-3">
                <h2 className="mb-2.5 text-[11px] font-bold tracking-[0.12em] text-red-400 uppercase">
                  Active Updates & Cross-Checks
                </h2>
                <div className="space-y-2.5">
                  {selected.updates.map((upd) => (
                    <div
                      key={upd.id}
                      className="rounded-xl border border-white/10 bg-[#171d29] p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11.5px]">
                        <span className="font-semibold text-white">
                          {upd.title}
                        </span>
                        <span className="shrink-0 text-zinc-400 tabular-nums">
                          {upd.time}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">
                        {upd.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0c1017] pt-[90px] pb-6 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#101621] px-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold tracking-tight text-white">
                Case Files
              </h1>
              <p className="text-[11.5px] text-zinc-400">
                Gyeong-gwan Precinct · Interrogation Dossiers
              </p>
            </div>
          </div>
          <span className="text-[12px] font-semibold text-zinc-400 tabular-nums">
            {dossiers.length} files
          </span>
        </div>

        {/* Search */}
        <div className="mt-3 flex min-h-[40px] items-center gap-2 rounded-xl border border-white/10 bg-[#171e2b] px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, dorm, alibi..."
            className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-zinc-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Interactive Filter Tabs */}
        <div className="no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'party', label: 'Party Guests' },
              { id: 'dorm', label: 'Dorm 304' },
              { id: 'dead', label: 'Deceased' },
            ] as { id: DossierFilter; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`min-h-[34px] shrink-0 rounded-lg border px-3 text-[12px] font-semibold transition-colors ${
                filter === item.id
                  ? 'border-blue-400/60 bg-blue-500/20 text-blue-300'
                  : 'border-white/10 bg-[#151b26] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dossier List */}
      <div className="no-scrollbar flex-1 divide-y divide-white/10 overflow-y-auto pb-4">
        {filteredDossiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <FileText className="h-8 w-8 text-zinc-600" />
            <p className="mt-2.5 text-[14px] font-semibold text-zinc-300">
              No matching dossiers
            </p>
            <p className="mt-1 text-[12.5px] text-zinc-500">
              Adjust your search filter or edit files inside src/assets/dossiers/.
            </p>
          </div>
        ) : (
          filteredDossiers.map((dossier) => (
            <button
              key={dossier.id}
              type="button"
              onClick={() => {
                setSelectedId(dossier.id);
                onInspectDossier?.(dossier.id);
              }}
              className="flex min-h-[72px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[14.5px] font-semibold text-white">
                    {dossier.name}
                  </span>
                  <span
                    className={`shrink-0 text-[10.5px] font-bold tracking-[0.1em] uppercase ${getStatusColorClass(
                      dossier.status
                    )}`}
                  >
                    {getStatusLabel(dossier.status)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[12px] text-zinc-400">
                  {dossier.role} ·{' '}
                  {dossier.attendedParty ? 'At Party' : 'Did Not Attend'}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-zinc-500">
                  {dossier.interrogationSummary}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
