import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

interface Reminder {
  id: number;
  text: string;
  time: number;
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
  }, [isTimerRunning, isHomeworkTimer, reminders]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const toggleHomeworkTimer = () => setIsHomeworkTimer(!isHomeworkTimer);

  const addReminder = () => {
    if (newReminder.trim() !== "") {
      const newReminderObj: Reminder = {
        id: Date.now(),
        text: newReminder,
        time: totalTimeSpent + newReminderTime * 60,
      };
      setReminders([...reminders, newReminderObj]);
      setNewReminder("");
      setNewReminderTime(5);
    }
  };

  const checkReminders = () => {
    reminders.forEach((reminder) => {
      if (totalTimeSpent === reminder.time) {
        alert(`${t.setReminder}: ${reminder.text}`);
        setReminders(reminders.filter((r) => r.id !== reminder.id));
      }
    });
  };

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
            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded text-sm"
          >
            {language === "en" ? "العربية" : "English"}
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
        </div>
      </div>
    </div>
  );
};

export default App;
