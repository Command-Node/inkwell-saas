import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_plan: string;
  subscription_status: string;
  usage_books: number;
  usage_revisions: number;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  preferences?: any;
}

export interface UserFolder {
  id: string;
  user_id: string;
  name: string;
  path: string;
  created_at: string;
}

export class UserService {
  /**
   * Create a complete user profile and folder structure
   */
  static async createUserProfile(user: User, userData?: any): Promise<UserProfile> {
    try {
      // Extract user information
      const email = user.email || '';
      const fullName = userData?.full_name || 
                      user.user_metadata?.full_name || 
                      user.user_metadata?.name ||
                      email.split('@')[0];
      
      const avatarUrl = user.user_metadata?.avatar_url || 
                       user.user_metadata?.picture ||
                       null;

      // Determine subscription plan based on signup method
      const subscriptionPlan = this.determineSubscriptionPlan(userData);
      
      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: email,
            full_name: fullName,
            avatar_url: avatarUrl,
            subscription_plan: subscriptionPlan,
            subscription_status: 'active',
            usage_books: 0,
            usage_revisions: 0,
            onboarding_completed: false,
            preferences: {
              theme: 'light',
              notifications: true,
              auto_save: true,
              writing_style: 'professional'
            }
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw new Error('Failed to create user profile');
      }

      // Create user folder structure
      await this.createUserFolders(user.id);

      // Initialize user workspace
      await this.initializeUserWorkspace(user.id);

      return profile;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      throw error;
    }
  }

  /**
   * Determine subscription plan based on signup method
   */
  private static determineSubscriptionPlan(userData?: any): string {
    // Check if user came from a specific signup flow
    if (userData?.subscription_plan) {
      return userData.subscription_plan;
    }
    
    // Default to free plan
    return 'free';
  }

  /**
   * Create user folder structure in Supabase Storage
   */
  static async createUserFolders(userId: string): Promise<void> {
    try {
      const folders = [
        'projects',
        'projects/drafts',
        'projects/published',
        'projects/archived',
        'uploads',
        'uploads/audio',
        'uploads/documents',
        'exports',
        'exports/books',
        'exports/audiobooks',
        'templates',
        'settings'
      ];

      // Create each folder
      for (const folder of folders) {
        const folderPath = `${userId}/${folder}`;
        
        // Create empty file to establish folder structure
        const { error } = await supabase.storage
          .from('user-files')
          .upload(`${folderPath}/.keep`, new Blob([''], { type: 'text/plain' }), {
            upsert: true
          });

        if (error && error.message !== 'The resource already exists') {
          console.error(`Error creating folder ${folderPath}:`, error);
        }
      }

      console.log(`✅ Created folder structure for user ${userId}`);
    } catch (error) {
      console.error('Error creating user folders:', error);
      throw error;
    }
  }

  /**
   * Initialize user workspace with default content
   */
  static async initializeUserWorkspace(userId: string): Promise<void> {
    try {
      // Create welcome project
      const welcomeProject = {
        title: 'Welcome to InkWell',
        description: 'Your first project - start creating amazing content!',
        status: 'draft',
        writing_style: 'professional',
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: projectError } = await supabase
        .from('projects')
        .insert([welcomeProject]);

      if (projectError) {
        console.error('Error creating welcome project:', projectError);
      }

      // Create default templates
      const defaultTemplates = [
        {
          name: 'Professional Book',
          description: 'A structured template for professional content',
          content: JSON.stringify({
            sections: ['Introduction', 'Chapter 1', 'Chapter 2', 'Conclusion'],
            style: 'professional'
          }),
          user_id: userId
        },
        {
          name: 'Creative Story',
          description: 'A flexible template for creative writing',
          content: JSON.stringify({
            sections: ['Prologue', 'Act 1', 'Act 2', 'Act 3', 'Epilogue'],
            style: 'creative'
          }),
          user_id: userId
        }
      ];

      // Note: You'll need to create a 'templates' table in Supabase
      // for (const template of defaultTemplates) {
      //   await supabase.from('templates').insert([template]);
      // }

      console.log(`✅ Initialized workspace for user ${userId}`);
    } catch (error) {
      console.error('Error initializing user workspace:', error);
      throw error;
    }
  }

  /**
   * Get user profile with complete information
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return null;
    }
  }

  /**
   * Complete user onboarding
   */
  static async completeOnboarding(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error completing onboarding:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in completeOnboarding:', error);
      return false;
    }
  }

  /**
   * Get user folder structure
   */
  static async getUserFolders(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .list(userId, {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error('Error fetching user folders:', error);
        return [];
      }

      return data?.map(item => item.name) || [];
    } catch (error) {
      console.error('Error in getUserFolders:', error);
      return [];
    }
  }

  /**
   * Handle social login user creation
   */
  static async handleSocialLogin(user: User): Promise<UserProfile | null> {
    try {
      // Check if user profile already exists
      const existingProfile = await this.getUserProfile(user.id);
      
      if (existingProfile) {
        // Update last login
        await this.updateUserProfile(user.id, {
          updated_at: new Date().toISOString()
        });
        return existingProfile;
      }

      // Create new user profile and folders
      return await this.createUserProfile(user);
    } catch (error) {
      console.error('Error handling social login:', error);
      return null;
    }
  }
} 