import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Home from './pages/Home';
import TopicDetail from './pages/TopicDetail';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Quizzes from './pages/Quizzes';
import Keywords from './pages/Keywords';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/topic/:id" element={<TopicDetail />} />
              <Route path="/topic/:id/lessons" element={<Lessons />} />
              <Route path="/topic/:id/quizzes" element={<Quizzes />} />
              <Route path="/topic/:id/keywords" element={<Keywords />} />
              <Route path="/lesson/:id" element={<LessonDetail />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
