'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);
  const punctuationKeys = [
    "apostrophes", "colons", "commas", "curly_brackets", "double_inverted_commas",
    "ellipses", "em_dashes", "en_dashes", "exclamation_marks", "full_stops",
    "hyphens", "other_punctuation_marks", "question_marks", "round_brackets",
    "semicolons", "slashes", "square_brackets", "vertical_bars"
  ];
  const [result, setResult] = useState<any>(null);
  const [csvBlob, setCsvBlob] = useState<Blob | null>(null);
  const [graphBlob, setGraphBlob] = useState<Blob | null>(null);

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a file!");

    const formData = new FormData();
    formData.append("file", file);

    const baseURL = "https://punctuation-vercel-3kv793dzy-sindhisanchayas-projects.vercel.app";
 

    try {
      const { data } = await axios.post(`${baseURL}/analyze`, formData);
      setResult(data);

      const csvRes = await axios.post(`${baseURL}/csv`, data, {
        responseType: 'blob',
      });
      setCsvBlob(csvRes.data);

      const graphRes = await axios.post(`${baseURL}/graph`, {
        filename: file.name,
        selected_marks: selectedMarks,
        punctuation_counts: data.punctuation_counts,
      }, {
        responseType: 'blob',
      });
      setGraphBlob(graphRes.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing file.");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Punctuation Analyzer</h1>
      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <br /><br />

      <strong>Select punctuation marks:</strong>
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {punctuationKeys.map((key) => (
          <label key={key} style={{ display: 'block' }}>
            <input
              type="checkbox"
              value={key}
              checked={selectedMarks.includes(key)}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedMarks((prev) =>
                  checked ? [...prev, key] : prev.filter((k) => k !== key)
                );
              }}
            /> {key.replace(/_/g, ' ')}
          </label>
        ))}
      </div>

      <br />
      <button onClick={handleAnalyze}>Analyze</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Word Count: {result.word_count}</h3>
          <ul>
            {Object.entries(result.punctuation_counts).map(([k, v]) => (
              <li key={k}>{k.replace(/_/g, ' ')}: {v as number}</li>
            ))}
          </ul>

          {csvBlob && (
            <button onClick={() => downloadBlob(csvBlob, 'summary.csv')}>
              📄 Download CSV
            </button>
          )}
          {' '}
          {graphBlob && (
            <button onClick={() => downloadBlob(graphBlob, 'graph.png')}>
              📈 Download Graph
            </button>
          )}
        </div>
      )}
    </main>
  );
}
