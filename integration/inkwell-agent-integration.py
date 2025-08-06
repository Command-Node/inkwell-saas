import asyncio
import json
from typing import Dict, List, Any
from datetime import datetime
import sys
import os

# Add the agent system to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from agent_coordinator import AgentCoordinator, BookProject, ProjectStatus
from rag_agents.development_agent import DevelopmentAgent

class InkWellAgentIntegration:
    """
    Integration layer between InkWell platform and RAG Agent System
    """
    
    def __init__(self, supabase_client=None):
        self.agent_coordinator = AgentCoordinator()
        self.supabase = supabase_client
        self.active_projects = {}
    
    async def create_book_project(self, customer_request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new book project and start the agent workflow
        """
        try:
            # Create project in agent system
            project = await self.agent_coordinator.process_book_request(customer_request)
            
            # Store in local tracking
            self.active_projects[project.id] = project
            
            # Save to database if Supabase is available
            if self.supabase:
                await self._save_project_to_database(project)
            
            return {
                "success": True,
                "project_id": project.id,
                "status": project.status.value,
                "message": "Book project created and workflow started"
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to create book project"
            }
    
    async def get_project_status(self, project_id: str) -> Dict[str, Any]:
        """
        Get the current status of a book project
        """
        try:
            status = await self.agent_coordinator.get_project_status(project_id)
            return {
                "success": True,
                "project_status": status
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to get project status"
            }
    
    async def get_all_projects(self, customer_id: str = None) -> Dict[str, Any]:
        """
        Get all projects for a customer or all projects
        """
        try:
            projects = []
            
            for project_id, project in self.active_projects.items():
                if customer_id is None or project.customer_id == customer_id:
                    status = await self.agent_coordinator.get_project_status(project_id)
                    projects.append({
                        "project_id": project_id,
                        "title": project.title,
                        "genre": project.genre,
                        "status": status,
                        "created_at": project.created_at
                    })
            
            return {
                "success": True,
                "projects": projects
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to get projects"
            }
    
    async def update_project_requirements(self, project_id: str, new_requirements: str) -> Dict[str, Any]:
        """
        Update project requirements and restart workflow if needed
        """
        try:
            if project_id not in self.active_projects:
                return {
                    "success": False,
                    "error": "Project not found",
                    "message": "Project does not exist"
                }
            
            project = self.active_projects[project_id]
            project.requirements = new_requirements
            project.updated_at = datetime.now().isoformat()
            
            # If project is in early stages, restart workflow
            if project.status in [ProjectStatus.REQUESTED, ProjectStatus.IN_DEVELOPMENT]:
                await self.agent_coordinator.workflow_manager.execute_workflow(project)
            
            return {
                "success": True,
                "message": "Project requirements updated"
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to update project requirements"
            }
    
    async def approve_outline(self, project_id: str, approval: bool, feedback: str = None) -> Dict[str, Any]:
        """
        Approve or reject the outline and continue workflow
        """
        try:
            if project_id not in self.active_projects:
                return {
                    "success": False,
                    "error": "Project not found",
                    "message": "Project does not exist"
                }
            
            project = self.active_projects[project_id]
            
            if approval:
                # Continue to writing phase
                project.status = ProjectStatus.WRITING_IN_PROGRESS
                await self.agent_coordinator.workflow_manager._execute_writing_phase(project)
                
                return {
                    "success": True,
                    "message": "Outline approved, writing phase started"
                }
            else:
                # Return to outline phase for revisions
                project.status = ProjectStatus.OUTLINE_READY
                await self.agent_coordinator.workflow_manager._execute_outline_phase(project)
                
                return {
                    "success": True,
                    "message": "Outline rejected, revisions requested"
                }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to process outline approval"
            }
    
    async def get_project_deliverables(self, project_id: str) -> Dict[str, Any]:
        """
        Get all deliverables for a project (outline, chapters, cover, etc.)
        """
        try:
            if project_id not in self.active_projects:
                return {
                    "success": False,
                    "error": "Project not found",
                    "message": "Project does not exist"
                }
            
            project = self.active_projects[project_id]
            
            deliverables = {
                "project_id": project_id,
                "title": project.title,
                "status": project.status.value,
                "outline": project.outline,
                "manuscript": project.manuscript,
                "cover_design": project.cover_design,
                "audiobook_url": project.audiobook_url,
                "created_at": project.created_at,
                "updated_at": project.updated_at
            }
            
            return {
                "success": True,
                "deliverables": deliverables
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to get project deliverables"
            }
    
    async def _save_project_to_database(self, project: BookProject):
        """
        Save project to Supabase database
        """
        if not self.supabase:
            return
        
        try:
            # Save to book_projects table
            project_data = {
                "id": project.id,
                "customer_id": project.customer_id,
                "title": project.title,
                "genre": project.genre,
                "tone": project.tone,
                "requirements": project.requirements,
                "status": project.status.value,
                "created_at": project.created_at,
                "updated_at": project.updated_at,
                "assigned_writer_id": project.assigned_writer_id,
                "assigned_editor_id": project.assigned_editor_id
            }
            
            result = await self.supabase.table("book_projects").upsert(project_data).execute()
            
            print(f"Project saved to database: {project.id}")
        
        except Exception as e:
            print(f"Failed to save project to database: {e}")
    
    async def _load_projects_from_database(self):
        """
        Load projects from Supabase database
        """
        if not self.supabase:
            return
        
        try:
            result = await self.supabase.table("book_projects").select("*").execute()
            
            for row in result.data:
                project = BookProject(
                    id=row["id"],
                    customer_id=row["customer_id"],
                    title=row["title"],
                    genre=row["genre"],
                    tone=row["tone"],
                    requirements=row["requirements"],
                    status=ProjectStatus(row["status"]),
                    created_at=row["created_at"],
                    updated_at=row["updated_at"],
                    assigned_writer_id=row.get("assigned_writer_id"),
                    assigned_editor_id=row.get("assigned_editor_id")
                )
                
                self.active_projects[project.id] = project
            
            print(f"Loaded {len(self.active_projects)} projects from database")
        
        except Exception as e:
            print(f"Failed to load projects from database: {e}")

# API endpoints for InkWell integration
class InkWellAgentAPI:
    """
    API endpoints for integrating with InkWell frontend
    """
    
    def __init__(self, integration: InkWellAgentIntegration):
        self.integration = integration
    
    async def create_book_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        API endpoint for creating a new book request
        """
        return await self.integration.create_book_project(request_data)
    
    async def get_project_status(self, project_id: str) -> Dict[str, Any]:
        """
        API endpoint for getting project status
        """
        return await self.integration.get_project_status(project_id)
    
    async def get_customer_projects(self, customer_id: str) -> Dict[str, Any]:
        """
        API endpoint for getting all projects for a customer
        """
        return await self.integration.get_all_projects(customer_id)
    
    async def approve_outline(self, project_id: str, approval: bool, feedback: str = None) -> Dict[str, Any]:
        """
        API endpoint for approving/rejecting outline
        """
        return await self.integration.approve_outline(project_id, approval, feedback)
    
    async def get_deliverables(self, project_id: str) -> Dict[str, Any]:
        """
        API endpoint for getting project deliverables
        """
        return await self.integration.get_project_deliverables(project_id)

# Example usage
async def main():
    # Initialize integration
    integration = InkWellAgentIntegration()
    
    # Example book request
    book_request = {
        "id": "book_001",
        "customer_id": "user_123",
        "title": "The AI Revolution",
        "genre": "non-fiction",
        "tone": "professional",
        "requirements": "A comprehensive guide to AI in business",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    # Create project
    result = await integration.create_book_project(book_request)
    print(f"Create Project Result: {json.dumps(result, indent=2)}")
    
    # Get status
    status = await integration.get_project_status("book_001")
    print(f"Project Status: {json.dumps(status, indent=2)}")
    
    # Get all projects
    projects = await integration.get_all_projects("user_123")
    print(f"Customer Projects: {json.dumps(projects, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main()) 