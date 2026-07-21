const BASE = import.meta.env.VITE_API_URL

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
  //console.log(`${BASE}${endpoint}`)
  return res.json()
}

export const getAllLoan = (type) => apiBase(`loans/${type || 'residential'}/`)
export const getOneLoan = (id) => apiBase(`loans/${id}`)
export const createLoan = (data) => apiBase("loans/", {
  method: "POST",
  body: JSON.stringify(data),
})


export default apiBase
