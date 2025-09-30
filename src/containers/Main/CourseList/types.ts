export interface CourseListState {
  searchQuery: string;
  selectedTags: string[];
  sortBy: 'createdAt' | 'title' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}
