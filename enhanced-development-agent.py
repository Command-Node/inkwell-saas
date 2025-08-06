import asyncio
import json
from typing import Dict, List, Any
from dataclasses import dataclass
import importlib.util
spec = importlib.util.spec_from_file_location("crew_ai_integration", "crew-ai-integration.py")
crew_ai_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(crew_ai_module)
CrewAIIntegration = crew_ai_module.CrewAIIntegration

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

class EnhancedDevelopmentAgent:
    """
    Development Agent enhanced with Crew AI personality
    """
    
    def __init__(self, openai_api_key: str = None):
        self.name = "Dr. Elena Rodriguez"
        self.role = "Development Agent"
        self.crew_ai = CrewAIIntegration()
        self.personality = self.crew_ai.get_agent_personality("development")
        
        # Initialize knowledge base (same as before)
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
    
    def get_personality_introduction(self) -> str:
        """Get Dr. Elena's introduction in character"""
        return f"""
*adjusts reading glasses and opens her well-worn notebook*

"Hello there! I'm {self.name}, and I'm absolutely thrilled to help you bring your characters and world to life! 

As a former creative writing professor with over 15 years of experience, I've learned that the most memorable stories begin with characters that readers can truly connect with. I always say, 'A character without motivation is like a ship without a compass' - they might look impressive, but they won't get anywhere meaningful!

My approach is methodical but creative - I start by understanding what drives your characters, what they want most in the world, and what's standing in their way. Then we build outward from there, creating a world that both challenges and supports their journey.

I love using metaphors and storytelling examples to explain concepts, and I have this habit of speaking in character voices when I'm really excited about a character! *chuckles*

Now, tell me about your story - what genre are we working with, and what's the heart of the tale you want to tell?"
"""
    
    async def create_characters(self, genre: str, tone: str, requirements: str) -> List[Character]:
        """
        Create characters using Dr. Elena's personality and expertise
        """
        print(self.get_personality_introduction())
        print(f"\n*flips through notebook thoughtfully*\n")
        print(f"Ah, {genre} with a {tone} tone! This is going to be wonderful. Let me think about this...")
        
        # Get relevant knowledge from RAG
        genre_conventions = self.knowledge_base["genre_conventions"].get(genre, {})
        character_techniques = self.knowledge_base["character_development"]
        
        print(f"\n*consults her extensive knowledge of {genre} conventions*\n")
        print(f"I see we have {len(genre_conventions.get('elements', []))} key elements to work with. Perfect!")
        
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
        
        print(f"\n*closes notebook with satisfaction*\n")
        print(f"Excellent! I've created {len(characters)} characters that I think will really resonate with readers. Each one has their own unique voice and journey.")
        
        return characters
    
    async def build_world(self, genre: str, setting_requirements: str) -> World:
        """
        Build world using Dr. Elena's world-building expertise
        """
        print(f"\n*adjusts glasses and pulls out a fresh page*\n")
        print(f"Now for the world-building! This is where the magic happens - literally, in the case of fantasy! *laughs*")
        
        # Get relevant world building knowledge
        world_elements = self.knowledge_base["world_building"]["world_elements"]
        genre_conventions = self.knowledge_base["genre_conventions"].get(genre, {})
        
        print(f"\n*consults her world-building checklist*\n")
        print(f"For a {genre} world, we need to consider {len(world_elements)} key elements. Let me craft something special for you...")
        
        # Generate world based on genre and requirements
        if genre == "fantasy":
            world = await self._create_fantasy_world(setting_requirements)
        elif genre == "sci_fi":
            world = await self._create_scifi_world(setting_requirements)
        else:
            world = await self._create_general_world(genre, setting_requirements)
        
        print(f"\n*sketches a quick map in the margin*\n")
        print(f"There we go! I've created '{world.name}' - a world that I think will really serve your story and characters.")
        
        return world
    
    async def _create_fantasy_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create fantasy characters with Dr. Elena's touch"""
        print("*speaks in a mystical voice* 'In the realm of fantasy, every character carries the weight of destiny...'")
        
        characters = [
            Character(
                name="Aria Stormwind",
                role="Protagonist",
                description="A young mage discovering her powers",
                backstory="Orphaned at a young age, raised by a mysterious mentor who taught her the ancient ways",
                personality_traits=["Curious", "Brave", "Determined", "Innocent"],
                goals=["Master her magic", "Discover her true heritage", "Protect those she loves"],
                conflicts=["Dark forces hunting her", "Internal struggle with power", "Trusting the wrong people"]
            ),
            Character(
                name="Thorne Blackwood",
                role="Mentor",
                description="A wise but mysterious wizard with a dark past",
                backstory="Former court mage who was betrayed and exiled, now living in the shadows",
                personality_traits=["Wise", "Secretive", "Protective", "Haunted"],
                goals=["Guide Aria safely", "Protect the realm", "Redeem his past"],
                conflicts=["Dark past catching up", "Trusting others again", "Balancing power and morality"]
            )
        ]
        return characters
    
    async def _create_scifi_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create sci-fi characters with Dr. Elena's touch"""
        print("*adjusts to a more analytical tone* 'In the vast expanse of space, technology and humanity dance a delicate waltz...'")
        
        characters = [
            Character(
                name="Commander Sarah Chen",
                role="Protagonist",
                description="Starship captain navigating political intrigue",
                backstory="Rising through military ranks with distinction, now commanding her own ship in dangerous times",
                personality_traits=["Strategic", "Loyal", "Determined", "Pragmatic"],
                goals=["Protect her crew", "Uncover conspiracy", "Maintain her principles"],
                conflicts=["Political enemies", "Moral dilemmas", "Trust vs suspicion"]
            )
        ]
        return characters
    
    async def _create_mystery_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create mystery characters with Dr. Elena's touch"""
        print("*adopts a detective's thoughtful expression* 'In the shadows of the city, every clue tells a story...'")
        
        characters = [
            Character(
                name="Detective Marcus Reed",
                role="Protagonist",
                description="Seasoned detective with a troubled past",
                backstory="Former military turned detective, haunted by cases that got away",
                personality_traits=["Observant", "Persistent", "Guarded", "Just"],
                goals=["Solve the case", "Find redemption", "Protect the innocent"],
                conflicts=["Personal demons", "Corrupt system", "Past mistakes"]
            )
        ]
        return characters
    
    async def _create_romance_characters(self, tone: str, requirements: str) -> List[Character]:
        """Create romance characters with Dr. Elena's touch"""
        print("*speaks warmly* 'Love stories are the most human of all tales, aren't they? They touch something deep in all of us...'")
        
        characters = [
            Character(
                name="Emma Thompson",
                role="Protagonist",
                description="Successful businesswoman seeking love",
                backstory="Focused on career success, now ready to open her heart to romance",
                personality_traits=["Independent", "Ambitious", "Vulnerable", "Hopeful"],
                goals=["Find true love", "Balance career and personal life", "Overcome past hurts"],
                conflicts=["Trust issues", "Work-life balance", "Fear of vulnerability"]
            )
        ]
        return characters
    
    async def _create_general_characters(self, genre: str, tone: str, requirements: str) -> List[Character]:
        """Create general characters for any genre"""
        print("*speaks thoughtfully* 'Every story, regardless of genre, needs characters that readers can believe in...'")
        
        characters = [
            Character(
                name="Alex Johnson",
                role="Protagonist",
                description="Main character facing challenges",
                backstory="Ordinary person in extraordinary circumstances, learning to rise to the occasion",
                personality_traits=["Relatable", "Determined", "Growth-oriented", "Authentic"],
                goals=["Overcome obstacles", "Achieve dreams", "Find their place"],
                conflicts=["External challenges", "Internal growth", "Self-doubt"]
            )
        ]
        return characters
    
    async def _create_fantasy_world(self, requirements: str) -> World:
        """Create fantasy world with Dr. Elena's touch"""
        return World(
            name="Eldoria",
            description="A magical realm where ancient powers clash and destiny unfolds",
            setting_details="Medieval-inspired world with magic, dragons, and kingdoms, where the old ways still hold power",
            rules_systems=["Magic system", "Political hierarchy", "Ancient prophecies", "Divine intervention"],
            locations=["Capital City", "Enchanted Forest", "Mystical Mountains", "Ancient Ruins"],
            time_period="Medieval Fantasy",
            atmosphere="Mysterious and magical, with hints of ancient power"
        )
    
    async def _create_scifi_world(self, requirements: str) -> World:
        """Create sci-fi world with Dr. Elena's touch"""
        return World(
            name="Nova Prime",
            description="Advanced space-faring civilization on the brink of change",
            setting_details="Interstellar empire with advanced technology, where AI and humanity coexist uneasily",
            rules_systems=["Space travel", "AI integration", "Political factions", "Technological advancement"],
            locations=["Space Station", "Planetary Colonies", "Warp Gates", "AI Hubs"],
            time_period="Future",
            atmosphere="High-tech and political, with underlying tension"
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
        Create a summary of the development work in Dr. Elena's voice
        """
        print(f"\n*organizes her notes with satisfaction*\n")
        print(f"Let me give you a summary of what we've created together...")
        
        summary = {
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
            "development_notes": f"Characters and world developed according to {genre} conventions and requirements, with careful attention to character motivation and world consistency. Each character has clear goals and conflicts that will drive the story forward."
        }
        
        print(f"\n*closes notebook with a satisfied smile*\n")
        print(f"There you have it! {len(characters)} characters and a world called '{world.name}' that I think will really serve your story. Remember, the best characters are the ones that feel real to readers - they should have hopes, fears, and flaws that make them human, even in the most fantastical settings!")
        
        return summary

# Example usage
async def main():
    agent = EnhancedDevelopmentAgent()
    
    print("=== InkWell AI Writing Agency ===")
    print("Development Agent: Dr. Elena Rodriguez")
    print("=" * 40)
    
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
    print(f"\nFinal Summary: {json.dumps(summary, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main()) 