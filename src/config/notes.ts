export interface NoteCategory {
  id: string;
  title: string;
}

// 추가: [메모 분류] · 메모 앱에 보일 것만 · 글 폴더: src/content/<id>/
export const noteCategories: NoteCategory[] = [{ id: 'about', title: '소개' }];

// 추가: [바탕화면 · 파인더 폴더] · 글 폴더: src/content/<id>/
export const finderFolders: NoteCategory[] = [
  { id: 'awards', title: '수상' },
  { id: 'activities', title: '활동' },
  { id: 'projects', title: '프로젝트' },
];

export const FINDER_ROOT = '포트폴리오';
