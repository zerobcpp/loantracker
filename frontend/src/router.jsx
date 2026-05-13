import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoanList from './features/loans/components/LoanList'
import Nav from '../components/Nav'


const Router = () => {
    return (
        <BrowserRouter>
            <Nav/>
            <Routes>
                
                <Route path="/loans" element={<LoanList />} />
                
            </Routes>
        </BrowserRouter>
    )
}

export default Router
