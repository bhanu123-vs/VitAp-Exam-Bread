import { ExamType } from '../types.js';

export interface PublishedPaper {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'cat1' | 'cat2' | 'fat';
  year: number;
  fileName: string;
  fileSize: number;
  driveLink: string;
  pdfBase64?: string;
  publishedAt: string;
  publishedBy: string; // e.g. "Admin"
  verified: boolean;
  notes?: string;
}

const STORAGE_KEY = 'exambread_published_papers_v2';

export class PublishedPapersManager {
  private static instance: PublishedPapersManager;
  private papers: PublishedPaper[] = [];
  private listeners: (() => void)[] = [];

  private constructor() {
    this.loadInitial();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.loadInitial();
          this.notifyListeners();
        }
      });
      // Also fetch from server on load
      this.syncWithServer();
    }
  }

  public static getInstance(): PublishedPapersManager {
    if (!PublishedPapersManager.instance) {
      PublishedPapersManager.instance = new PublishedPapersManager();
    }
    return PublishedPapersManager.instance;
  }

  private loadInitial() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.papers = JSON.parse(stored);
      } else {
        this.papers = [];
      }
    } catch {
      this.papers = [];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.papers));
    } catch (e) {
      console.error('Error saving published papers:', e);
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error(err);
      }
    }
  }

  public async syncWithServer() {
    try {
      const res = await fetch('/api/papers/published');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.publishedPapers)) {
          // Merge with local papers
          const existingIds = new Set(this.papers.map((p) => p.id));
          let changed = false;
          for (const serverPaper of data.publishedPapers) {
            if (!existingIds.has(serverPaper.id)) {
              this.papers.unshift(serverPaper);
              changed = true;
            }
          }
          if (changed) {
            this.save();
          }
        }
      }
    } catch {
      // Server sync optional in offline/test mode
    }
  }

  public getAll(): PublishedPaper[] {
    return [...this.papers];
  }

  public getForCourse(courseCode: string): PublishedPaper[] {
    const code = courseCode.trim().toUpperCase();
    return this.papers.filter((p) => p.courseCode.toUpperCase() === code);
  }

  public hasCat2ForCourse(courseCode: string): boolean {
    const code = courseCode.trim().toUpperCase();
    return this.papers.some(
      (p) => p.courseCode.toUpperCase() === code && p.examType === 'cat2'
    );
  }

  public publish(paper: Omit<PublishedPaper, 'id' | 'publishedAt' | 'publishedBy' | 'verified'> & { id?: string; publishedBy?: string }): PublishedPaper {
    const newPaper: PublishedPaper = {
      id: paper.id || `published-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      courseCode: paper.courseCode.trim().toUpperCase(),
      courseName: paper.courseName,
      examType: paper.examType,
      year: paper.year,
      fileName: paper.fileName,
      fileSize: paper.fileSize,
      driveLink: paper.driveLink || 'https://drive.google.com/drive/folders/1sX8kIpxqxuv_rnECo7rS9Ldl8eycBdJ5?usp=drive_link',
      pdfBase64: paper.pdfBase64,
      publishedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      publishedBy: paper.publishedBy || 'Admin',
      verified: true,
      notes: paper.notes,
    };

    // Remove duplicates if same course, examType and year
    this.papers = this.papers.filter(
      (p) => !(p.courseCode === newPaper.courseCode && p.examType === newPaper.examType && p.year === newPaper.year && p.fileName === newPaper.fileName)
    );
    this.papers.unshift(newPaper);
    this.save();

    // Trigger window event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('exambread:published-updated', { detail: newPaper }));
    }

    return newPaper;
  }

  public remove(id: string) {
    this.papers = this.papers.filter((p) => p.id !== id);
    this.save();
  }
}

export const publishedPapersStore = PublishedPapersManager.getInstance();
