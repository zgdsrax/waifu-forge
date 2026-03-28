from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from diffusers import StableDiffusionXLPipeline
import uuid
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pipe = StableDiffusionXLPipeline.from_pretrained(
    "AstraliteHeart/pony-diffusion-v6-xl", 
    torch_dtype=torch.float16
).to("cuda")

class GenerateRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate(req: GenerateRequest):
    image = pipe(req.prompt).images[0]
    filename = f"{uuid.uuid4()}.png"
    filepath = os.path.join("storage", filename)
    image.save(filepath)
    return {"image_url": f"/storage/{filename}"}

@app.get("/storage/{filename}")
async def get_image(filename: str):
    from fastapi.responses import FileResponse
    return FileResponse(os.path.join("storage", filename))

if __name__ == "__main__":
    import uvicorn
    os.makedirs("storage", exist_ok=True)
    uvicorn.run(app, host="0.0.0.0", port=8000)
