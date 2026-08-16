import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoanList from './features/Loan/components/LoanList'
import InsuranceList from './features/Insurance/components/InsuranceList'
import Nav from './features/Home/components/Nav'
import Footer from './features/Home/components/Footer'
import Dashboard from './features/Home/components/Dashboard'


const Router = () => {
    return (
        <BrowserRouter>
            <Nav/>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/loan/" element={<LoanList />} />
                <Route path="/insurance/" element={<InsuranceList />} />
                
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}

export default Router
