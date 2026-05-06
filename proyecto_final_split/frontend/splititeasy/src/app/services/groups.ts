import { Injectable } from '@angular/core';

export interface GroupMessage {
  id: number;
  author: string;
  text: string;
  date: string;
}

export interface Group {
  id: number;
  name: string;
  members: string[];
  messages: GroupMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private storageKey = 'groups';
  private groups: Group[] = [];

  constructor() {
    const data = localStorage.getItem(this.storageKey);
    this.groups = data ? JSON.parse(data) : [];
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.groups));
  }

  private nextGroupId() {
    return this.groups.length > 0
      ? Math.max(...this.groups.map(g => g.id)) + 1
      : 1;
  }

  private nextMessageId(messages: GroupMessage[]) {
    return messages.length > 0
      ? Math.max(...messages.map(m => m.id)) + 1
      : 1;
  }

  getGroups() {
    return this.groups;
  }

  getGroupById(id: number) {
    return this.groups.find(g => g.id === id);
  }

  createGroup(name: string, owner: string) {
    const group: Group = {
      id: this.nextGroupId(),
      name: name.trim(),
      members: [owner],
      messages: []
    };

    this.groups.unshift(group);
    this.save();
    return group;
  }

  addMember(groupId: number, memberName: string) {
    const group = this.getGroupById(groupId);
    if (!group) return false;

    const cleanMember = memberName.trim();
    if (!cleanMember) return false;

    const exists = group.members.some(
      m => m.toLowerCase() === cleanMember.toLowerCase()
    );

    if (exists) return false;

    group.members.push(cleanMember);
    this.save();
    return true;
  }

  addMessage(groupId: number, author: string, text: string) {
    const group = this.getGroupById(groupId);
    if (!group) return false;

    const cleanText = text.trim();
    if (!cleanText) return false;

    const message: GroupMessage = {
      id: this.nextMessageId(group.messages),
      author: author.trim() || 'Usuario',
      text: cleanText,
      date: new Date().toISOString()
    };

    group.messages.push(message);
    this.save();
    return true;
  }
}