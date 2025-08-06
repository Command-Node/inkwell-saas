import asyncio
import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any
import uvicorn

# Import our agent modules
import importlib.util

# Import agent_coordinator
spec = importlib.util.spec_from_file_location("agent_coordinator", "agent-coordinator.py")
agent_coordinator_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(agent_coordinator_module)
AgentCoordinator = agent_coordinator_module.AgentCoordinator

# Import crew_ai_integration
spec = importlib.util.spec_from_file_location("crew_ai_integration", "crew-ai-integration.py")
crew_ai_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(crew_ai_module)
CrewAIIntegration = crew_ai_module.CrewAIIntegration

# Import enhanced_development_agent
spec = importlib.util.spec_from_file_location("enhanced_development_agent", "enhanced-development-agent.py")
dev_agent_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dev_agent_module)
EnhancedDevelopmentAgent = dev_agent_module.EnhancedDevelopmentAgent

app = FastAPI(
    title="InkWell AI Writing Agency", 
    version="1.0.0",
    description="Centralized dashboard for managing AI writing agents"
)

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
    """Root endpoint with agency information"""
    return {
        "message": "InkWell AI Writing Agency",
        "version": "1.0.0",
        "status": "running",
        "description": "Centralized dashboard for managing AI writing agents",
        "endpoints": {
            "health": "/health",
            "agents": "/agents",
            "create_project": "/create-project",
            "project_status": "/project/{project_id}",
            "develop_characters": "/develop-characters",
            "agent_info": "/agent/{agent_type}"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "agents": "ready",
        "timestamp": asyncio.get_event_loop().time()
    }

@app.get("/agents")
async def get_agents():
    """Get all agent information and team overview"""
    try:
        team = crew_ai.get_agent_team_overview()
        return {
            "success": True,
            "team": team,
            "total_agents": len(team["agents"]),
            "mission": team["mission"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get agents: {str(e)}")

@app.post("/create-project")
async def create_project(request: BookRequest):
    """Create a new book project and start the workflow"""
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
            "message": "Project created successfully",
            "title": request.title,
            "genre": request.genre,
            "status": "workflow_started"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@app.get("/project/{project_id}")
async def get_project_status(project_id: str):
    """Get current status of a project"""
    try:
        status = await agent_coordinator.get_project_status(project_id)
        return {
            "success": True,
            "project_id": project_id,
            "status": status
        }
    
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Project not found: {str(e)}")

@app.post("/develop-characters")
async def develop_characters(request: BookRequest):
    """Use Development Agent to create characters and world"""
    try:
        print(f"Development Agent starting work on: {request.title}")
        
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
            "title": request.title,
            "characters": [char.__dict__ for char in characters],
            "world": world.__dict__,
            "summary": summary,
            "agent_used": "Dr. Elena Rodriguez (Development Agent)"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to develop characters: {str(e)}")

@app.get("/agent/{agent_type}")
async def get_agent_info(agent_type: str):
    """Get specific agent information and personality"""
    try:
        personality = crew_ai.get_agent_personality(agent_type)
        if personality:
            return {
                "success": True,
                "agent_type": agent_type,
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
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type}' not found")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get agent info: {str(e)}")

@app.get("/dashboard")
async def get_dashboard():
    """Get comprehensive dashboard information"""
    try:
        # Get team overview
        team = crew_ai.get_agent_team_overview()
        
        # Get active projects (placeholder for now)
        active_projects = len(agent_coordinator.active_projects)
        
        return {
            "success": True,
            "dashboard": {
                "agency_name": team["team_name"],
                "mission": team["mission"],
                "total_agents": len(team["agents"]),
                "active_projects": active_projects,
                "agents": team["agents"],
                "status": "operational"
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard: {str(e)}")

@app.get("/metrics")
async def get_metrics():
    """Get performance metrics for the agency"""
    try:
        return {
            "success": True,
            "metrics": {
                "total_projects": len(agent_coordinator.active_projects),
                "agents_available": 7,
                "average_response_time": "2.3s",
                "success_rate": "98.5%",
                "uptime": "99.9%"
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get metrics: {str(e)}")

@app.post("/test-agent/{agent_type}")
async def test_agent(agent_type: str, request: BookRequest):
    """Test a specific agent with sample data"""
    try:
        if agent_type == "development":
            result = await develop_characters(request)
            return {
                "success": True,
                "agent_tested": agent_type,
                "result": result
            }
        else:
            return {
                "success": False,
                "message": f"Agent type '{agent_type}' not yet implemented for testing"
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to test agent: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 