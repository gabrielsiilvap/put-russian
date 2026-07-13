import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SpeechProvider } from "./lib/SpeechProvider";
import { DashboardPage } from "./routes/DashboardPage";
import { WeekPage } from "./routes/WeekPage";
import { DayPage } from "./routes/DayPage";
import { ComingSoonPage } from "./routes/ComingSoonPage";
import { NotFoundPage } from "./routes/NotFoundPage";

export default function App() {
  return (
    <SpeechProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="week/:weekNum" element={<WeekPage />} />
            <Route path="day/:dayNum" element={<DayPage />} />
            <Route
              path="review"
              element={
                <ComingSoonPage
                  title="Spaced review"
                  body="The FSRS review engine lands in Phase 2. Complete a day first — its cards will queue up here."
                />
              }
            />
            <Route
              path="progress"
              element={
                <ComingSoonPage
                  title="Progress"
                  body="Streak calendar, retention chart, and your free-write archive arrive in Phase 4."
                />
              }
            />
            <Route
              path="test/:testId"
              element={
                <ComingSoonPage
                  title="Checkpoint test"
                  body="Checkpoint and mock tests arrive in Phase 4, once all days for this week have content."
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </SpeechProvider>
  );
}
