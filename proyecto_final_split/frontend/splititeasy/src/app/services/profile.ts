import { Injectable } from '@angular/core';

export interface Profile {
  name: string;
  email: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private storageKey = 'profile';
  private profile: Profile = {
    name: '',
    email: '',
    description: ''
  };

  constructor() {
    const data = localStorage.getItem(this.storageKey);
    this.profile = data ? JSON.parse(data) : this.profile;
  }

  getProfile() {
    return this.profile;
  }

  saveProfile(profile: Profile) {
    this.profile = { ...profile };
    localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
  }
}