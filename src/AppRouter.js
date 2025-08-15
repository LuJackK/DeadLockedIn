import { BrowserRouter, Routes, Route } from 'react-router';
import App from './App';
import Home from './components/home/Home';
import HeroPage from './components/heroes/HeroPage';
import ItemPage from './components/items/itemPage';
import HeroProfile from './components/heroes/HeroProfile';
import Login from './components/user/Login';
import CreateAccount from './components/user/CreateAccount';
import BlogPage from './components/community-blog/blogPage';
import CreatePostPage from './components/community-blog/CreatePostPage';
import FullPost from './components/community-blog/FullPost';
import LeaderBoard from './components/players/LeaderBoard';
import Profile from './components/players/Profile';
const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} >
                <Route index element={<Home />} />
                <Route path="heroes" element={<HeroPage />} />
                <Route path="items" element={<ItemPage />} />
                <Route path="heroes/:heroId" element={<HeroProfile />} />
                <Route path="login" element={<Login />}/>
                <Route path="create-account" element={<CreateAccount />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/create" element={<CreatePostPage />} />
                <Route path="post/:id" element={<FullPost />} />
               <Route path="leaderboard" element={<LeaderBoard />} />
                <Route path="profile/:id" element={<Profile />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
