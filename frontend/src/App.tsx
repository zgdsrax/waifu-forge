import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/generate', { prompt })
      setImage('http://localhost:8000' + res.data.image_url)
    } catch (e) {
      alert('Error generating')
    }
    setLoading(false)
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Waifu Forge</h1>
      <input className="border p-2 w-full" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter prompt..." />
      <button className="bg-blue-500 text-white p-2 mt-2" onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {image && <img src={image} className="mt-4" />}
    </div>
  )
}
export default App
