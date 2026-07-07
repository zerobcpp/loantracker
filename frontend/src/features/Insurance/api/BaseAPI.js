const BASE = process.env.BACKEND

const apiBase = async (endpoint, opts = {}) => {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...opts,
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

export const getAllInsurance = () => apiBase("insurance/")
export const getOneInsurance = (id) => apiBase(`insurance/${id}`)
export const createInsurance = (data) => apiBase("insurance/", {
  method: "POST",
  body: JSON.stringify(data),
})
export const getInsuranceReport = () => apiBase("insurance/report/")


export default apiBase