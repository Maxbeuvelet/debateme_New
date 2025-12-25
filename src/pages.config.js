import Achievements from './pages/Achievements';
import AdminDashboard from './pages/AdminDashboard';
import Categories from './pages/Categories';
import CategoryTopics from './pages/CategoryTopics';
import Community from './pages/Community';
import CreateDebate from './pages/CreateDebate';
import DebateDetails from './pages/DebateDetails';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Ranked from './pages/Ranked';
import SetupProfile from './pages/SetupProfile';
import TakeStance from './pages/TakeStance';
import Trending from './pages/Trending';
import Unsubscribe from './pages/Unsubscribe';
import UserStats from './pages/UserStats';
import VoiceDebate from './pages/VoiceDebate';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "AdminDashboard": AdminDashboard,
    "Categories": Categories,
    "CategoryTopics": CategoryTopics,
    "Community": Community,
    "CreateDebate": CreateDebate,
    "DebateDetails": DebateDetails,
    "Home": Home,
    "PrivacyPolicy": PrivacyPolicy,
    "Ranked": Ranked,
    "SetupProfile": SetupProfile,
    "TakeStance": TakeStance,
    "Trending": Trending,
    "Unsubscribe": Unsubscribe,
    "UserStats": UserStats,
    "VoiceDebate": VoiceDebate,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};