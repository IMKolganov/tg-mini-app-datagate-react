import UserInfoPage from "./pages/UserInfoPage";
import StatisticsPage from "./pages/StatisticsPage";
import TelegramServersPage from "./pages/TelegramServersPage";

export default function App() {
  return (
    <div>
      <TelegramServersPage />
      <UserInfoPage />
      <StatisticsPage />
    </div>
  );
}