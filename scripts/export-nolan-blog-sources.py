"""Export reviewed, commit-pinned research records for the website articles.

Run with --repository /path/to/amc_nolan. This reads Git objects only; it never
changes the research checkout or copies raw market payloads / personal notes.
Add a phase only for a substantial research milestone, not a housekeeping commit.
"""
import argparse
import hashlib
import json
from datetime import datetime
from pathlib import Path
import subprocess
from zoneinfo import ZoneInfo

PHASES = {
    'protocol': {
        'commits': ['e755b029ce58d44a23df93ad56fc112249b04109', 'addcf2a21bad6cc9e5f62b3274aa05e8498de484'],
        'records': [('e755b02', 'docs/analysis_plan.md'), ('addcf2a', 'data/raw/nolan_films.csv'), ('addcf2a', 'data/raw/excluded_films.csv'), ('addcf2a', 'data/raw/market_manifest.json')],
    },
    'eventStudy': {
        'commits': ['a58d5f18bbf943c6191f9b5d2d24efd1e7dc420d', '2bb33669b10819dbb903911d3e6c3a5cfa9dc9c1', 'cc082fff892fdb23d21c895cd4257de672242106', 'a4451c791af4f3bb5cfdd7826010660eeb2a317c'],
        'records': [('a4451c7', 'results/assessment.md'), ('a4451c7', 'docs/validation_report.md'), ('a4451c7', 'results/tables/tests.csv'), ('2bb3366', 'src/event_study.py', 'hash-only'), ('2bb3366', 'src/volatility.py', 'hash-only')],
    },
    'attention': {
        'commits': ['39e20e1f73cd85488dbbaa77cd2746287730d5e6', '7bcd418581e9ff25b7a95502574fd20fecfc7ff0', '80bacbfe75c0e5dca2c0b182f43acc4497714a58'],
        'records': [('39e20e1', 'docs/confounder_extension.md'), ('80bacbf', 'results/attention_assessment.md'), ('80bacbf', 'results/tables/attention_correlations.csv'), ('80bacbf', 'docs/validation_report.md'), ('7bcd418', 'src/attention.py', 'hash-only')],
    },
    'audit': {
        'commits': ['b1e78a722ffbe83089ba16fcc6df99063cee2843'],
        'records': [('b1e78a7', 'docs/quant_finance_assessment.md', 'assessment-sections-3-to-5'), ('b1e78a7', 'docs/options_implementation_plan.md'), ('b1e78a7', 'src/options.py', 'hash-only')],
    },
}


def export(repository, website):
    def git(*args):
        return subprocess.check_output(['git', '-C', str(repository), *args])

    public = website / 'client/public/blog/nolan-amc'
    (public / 'sources').mkdir(parents=True, exist_ok=True)
    provenance = {}
    for key, phase in PHASES.items():
        commits = []
        for revision in phase['commits']:
            sha, timestamp, subject = git('show', '-s', '--format=%H%n%aI%n%s', revision).decode().strip().split('\n', 2)
            commits.append({'sha': sha, 'timestamp': timestamp, 'subject': subject})
        records = []
        for spec in phase['records']:
            revision, path, *selection = spec
            sha = git('rev-parse', revision).decode().strip()
            blob = git('show', f'{sha}:{path}')
            record = {'commit': sha, 'path': path, 'sha256': hashlib.sha256(blob).hexdigest()}
            mode = selection[0] if selection else 'full-text'
            record['selection'] = mode
            if mode != 'hash-only':
                content = blob.decode()
                if mode == 'assessment-sections-3-to-5':
                    content = content[content.index('## 3.'):content.index('## 6.')]
                record['content'] = content
                record['exported_text_sha256'] = hashlib.sha256(content.encode()).hexdigest()
            records.append(record)
        pack = {'project': 'Nolan / AMC Event Study', 'phase': key, 'commits': commits, 'records': records}
        payload = (json.dumps(pack, indent=2, ensure_ascii=False) + '\n').encode()
        filename = f'{key}.json'
        (public / 'sources' / filename).write_bytes(payload)
        provenance[key] = {
            'date': datetime.fromisoformat(commits[-1]['timestamp']).astimezone(ZoneInfo('America/Los_Angeles')).date().isoformat(),
            'commits': commits,
            'records': [{k: v for k, v in record.items() if k != 'content'} for record in records],
            'url': f'/blog/nolan-amc/sources/{filename}',
            'sha256': hashlib.sha256(payload).hexdigest(),
        }
    for revision, name, target in [('a4451c7', '08_individual_events.png', 'individual-events.png'), ('80bacbf', '14_attention_and_confounders.png', 'attention-and-confounders.png')]:
        (public / target).write_bytes(git('show', f'{revision}:results/figures/{name}'))
    output = website / 'client/src/content/blog/notebooks/nolan-amc/provenance.ts'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text('// Generated from Git objects by scripts/export-nolan-blog-sources.py.\nexport const nolanSources = ' + json.dumps(provenance, indent=2, ensure_ascii=False) + ' as const;\n')
    print(f'Exported {len(provenance)} research phases from immutable Git objects.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--website', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    export(args.repository, args.website)
