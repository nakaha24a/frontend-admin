
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopPage from './page/TopPage.tsx';
import OrderManagementPage from './page/OrderManagementPage';
import { MenuManagementPage } from './page/MenuManagementPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/menu" element={<MenuManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// </div><><OrderManagementPage /> <MenuManagementPage /></>