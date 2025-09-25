# API Integration Documentation

## Overview

The Senda CMS integrates with the Senda API to manage meditation courses and lessons. This document outlines the API integration patterns and implementation details.

The up-to-date OpenAPI specification can be fetched at http://localhost:8000/api/openapi.json. Fetch this URL to get the API structure before implementing a request to an endpoint.

## Data Models

### Course Type

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  author: string;
  imagePlaceholderUrl: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Lesson Type

```typescript
interface Lesson {
  id: number;
  lessonNumber: number;
  title: string;
  corePractice: string;
  keyPoint: string;
  tone: string;
  durationMinutes: number;
  status: LessonStatus;
  scriptUrl?: string;
  scriptGeneratedAt?: Date;
  audioUrl?: string;
  audioGeneratedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type LessonStatus = 'NOT_GENERATED' | 'GENERATING' | 'COMPLETED' | 'FAILED';
```
