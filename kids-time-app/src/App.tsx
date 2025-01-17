import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "./LanguageContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HistoryComponent from "./HistoryComponent";

interface Reminder {
  id: number;
  text: string;
  time: number;
}

interface HistoryEntry {
  id: number;
  date: string;
  totalTime: number;
  homeworkTime: number;
}

const translations = {
  en: {
    title: "Kid's Time Tracker",
    totalTime: "Total Time",
    homeworkTime: "Homework Time",
    startTimer: "Start Timer",
    stopTimer: "Stop Timer",
    startHomework: "Start Homework",
    stopHomework: "Stop Homework",
    setReminder: "Set a Reminder",
    whatToRemember: "What to remember?",
    minutesFromNow: "minutes from now",
    addReminder: "Add Reminder",
    reminders: "Reminders",
    noReminders: "No reminders set",
    inMinutes: "in",
    minutes: "minutes",
    reminder: "Reminder",
    reminderEmpty: "Please enter a reminder text",
    reminderAdded: "Reminder added successfully",
    history: "History",
    date: "Date",
    totalTimeSpent: "Total Time Spent",
    homeworkTimeSpent: "Homework Time Spent",
    noHistory: "No history available",
  },
  ar: {
    title: "متتبع وقت الأطفال",
    totalTime: "الوقت الكلي",
    homeworkTime: "وقت الواجب المنزلي",
    startTimer: "بدء المؤقت",
    stopTimer: "إيقاف المؤقت",
    startHomework: "بدء الواجب المنزلي",
    stopHomework: "إيقاف الواجب المنزلي",
    setReminder: "ضبط تذكير",
    whatToRemember: "ماذا تريد أن تتذكر؟",
    minutesFromNow: "دقائق من الآن",
    addReminder: "إضافة تذكير",
    reminders: "التذكيرات",
    noReminders: "لا توجد تذكيرات",
    inMinutes: "في غضون",
    minutes: "دقائق",
    reminder: "تذكير",
    reminderEmpty: "الرجاء إدخال نص التذكير",
    reminderAdded: "تمت إضافة التذكير بنجاح",
    history: "السجل",
    date: "التاريخ",
    totalTimeSpent: "إجمالي الوقت المستغرق",
    homeworkTimeSpent: "وقت الواجب المنزلي المستغرق",
    noHistory: "لا يوجد سجل متاح",
  },
};

const App: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [homeworkTimeSpent, setHomeworkTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isHomeworkTimer, setIsHomeworkTimer] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState("");
  const [newReminderTime, setNewReminderTime] = useState(5);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const checkReminders = useCallback(() => {
    reminders.forEach((reminder) => {
      if (totalTimeSpent === reminder.time) {
        toast.info(`${t.reminder}: ${reminder.text}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setReminders((prevReminders) =>
          prevReminders.filter((r) => r.id !== reminder.id)
        );
      }
    });
  }, [reminders, totalTimeSpent, t.reminder]);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTotalTimeSpent((prev) => prev + 1);
        if (isHomeworkTimer) {
          setHomeworkTimeSpent((prev) => prev + 1);
        }
        checkReminders();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isHomeworkTimer, checkReminders]);

  const addHistoryEntry = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const existingEntry = history.find((entry) => entry.date === today);

    if (existingEntry) {
      setHistory((prevHistory) =>
        prevHistory.map((entry) =>
          entry.date === today
            ? {
                ...entry,
                totalTime: totalTimeSpent,
                homeworkTime: homeworkTimeSpent,
              }
            : entry
        )
      );
    } else {
      const newEntry: HistoryEntry = {
        id: Date.now(),
        date: today,
        totalTime: totalTimeSpent,
        homeworkTime: homeworkTimeSpent,
      };
      setHistory((prevHistory) => [...prevHistory, newEntry]);
    }
  }, [totalTimeSpent, homeworkTimeSpent, history]);

  const toggleTimer = () => {
    if (isTimerRunning) {
      addHistoryEntry();
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const toggleHomeworkTimer = () => setIsHomeworkTimer(!isHomeworkTimer);

  const addReminder = () => {
    if (newReminder.trim() === "") {
      toast.error(t.reminderEmpty, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const newReminderObj: Reminder = {
      id: Date.now(),
      text: newReminder,
      time: totalTimeSpent + newReminderTime * 60,
    };
    setReminders((prevReminders) => [...prevReminders, newReminderObj]);
    setNewReminder("");
    setNewReminderTime(5);

    toast.success(t.reminderAdded, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const saveHistory = useCallback(() => {
    localStorage.setItem("kidTimeTrackerHistory", JSON.stringify(history));
  }, [history]);

  const loadHistory = useCallback(() => {
    const savedHistory = localStorage.getItem("kidTimeTrackerHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    saveHistory();
  }, [history, saveHistory]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 font-kid flex items-center justify-center ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="p-6 grid grid-cols-2 gap-4">
          <h1 className="text-3xl font-bold text-center mb-4 text-indigo-600 col-span-2">
            {t.title}
          </h1>

          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="absolute top-2 right-2 bg-transparent hover:bg-gray-100 p-1 rounded"
          >
            {language === "en" ? "🇦🇪" : "🇬🇧"}
          </button>

          <div className="bg-yellow-100 p-3 rounded-2xl">
            <h2 className="text-xl font-semibold text-yellow-700 mb-1">
              {t.totalTime}
            </h2>
            <p className="text-2xl font-bold text-yellow-600">
              {formatTime(totalTimeSpent)}
            </p>
          </div>

          <div className="bg-green-100 p-3 rounded-2xl">
            <h2 className="text-xl font-semibold text-green-700 mb-1">
              {t.homeworkTime}
            </h2>
            <p className="text-2xl font-bold text-green-600">
              {formatTime(homeworkTimeSpent)}
            </p>
          </div>

          <div className="col-span-2 flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`px-4 py-2 rounded-full text-white font-semibold text-sm transition duration-300 ${
                isTimerRunning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isTimerRunning ? t.stopTimer : t.startTimer}
            </button>

            <button
              onClick={toggleHomeworkTimer}
              className={`px-4 py-2 rounded-full text-white font-semibold text-sm transition duration-300 ${
                isHomeworkTimer
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {isHomeworkTimer ? t.stopHomework : t.startHomework}
            </button>
          </div>

          <div className="bg-blue-100 p-3 rounded-2xl col-span-2">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              {t.setReminder}
            </h2>
            <input
              type="text"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder={t.whatToRemember}
              className="w-full px-3 py-1 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-sm"
            />
            <div className="flex items-center mb-2">
              <input
                type="number"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(Number(e.target.value))}
                min="1"
                className="w-16 px-2 py-1 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 text-sm"
              />
              <span className="text-blue-700 text-sm">{t.minutesFromNow}</span>
            </div>
            <button
              onClick={addReminder}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-full transition duration-300 text-sm"
            >
              {t.addReminder}
            </button>
          </div>

          <div className="bg-pink-100 p-3 rounded-2xl col-span-2 max-h-32 overflow-y-auto">
            <h2 className="text-xl font-semibold text-pink-700 mb-2">
              {t.reminders}
            </h2>
            {reminders.length > 0 ? (
              <ul className="list-disc list-inside">
                {reminders.map((reminder) => (
                  <li key={reminder.id} className="text-pink-600 text-sm">
                    {reminder.text} ({t.inMinutes}{" "}
                    {Math.max(
                      0,
                      Math.floor((reminder.time - totalTimeSpent) / 60)
                    )}{" "}
                    {t.minutes})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-pink-600 text-sm">{t.noReminders}</p>
            )}
          </div>

          <HistoryComponent
            history={history}
            formatTime={formatTime}
            translations={{
              history: t.history,
              date: t.date,
              totalTimeSpent: t.totalTimeSpent,
              homeworkTimeSpent: t.homeworkTimeSpent,
              noHistory: t.noHistory,
            }}
          />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={language === "ar"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <style>
        {`
          /* Enhance the overall styling of the app */

          /* Container for the entire app */
          .min-h-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to right, #6a11cb, #2575fc);
            padding: 20px;
            font-family: 'Arial', sans-serif;
          }

          /* Main card styling */
          .bg-white {
            background-color: #ffffff;
            border-radius: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 100%;
            max-width: 800px;
          }

          /* Title styling */
          .text-3xl {
            font-size: 2rem;
            font-weight: bold;
            color: #4a4a4a;
            text-align: center;
            margin-bottom: 20px;
          }

          /* Button styling */
          button {
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            transition: background-color 0.3s ease;
          }

          button:hover {
            opacity: 0.9;
          }

          /* Input styling */
          input[type='text'],
          input[type='number'] {
            width: 100%;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            font-size: 0.9rem;
          }

          input:focus {
            outline: none;
            border-color: #2575fc;
            box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
          }

          /* Reminder list styling */
          .list-disc {
            padding-left: 20px;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .grid-cols-2 {
              grid-template-columns: 1fr;
            }
            .text-3xl {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;
