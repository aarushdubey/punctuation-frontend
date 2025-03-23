'use client';

import { useState } from 'react';
import axios from 'axios';

type PunctuationResult = {
  filename: string;
  word_count: number;
  [key: string]: number | string; // dynamic keys for punctuation counts
};

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);
  const [result, setResult] = useState<PunctuationResult | null>(null);
  const [csvBlob, setCsvBlob] = useState<Blob | null>(null);
  const [graphBlob, setGraphBlob] = useState<Blob | null>(null);

  const punctuationKeys = [
    "apostrophes", "colons", "commas", "curly_brackets", "double_inverted_commas",
    "ellipses", "em_dashes", "en_dashes", "exclamation_marks", "full_stops",
    "hyphens", "other_punctuation_marks", "question_marks", "round_brackets",
    "semicolons", "slashes", "square_brackets", "vertical_bars"
  ];

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a file!");

    const formData = new FormData();
    formData.append("file", file);

    const baseURL = "https://punctuation-vercel-3kv793dzy-sindhisanchayas-projects.vercel.app"; // your deployed backend URL

    try {
      const { data } = await axios.post<PunctuationResult>(`${baseURL}/api/analyze`, formData);
      setResult(data);

      const csvResponse = await axios.get(`${baseURL}/api/download_csv`, {
        responseType: 'blob',
      });
      setCsvBlob(csvResponse.data as Blob); // ✅ TypeScript fix

      const graphResponse = await axios.get(`${baseURL}/api/download_graph`, {
        responseType: 'blob',
      });
      setGraphBlob(graphResponse.data as Blob); // ✅ TypeScript fix
    } catch (err) {
      console.error(err);
      alert("Error analyzing file.");
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>Punctuation Analyzer</h1>

      <input type="file" accept=".docx" onChange={(e) => {
        if (e.target.files?.[0]) {
          setFile(e.target.files[0]);
        }
      }} />

      <h3>Select punctuation marks:</h3>
      <ul>
        {punctuationKeys.map((key) => (
          <li key={key}>
            <input
              type="checkbox"
              checked={selectedMarks.includes(key)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...selectedMarks, key]
                  : selectedMarks.filter((k) => k !== key);
                setSelectedMarks(updated);
              }}
            />
            <label style={{ marginLeft: 6 }}>{key.replace(/_/g, ' ')}</label>
          </li>
        ))}
      </ul>

      <button style={{ marginTop: 16 }} onClick={handleAnalyze}>Analyze</button>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {csvBlob && (
        <a
          href={URL.createObjectURL(csvBlob)}
          download="punctuation_summary.csv"
          style={{ display: "block", marginTop: 16 }}
        >
          Download CSV
        </a>
      )}

      {graphBlob && (
        <a
          href={URL.createObjectURL(graphBlob)}
          download="combined_punctuation_graph.png"
          style={{ display: "block", marginTop: 8 }}
        >
          Download Graph
        </a>
      )}
    </div>
  );
}
