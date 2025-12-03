import Home from './pages/Home';
import DebateDetails from './pages/DebateDetails';
import CategoryTopics from './pages/CategoryTopics';
import TakeStance from './pages/TakeStance';
import VoiceDebate from './pages/VoiceDebate';
import Trending from './pages/Trending';
import Categories from './pages/Categories';
import Community from './pages/Community';
import SetupProfile from './pages/SetupProfile';
import UserStats from './pages/UserStats';
import Ranked from './pages/Ranked';
import Achievements from './pages/Achievements';
import CreateDebate from './pages/CreateDebate';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Unsubscribe from './pages/Unsubscribe';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "DebateDetails": DebateDetails,
    "CategoryTopics": CategoryTopics,
    "TakeStance": TakeStance,
    "VoiceDebate": VoiceDebate,
    "Trending": Trending,
    "Categories": Categories,
    "Community": Community,
    "SetupProfile": SetupProfile,
    "UserStats": UserStats,
    "Ranked": Ranked,
    "Achievements": Achievements,
    "CreateDebate": CreateDebate,
    "PrivacyPolicy": PrivacyPolicy,
    "Unsubscribe": Unsubscribe,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};