#!/usr/bin/env python3
"""
Test script for Railway deployment
"""

import asyncio
import json
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all required modules can be imported"""
    print("Testing imports...")
    
    try:
        # Import using the actual file names
        import importlib.util
        
        # Import agent_coordinator
        spec = importlib.util.spec_from_file_location("agent_coordinator", "agent-coordinator.py")
        agent_coordinator_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(agent_coordinator_module)
        AgentCoordinator = agent_coordinator_module.AgentCoordinator
        print("✅ AgentCoordinator imported successfully")
    except Exception as e:
        print(f"❌ Failed to import AgentCoordinator: {e}")
        return False
    
    try:
        # Import crew_ai_integration
        spec = importlib.util.spec_from_file_location("crew_ai_integration", "crew-ai-integration.py")
        crew_ai_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(crew_ai_module)
        CrewAIIntegration = crew_ai_module.CrewAIIntegration
        print("✅ CrewAIIntegration imported successfully")
    except Exception as e:
        print(f"❌ Failed to import CrewAIIntegration: {e}")
        return False
    
    try:
        # Import enhanced_development_agent
        spec = importlib.util.spec_from_file_location("enhanced_development_agent", "enhanced-development-agent.py")
        dev_agent_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(dev_agent_module)
        EnhancedDevelopmentAgent = dev_agent_module.EnhancedDevelopmentAgent
        print("✅ EnhancedDevelopmentAgent imported successfully")
    except Exception as e:
        print(f"❌ Failed to import EnhancedDevelopmentAgent: {e}")
        return False
    
    try:
        from fastapi import FastAPI
        print("✅ FastAPI imported successfully")
    except Exception as e:
        print(f"❌ Failed to import FastAPI: {e}")
        return False
    
    return True

async def test_agents():
    """Test that agents can be initialized and work"""
    print("\nTesting agents...")
    
    try:
        # Import modules again for this test
        import importlib.util
        
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
        
        # Import agent_coordinator
        spec = importlib.util.spec_from_file_location("agent_coordinator", "agent-coordinator.py")
        agent_coordinator_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(agent_coordinator_module)
        AgentCoordinator = agent_coordinator_module.AgentCoordinator
        
        # Test Crew AI integration
        crew_ai = CrewAIIntegration()
        team = crew_ai.get_agent_team_overview()
        print(f"✅ Crew AI team loaded: {len(team['agents'])} agents")
        
        # Test Development Agent
        dev_agent = EnhancedDevelopmentAgent()
        print(f"✅ Development Agent initialized: {dev_agent.name}")
        
        # Test Agent Coordinator
        coordinator = AgentCoordinator()
        print("✅ Agent Coordinator initialized")
        
        return True
        
    except Exception as e:
        print(f"❌ Agent test failed: {e}")
        return False

async def test_api_endpoints():
    """Test that API endpoints can be created"""
    print("\nTesting API endpoints...")
    
    try:
        from main import app
        
        # Test that app can be created
        print("✅ FastAPI app created successfully")
        
        # Test root endpoint
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        response = client.get("/")
        if response.status_code == 200:
            print("✅ Root endpoint working")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
        
        response = client.get("/health")
        if response.status_code == 200:
            print("✅ Health endpoint working")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

async def test_development_agent():
    """Test the development agent with sample data"""
    print("\nTesting Development Agent...")
    
    try:
        # Import using the actual file name
        import importlib.util
        spec = importlib.util.spec_from_file_location("enhanced_development_agent", "enhanced-development-agent.py")
        dev_agent_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(dev_agent_module)
        EnhancedDevelopmentAgent = dev_agent_module.EnhancedDevelopmentAgent
        
        agent = EnhancedDevelopmentAgent()
        
        # Test character creation
        characters = await agent.create_characters(
            genre="fantasy",
            tone="epic",
            requirements="A young mage discovers her powers"
        )
        
        print(f"✅ Created {len(characters)} characters")
        
        # Test world building
        world = await agent.build_world(
            genre="fantasy",
            setting_requirements="Medieval fantasy world"
        )
        
        print(f"✅ Created world: {world.name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Development Agent test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 Testing InkWell AI Writing Agency for Railway deployment")
    print("=" * 60)
    
    tests = [
        ("Import Test", test_imports),
        ("Agent Test", test_agents),
        ("API Test", test_api_endpoints),
        ("Development Agent Test", test_development_agent)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name}...")
        if asyncio.iscoroutinefunction(test_func):
            result = await test_func()
        else:
            result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results:")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Ready for Railway deployment!")
        return True
    else:
        print("⚠️  Some tests failed. Please fix issues before deploying.")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1) 