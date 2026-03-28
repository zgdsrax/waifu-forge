import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [style, setStyle] = useState('Default')

  const generate = async () => {
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/generate', { 
          prompt: `${prompt}, style: ${style}` 
      })
      setImage('http://localhost:8000' + res.data.image_url)
    } catch (e) {
      alert('Error generating')
    }
    setLoading(false)
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Waifu Forge 🦊</h1>
      <select className="border p-2 w-full mb-2" onChange={e => setStyle(e.target.value)}>
        <option>Default</option>
        <option>Cyberpunk</option>
        <option>Studio Ghibli</option>
      </select>
      <textarea className="border p-2 w-full mb-2" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your waifu..." />
      <button className="bg-blue-600 text-white px-4 py-2 w-full rounded" onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : 'Forge Waifu'}
      </button>
      {image && <img src={image} className="mt-6 w-full rounded-lg shadow" />}
    </div>
  )
}
export default App
