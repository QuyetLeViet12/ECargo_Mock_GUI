import { useState, useEffect } from 'react';

export function useAWBHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('awb_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const addAWB = (awb: string) => {
    const newHistory = [awb, ...history.filter(a => a !== awb)].slice(0, 5); // Keep top 5
    setHistory(newHistory);
    localStorage.setItem('awb_history', JSON.stringify(newHistory));
  };

  const removeAWB = (awb: string) => {
    const newHistory = history.filter(a => a !== awb);
    setHistory(newHistory);
    localStorage.setItem('awb_history', JSON.stringify(newHistory));
  };
  
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('awb_history');
  }

  return { history, addAWB, removeAWB, clearHistory };
}
