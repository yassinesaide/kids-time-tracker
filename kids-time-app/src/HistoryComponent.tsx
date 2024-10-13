import React from "react";

interface HistoryEntry {
  id: number;
  date: string;
  totalTime: number;
  homeworkTime: number;
}

interface HistoryComponentProps {
  history: HistoryEntry[];
  formatTime: (seconds: number) => string;
  translations: {
    history: string;
    date: string;
    totalTimeSpent: string;
    homeworkTimeSpent: string;
    noHistory: string;
  };
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({
  history,
  formatTime,
  translations: t,
}) => {
  return (
    <div className="bg-indigo-100 p-3 rounded-2xl col-span-2 max-h-64 overflow-y-auto">
      <h2 className="text-xl font-semibold text-indigo-700 mb-2">
        {t.history}
      </h2>
      {history.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">{t.date}</th>
              <th className="text-right">{t.totalTimeSpent}</th>
              <th className="text-right">{t.homeworkTimeSpent}</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td className="text-right">{formatTime(entry.totalTime)}</td>
                <td className="text-right">{formatTime(entry.homeworkTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-indigo-600 text-sm">{t.noHistory}</p>
      )}
    </div>
  );
};

export default HistoryComponent;
