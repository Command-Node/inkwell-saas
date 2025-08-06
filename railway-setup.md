# Railway Setup for InkWell Crew AI Agents

## 🚀 Setting Up Your AI Writing Agency in Railway

### Step 1: Create Railway Project

1. **Go to [railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Choose "Deploy from GitHub repo"**

### Step 2: Connect Your Repository

1. **Select your InkWell repository**
2. **Railway will detect it's a Python project**
3. **Set the root directory to: `agent-system`**

### Step 3: Configure Environment Variables

Add these environment variables in Railway:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Crew AI Configuration
CREW_AI_API_KEY=your_crew_ai_api_key

# Agent Configuration
AGENT_COORDINATOR_URL=https://your-railway-app.railway.app
```

### Step 4: Create Railway Configuration Files

#### `railway.json` (in agent-system directory)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python main.py",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `nixpacks.toml` (in agent-system directory)
```toml
[phases.setup]
nixPkgs = ["python3", "python3Packages.pip"]

[phases.install]
cmds = ["pip install -r requirements.txt"]

[phases.build]
cmds = ["echo 'Build complete'"]

[start]
cmd = "python main.py"
```

### Step 5: Create Main Application File

#### `main.py` (in agent-system directory)
```python
import asyncio
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any
import uvicorn

from agent_coordinator import AgentCoordinator
from crew_ai_integration import CrewAIIntegration
from enhanced_development_agent import EnhancedDevelopmentAgent

app = FastAPI(title="InkWell AI Writing Agency", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
agent_coordinator = AgentCoordinator()
crew_ai = CrewAIIntegration()
development_agent = EnhancedDevelopmentAgent()

# Pydantic models for API
class BookRequest(BaseModel):
    title: str
    genre: str
    tone: str
    requirements: str
    customer_id: str

class ProjectStatus(BaseModel):
    project_id: str
    status: str
    progress: int
    current_stage: str

@app.get("/")
async def root():
    return {
        "message": "InkWell AI Writing Agency",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agents": "ready"}

@app.get("/agents")
async def get_agents():
    """Get all agent information"""
    team = crew_ai.get_agent_team_overview()
    return team

@app.post("/create-project")
async def create_project(request: BookRequest):
    """Create a new book project"""
    try:
        # Create customer request
        customer_request = {
            "id": f"book_{int(asyncio.get_event_loop().time())}",
            "customer_id": request.customer_id,
            "title": request.title,
            "genre": request.genre,
            "tone": request.tone,
            "requirements": request.requirements,
            "created_at": asyncio.get_event_loop().time(),
            "updated_at": asyncio.get_event_loop().time()
        }
        
        # Process with agent coordinator
        result = await agent_coordinator.process_book_request(customer_request)
        
        return {
            "success": True,
            "project_id": result.id,
            "message": "Project created successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/project/{project_id}")
async def get_project_status(project_id: str):
    """Get project status"""
    try:
        status = await agent_coordinator.get_project_status(project_id)
        return status
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Project not found")

@app.post("/develop-characters")
async def develop_characters(request: BookRequest):
    """Use Development Agent to create characters"""
    try:
        characters = await development_agent.create_characters(
            genre=request.genre,
            tone=request.tone,
            requirements=request.requirements
        )
        
        world = await development_agent.build_world(
            genre=request.genre,
            setting_requirements=request.requirements
        )
        
        summary = development_agent.get_development_summary(characters, world)
        
        return {
            "success": True,
            "characters": [char.__dict__ for char in characters],
            "world": world.__dict__,
            "summary": summary
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/{agent_type}")
async def get_agent_info(agent_type: str):
    """Get specific agent information"""
    try:
        personality = crew_ai.get_agent_personality(agent_type)
        if personality:
            return {
                "name": personality.name,
                "role": personality.role,
                "personality": personality.personality,
                "backstory": personality.backstory,
                "expertise": personality.expertise,
                "communication_style": personality.communication_style,
                "work_approach": personality.work_approach,
                "quirks": personality.quirks
            }
        else:
            raise HTTPException(status_code=404, detail="Agent not found")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 6: Update Requirements

#### `requirements.txt` (update existing)
```txt
# Core dependencies for InkWell RAG Agent System
openai>=1.0.0
langchain>=0.1.0
langchain-openai>=0.1.0
langchain-community>=0.3.0
chromadb>=0.4.0
tiktoken>=0.5.0

# Vector store and embeddings
sentence-transformers>=2.2.0
faiss-cpu>=1.7.0

# Async support
aiohttp>=3.8.0
asyncio-mqtt>=0.16.0

# Database and storage
supabase>=2.0.0
psycopg2-binary>=2.9.0

# Web framework for API
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.0.0

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0
numpy>=1.24.0
pandas>=2.0.0

# Crew AI
crewai>=0.1.0

# Development and testing
pytest>=7.4.0
pytest-asyncio>=0.21.0
black>=23.0.0
flake8>=6.0.0
```

### Step 7: Create Crew AI Configuration

#### `crew_config.py`
```python
import os
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

class CrewAIConfig:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.7,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def create_development_agent(self):
        """Create Development Agent with Crew AI"""
        return Agent(
            role="Development Agent",
            goal="Create compelling characters and immersive worlds for books",
            backstory="""You are Dr. Elena Rodriguez, a former creative writing professor with 15 years of experience in character development. 
            Published author of 8 novels across multiple genres. Known for creating memorable characters that readers connect with deeply.
            You are creative and imaginative, with a deep love for storytelling and character development.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_research_agent(self):
        """Create Research Agent with Crew AI"""
        return Agent(
            role="Research Agent",
            goal="Gather accurate facts and information for non-fiction books",
            backstory="""You are Dr. Marcus Chen, a former investigative journalist turned academic researcher. 
            PhD in Information Science. Known for uncovering hidden connections and finding the most obscure but relevant information.
            You are analytical and thorough, with an insatiable curiosity for facts and details.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_outline_agent(self):
        """Create Outline Agent with Crew AI"""
        return Agent(
            role="Outline Agent",
            goal="Create detailed story structures and chapter outlines",
            backstory="""You are Sarah Mitchell, a former screenwriter and story consultant for major studios. 
            Expert in story structure and pacing. Has helped develop over 200 successful projects across film, TV, and books.
            You are organized and strategic, with a gift for seeing the big picture.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_writing_agent(self):
        """Create Writing Agent with Crew AI"""
        return Agent(
            role="Writing Agent",
            goal="Write compelling chapters and content in the appropriate style",
            backstory="""You are James "Jazz" Thompson, an award-winning author with 12 published novels. 
            Known for distinctive voice and ability to adapt writing style to any genre. Former journalist who brings authenticity to every piece.
            You are passionate and expressive, with a natural talent for capturing voice and tone.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_editing_agent(self):
        """Create Editing Agent with Crew AI"""
        return Agent(
            role="Editing Agent",
            goal="Edit and improve content while maintaining author voice",
            backstory="""You are Professor Margaret "Maggie" O'Connor, a former senior editor at major publishing house with 25 years of experience. 
            Known for nurturing authors while maintaining high standards. Has edited 50+ bestsellers.
            You are meticulous and caring, with an eye for both technical excellence and artistic integrity.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_cover_design_agent(self):
        """Create Cover Design Agent with Crew AI"""
        return Agent(
            role="Cover Design Agent",
            goal="Create compelling book covers that attract readers",
            backstory="""You are Alex Rivera, an award-winning graphic designer with expertise in book covers. 
            Former art director for major publishing house. Known for creating covers that both attract readers and accurately represent the content.
            You are visual and intuitive, with a deep understanding of design psychology.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_audiobook_agent(self):
        """Create Audiobook Agent with Crew AI"""
        return Agent(
            role="Audiobook Agent",
            goal="Create high-quality audiobook productions",
            backstory="""You are Natalie "Nat" Williams, a former voice actor and audio engineer. 
            Has narrated over 100 audiobooks and produced 50+ audio projects. Expert in voice casting and audio production.
            You are expressive and technical, with a deep understanding of audio storytelling.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

# Example usage
def create_book_crew():
    """Create a crew for book development"""
    config = CrewAIConfig()
    
    # Create agents
    development_agent = config.create_development_agent()
    research_agent = config.create_research_agent()
    outline_agent = config.create_outline_agent()
    writing_agent = config.create_writing_agent()
    editing_agent = config.create_editing_agent()
    cover_agent = config.create_cover_design_agent()
    audiobook_agent = config.create_audiobook_agent()
    
    # Create tasks
    development_task = Task(
        description="Create compelling characters and world for the book",
        agent=development_agent
    )
    
    research_task = Task(
        description="Gather facts and information for the book",
        agent=research_agent
    )
    
    outline_task = Task(
        description="Create detailed story structure and chapter outline",
        agent=outline_agent
    )
    
    writing_task = Task(
        description="Write the book chapters in the appropriate style",
        agent=writing_agent
    )
    
    editing_task = Task(
        description="Edit and improve the book content",
        agent=editing_agent
    )
    
    cover_task = Task(
        description="Design an attractive book cover",
        agent=cover_agent
    )
    
    audiobook_task = Task(
        description="Create audiobook version of the book",
        agent=audiobook_agent
    )
    
    # Create crew
    crew = Crew(
        agents=[development_agent, research_agent, outline_agent, writing_agent, editing_agent, cover_agent, audiobook_agent],
        tasks=[development_task, research_task, outline_task, writing_task, editing_task, cover_task, audiobook_task],
        verbose=True,
        process=Process.sequential
    )
    
    return crew
```

### Step 8: Deploy to Railway

1. **Push your code to GitHub**
2. **Railway will automatically deploy**
3. **Check the deployment logs**
4. **Your API will be available at: `https://your-app.railway.app`**

### Step 9: Test Your Deployment

#### Test the API endpoints:

```bash
# Health check
curl https://your-app.railway.app/health

# Get all agents
curl https://your-app.railway.app/agents

# Create a project
curl -X POST https://your-app.railway.app/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The AI Revolution",
    "genre": "non-fiction",
    "tone": "professional",
    "requirements": "A comprehensive guide to AI in business",
    "customer_id": "user_123"
  }'
```

### Step 10: Monitor Your Agents

Railway provides:
- **Real-time logs** for each agent
- **Performance metrics** 
- **Error tracking**
- **Automatic scaling**

## 🎯 Benefits of Railway Deployment

✅ **Centralized Dashboard** - See all agents in one place
✅ **Real-time Monitoring** - Track agent performance
✅ **Automatic Scaling** - Handle multiple projects
✅ **Easy Updates** - Deploy new agent versions
✅ **API Access** - Integrate with your InkWell platform
✅ **Cost Effective** - Pay only for what you use

## 🚀 Next Steps

1. **Deploy to Railway** using the guide above
2. **Test all endpoints** to ensure agents work
3. **Integrate with InkWell** - Connect your frontend
4. **Add more agents** - Expand your AI team
5. **Monitor performance** - Optimize agent efficiency

Your AI writing agency will be live and accessible from anywhere! 🎉 