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

export const getAll = () => apiBase("insurance/")
export const getOne = (id) => apiBase(`insurance/${id}`)
export const create = (data) => apiBase("insurance/", {
  method: "POST",
  body: JSON.stringify(data),
})

export default apiBase