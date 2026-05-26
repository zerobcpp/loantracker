import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoanList from './features/Loan/components/LoanList'
import InsuranceList from './features/Insurance/components/InsuranceList'
import Nav from './features/Home/components/Nav'


const Router = () => {
    return (
        <BrowserRouter>
            <Nav/>
            <Routes>
                
                <Route path="/loan" element={<LoanList />} />
                <Route path="/insurance" element={<InsuranceList />} />
                
            </Routes>
        </BrowserRouter>
    )
}

export default Router
