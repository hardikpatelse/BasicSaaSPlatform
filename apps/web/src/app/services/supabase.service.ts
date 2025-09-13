import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser extends User {
  role?: string;
  subscription_status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private _currentUser = new BehaviorSubject<AuthUser | null>(null);
  private _session = new BehaviorSubject<Session | null>(null);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Only initialize Supabase in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSupabase();
    }
  }

  private initializeSupabase() {
    // Check if we have valid URLs before initializing
    if (!environment.supabase.url || 
        environment.supabase.url === 'your_supabase_project_url' ||
        !environment.supabase.anonKey || 
        environment.supabase.anonKey === 'your_supabase_anon_key') {
      console.warn('Supabase not properly configured. Please update environment variables.');
      return;
    }

    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
    
    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._session.next(session);
      if (session?.user) {
        this.loadUserProfile(session.user);
      } else {
        this._currentUser.next(null);
      }
    });

    // Check for existing session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this._session.next(session);
      if (session?.user) {
        this.loadUserProfile(session.user);
      }
    });
  }

  get currentUser$(): Observable<AuthUser | null> {
    return this._currentUser.asObservable();
  }

  get session$(): Observable<Session | null> {
    return this._session.asObservable();
  }

  get currentUser(): AuthUser | null {
    return this._currentUser.value;
  }

  get session(): Session | null {
    return this._session.value;
  }

  private async loadUserProfile(user: User) {
    if (!this.supabase) return;

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
      }

      const authUser: AuthUser = {
        ...user,
        role: data?.role || 'user',
        subscription_status: data?.subscription_status || 'none'
      };

      this._currentUser.next(authUser);
    } catch (error) {
      console.error('Error loading user profile:', error);
      this._currentUser.next(user as AuthUser);
    }
  }

  async signUp(email: string, password: string, fullName?: string) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async signIn(email: string, password: string) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async signInWithGoogle() {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async signOut() {
    if (!this.supabase) {
      return { error: new Error('Supabase not initialized') };
    }

    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      this._currentUser.next(null);
      this._session.next(null);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  async resetPassword(email: string) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async updatePassword(password: string) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    try {
      const { data, error } = await this.supabase.auth.updateUser({
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async updateProfile(updates: { full_name?: string; avatar_url?: string }) {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    try {
      const user = this.currentUser;
      if (!user) throw new Error('No user logged in');

      // Update auth user metadata
      const { data: authData, error: authError } = await this.supabase.auth.updateUser({
        data: updates
      });

      if (authError) throw authError;

      // Update user profile table
      const { data, error } = await this.supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: updates.full_name || user.user_metadata?.['full_name'],
          avatar_url: updates.avatar_url || user.user_metadata?.['avatar_url'],
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Reload user profile
      await this.loadUserProfile(authData.user);

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  getAccessToken(): string | null {
    return this.session?.access_token || null;
  }
}