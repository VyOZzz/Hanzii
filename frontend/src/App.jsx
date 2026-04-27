import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import AccountPage from './pages/AccountPage'
import DictionaryPage from './pages/DictionaryPage'
import GrammarPage from './pages/GrammarPage'
import HistoryPage from './pages/HistoryPage'
import NotebookPage from './pages/NotebookPage'
import TranslationPage from './pages/TranslationPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/notebook" element={<NotebookPage />} />
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/translation" element={<TranslationPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<Navigate to="/dictionary" replace />} />
      </Route>
    </Routes>
  )
}
