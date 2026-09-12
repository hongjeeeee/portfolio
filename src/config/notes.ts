export interface NoteCategory {
  id: string;
  title: string;
}

// 추가: [메모 분류] · 글 폴더: src/content/<id>/
export const noteCategories: NoteCategory[] = [{ id: 'about', title: '소개' }];
