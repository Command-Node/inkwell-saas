import asyncio
import json
from typing import Dict, List, Any
from dataclasses import dataclass
from enum import Enum

class ProjectStatus(Enum):
    REQUESTED = "requested"
    IN_DEVELOPMENT = "in_development"
    OUTLINE_READY = "outline_ready"
    WRITING_IN_PROGRESS = "writing_in_progress"
    EDITING = "editing"
    COVER_DESIGN = "cover_design"
    AUDIOBOOK_PRODUCTION = "audiobook_production"
    FINAL_REVIEW = "final_review"
    COMPLETED = "completed"

@dataclass
class BookProject:
    id: str
    customer_id: str
    title: str
    genre: str
    tone: str
    requirements: str
    status: ProjectStatus
    created_at: str
    updated_at: str
    assigned_writer_id: str = None
    assigned_editor_id: str = None
    outline: str = None
    manuscript: str = None
    cover_design: str = None
    audiobook_url: str = None

class AgentCoordinator:
    """
    Master agent that coordinates the entire book creation workflow
    """
    
    def __init__(self):
        self.agents = {
            'development': DevelopmentAgent(),
            'research': ResearchAgent(),
            'outline': OutlineAgent(),
            'writing': WritingAgent(),
            'editing': EditingAgent(),
            'cover_design': CoverDesignAgent(),
            'audiobook': AudiobookAgent()
        }
        self.active_projects = {}
        self.workflow_manager = WorkflowManager()
    
    async def process_book_request(self, customer_request: Dict[str, Any]) -> BookProject:
        """
        Process a new book request from customer
        """
        # Create new project
        project = BookProject(
            id=customer_request.get('id'),
            customer_id=customer_request.get('customer_id'),
            title=customer_request.get('title'),
            genre=customer_request.get('genre'),
            tone=customer_request.get('tone'),
            requirements=customer_request.get('requirements'),
            status=ProjectStatus.REQUESTED,
            created_at=customer_request.get('created_at'),
            updated_at=customer_request.get('updated_at')
        )
        
        # Store project
        self.active_projects[project.id] = project
        
        # Start workflow
        await self.workflow_manager.execute_workflow(project)
        
        return project
    
    async def get_project_status(self, project_id: str) -> Dict[str, Any]:
        """
        Get current status of a project
        """
        if project_id not in self.active_projects:
            return {"error": "Project not found"}
        
        project = self.active_projects[project_id]
        return {
            "project_id": project.id,
            "status": project.status.value,
            "title": project.title,
            "genre": project.genre,
            "progress": self._calculate_progress(project.status),
            "current_stage": self._get_current_stage(project.status),
            "estimated_completion": self._estimate_completion(project.status)
        }
    
    def _calculate_progress(self, status: ProjectStatus) -> int:
        """Calculate project completion percentage"""
        progress_map = {
            ProjectStatus.REQUESTED: 0,
            ProjectStatus.IN_DEVELOPMENT: 10,
            ProjectStatus.OUTLINE_READY: 25,
            ProjectStatus.WRITING_IN_PROGRESS: 50,
            ProjectStatus.EDITING: 75,
            ProjectStatus.COVER_DESIGN: 85,
            ProjectStatus.AUDIOBOOK_PRODUCTION: 90,
            ProjectStatus.FINAL_REVIEW: 95,
            ProjectStatus.COMPLETED: 100
        }
        return progress_map.get(status, 0)
    
    def _get_current_stage(self, status: ProjectStatus) -> str:
        """Get human-readable current stage"""
        stage_map = {
            ProjectStatus.REQUESTED: "Request Received",
            ProjectStatus.IN_DEVELOPMENT: "Development Phase",
            ProjectStatus.OUTLINE_READY: "Outline Ready for Review",
            ProjectStatus.WRITING_IN_PROGRESS: "Writing in Progress",
            ProjectStatus.EDITING: "Editing Phase",
            ProjectStatus.COVER_DESIGN: "Cover Design",
            ProjectStatus.AUDIOBOOK_PRODUCTION: "Audiobook Production",
            ProjectStatus.FINAL_REVIEW: "Final Review",
            ProjectStatus.COMPLETED: "Completed"
        }
        return stage_map.get(status, "Unknown")
    
    def _estimate_completion(self, status: ProjectStatus) -> str:
        """Estimate completion time"""
        estimates = {
            ProjectStatus.REQUESTED: "2-3 weeks",
            ProjectStatus.IN_DEVELOPMENT: "1-2 weeks",
            ProjectStatus.OUTLINE_READY: "1 week",
            ProjectStatus.WRITING_IN_PROGRESS: "2-3 weeks",
            ProjectStatus.EDITING: "1 week",
            ProjectStatus.COVER_DESIGN: "3-5 days",
            ProjectStatus.AUDIOBOOK_PRODUCTION: "1-2 weeks",
            ProjectStatus.FINAL_REVIEW: "2-3 days",
            ProjectStatus.COMPLETED: "Complete"
        }
        return estimates.get(status, "Unknown")

class WorkflowManager:
    """
    Manages the workflow execution between agents
    """
    
    def __init__(self):
        self.stages = [
            'development',
            'research', 
            'outline',
            'writing',
            'editing',
            'cover_design',
            'audiobook',
            'final_review'
        ]
    
    async def execute_workflow(self, project: BookProject):
        """
        Execute the complete workflow for a project
        """
        print(f"Starting workflow for project: {project.title}")
        
        # Development Phase
        await self._execute_development_phase(project)
        
        # Research Phase (if needed)
        if project.genre in ['non-fiction', 'academic', 'biography']:
            await self._execute_research_phase(project)
        
        # Outline Phase
        await self._execute_outline_phase(project)
        
        # Writing Phase
        await self._execute_writing_phase(project)
        
        # Editing Phase
        await self._execute_editing_phase(project)
        
        # Cover Design (parallel)
        await self._execute_cover_design_phase(project)
        
        # Audiobook (if requested)
        if project.audiobook_url:
            await self._execute_audiobook_phase(project)
        
        # Final Review
        await self._execute_final_review_phase(project)
        
        print(f"Workflow completed for project: {project.title}")
    
    async def _execute_development_phase(self, project: BookProject):
        """Execute development phase with character/world building"""
        print(f"Executing development phase for: {project.title}")
        # This will be implemented with actual agent calls
        project.status = ProjectStatus.IN_DEVELOPMENT
        await asyncio.sleep(1)  # Simulate processing time
    
    async def _execute_research_phase(self, project: BookProject):
        """Execute research phase for non-fiction projects"""
        print(f"Executing research phase for: {project.title}")
        await asyncio.sleep(1)  # Simulate processing time
    
    async def _execute_outline_phase(self, project: BookProject):
        """Execute outline creation phase"""
        print(f"Executing outline phase for: {project.title}")
        project.status = ProjectStatus.OUTLINE_READY
        await asyncio.sleep(1)  # Simulate processing time
    
    async def _execute_writing_phase(self, project: BookProject):
        """Execute writing phase"""
        print(f"Executing writing phase for: {project.title}")
        project.status = ProjectStatus.WRITING_IN_PROGRESS
        await asyncio.sleep(2)  # Simulate longer processing time
    
    async def _execute_editing_phase(self, project: BookProject):
        """Execute editing phase"""
        print(f"Executing editing phase for: {project.title}")
        project.status = ProjectStatus.EDITING
        await asyncio.sleep(1)  # Simulate processing time
    
    async def _execute_cover_design_phase(self, project: BookProject):
        """Execute cover design phase"""
        print(f"Executing cover design phase for: {project.title}")
        project.status = ProjectStatus.COVER_DESIGN
        await asyncio.sleep(1)  # Simulate processing time
    
    async def _execute_audiobook_phase(self, project: BookProject):
        """Execute audiobook production phase"""
        print(f"Executing audiobook phase for: {project.title}")
        project.status = ProjectStatus.AUDIOBOOK_PRODUCTION
        await asyncio.sleep(2)  # Simulate longer processing time
    
    async def _execute_final_review_phase(self, project: BookProject):
        """Execute final review phase"""
        print(f"Executing final review phase for: {project.title}")
        project.status = ProjectStatus.FINAL_REVIEW
        await asyncio.sleep(1)  # Simulate processing time
        project.status = ProjectStatus.COMPLETED

# Placeholder agent classes (will be implemented with actual RAG functionality)
class DevelopmentAgent:
    def __init__(self):
        self.name = "Development Agent"
        self.rag_knowledge = ["fiction_writing_guides", "character_development"]

class ResearchAgent:
    def __init__(self):
        self.name = "Research Agent"
        self.rag_knowledge = ["research_methodologies", "fact_checking_sources"]

class OutlineAgent:
    def __init__(self):
        self.name = "Outline Agent"
        self.rag_knowledge = ["story_structure", "chapter_organization"]

class WritingAgent:
    def __init__(self):
        self.name = "Writing Agent"
        self.rag_knowledge = ["writing_styles", "genre_conventions"]

class EditingAgent:
    def __init__(self):
        self.name = "Editing Agent"
        self.rag_knowledge = ["grammar_rules", "style_guides"]

class CoverDesignAgent:
    def __init__(self):
        self.name = "Cover Design Agent"
        self.rag_knowledge = ["design_principles", "genre_conventions"]

class AudiobookAgent:
    def __init__(self):
        self.name = "Audiobook Agent"
        self.rag_knowledge = ["narration_styles", "audio_production"]

# Example usage
async def main():
    coordinator = AgentCoordinator()
    
    # Example customer request
    customer_request = {
        "id": "book_001",
        "customer_id": "user_123",
        "title": "The AI Revolution",
        "genre": "non-fiction",
        "tone": "professional",
        "requirements": "A comprehensive guide to AI in business",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
    }
    
    # Process the request
    project = await coordinator.process_book_request(customer_request)
    
    # Get status
    status = await coordinator.get_project_status(project.id)
    print(f"Project Status: {status}")

if __name__ == "__main__":
    asyncio.run(main()) 