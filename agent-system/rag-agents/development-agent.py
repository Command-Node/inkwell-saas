import asyncio
import json
from typing import Dict, List, Any
from dataclasses import dataclass
import openai
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader

@dataclass
class Character:
    name: str
    role: str
    description: str
    backstory: str
    personality_traits: List[str]
    goals: List[str]
    conflicts: List[str]

@dataclass
class World:
    name: str
    description: str
    setting_details: str
    rules_systems: List[str]
    locations: List[str]
    time_period: str
    atmosphere: str

class DevelopmentAgent:
    """
    RAG Agent specialized in character and world development for fiction
    """
    
    def __init__(self, openai_api_key: str = None):
        self.name = "Development Agent"
        self.openai_client = openai.OpenAI(api_key=openai_api_key) if openai_api_key else None
        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key) if openai_api_key else None
        
        # RAG Knowledge Base
        self.rag_knowledge = {
            "fiction_writing_guides": [
                "character_development_techniques",
                "world_building_methods",
                "genre_conventions",
                "story_structure_principles"
            ],
            "character_development": [
                "character_archetypes",
                "personality_development",
                "character_relationships",
                "character_arcs"
            ],
            "world_building_techniques": [
                "setting_creation",
                "world_rules_systems",
                "atmosphere_development",
                "location_design"
            ],
            "genre_conventions": [
                "fantasy_conventions",
                "sci_fi_conventions",
                "mystery_conventions",
                "romance_conventions"
            ]
        }
        
        # Initialize vector store (placeholder)
        self.vector_store = None
        self._initialize_knowledge_base()
    
    def _initialize_knowledge_base(self):
        """
        Initialize the RAG knowledge base with writing guides and techniques
        """
        # This would load actual writing guides, character development books, etc.
        # For now, we'll use placeholder data
        self.knowledge_base = {
            "character_development": self._load_character_development_knowledge(),
            "world_building": self._load_world_building_knowledge(),
            "genre_conventions": self._load_genre_conventions()
        }
    
    def _load_character_development_knowledge(self) -> Dict[str, Any]:
        """Load character development knowledge base"""
        return {
            "archetypes": [
                "Hero", "Mentor", "Threshold Guardian", "Herald", "Shapeshifter", 
                "Shadow", "Ally", "Trickster"
            ],
            "personality_traits": [
                "Extroverted", "Introverted", "Analytical", "Creative", "Practical",
                "Idealistic", "Cautious", "Adventurous", "Loyal", "Independent"
            ],
            "character_goals": [
                "External Goal", "Internal Goal", "Relationship Goal", "Professional Goal",
                "Personal Growth Goal", "Survival Goal", "Revenge Goal", "Discovery Goal"
            ],
            "conflict_types": [
                "Man vs Man", "Man vs Nature", "Man vs Society", "Man vs Self",
                "Man vs Technology", "Man vs Supernatural"
            ]
        }
    
    def _load_world_building_knowledge(self) -> Dict[str, Any]:
        """Load world building knowledge base"""
        return {
            "world_elements": [
                "Geography", "Climate", "Culture", "Politics", "Economy",
                "Technology", "Magic Systems", "Religion", "History", "Social Structure"
            ],
            "atmosphere_types": [
                "Dark and Gritty", "Light and Hopeful", "Mysterious", "Tense",
                "Peaceful", "Chaotic", "Orderly", "Romantic", "Dangerous"
            ],
            "time_periods": [
                "Ancient", "Medieval", "Renaissance", "Industrial", "Modern",
                "Future", "Post-Apocalyptic", "Alternate History"
            ]
        }
    
    def _load_genre_conventions(self) -> Dict[str, Any]:
        """Load genre-specific conventions"""
        return {
            "fantasy": {
                "elements": ["Magic", "Fantasy Races", "Quests", "Good vs Evil"],
                "tropes": ["Chosen One", "Dark Lord", "Magical Artifacts", "Hidden World"]
            },
            "sci_fi": {
                "elements": ["Advanced Technology", "Space Travel", "Aliens", "Future Society"],
                "tropes": ["AI Rebellion", "Time Travel", "Space Opera", "Dystopia"]
            },
            "mystery": {
                "elements": ["Crime", "Investigation", "Clues", "Suspense"],
                "tropes": ["Detective", "Red Herring", "Whodunit", "Amateur Sleuth"]
            },
            "romance": {
                "elements": ["Love Story", "Emotional Conflict", "Happy Ending"],
                "tropes": ["Enemies to Lovers", "Second Chance", "Forbidden Love"]
            }
        }
    
    async def create_characters(self, genre: str, tone: str, requirements: str) -> List[Character]:
        """
        Create characters using RAG knowledge and AI
        """
        print(f"Development Agent: Creating characters for {genre} genre with {tone} tone")
        
        # Get relevant knowledge from RAG
        genre_conventions = self.knowledge_base["genre_conventions"].get(genre, {})
        character_techniques = self.knowledge_base["character_development"]
        
        # Generate characters based on genre and requirements
        characters = []
        
        if genre == "fantasy":
            characters = await self._create_fantasy_characters(tone, requirements)
        elif genre == "sci_fi":
            characters = await self._create_scifi_characters(tone, requirements)
        elif genre == "mystery":
            characters = await self._create_mystery_characters(tone, requirements)
        elif genre == "romance":
            characters = await self._create_romance_characters(tone, requirements)
        else:
            characters = await self._create_general_characters(genre, tone, requirements)
        
        return characters
    
    async def build_world(self, genre: str, setting_requirements: str) -> World:
        """
        Build world using RAG knowledge and AI
        """
        print(f"Development Agent: Building world for {genre} genre")
        
        # Get relevant world building knowledge
        world_elements = self.knowledge_base["world_building"]["world_elements"]
        genre_conventions = self.knowledge_base["genre_conventions"].get(genre, {})
        
        # Generate world based on genre and requirements
        if genre == "fantasy":
            world = await self._create_fantasy_world(setting_requirements)
        elif genre == "sci_fi":
            world = await self._create_scifi_world(setting_requirements)
        else:
            world = await self._create_general_world(genre, setting_requirements)
        
        return world
    
    async def _create_fantasy_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create fantasy characters"""
        characters = [
            Character(
                name="Aria Stormwind",
                role="Protagonist",
                description="A young mage discovering her powers",
                backstory="Orphaned at a young age, raised by a mysterious mentor",
                personality_traits=["Curious", "Brave", "Determined"],
                goals=["Master her magic", "Discover her true heritage"],
                conflicts=["Dark forces hunting her", "Internal struggle with power"]
            ),
            Character(
                name="Thorne Blackwood",
                role="Mentor",
                description="A wise but mysterious wizard",
                backstory="Former court mage, now living in exile",
                personality_traits=["Wise", "Secretive", "Protective"],
                goals=["Guide Aria", "Protect the realm"],
                conflicts=["Dark past", "Trusting others"]
            )
        ]
        return characters
    
    async def _create_scifi_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create sci-fi characters"""
        characters = [
            Character(
                name="Commander Sarah Chen",
                role="Protagonist",
                description="Starship captain navigating political intrigue",
                backstory="Rising through military ranks, now commanding her own ship",
                personality_traits=["Strategic", "Loyal", "Determined"],
                goals=["Protect her crew", "Uncover conspiracy"],
                conflicts=["Political enemies", "Moral dilemmas"]
            )
        ]
        return characters
    
    async def _create_mystery_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create mystery characters"""
        characters = [
            Character(
                name="Detective Marcus Reed",
                role="Protagonist",
                description="Seasoned detective with a troubled past",
                backstory="Former military, now solving crimes in the city",
                personality_traits=["Observant", "Persistent", "Guarded"],
                goals=["Solve the case", "Find redemption"],
                conflicts=["Personal demons", "Corrupt system"]
            )
        ]
        return characters
    
    async def _create_romance_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create romance characters"""
        characters = [
            Character(
                name="Emma Thompson",
                role="Protagonist",
                description="Successful businesswoman seeking love",
                backstory="Focused on career, now ready for romance",
                personality_traits=["Independent", "Ambitious", "Vulnerable"],
                goals=["Find true love", "Balance career and personal life"],
                conflicts=["Trust issues", "Work-life balance"]
            )
        ]
        return characters
    
    async def _create_general_characters(self, genre: str, tone: str, requirements: str) -> List[Character]:
        """Create general characters for any genre"""
        characters = [
            Character(
                name="Alex Johnson",
                role="Protagonist",
                description="Main character facing challenges",
                backstory="Ordinary person in extraordinary circumstances",
                personality_traits=["Relatable", "Determined", "Growth-oriented"],
                goals=["Overcome obstacles", "Achieve dreams"],
                conflicts=["External challenges", "Internal growth"]
            )
        ]
        return characters
    
    async def _create_fantasy_world(self, requirements: str) -> World:
        """Create fantasy world"""
        return World(
            name="Eldoria",
            description="A magical realm where ancient powers clash",
            setting_details="Medieval-inspired world with magic, dragons, and kingdoms",
            rules_systems=["Magic system", "Political hierarchy", "Ancient prophecies"],
            locations=["Capital City", "Enchanted Forest", "Mystical Mountains"],
            time_period="Medieval Fantasy",
            atmosphere="Mysterious and magical"
        )
    
    async def _create_scifi_world(self, requirements: str) -> World:
        """Create sci-fi world"""
        return World(
            name="Nova Prime",
            description="Advanced space-faring civilization",
            setting_details="Interstellar empire with advanced technology",
            rules_systems=["Space travel", "AI integration", "Political factions"],
            locations=["Space Station", "Planetary Colonies", "Warp Gates"],
            time_period="Future",
            atmosphere="High-tech and political"
        )
    
    async def _create_general_world(self, genre: str, requirements: str) -> World:
        """Create general world for any genre"""
        return World(
            name="The World",
            description="Setting for the story",
            setting_details="Adaptable to any genre requirements",
            rules_systems=["Social norms", "Physical laws", "Cultural customs"],
            locations=["Various settings"],
            time_period="Contemporary",
            atmosphere="Neutral"
        )
    
    def get_development_summary(self, characters: List[Character], world: World) -> Dict[str, Any]:
        """
        Create a summary of the development work
        """
        return {
            "characters_created": len(characters),
            "character_summaries": [
                {
                    "name": char.name,
                    "role": char.role,
                    "description": char.description
                } for char in characters
            ],
            "world_details": {
                "name": world.name,
                "description": world.description,
                "atmosphere": world.atmosphere
            },
            "development_notes": "Characters and world developed according to genre conventions and requirements"
        }

# Example usage
async def main():
    agent = DevelopmentAgent()
    
    # Create characters for a fantasy novel
    characters = await agent.create_characters(
        genre="fantasy",
        tone="epic",
        requirements="A young mage discovers her powers and must save the world"
    )
    
    # Build world
    world = await agent.build_world(
        genre="fantasy",
        setting_requirements="Medieval fantasy world with magic and dragons"
    )
    
    # Get summary
    summary = agent.get_development_summary(characters, world)
    print(f"Development Summary: {json.dumps(summary, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main()) 