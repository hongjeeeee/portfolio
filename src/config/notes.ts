export interface NoteCategory {
  id: string;
  title: string;
}

// 추가: 메모 앱의 분류. 분류를 늘리면 src/content/<id>/ 폴더도 만든다.
export const noteCategories: NoteCategory[] = [{ id: 'about', title: '소개' }];
