from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from diffusers import StableDiffusionXLPipeline
import uuid
import os

app = FastAPI()

# Load model (Pony Diffusion V6 XL)
pipe = StableDiffusionXLPipeline.from_pretrained(
    "AstraliteHeart/pony-diffusion-v6-xl", 
    torch_dtype=torch.float16
).to("cuda")

class GenerateRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate(req: GenerateRequest):
    try:
        # Simple generation
        image = pipe(req.prompt).images[0]
        filename = f"{uuid.uuid4()}.png"
        image.save(f"generated/{filename}")
        return {"image_url": f"/generated/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    os.makedirs("generated", exist_ok=True)
    uvicorn.run(app, host="0.0.0.0", port=8000)
