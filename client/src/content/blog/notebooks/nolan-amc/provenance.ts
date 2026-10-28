// Generated from Git objects by scripts/export-nolan-blog-sources.py.
export const nolanSources = {
  "protocol": {
    "date": "2026-09-16",
    "commits": [
      {
        "sha": "e755b029ce58d44a23df93ad56fc112249b04109",
        "timestamp": "2026-09-16T09:57:46-07:00",
        "subject": "docs: freeze Nolan AMC research protocol before observing market outcomes"
      },
      {
        "sha": "addcf2a21bad6cc9e5f62b3274aa05e8498de484",
        "timestamp": "2026-09-16T10:02:38-07:00",
        "subject": "feat: add frozen market snapshots and sourced film and confounder datasets"
      }
    ],
    "records": [
      {
        "commit": "e755b029ce58d44a23df93ad56fc112249b04109",
        "path": "docs/analysis_plan.md",
        "sha256": "531b46c119ebd04b1673800929787631575227b06bf949a2ee0c3d91dd4c2dd7",
        "selection": "full-text",
        "exported_text_sha256": "531b46c119ebd04b1673800929787631575227b06bf949a2ee0c3d91dd4c2dd7"
      },
      {
        "commit": "addcf2a21bad6cc9e5f62b3274aa05e8498de484",
        "path": "data/raw/nolan_films.csv",
        "sha256": "d0fd6fa2fa229a1abd845ffe192bfdd8e8d3c11a6fbf3bd2aecf52721b8470c4",
        "selection": "full-text",
        "exported_text_sha256": "d0fd6fa2fa229a1abd845ffe192bfdd8e8d3c11a6fbf3bd2aecf52721b8470c4"
      },
      {
        "commit": "addcf2a21bad6cc9e5f62b3274aa05e8498de484",
        "path": "data/raw/excluded_films.csv",
        "sha256": "874c1b80a1662e1b1da3bc5363c4eb865072cf5ade2bd0888dfe9365c1a58526",
        "selection": "full-text",
        "exported_text_sha256": "874c1b80a1662e1b1da3bc5363c4eb865072cf5ade2bd0888dfe9365c1a58526"
      },
      {
        "commit": "addcf2a21bad6cc9e5f62b3274aa05e8498de484",
        "path": "data/raw/market_manifest.json",
        "sha256": "421c3ca0f0352d9a811016a30f3feb752ee57936ed0fa77e8b3fc43dac4ad811",
        "selection": "full-text",
        "exported_text_sha256": "421c3ca0f0352d9a811016a30f3feb752ee57936ed0fa77e8b3fc43dac4ad811"
      }
    ],
    "url": "/blog/nolan-amc/sources/protocol.json",
    "sha256": "bd8bef06d2fa585ba49185974e9ed7a2904bb04eff476ceea7de0fd8f94c1469"
  },
  "eventStudy": {
    "date": "2026-09-16",
    "commits": [
      {
        "sha": "a58d5f18bbf943c6191f9b5d2d24efd1e7dc420d",
        "timestamp": "2026-09-16T10:03:27-07:00",
        "subject": "docs: add user-requested interview methodology and volatility plan"
      },
      {
        "sha": "2bb33669b10819dbb903911d3e6c3a5cfa9dc9c1",
        "timestamp": "2026-09-16T10:12:30-07:00",
        "subject": "feat: implement event inference GARCH diagnostics and scientific validation tests"
      },
      {
        "sha": "cc082fff892fdb23d21c895cd4257de672242106",
        "timestamp": "2026-09-16T10:21:47-07:00",
        "subject": "docs: author complete interview-focused research notebook and reproduction guide"
      },
      {
        "sha": "a4451c791af4f3bb5cfdd7826010660eeb2a317c",
        "timestamp": "2026-09-16T10:27:12-07:00",
        "subject": "feat: deliver executed study with verified artifacts and locked reproduction environment"
      }
    ],
    "records": [
      {
        "commit": "a4451c791af4f3bb5cfdd7826010660eeb2a317c",
        "path": "results/assessment.md",
        "sha256": "6074fcaa5787ab33373e69ae74886a334258cec6f2d7fcb72e9e3c54888280be",
        "selection": "full-text",
        "exported_text_sha256": "6074fcaa5787ab33373e69ae74886a334258cec6f2d7fcb72e9e3c54888280be"
      },
      {
        "commit": "a4451c791af4f3bb5cfdd7826010660eeb2a317c",
        "path": "docs/validation_report.md",
        "sha256": "bd216b954db48fb5b5497f3f9e4a8dbe7b604cec93d2b5b8c3adc7d03f40eb06",
        "selection": "full-text",
        "exported_text_sha256": "bd216b954db48fb5b5497f3f9e4a8dbe7b604cec93d2b5b8c3adc7d03f40eb06"
      },
      {
        "commit": "a4451c791af4f3bb5cfdd7826010660eeb2a317c",
        "path": "results/tables/tests.csv",
        "sha256": "4a36c1e432b6f194646e4aaf587eb75326a7bcf88777ce931fac1fa5ed578a70",
        "selection": "full-text",
        "exported_text_sha256": "4a36c1e432b6f194646e4aaf587eb75326a7bcf88777ce931fac1fa5ed578a70"
      },
      {
        "commit": "2bb33669b10819dbb903911d3e6c3a5cfa9dc9c1",
        "path": "src/event_study.py",
        "sha256": "a1e5e3a208aa9ee0abf4d14357d3fb3ec0a3c6f6ef424c2aaf69b3ad06a26010",
        "selection": "hash-only"
      },
      {
        "commit": "2bb33669b10819dbb903911d3e6c3a5cfa9dc9c1",
        "path": "src/volatility.py",
        "sha256": "75451cbf5ab7a6b835632538112e895029be6cb690584af26ddd2549364bf93b",
        "selection": "hash-only"
      }
    ],
    "url": "/blog/nolan-amc/sources/eventStudy.json",
    "sha256": "41228e7f8af56898fe68a067e5e3a0e9f86c9f7aeaf1d06210d59da9794b088d"
  },
  "attention": {
    "date": "2026-09-16",
    "commits": [
      {
        "sha": "39e20e1f73cd85488dbbaa77cd2746287730d5e6",
        "timestamp": "2026-09-16T20:10:18-07:00",
        "subject": "docs: specify exploratory attention tests and expanded confounder research"
      },
      {
        "sha": "7bcd418581e9ff25b7a95502574fd20fecfc7ff0",
        "timestamp": "2026-09-16T20:19:08-07:00",
        "subject": "feat: add sourced confounder research and reproducible attention correlation tests"
      },
      {
        "sha": "80bacbfe75c0e5dca2c0b182f43acc4497714a58",
        "timestamp": "2026-09-16T20:21:50-07:00",
        "subject": "docs: publish executed attention extension and verified research findings"
      }
    ],
    "records": [
      {
        "commit": "39e20e1f73cd85488dbbaa77cd2746287730d5e6",
        "path": "docs/confounder_extension.md",
        "sha256": "0e998b23cb1001cc811011f9f3bc131e4d58b6c44a5c78e6ae8233d2a651f57b",
        "selection": "full-text",
        "exported_text_sha256": "0e998b23cb1001cc811011f9f3bc131e4d58b6c44a5c78e6ae8233d2a651f57b"
      },
      {
        "commit": "80bacbfe75c0e5dca2c0b182f43acc4497714a58",
        "path": "results/attention_assessment.md",
        "sha256": "c6881a0adf0df3ea39bab6181886ef36196d10d9f016b75f97838b6209e481cb",
        "selection": "full-text",
        "exported_text_sha256": "c6881a0adf0df3ea39bab6181886ef36196d10d9f016b75f97838b6209e481cb"
      },
      {
        "commit": "80bacbfe75c0e5dca2c0b182f43acc4497714a58",
        "path": "results/tables/attention_correlations.csv",
        "sha256": "c0854dc1b9e132b195b7b614508a35d471c3fa5ce975133b73cd87fb9b4064e1",
        "selection": "full-text",
        "exported_text_sha256": "c0854dc1b9e132b195b7b614508a35d471c3fa5ce975133b73cd87fb9b4064e1"
      },
      {
        "commit": "80bacbfe75c0e5dca2c0b182f43acc4497714a58",
        "path": "docs/validation_report.md",
        "sha256": "2171b8072544df6203f49ff75d97cbeaffd6259f2d6f9420dd66bd53732fc17b",
        "selection": "full-text",
        "exported_text_sha256": "2171b8072544df6203f49ff75d97cbeaffd6259f2d6f9420dd66bd53732fc17b"
      },
      {
        "commit": "7bcd418581e9ff25b7a95502574fd20fecfc7ff0",
        "path": "src/attention.py",
        "sha256": "391467d7aeb7ec5eac62c5a7e8afdc3a9425d09591cce48d8f0b21f69cea0f45",
        "selection": "hash-only"
      }
    ],
    "url": "/blog/nolan-amc/sources/attention.json",
    "sha256": "723728d8f9a2fe5d363c26a9cb7252d1aacb51f0ec808af3c0fe5e6224160937"
  },
  "audit": {
    "date": "2026-10-27",
    "commits": [
      {
        "sha": "b1e78a722ffbe83089ba16fcc6df99063cee2843",
        "timestamp": "2026-10-27T23:08:32-07:00",
        "subject": "docs: audit research readiness and plan a defensible options extension"
      }
    ],
    "records": [
      {
        "commit": "b1e78a722ffbe83089ba16fcc6df99063cee2843",
        "path": "docs/quant_finance_assessment.md",
        "sha256": "cb6b950a4ce3f8d79f9d741851647c7cb2e02762fefed09d6a4f0808b995579c",
        "selection": "assessment-sections-3-to-5",
        "exported_text_sha256": "6edd2032a863f436d100bccaee6146f68797834e0073333d8f1b210435ff483d"
      },
      {
        "commit": "b1e78a722ffbe83089ba16fcc6df99063cee2843",
        "path": "docs/options_implementation_plan.md",
        "sha256": "f1c0e6971f2f6ce396cd3a511f4da4d4d48a861f5854d530968ff30f03cd1d77",
        "selection": "full-text",
        "exported_text_sha256": "f1c0e6971f2f6ce396cd3a511f4da4d4d48a861f5854d530968ff30f03cd1d77"
      },
      {
        "commit": "b1e78a722ffbe83089ba16fcc6df99063cee2843",
        "path": "src/options.py",
        "sha256": "a8bd4d0c567b8686a24a6e381febbd29c220a0e187893c110b0c2516bb73174c",
        "selection": "hash-only"
      }
    ],
    "url": "/blog/nolan-amc/sources/audit.json",
    "sha256": "f713ccfdad5220c1b165606c7c810c804d2423ad40c73880e441758933c36436"
  }
} as const;
